<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Contract extends Model
{
    protected $fillable = [
        'room_type_id',
        'tenant_id',
        'start_date',
        'end_date',
        'status'
    ];

    public function roomType() {
        return $this->belongsTo(RoomType::class);
    }

    public function tenant() {
        return $this->belongsTo(User::class, 'tenant_id');
    }

    public function review() {
        return $this->hasOne(Review::class);
    }

    public function invoices() {
        return $this->hasMany(Invoice::class);
    }

    public function Complaints() {
        return $this->hasMany(Complaint::class);
    }
}
