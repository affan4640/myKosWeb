<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\RentalRequest;
use App\Models\RoomType;
use Illuminate\Http\Request;

class RentalRequestController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'room_type_id'   => 'required|integer|exists:room_types,id',
            'start_date'     => 'required|date|after_or_equal:today',
            'duration_value' => 'required|integer|min:1',
            'duration_type'  => 'required|in:daily,monthly',
            'note'           => 'nullable|string',
        ]);

        $exists = RentalRequest::where(
                'tenant_id',
                $request->user()->id
            )
            ->where(
                'room_type_id',
                $request->room_type_id
            )
            ->whereIn('status', [
                'pending',
                'accepted'
            ])
            ->exists();

        if ($exists) {
            return response()->json([
                'message' => 'Anda sudah memiliki pengajuan aktif untuk kamar ini'
            ], 422);
        }

        $rentalRequest = RentalRequest::create([
            'room_type_id'   => $request->room_type_id,
            'tenant_id'      => $request->user()->id,
            'start_date'     => $request->start_date,
            'duration_value' => $request->duration_value,
            'duration_type'  => $request->duration_type,
            'note'           => $request->note,
            'status'         => 'pending',
        ]);

        return response()->json([
            'message' => 'Pengajuan sewa berhasil, menunggu persetujuan pemilik kost.',
            'data'    => $rentalRequest,
        ], 201);
    }

    public function index(Request $request)
    {
        $requests = RentalRequest::with(['roomType.property.images'])
            ->where('tenant_id', $request->user()->id)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($requests->map(function ($r) {
            $property = $r->roomType->property;
            $image = $property->images->first();

            $imageUrl = null;
            if ($image) {
                $imageUrl = str_starts_with($image->image_path, 'http')
                    ? $image->image_path
                    : asset('storage/' . $image->image_path);
            }

            $statusMap = [
                'pending'  => ['label' => 'Menunggu',   'color' => 'orange'],
                'approved' => ['label' => 'Disetujui',  'color' => 'green'],
                'rejected' => ['label' => 'Ditolak',    'color' => 'red'],
            ];
            $statusInfo = $statusMap[$r->status] ?? ['label' => $r->status, 'color' => 'grey'];

            return [
                'id'             => $r->id,
                'status'         => $r->status,
                'status_label'   => $statusInfo['label'],
                'status_color'   => $statusInfo['color'],
                'start_date'     => $r->start_date,
                'duration_value' => $r->duration_value,
                'duration_type'  => $r->duration_type,
                'note'           => $r->note,
                'created_at'     => $r->created_at->format('d F Y'),
                'property'       => [
                    'id'        => $property->id,
                    'name'      => $property->name,
                    'address'   => $property->address,
                    'city'      => $property->city,
                    'image_url' => $imageUrl,
                ],
                'room_type' => [
                    'id'           => $r->roomType->id,
                    'name'         => $r->roomType->name,
                    'price'        => $r->roomType->price,
                    'rental_type'  => $r->roomType->rental_type,
                ],
            ];
        }));
    }

    public function show(Request $request, $id)
    {
        $r = RentalRequest::with([
            'roomType.property.images',
            'roomType.property.owner',
        ])
        ->where('tenant_id', $request->user()->id)
        ->findOrFail($id);

        $property = $r->roomType->property;
        $image = $property->images->first();

        $imageUrl = null;
        if ($image) {
            $imageUrl = str_starts_with($image->image_path, 'http')
                ? $image->image_path
                : asset('storage/' . $image->image_path);
        }

        $statusMap = [
            'pending'  => ['label' => 'Menunggu Persetujuan', 'color' => 'orange'],
            'approved' => ['label' => 'Disetujui',            'color' => 'green'],
            'rejected' => ['label' => 'Ditolak',              'color' => 'red'],
        ];
        $statusInfo = $statusMap[$r->status] ?? ['label' => $r->status, 'color' => 'grey'];

        return response()->json([
            'id'             => $r->id,
            'status'         => $r->status,
            'status_label'   => $statusInfo['label'],
            'status_color'   => $statusInfo['color'],
            'start_date'     => $r->start_date,
            'duration_value' => $r->duration_value,
            'duration_type'  => $r->duration_type,
            'note'           => $r->note,
            'created_at'     => $r->created_at->format('d F Y H:i'),
            'property'       => [
                'id'        => $property->id,
                'name'      => $property->name,
                'address'   => $property->address,
                'city'      => $property->city,
                'image_url' => $imageUrl,
                'owner'     => [
                    'name'  => $property->owner->name ?? '-',
                    'phone' => $property->owner->phone ?? '-',
                ],
            ],
            'room_type' => [
                'id'          => $r->roomType->id,
                'name'        => $r->roomType->name,
                'price'       => $r->roomType->price,
                'rental_type' => $r->roomType->rental_type,
            ],
        ]);
    }
}