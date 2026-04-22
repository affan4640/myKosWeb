<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RoomType extends Model
{
     protected $fillable = [
        'property_id',
        'name',
        'size',
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
