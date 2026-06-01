<?php

namespace App\Console\Commands;

use App\Models\Contract;
use App\Models\Invoice;
use App\Models\RentalRequest;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;

class SyncXenditInvoices extends Command
{
    protected $signature   = 'xendit:sync-invoices';
    protected $description = 'Sync status invoice dari Xendit dan update kontrak';

    public function handle()
    {
        $this->info('Mulai sync invoice Xendit...');

        // Ambil semua invoice unpaid
        $invoices = Invoice::where('status', 'unpaid')
            ->whereNotNull('midtrans_order_id')
            ->get();

        $this->info("Ditemukan {$invoices->count()} invoice unpaid");

        foreach ($invoices as $invoice) {
            $this->line("Cek invoice: {$invoice->midtrans_order_id}");

            // Fix rental_request_id jika NULL
            if ($invoice->rental_request_id === null) {
                $externalId = $invoice->midtrans_order_id;

                // Extract ID dari format INV-RENEW-{id}-xxx atau INV-{id}-xxx
                if (preg_match('/INV-(?:RENEW-)?(\d+)-/', $externalId, $matches)) {
                    $rentalRequestId = (int) $matches[1];
                    $rentalRequest   = RentalRequest::find($rentalRequestId);

                    if ($rentalRequest) {
                        $invoice->update(['rental_request_id' => $rentalRequestId]);
                        $this->info("  → rental_request_id diset ke $rentalRequestId");
                    }
                }
            }

            // Cek status ke Xendit API
            try {
                $response = Http::withBasicAuth(env('XENDIT_SECRET_KEY'), '')
                    ->get("https://api.xendit.co/v2/invoices/{$invoice->midtrans_order_id}");

                if (!$response->successful()) {
                    // Coba pakai external_id
                    $response = Http::withBasicAuth(env('XENDIT_SECRET_KEY'), '')
                        ->get('https://api.xendit.co/v2/invoices', [
                            'external_id' => $invoice->midtrans_order_id,
                        ]);
                }

                if ($response->successful()) {
                    $data   = $response->json();
                    $status = is_array($data) && isset($data[0])
                        ? $data[0]['status']
                        : ($data['status'] ?? null);

                    $this->line("  → Status Xendit: $status");

                    if (in_array($status, ['PAID', 'SETTLED'])) {
                        $this->_processPaid($invoice);
                    }
                }
            } catch (\Exception $e) {
                $this->error("  → Error cek Xendit: {$e->getMessage()}");
            }
        }

        $this->info('Selesai!');
        return 0;
    }

    private function _processPaid(Invoice $invoice): void
    {
        if ($invoice->status === 'paid') {
            $this->line('  → Sudah paid, skip');
            return;
        }

        $invoice->update(['status' => 'paid']);
        $this->info('  → Status diupdate ke paid');

        $rentalRequest = RentalRequest::find($invoice->rental_request_id);
        if (!$rentalRequest) {
            $this->warn('  → RentalRequest tidak ditemukan');
            return;
        }

        if ($rentalRequest->is_renewal && $rentalRequest->contract_id) {
            // Perpanjang kontrak
            $contract = Contract::find($rentalRequest->contract_id);
            if ($contract) {
                $currentEnd = Carbon::parse($contract->end_date);
                $newEnd     = $rentalRequest->duration_type === 'monthly'
                    ? $currentEnd->copy()->addMonths($rentalRequest->duration_value)
                    : $currentEnd->copy()->addDays($rentalRequest->duration_value);

                $contract->update([
                    'end_date' => $newEnd->format('Y-m-d'),
                    'status'   => 'active',
                ]);

                $this->info("  → Kontrak #{$contract->id} diperpanjang sampai {$newEnd->format('Y-m-d')}");
            }
        } else {
            // Buat kontrak baru
            $startDate = Carbon::parse($rentalRequest->start_date);
            $endDate   = $rentalRequest->duration_type === 'monthly'
                ? $startDate->copy()->addMonths($rentalRequest->duration_value)->subDay()
                : $startDate->copy()->addDays($rentalRequest->duration_value)->subDay();

            $existingContract = Contract::where('room_type_id', $rentalRequest->room_type_id)
                ->where('tenant_id', $rentalRequest->tenant_id)
                ->where('start_date', $startDate->format('Y-m-d'))
                ->first();

            if (!$existingContract) {
                $contract = Contract::create([
                    'room_type_id' => $rentalRequest->room_type_id,
                    'tenant_id'    => $rentalRequest->tenant_id,
                    'start_date'   => $startDate->format('Y-m-d'),
                    'end_date'     => $endDate->format('Y-m-d'),
                    'status'       => 'active',
                ]);

                $invoice->update(['contract_id' => $contract->id]);
                $this->info("  → Kontrak baru #{$contract->id} dibuat");
            } else {
                $this->line("  → Kontrak sudah ada #{$existingContract->id}");
            }
        }
    }
}