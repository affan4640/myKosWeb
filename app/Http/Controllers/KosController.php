<?php

namespace App\Http\Controllers;

use App\Models\Property;
use Inertia\Inertia;

class KosController extends Controller
{
    public function detail($id)
    {
        $query = Property::with([
            'images',
            'facilities',
            'roomTypes.images',
            'roomTypes.facilities',
        ]);

        if (auth()->check()) {
            $query->with(['wishlists' => function ($q) {
                $q->where('user_id', auth()->id());
            }]);
        }

        $property = $query->findOrFail($id);

        $similar = Property::with(['images', 'roomTypes'])
            ->where('city', $property->city)
            ->where('id', '!=', $id)
            ->limit(6)
            ->get();

        $isWishlisted = auth()->check()
            ? $property->wishlists->isNotEmpty()
            : false;

        return Inertia::render('DetailKos', [
            'property'    => $property,
            'similar'     => $similar,
            'isWishlisted' => $isWishlisted,
        ]);
    }
}