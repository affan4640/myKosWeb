<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

#[Fillable(['name', 'email', 'password', 'role', 'phone', 'avatar'])]
#[Hidden(['password', 'remember_token'])]
class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasApiTokens,HasFactory, Notifiable;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function properties() {
        return $this->hasMany(Property::class, 'owner_id');
    }

    public function rentalRequests() {
        return $this->hasMany(RentalRequest::class, 'tenant_id');
    }

    public function reviews() {
        return $this->hasMany(Review::class);
    }

    public function wishlists() {
        return $this->hasMany(Wishlist::class);
    }

    public function complaints() {
        return $this->hasMany(Complaint::class);
    }

    public function contracts() {
        return $this->hasMany(Contract::class, 'tenant_id');
    }

    public function invoices() {
        return $this->hasMany(Invoice::class);
    }

    public function verifiedPayments() {
        return $this-> hasMany(Payment::class, 'verified_by');
    }
}
