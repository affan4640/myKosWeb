<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RentalRequest extends Model
{
    protected $fillable = [
        'room_type_id',
        'tenant_id',
        'start_date',
        'duration_value',
        'duration_type',
        'note',
        'status',
        'is_renewal',
        'contract_id',
    ];
    protected $casts = [
        'is_renewal' => 'boolean',
    ];

    public function roomType()
    {
        return $this->belongsTo(RoomType::class);
    }

    public function tenant()
    {
        return $this->belongsTo(User::class, 'tenant_id');
    }

    public function contract()
    {
        return $this->hasOne(\App\Models\Contract::class, 'rental_request_id');
    }
}
