<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Contract;
use App\Models\Invoice;
use App\Models\Notification;
use App\Models\Payment;
use App\Models\RentalRequest;
use App\Models\Wallet;
use App\Models\WalletTransaction;
use App\Services\FCMService;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class PaymentController extends Controller
{
    // ── Dipanggil dari OrderDetailScreen (sewa baru approved) ────────────────
    public function createInvoiceForRentalRequest(Request $request, $rentalRequestId)
    {
        $rentalRequest = RentalRequest::with([
            'roomType.property.owner',
            'contract.invoice',
        ])
            ->where('tenant_id', $request->user()->id)
            ->where('status', 'approved')
            ->findOrFail($rentalRequestId);

        $existingInvoice = $rentalRequest->contract?->invoice;
        if (
            $existingInvoice &&
            $existingInvoice->invoice_url &&
            $existingInvoice->status === 'unpaid'
        ) {
            return response()->json([
                'success'     => true,
                'invoice_url' => $existingInvoice->invoice_url,
            ]);
        }

        $total = $rentalRequest->roomType->price * $rentalRequest->duration_value;

        DB::beginTransaction();
        try {
            $contract = $rentalRequest->contract ?? Contract::create([
                'rental_request_id' => $rentalRequest->id,
                'room_type_id'      => $rentalRequest->room_type_id,
                'tenant_id'         => $rentalRequest->tenant_id,
                'start_date'        => $rentalRequest->start_date,
                'end_date'          => $this->calculateEndDate(
                    $rentalRequest->start_date,
                    $rentalRequest->duration_value,
                    $rentalRequest->duration_type
                ),
                'status' => 'pending_payment',
            ]);

            $invoice = $contract->invoice ?? Invoice::create([
                'contract_id' => $contract->id,
                'amount'      => $total,
                'status'      => 'unpaid',
                'due_date'    => now()->addDay()->toDateString(),
            ]);

            $externalId = 'INV-' . $invoice->id . '-' . time();

            $response = Http::withBasicAuth(config('services.xendit.secret_key'), '')
                ->post('https://api.xendit.co/v2/invoices', [
                    'external_id'      => $externalId,
                    'amount'           => (float) $invoice->amount,
                    'payer_email'      => $request->user()->email,
                    'description'      => 'Pembayaran Sewa Kost - ' .
                                          $rentalRequest->roomType->property->name,
                    'currency'         => 'IDR',
                    'invoice_duration' => 86400,
                ]);

            if (! $response->successful()) {
                throw new \Exception('Xendit error: ' . $response->body());
            }

            $result = $response->json();

            $invoice->update([
                'xendit_invoice_id' => $result['id'],
                'external_id'       => $externalId,
                'invoice_url'       => $result['invoice_url'],
                'expired_at'        => isset($result['expiry_date'])
                                        ? Carbon::parse($result['expiry_date'])
                                        : now()->addDay(),
                'status'            => 'unpaid',
            ]);

            DB::commit();

            return response()->json([
                'success'     => true,
                'invoice_url' => $result['invoice_url'],
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('createInvoiceForRentalRequest error', [
                'rental_request_id' => $rentalRequestId,
                'message'           => $e->getMessage(),
            ]);
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    // ── Dipanggil dari CheckoutScreen (via rental_request_id) ────────────────
    public function createInvoice(Request $request)
    {
        $request->validate([
            'rental_request_id' => 'required|integer|exists:rental_requests,id',
        ]);

        $rentalRequest = RentalRequest::with(['roomType.property.owner'])
            ->where('tenant_id', $request->user()->id)
            ->where('status', 'approved')
            ->findOrFail($request->rental_request_id);

        $roomType = $rentalRequest->roomType;
        $total    = $roomType->price * $rentalRequest->duration_value;

        // Cek invoice yang sudah ada
        $existing = Invoice::where('rental_request_id', $rentalRequest->id)
            ->whereIn('status', ['unpaid', 'paid'])
            ->first();

        if ($existing && $existing->snap_token) {
            return response()->json([
                'success'     => true,
                'invoice_url' => $existing->snap_token,
                'message'     => 'Invoice sudah ada',
            ]);
        }

        DB::beginTransaction();
        try {
            // 1. Buat Contract dulu
            $contract = Contract::where('rental_request_id', $rentalRequest->id)->first();

            if (! $contract) {
                $startDate = Carbon::parse($rentalRequest->start_date);
                $endDate   = $rentalRequest->duration_type === 'monthly'
                    ? $startDate->copy()->addMonths($rentalRequest->duration_value)->subDay()
                    : $startDate->copy()->addDays($rentalRequest->duration_value)->subDay();

                $contract = Contract::create([
                    'rental_request_id' => $rentalRequest->id,
                    'room_type_id'      => $rentalRequest->room_type_id,
                    'tenant_id'         => $rentalRequest->tenant_id,
                    'start_date'        => $startDate->format('Y-m-d'),
                    'end_date'          => $endDate->format('Y-m-d'),
                    'status'            => 'pending_payment',
                ]);
            }

            // 2. Buat invoice Xendit
            $externalId = ($rentalRequest->is_renewal ? 'INV-RENEW-' : 'INV-')
                . $rentalRequest->id . '-' . Str::random(6);

            $response = Http::withBasicAuth(config('services.xendit.secret_key'), '')
                ->post('https://api.xendit.co/v2/invoices', [
                    'external_id'      => $externalId,
                    'amount'           => (float) $total,
                    'payer_email'      => $request->user()->email,
                    'description'      => 'Pembayaran sewa ' . $roomType->property->name,
                    'invoice_duration' => 86400,
                    'currency'         => 'IDR',
                    'reminder_time'    => 1,
                ]);

            if (! $response->successful()) {
                throw new \Exception('Gagal membuat invoice Xendit: ' . $response->body());
            }

            $xenditData = $response->json();

            // 3. Simpan Invoice dengan contract_id valid
            $invoice = Invoice::create([
                'contract_id'       => $contract->id,
                'rental_request_id' => $rentalRequest->id,
                'amount'            => $total,
                'due_date'          => now()->addDay()->format('Y-m-d'),
                'midtrans_order_id' => $externalId,
                'snap_token'        => $xenditData['invoice_url'],
                'status'            => 'unpaid',
            ]);

            DB::commit();

            return response()->json([
                'success'     => true,
                'invoice_url' => $xenditData['invoice_url'],
                'invoice_id'  => $invoice->id,
                'message'     => 'Invoice berhasil dibuat',
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    // ── Mark paid manual ──────────────────────────────────────────────────────
    public function markPaid(Request $request, $id)
    {
        $invoice = Invoice::with('contract')->findOrFail($id);
        $invoice->update(['status' => 'paid']);

        $contract = $invoice->contract;
        if ($contract) {
            $rentalRequest = RentalRequest::where('contract_id', $contract->id)
                ->where('is_renewal', true)
                ->where('status', 'approved')
                ->latest()
                ->first();

            if ($rentalRequest) {
                $currentEnd = Carbon::parse($contract->end_date);
                $newEnd     = $rentalRequest->duration_type === 'monthly'
                    ? $currentEnd->addMonths($rentalRequest->duration_value)
                    : $currentEnd->addDays($rentalRequest->duration_value);

                $contract->update(['end_date' => $newEnd->format('Y-m-d')]);
            }
        }

        return response()->json(['message' => 'Pembayaran berhasil dikonfirmasi']);
    }

    // ── Xendit webhook callback ───────────────────────────────────────────────
    public function callback(Request $request)
    {
        try {
            $token = $request->header('x-callback-token');

            if ($token !== config('services.xendit.webhook_token')) {
                return response()->json(['message' => 'Unauthorized'], 403);
            }

            $invoice = Invoice::where('external_id', $request->external_id)
                ->orWhere('midtrans_order_id', $request->external_id)
                ->first();

                if (! $invoice) {
                Log::warning('Xendit callback: invoice not found', [
                    'external_id' => $request->external_id,
                ]);
                    return response()->json(['message' => 'Invoice not found'], 404);
                }

            if (in_array($invoice->status, ['paid', 'expired'])) {
                return response()->json([
                    'success' => true,
                    'message' => 'Webhook duplikat diabaikan, transaksi sudah pernah diproses.'
                ], 200); 
            }

            DB::transaction(function () use ($request, $invoice) {

                if (in_array($request->status, ['PAID', 'SETTLED'])) {
                    $invoice->update([
                        'status'         => 'paid',
                        'payment_method' => $request->payment_method ?? null,
                    ]);

                    Payment::create([
                        'invoice_id'      => $invoice->id,
                        'paid_at'         => now(),
                        'status'          => 'paid',
                        'external_id'     => $request->id,
                        'payment_method'  => $request->payment_method ?? null,
                        'payment_channel' => $request->payment_channel ?? null,
                        'paid_amount'     => $request->paid_amount,
                    ]);

                    $contract = $invoice->contract()
                        ->with('roomType.property.owner')
                        ->first();

                    if (! $contract) {
                        throw new \Exception('Contract not found for invoice ID: ' . $invoice->id);
                    }

                    // Cek apakah ini perpanjang
                    $rentalRequest = RentalRequest::find($invoice->rental_request_id);

                    if ($rentalRequest && $rentalRequest->is_renewal && $rentalRequest->contract_id) {
                        // Perpanjang — update end_date kontrak lama
                        $oldContract = Contract::find($rentalRequest->contract_id);
                        if ($oldContract) {
                            $currentEnd = Carbon::parse($oldContract->end_date);
                            $newEnd     = $rentalRequest->duration_type === 'monthly'
                                ? $currentEnd->copy()->addMonths($rentalRequest->duration_value)
                                : $currentEnd->copy()->addDays($rentalRequest->duration_value);

                            $oldContract->update([
                                'end_date' => $newEnd->format('Y-m-d'),
                                'status'   => 'active',
                            ]);
                        }
                        // Contract baru (temp) dibatalkan
                        $contract->update(['status' => 'cancelled']);
                    } else {
                        // Sewa baru — aktifkan contract
                        $contract->update(['status' => 'active']);
                    }

                    // Transfer ke wallet owner
                    $owner = $contract->roomType?->property?->owner;
                    if ($owner) {
                        $wallet = Wallet::firstOrCreate(
                            ['user_id' => $owner->id],
                            ['balance' => 0]
                        );
                        $wallet->increment('balance', $invoice->amount);

                        WalletTransaction::create([
                            'wallet_id'   => $wallet->id,
                            'type'        => 'income',
                            'amount'      => $invoice->amount,
                            'description' => 'Pembayaran sewa dari tenant #' .
                                             $contract->tenant_id .
                                             ' - Contract #' . $contract->id,
                        ]);

                        Notification::create([
                            'user_id' => $owner->id,
                            'title'   => 'Pembayaran Diterima',
                            'message' => 'Pembayaran sewa kost sebesar Rp ' .
                                         number_format($invoice->amount, 0, ',', '.') .
                                         ' telah berhasil diterima.',
                            'type'    => 'payment',
                            'data'    => ['rental_request_id' => $rentalRequest?->id],
                        ]);

                        // FCM push ke owner
                        if ($owner->fcm_token) {
                            FCMService::send(
                                $owner->fcm_token,
                                'Pembayaran Diterima',
                                'Pembayaran sewa sebesar Rp ' . number_format($invoice->amount, 0, ',', '.') . ' diterima.',
                                [
                                    'type' => 'payment',
                                    'rental_request_id' => (string) ($rentalRequest?->id ?? ''),
                                ]
                            );
                        }
                    }

                    Notification::create([
                        'user_id' => $contract->tenant_id,
                        'title'   => 'Pembayaran Berhasil',
                        'message' => 'Pembayaran sewa kost kamu berhasil. Kontrak kamu sekarang aktif.',
                        'type'    => 'payment',
                        'data'    => ['rental_request_id' => $rentalRequest?->id],
                    ]);

                    // FCM push ke tenant
                    $tenant = \App\Models\User::find($contract->tenant_id);
                    if ($tenant && $tenant->fcm_token) {
                        FCMService::send(
                            $tenant->fcm_token,
                            'Pembayaran Berhasil',
                            'Pembayaran sewa kost kamu berhasil. Kontrak kamu sekarang aktif.',
                            [
                                'type' => 'payment',
                                'rental_request_id' => (string) ($rentalRequest?->id ?? ''),
                            ]
                        );
                    }
                }

                if ($request->status === 'EXPIRED') {
                    $contract = $invoice->contract;
                    if ($contract) {
                        $contract->update(['status' => 'cancelled']);

                        Notification::create([
                            'user_id' => $contract->tenant_id,
                            'title'   => 'Invoice Kedaluwarsa',
                            'message' => 'Invoice pembayaran kamu telah kedaluwarsa. Silakan ajukan permintaan sewa ulang.',
                            'type'    => 'payment',
                            'data'    => ['rental_request_id' => $invoice->rental_request_id],
                        ]);

                        // FCM push ke tenant
                        $tenant = \App\Models\User::find($contract->tenant_id);
                        if ($tenant && $tenant->fcm_token) {
                            FCMService::send(
                                $tenant->fcm_token,
                                'Invoice Kedaluwarsa',
                                'Invoice pembayaran kamu telah kedaluwarsa.',
                                [
                                    'type' => 'payment',
                                    'rental_request_id' => (string) ($invoice->rental_request_id ?? ''),
                                ]
                            );
                        }
                    }
                }
            });

            return response()->json(['success' => true]);

        } catch (\Exception $e) {
            Log::error('Xendit callback error', [
                'message' => $e->getMessage(),
                'payload' => $request->all(),
            ]);
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    private function calculateEndDate(string $startDate, int $duration, string $type): string
    {
        $date = Carbon::parse($startDate);
        return $type === 'monthly'
            ? $date->addMonths($duration)->toDateString()
            : $date->addDays($duration)->toDateString();
    }
}