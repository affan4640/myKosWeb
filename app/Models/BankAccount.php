<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BankAccount extends Model
{
    protected $fillable = [
        'user_id',
        'bank_code',
        'bank_name',
        'account_name',
        'account_number',
        'is_primary'
    ];

    public function user()
{
    return $this->belongsTo(User::class);
}

public function withdrawals()
{
    return $this->hasMany(Withdrawal::class);
}
}
