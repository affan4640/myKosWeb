<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class RoomType extends Model
{
    use SoftDeletes;
     protected $fillable = [
        'property_id',
        'name',
        'room_width',
        'room_length',
        'price',
        'capacity',
        'total_rooms',
        'rental_type'
    ];

    public function property() {
        return $this->belongsTo(Property::class);
    }

    public function rentalRequests() {
        return $this->hasMany(RentalRequest::class);
    }

    public function facilities() {
        return $this->belongsToMany(Facility::class, 'room_type_facilities');
    }

    public function images() {
        return $this->hasMany(RoomTypeImage::class);
    }

    public function contracts() {
        return $this->hasMany(Contract::class);
    }

}
