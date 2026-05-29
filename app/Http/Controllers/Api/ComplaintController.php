<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Complaint;
use App\Models\Contract;
use Illuminate\Http\Request;

class ComplaintController extends Controller
{
    private function resolveImageUrl(?string $path): ?string
    {
        if (!$path) return null;
        return str_starts_with($path, 'http')
            ? $path
            : asset('storage/' . $path);
    }

    public function index(Request $request)
    {
        $complaints = Complaint::with(['property'])
            ->where('tenant_id', $request->user()->id)
            ->latest()
            ->get();

        return response()->json([
            'data' => $complaints->map(function ($complaint) {
                return [
                    'id'          => $complaint->id,
                    'tenant_id'   => $complaint->tenant_id,
                    'property_id' => $complaint->property_id,
                    'contract_id' => $complaint->contract_id,
                    'title'       => $complaint->title,
                    'description' => $complaint->description,
                    'image'       => $this->resolveImageUrl($complaint->image),
                    'status'      => $complaint->status,
                    'created_at'  => $complaint->created_at?->format('d M Y'),
                ];
            }),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'property_id' => 'nullable|exists:properties,id',
            'contract_id' => 'nullable|exists:contracts,id',
            'title'       => 'required|string|max:255',
            'description' => 'required|string',
            'image'       => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
        ]);

        $propertyId = $request->property_id;
        $contractId = $request->contract_id;

        if (!$propertyId) {
            $activeContract = Contract::with('roomType.property')
                ->where('tenant_id', $request->user()->id)
                ->where('status', 'active')
                ->latest()
                ->first();

            if (!$activeContract) {
                return response()->json([
                    'message' => 'Tidak ada kontrak aktif',
                ], 422);
            }

            $propertyId = $activeContract->roomType->property->id;
            $contractId = $activeContract->id;
        }

        $imagePath = null;
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('complaints', 'public');
        }

        $complaint = Complaint::create([
            'tenant_id'   => $request->user()->id,
            'property_id' => $propertyId,
            'contract_id' => $contractId,
            'title'       => $request->title,
            'description' => $request->description,
            'image'       => $imagePath,
            'status'      => 'new',
        ]);

        return response()->json(['data' => $complaint], 201);
    }

    public function update(Request $request, $id)
    {
        $complaint = Complaint::where('id', $id)->firstOrFail();

        $request->validate([
            'status' => 'required|in:new,process,done',
        ]);

        $complaint->update(['status' => $request->status]);

        return response()->json(['data' => $complaint]);
    }
}