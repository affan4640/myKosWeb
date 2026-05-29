<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Invoice;
use App\Models\Payment;
use App\Models\Wallet;
use Illuminate\Http\Request;

use Illuminate\Support\Facades\DB;
use Xendit\Configuration;
use Xendit\Invoice\InvoiceApi;
use Xendit\Invoice\CreateInvoiceRequest;

class PaymentController extends Controller
{
    public function createInvoice(Invoice $invoice)
    {
        Configuration::setXenditKey(
            config('services.xendit.secret_key')
        );

        $apiInstance = new InvoiceApi();

        $external_id = 'INV-' . $invoice->id . '-' . time();

        $createInvoice = new CreateInvoiceRequest([
            'external_id' => $external_id,
            'amount' => (float) $invoice->amount,
            'payer_email' => auth()->user()->email,
            'description' => 'Pembayaran Sewa Kos',
            'currency' => 'IDR'
        ]);

        try {

            $result = $apiInstance->createInvoice(
                $createInvoice
            );

            $invoice->update([
                'xendit_invoice_id' => $result['id'],
                'external_id' => $external_id,
                'invoice_url' => $result['invoice_url'],
                'status' => 'unpaid'
            ]);

            return response()->json([
                'success' => true,
                'invoice_url' => $result['invoice_url']
            ]);

        } catch (\Exception $e) {

            return response()->json([
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function callback(Request $request)
{
    // 1. Bungkus dari awal proses pencarian sampai selesai
    try {
        $token = $request->header('x-callback-token');

        if ($token !== config('services.xendit.webhook_token')) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $invoice = Invoice::where('external_id', $request->external_id)->first();

        if (!$invoice) {
            return response()->json(['message' => 'Invoice not found'], 404);
        }

        DB::transaction(function () use($request, $invoice) {
            if ($request->status === 'PAID') {

                $invoice->update(['status' => 'paid']);

                Payment::create([
                    'invoice_id' => $invoice->id,
                    'paid_at' => now(),
                    'status' => 'paid',
                    'external_id' => $request->id,
                    'payment_method' => $request->payment_method,
                    'payment_channel' => $request->payment_channel,
                    'paid_amount' => $request->paid_amount
                ]);

                // Pastikan nama relasi ini sudah sinkron (contract atau contracts)
                $contract = $invoice->contract; 
                $contract->update(['status' => 'active']);

                // Pastikan rantai relasi ini tidak ada yang null atau typo
                $owner = $contract->roomType->property->owner;

                $wallet = Wallet::firstOrCreate(
                    ['user_id' => $owner->id],
                    ['balance' => 0]
                );

                $wallet->increment('balance', $invoice->amount);
            }

            if ($request->status === 'EXPIRED') {
                $invoice->update([
                    'status' => 'expired'
                ]);

                $invoice->contract->update([
                    'status' => 'cancelled'
                ]);
            }
        });

        return response()->json(['success' => true]);

    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'message' => $e->getMessage()
        ], 500);
    }
}
}