<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Contract;
use App\Models\Invoice;
use Carbon\Carbon;
use App\Models\RentalRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class RentalRequestController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'room_type_id'   => 'required|integer|exists:room_types,id',
            'start_date'     => 'required|date',
            'duration_value' => 'required|integer|min:1',
            'duration_type'  => 'required|in:daily,monthly',
            'is_renewal'     => 'boolean',
            'contract_id'    => 'nullable|integer|exists:contracts,id',
            'note'           => 'nullable|string',
        ]);

        $rentalRequest = RentalRequest::create([
            'room_type_id'   => $request->room_type_id,
            'tenant_id'      => $request->user()->id,
            'start_date'     => $request->start_date,
            'duration_value' => $request->duration_value,
            'duration_type'  => $request->duration_type,
            'is_renewal'     => $request->boolean('is_renewal'),
            'contract_id'    => $request->contract_id,
            'note'           => $request->note,
            'status'         => $request->boolean('is_renewal') ? 'approved' : 'pending',
        ]);

        // Load relasi yang dibutuhkan
        $rentalRequest->load('roomType.property');

        // Notifikasi ke owner: Permintaan Sewa Baru / Perpanjang Sewa
        $propertyName = $rentalRequest->roomType->property->name ?? 'Kost';
        $ownerId = $rentalRequest->roomType->property->owner_id;
        $title = $request->boolean('is_renewal') ? 'Perpanjang Sewa' : 'Permintaan Sewa Baru';
        $messageNotif = "Ada " . strtolower($title) . " di {$propertyName} dari " . $request->user()->name . ".";

        if ($ownerId) {
            \App\Models\Notification::create([
                'user_id' => $ownerId,
                'title'   => $title,
                'message' => $messageNotif,
                'type'    => 'booking',
                'data'    => ['rental_request_id' => $rentalRequest->id],
            ]);

            $owner = \App\Models\User::find($ownerId);
            if ($owner && $owner->fcm_token) {
                \App\Services\FCMService::send(
                    $owner->fcm_token,
                    $title,
                    $messageNotif,
                    [
                        'type' => 'booking',
                        'rental_request_id' => (string) $rentalRequest->id,
                    ]
                );
            }
        }

        if ($request->boolean('is_renewal')) {
            $roomType   = $rentalRequest->roomType;
            $total      = $roomType->price * $rentalRequest->duration_value;
            $externalId = 'INV-RENEW-' . $rentalRequest->id . '-' . Str::random(6);

            // Buat contract baru dulu
            $startDate = Carbon::parse($rentalRequest->start_date);
            $endDate   = $rentalRequest->duration_type === 'monthly'
                ? $startDate->copy()->addMonths($rentalRequest->duration_value)->subDay()
                : $startDate->copy()->addDays($rentalRequest->duration_value)->subDay();

            $newContract = Contract::create([
                'rental_request_id' => $rentalRequest->id,
                'room_type_id'      => $rentalRequest->room_type_id,
                'tenant_id'         => $rentalRequest->tenant_id,
                'start_date'        => $startDate->format('Y-m-d'),
                'end_date'          => $endDate->format('Y-m-d'),
                'status'            => 'pending_payment',
            ]);

            try {
                $xenditResponse = Http::withBasicAuth(
                    config('services.xendit.secret_key'),
                    ''
                )->post('https://api.xendit.co/v2/invoices', [
                    'external_id'      => $externalId,
                    'amount'           => (float) $total,
                    'payer_email'      => $request->user()->email,
                    'description'      => 'Perpanjang sewa ' . $roomType->property->name,
                    'invoice_duration' => 86400,
                    'currency'         => 'IDR',
                ]);

                if ($xenditResponse->successful()) {
                    $xenditData = $xenditResponse->json();

                    Invoice::create([
                        'contract_id'       => $newContract->id,
                        'rental_request_id' => $rentalRequest->id,
                        'amount'            => $total,
                        'due_date'          => now()->addDay()->format('Y-m-d'),
                        'midtrans_order_id' => $externalId,
                        'snap_token'        => $xenditData['invoice_url'],
                        'external_id'       => $externalId,
                        'xendit_invoice_id' => $xenditData['id'],
                        'invoice_url'       => $xenditData['invoice_url'],
                        'status'            => 'unpaid',
                    ]);

                    return response()->json([
                        'success'           => true,
                        'is_renewal'        => true,
                        'invoice_url'       => $xenditData['invoice_url'],
                        'rental_request_id' => $rentalRequest->id,
                        'message'           => 'Perpanjang sewa berhasil, silakan selesaikan pembayaran.',
                    ], 201);
                }

                // Xendit gagal tapi rental request & contract sudah terbuat
                return response()->json([
                    'success'           => true,
                    'is_renewal'        => true,
                    'invoice_url'       => null,
                    'rental_request_id' => $rentalRequest->id,
                    'message'           => 'Pengajuan perpanjang berhasil, tapi gagal membuat invoice: ' .
                        $xenditResponse->body(),
                ], 201);
            } catch (\Exception $e) {
                Log::error('Gagal buat invoice perpanjang', [
                    'rental_request_id' => $rentalRequest->id,
                    'error'             => $e->getMessage(),
                ]);

                return response()->json([
                    'success'           => true,
                    'is_renewal'        => true,
                    'invoice_url'       => null,
                    'rental_request_id' => $rentalRequest->id,
                    'message'           => 'Pengajuan berhasil, gagal buat invoice: ' . $e->getMessage(),
                ], 201);
            }
        }

        // Sewa baru biasa
        return response()->json([
            'success'           => true,
            'is_renewal'        => false,
            'rental_request_id' => $rentalRequest->id,
            'message'           => 'Pengajuan sewa berhasil, menunggu persetujuan pemilik kost.',
        ], 201);
    }


    public function index(Request $request)
    {
        $requests = RentalRequest::with(['roomType.property.images'])
            ->where('tenant_id', $request->user()->id)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($requests->map(function ($r) {
            $property = $r->roomType->property;
            $image    = $property->images->first();

            $imageUrl = null;
            if ($image) {
                $imageUrl = str_starts_with($image->image_path, 'http')
                    ? $image->image_path
                    : asset('storage/' . $image->image_path);
            }

            $statusMap = [
                'pending'  => ['label' => 'Menunggu',  'color' => 'orange'],
                'approved' => ['label' => 'Disetujui', 'color' => 'green'],
                'rejected' => ['label' => 'Ditolak',   'color' => 'red'],
            ];
            $statusInfo = $statusMap[$r->status] ?? ['label' => $r->status, 'color' => 'grey'];

            return [
                'id'             => $r->id,
                'status'         => $r->status,
                'status_label'   => $statusInfo['label'],
                'status_color'   => $statusInfo['color'],
                'is_renewal'     => $r->is_renewal,
                'start_date'     => $r->start_date,
                'duration_value' => $r->duration_value,
                'duration_type'  => $r->duration_type,
                'created_at'     => $r->created_at->format('d F Y'),
                'property'       => [
                    'id'        => $property->id,
                    'name'      => $property->name,
                    'address'   => $property->address,
                    'city'      => $property->city,
                    'image_url' => $imageUrl,
                ],
                'room_type' => [
                    'id'          => $r->roomType->id,
                    'name'        => $r->roomType->name,
                    'price'       => $r->roomType->price,
                    'rental_type' => $r->roomType->rental_type,
                ],
            ];
        }));
    }

    public function show(Request $request, $id)
    {
        $r = RentalRequest::with([
            'roomType.property.images',
            'roomType.property.owner',
        ])
            ->where('tenant_id', $request->user()->id)
            ->findOrFail($id);

        $property = $r->roomType->property;
        $image    = $property->images->first();

        $imageUrl = null;
        if ($image) {
            $imageUrl = str_starts_with($image->image_path, 'http')
                ? $image->image_path
                : asset('storage/' . $image->image_path);
        }

        $statusMap = [
            'pending'  => ['label' => 'Menunggu Persetujuan', 'color' => 'orange'],
            'approved' => ['label' => 'Disetujui',            'color' => 'green'],
            'rejected' => ['label' => 'Ditolak',              'color' => 'red'],
        ];
        $statusInfo = $statusMap[$r->status] ?? ['label' => $r->status, 'color' => 'grey'];

        // Ambil invoice_url jika sudah ada
        $invoice    = \App\Models\Invoice::where('rental_request_id', $r->id)
            ->where('status', '!=', 'expired')
            ->first();
        $invoiceUrl = $invoice?->snap_token;

        return response()->json([
            'id'             => $r->id,
            'status'         => $r->status,
            'status_label'   => $statusInfo['label'],
            'status_color'   => $statusInfo['color'],
            'is_renewal'     => $r->is_renewal,
            'invoice_url'    => $invoiceUrl,
            'start_date'     => $r->start_date,
            'duration_value' => $r->duration_value,
            'duration_type'  => $r->duration_type,
            'note'           => $r->note,
            'created_at'     => $r->created_at->format('d F Y H:i'),
            'property'       => [
                'id'        => $property->id,
                'name'      => $property->name,
                'address'   => $property->address,
                'city'      => $property->city,
                'image_url' => $imageUrl,
                'owner'     => [
                    'name'  => $property->owner->name ?? '-',
                    'phone' => $property->owner->phone ?? '-',
                ],
            ],
            'room_type' => [
                'id'          => $r->roomType->id,
                'name'        => $r->roomType->name,
                'price'       => $r->roomType->price,
                'rental_type' => $r->roomType->rental_type,
            ],
        ]);
    }
}
