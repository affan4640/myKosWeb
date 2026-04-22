<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RoomTypeFacility extends Model
{
    protected $fillable = [
        'room_type_id',
        'facility_id'
    ];

    public function roomType() {
        return $this->belongsTo(RoomType::class);
    }

    public function facility() {
        return $this->belongsTo(Facility::class);
    }
}
