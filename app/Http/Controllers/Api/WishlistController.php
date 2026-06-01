<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Wishlist;
use Illuminate\Http\Request;

class WishlistController extends Controller
{
    public function index(Request $request)
    {
        $wishlists = Wishlist::with([
            'property.images',
            'property.roomTypes.contracts',
            'property.reviews',
        ])
            ->where('user_id', $request->user()->id)
            ->get();

        return response()->json($wishlists->map(function ($wishlist) {
            $property    = $wishlist->property;
            $image       = $property->images->first();
            $cheapestRoom = $property->roomTypes->sortBy('price')->first();
            $avgRating   = $property->reviews->avg('rating');

            // Hitung ketersediaan dari semua room type milik properti ini
            $totalRooms      = $property->roomTypes->sum('total_rooms');
            $activeContracts = $property->roomTypes->sum(function ($room) {
                return $room->contracts->where('status', 'active')->count();
            });
            $isAvailable = ($totalRooms - $activeContracts) > 0;

            // Resolve type dari kolom property
            $typeRaw = strtolower($property->type ?? 'campuran');
            $type = match ($typeRaw) {
                'putra'    => 'Putra',
                'putri'    => 'Putri',
                'campuran' => 'Campuran',
                default    => 'Campuran',
            };

            $imageUrl = null;
            if ($image) {
                $imageUrl = str_starts_with($image->image_path, 'http')
                    ? $image->image_path
                    : asset('storage/' . $image->image_path);
            }

            return [
                'wishlist_id'  => $wishlist->id,
                'property_id'  => $property->id,
                'room_type_id' => $cheapestRoom?->id,
                'name'         => $property->name,
                'address'      => $property->address,
                'city'         => $property->city,
                'image_url'    => $imageUrl,
                'price'        => $cheapestRoom?->price ?? 0,
                'type'         => $type,
                'rating'       => $avgRating ? round($avgRating, 1) : 0,
                'description'  => $property->description,
                'latitude'     => (float) ($property->latitude ?? 0),
                'longitude'    => (float) ($property->longitude ?? 0),
                'rental_type'  => $cheapestRoom?->rental_type ?? 'monthly',
                'is_available' => $isAvailable,   // ← field baru
            ];
        }));
    }

    public function toggle(Request $request)
    {
        $request->validate(['property_id' => 'required|integer|exists:properties,id']);

        $userId     = $request->user()->id;
        $propertyId = $request->property_id;

        $existing = Wishlist::where('user_id', $userId)
            ->where('property_id', $propertyId)
            ->first();

        if ($existing) {
            $existing->delete();
            return response()->json(['status' => 'removed', 'message' => 'Dihapus dari favorit']);
        }

        Wishlist::create(['user_id' => $userId, 'property_id' => $propertyId]);

        return response()->json(['status' => 'added', 'message' => 'Ditambahkan ke favorit']);
    }

    public function check(Request $request, $propertyId)
    {
        $isFavorite = Wishlist::where('user_id', $request->user()->id)
            ->where('property_id', $propertyId)
            ->exists();

        return response()->json(['is_favorite' => $isFavorite]);
    }
}