<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RoomTypeImage extends Model
{
    protected $fillable = [
        'property_id',
        'image_path'
    ];

    public function roomType() {
        return $this->belongsTo(RoomType::class);
    }
}
