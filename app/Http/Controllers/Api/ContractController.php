<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Contract;
use Illuminate\Http\Request;

class ContractController extends Controller
{
    public function index(Request $request)
    {
        $contracts = Contract::with([
            'roomType.property.images',
            'roomType.property.reviews',
        ])
            ->where('tenant_id', $request->user()->id)
            ->whereIn('status', ['active', 'ended'])
            ->withExists('review')
            ->get();

        return response()->json($contracts->map(function ($contract) {
            $property = $contract->roomType->property;
            $image    = $property->images->first();

            $statusLabel = match ($contract->status) {
                'active' => 'Aktif',
                'ended'  => 'Selesai',
                default  => null,
            };

            if ($statusLabel === null) return null;

            $imageUrl = null;
            if ($image) {
                $imageUrl = str_starts_with($image->image_path, 'http')
                    ? $image->image_path
                    : asset('storage/' . $image->image_path);
            }

            return [
                'id'         => $contract->id,
                'status'     => $statusLabel,
                'status_raw' => $contract->status,
                'start_date' => $contract->start_date,
                'end_date'   => $contract->end_date,
                'room_type'  => $contract->roomType->name,
                'has_review' => (bool) $contract->review_exists,
                'price'      => $contract->roomType->price,
                'property'   => [
                    'id'          => $property->id,
                    'name'        => $property->name,
                    'address'     => $property->address,
                    'city'        => $property->city,
                    'image_url'   => $imageUrl,
                    'rating'      => round((float) ($property->reviews->avg('rating') ?? 0), 1),
                    'type'        => $this->resolveType($property->type ?? 'campuran'),
                    'description' => $property->description,
                    'latitude'    => (float) ($property->latitude ?? 0),
                    'longitude'   => (float) ($property->longitude ?? 0),
                    'rental_type' => $contract->roomType->rental_type,
                ],
            ];
        })->filter()->values());
    }

    private function resolveType(string $type): string
    {
        return match (strtolower($type)) {
            'putra'    => 'Putra',
            'putri'    => 'Putri',
            'campuran' => 'Campuran',
            default    => 'Campuran',
        };
    }
}