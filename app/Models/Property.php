<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Property extends Model
{
    protected $fillable = [
        'owner_id',
        'name',
        'address',
        'city',
        'description',
        'rules',
        'latitude',
        'longitude',
    ];

    public function owner() {
        return $this->belongsTo(User::class, 'owner_id');
    }

    public function images() {
        return $this->hasMany(PropertyImage::class);
    }

    public function roomTypes() {
        return $this->hasMany(RoomType::class);
    }

    public function reviews() {
        return $this->hasMany(Review::class);
    }

    public function wishlists() {
        return $this->hasMany(Wishlist::class);
    }

    public function facilities() {
        return $this->belongsToMany(Facility::class, 'property_facilities');
    }

    public function complaints() {
        return $this->hasMany(Complaint::class);
    }
}
