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
}