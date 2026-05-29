<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Invoice extends Model
{
    protected $fillable = [
        'contract_id',
        'amount',
        'due_date',
        'midtrans_order_id',
        'snap_token',
        'status',
        'external_id',
        'xendit_invoice_id',
        'invoice_url',
        'expired_at',
        'payment_method'
    ];

    public function contract() {
        return $this->belongsTo(Contract::class);
    }

    public function payments() {
        return $this->hasMany(Payment::class);
    }
}