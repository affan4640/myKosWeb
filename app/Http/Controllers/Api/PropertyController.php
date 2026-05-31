<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Property;
use Illuminate\Http\Request;

class PropertyController extends Controller
{
    private function resolveImageUrl(?string $path): ?string
    {
        if (!$path) return null;
        return str_starts_with($path, 'http')
            ? $path
            : asset('storage/' . $path);
    }

    private function resolveType(string $type): string
    {
        return match ($type) {
            'putra'    => 'Putra',
            'putri'    => 'Putri',
            'campuran' => 'Campuran',
            default    => 'Campuran',
        };
    }

    public function index(Request $request)
    {
        $query = Property::with(['images', 'roomTypes', 'reviews']);

        if ($request->has('search') && $request->search !== '') {
            $query->where(function ($q) use ($request) {
                $q->where('name', 'like', '%' . $request->search . '%')
                    ->orWhere('address', 'like', '%' . $request->search . '%')
                    ->orWhere('city', 'like', '%' . $request->search . '%');
            });
        }

        // Filter type langsung dari kolom properties.type
        if ($request->has('type') && $request->type !== 'Semua') {
            $query->where('type', strtolower($request->type));
        }

        $properties = $query->get();

        $data = $properties->map(function ($property) {
            $image = $property->images->first();
            $cheapestRoom = $property->roomTypes->sortBy('price')->first();
            $avgRating = $property->reviews->avg('rating');

            $totalRooms = $property->roomTypes->sum('total_rooms');
            $activeContracts = $property->roomTypes->sum(function ($room) {
                return $room->contracts()->where('status', 'active')->count();
            });
            $isAvailable = ($totalRooms - $activeContracts) > 0;

            return [
                'id'          => $property->id,
                'name'        => $property->name,
                'address'     => $property->address,
                'city'        => $property->city,
                'image_url'   => $this->resolveImageUrl($image?->image_path),
                'price'       => $cheapestRoom ? $cheapestRoom->price : 0,
                'type'        => $this->resolveType($property->type),
                'rating'      => $avgRating ? round($avgRating, 1) : 0,
                'description' => $property->description,
                'latitude'    => (float) ($property->latitude ?? 0),
                'longitude'   => (float) ($property->longitude ?? 0),
                'total_rooms'     => $totalRooms,
                'active_contracts' => $activeContracts,
                'is_available'    => $isAvailable,
            ];
        });



        return response()->json($data);
    }

    public function show($id)
    {
        $property = Property::with([
            'images',
            'roomTypes.images',
            'roomTypes.facilities',
            'reviews.user',
            'facilities',
            'owner',
        ])->findOrFail($id);

        $avgRating = $property->reviews->avg('rating');
        $cheapestRoom = $property->roomTypes->sortBy('price')->first();
        $type = $this->resolveType($property->type ?? 'campuran'); // fix ini

        return response()->json([
            'id'                  => $property->id,
            'name'                => $property->name,
            'address'             => $property->address,
            'city'                => $property->city,
            'description'         => $property->description,
            'rules'               => $property->rules,
            'latitude'            => $property->latitude,
            'longitude'           => $property->longitude,
            'rating'              => $avgRating ? round($avgRating, 1) : 0,
            'review_count'        => $property->reviews->count(),
            'price'               => $cheapestRoom ? $cheapestRoom->price : 0,
            'type'                => $type,
            'images'              => $property->images->map(
                fn($img) => $this->resolveImageUrl($img->image_path)
            ),
            'property_facilities' => $property->facilities->pluck('name'),
            'room_types' => $property->roomTypes->map(function ($room) use ($property) {
                $activeContracts = $room->contracts()->where('status', 'active')->count();
                $availableRooms  = $room->total_rooms - $activeContracts;
                return [
                    'id'              => $room->id,
                    'name'            => $room->name,
                    'price'           => $room->price,
                    'width'           => $room->width ?? null,   // fix: size -> width
                    'length'          => $room->length ?? null,  // fix: size -> length
                    'capacity'        => $room->capacity,
                    'total_rooms'     => $room->total_rooms,
                    'active_contracts' => $activeContracts,    
                    'available_rooms'  => max(0, $availableRooms), 
                    'is_available'     => $availableRooms > 0,     
                    'rental_type'     => $room->rental_type,
                    'type'            => $this->resolveType($property->type ?? 'campuran'), // fix
                    'room_facilities' => $room->facilities->pluck('name'),
                    'images'          => $room->images->map(
                        fn($img) => $this->resolveImageUrl($img->image_path)
                    ),
                ];
            }),
            'reviews' => $property->reviews->map(function ($review) {
                return [
                    'name'    => $review->user->name ?? 'Anonim',
                    'rating'  => $review->rating,
                    'comment' => $review->comment,
                    'date'    => $review->created_at->diffForHumans(),
                ];
            }),
            'owner' => [
                'id'    => $property->owner->id ?? null,
                'name'  => $property->owner->name ?? '-',
                'phone' => $property->owner->phone ?? '-',
            ],
        ]);
    }
}
