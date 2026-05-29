<?php

namespace App\Http\Controllers\Owner;

use App\Http\Controllers\Controller;
use App\Models\BankAccount;
use App\Models\Wallet;
use App\Models\WalletTransaction;
use App\Models\Withdrawal;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class OwnerWalletController extends Controller
{
    public function index()
    {
        $userId = auth()->id();

        $wallet = Wallet::with([
            'transactions' => function ($query) {
                $query->latest()->limit(10);
            }
        ])->firstOrCreate(
            ['user_id' => $userId],
            ['balance' => 0]
        );

        $bankAccounts = BankAccount::where(
            'user_id',
            $userId
        )->latest()->get();

        $withdrawals = Withdrawal::with('bankAccount')
            ->where('user_id', $userId)
            ->latest()
            ->get();

        return Inertia::render('Owner/Wallet', [
            'wallet' => $wallet,
            'bankAccounts' => $bankAccounts,
            'withdrawals' => $withdrawals
        ]);
    }

    public function storeBankAccount(Request $request)
    {
        $request->validate([
            'bank_name' => 'required|string|max:100',
            'account_name' => 'required|string|max:100',
            'account_number' => 'required|string|max:50',
        ]);

        BankAccount::create([
            'user_id' => auth()->id(),
            'bank_name' => $request->bank_name,
            'account_name' => $request->account_name,
            'account_number' => $request->account_number,
        ]);

        return redirect()->back()->with(
            'success',
            'Rekening berhasil ditambahkan'
        );
    }

    public function destroyBankAccount(string $id)
    {
        $bank = BankAccount::where(
            'user_id',
            auth()->id()
        )->findOrFail($id);

        $bank->delete();

        return redirect()->back()->with(
            'success',
            'Rekening berhasil dihapus'
        );
    }

    public function withdraw(Request $request)
    {
        $request->validate([
            'bank_account_id' => 'required|exists:bank_accounts,id',
            'amount' => 'required|numeric|min:10000'
        ]);

        $userId = auth()->id();

        $wallet = Wallet::where(
            'user_id',
            $userId
        )->firstOrFail();

        if ($wallet->balance < $request->amount) {
            return redirect()->back()->with(
                'error',
                'Saldo tidak mencukupi'
            );
        }

        if ($request->amount < 20000) {
            return redirect()->back()->with(
                'error',
                'Minimal Tarik Rp 20.000'
            );
        }

        DB::transaction(function () use (
            $request,
            $wallet,
            $userId
        ) {

            Withdrawal::create([
                'user_id' => $userId,
                'bank_account_id' => $request->bank_account_id,
                'amount' => $request->amount,
                'status' => 'completed',
            ]);

            $wallet->decrement(
                'balance',
                $request->amount
            );

            WalletTransaction::create([
                'wallet_id' => $wallet->id,
                'type' => 'outcome',
                'amount' => $request->amount,
                'description' => 'Withdraw saldo wallet'
            ]);
        });

        return redirect()->back()->with(
            'success',
            'Withdraw berhasil'
        );
    }
}