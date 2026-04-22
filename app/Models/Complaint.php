<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Complaint extends Model
{
    protected $fillable = [
        'tenant_id',
        'property_id',
        'contract_id',
        'title',
        'description',
        'image',
        'status'
    ];

    public function tenant() {
        return $this->belongsTo(User::class, 'tenant_id');
    }

    public function property() {
        return $this->belongsTo(Property::class);
    }

    public function contract() {
        return $this->belongsTo(Contract::class);
    }
}
