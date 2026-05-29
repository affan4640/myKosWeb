<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class WalletController extends Controller
{
    public function index() {
        $wallet = auth()->user()
        ->wallet()
        ->with('transactions')
        ->first();

        return Inertia::render('Owner/Wallet', [
            'wallet' => $wallet
        ]);
    }
}
