<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PropertyFacility extends Model
{
    protected $fillable = [
        'property_id',
        'facility_id'
    ];

    public function property() {
        return $this->belongsTo(Property::class);
    }

    public function facility() {
        return $this->belongsTo(Facility::class);
    }
}
