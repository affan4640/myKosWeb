<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    protected $fillable = [
        'invoice_id',
        'proof_image',
        'paid_at',
        'verified_by',
        'status'
    ];

    public function invoice() {
        return $this->belongsTo(Invoice::class);
    }

    public function verifier() {
        return $this->belongsTo(User::class, 'verified_by');
    }
}
