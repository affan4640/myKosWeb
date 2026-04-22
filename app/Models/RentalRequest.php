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
    ];

    public function roomType() {
        return $this->belongsTo(RoomType::class);
    }

    public function tenant() {
        return $this->belongsTo(User::class, 'tenant_id');
    }
}
