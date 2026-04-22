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
        'status'
    ];

    public function contracts() {
        return $this->belongsTo(Contract::class);
    }

    public function payments() {
        return $this->hasMany(Payment::class);
    }
}
