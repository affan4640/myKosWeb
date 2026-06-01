<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Invoice;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PaymentController extends Controller
{
    public function index(Request $request) {
        $transactions = Invoice::with([
            'contract.tenant', 
            'contract.roomType.property'
        ])
        ->when($request->search, function ($query, $search) {
            $query->whereHas('contract.tenant', function ($tenantQuery) use ($search) {
                $tenantQuery->where('name', 'like', "%{$search}%");
            });
        })
        ->latest('updated_at')
        ->paginate(10)
        ->withQueryString();

        return Inertia::render('Admin/Transaksi', [
            'transactions' => $transactions
        ]);
    }

    public function detail(string $id) {
        $transaction = Invoice::with([
            'contract.tenant',
            'contract.roomType.property'
        ])
        ->findOrFail($id);

        return Inertia::render('Admin/TransactionDetail', [
            'transactions' => $transaction
        ]);
    }
}
