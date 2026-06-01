<?php

namespace App\Http\Controllers\Owner;

use App\Http\Controllers\Controller;
use App\Models\Complaint;
use App\Models\Property;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OwnerComplaintController extends Controller
{
    public function index(Request $request)
    {
        $propertyIds = Property::where('owner_id', auth()->id())->pluck('id');

        $complaints = Complaint::with([
                'tenant:id,name,email',
                'property:id,name',
            ])
            ->whereIn('property_id', $propertyIds)
            ->when($request->search, function ($q, $search) {
                $q->where(function ($q) use ($search) {
                    $q->where('title', 'like', "%{$search}%")
                        ->orWhere('description', 'like', "%{$search}%")
                        ->orWhereHas('tenant', fn ($q) =>
                            $q->where('name', 'like', "%{$search}%")
                        )
                        ->orWhereHas('property', fn ($q) =>
                            $q->where('name', 'like', "%{$search}%")
                        );
                });
            })
            ->when($request->status, fn ($q, $status) =>
                $q->where('status', $status)
            )
            ->latest()
            ->paginate(10)
            ->withQueryString();

        $stats = [
            'total' => Complaint::whereIn('property_id', $propertyIds)->count(),
            'new' => Complaint::whereIn('property_id', $propertyIds)->where('status', 'new')->count(),
            'process' => Complaint::whereIn('property_id', $propertyIds)->where('status', 'process')->count(),
            'done' => Complaint::whereIn('property_id', $propertyIds)->where('status', 'done')->count(),
        ];

        return Inertia::render('Owner/Complaints', [
            'complaints' => $complaints,
            'stats' => $stats,
            'filters' => $request->only(['search', 'status']),
        ]);
    }

    public function updateStatus(Request $request, Complaint $complaint)
    {
        $request->validate([
            'status' => 'required|in:new,process,done',
        ]);

        $isOwner = Property::where('id', $complaint->property_id)
            ->where('owner_id', auth()->id())
            ->exists();

        abort_unless($isOwner, 403);

        $complaint->update([
            'status' => $request->status,
        ]);

        return back()->with('success', 'Status keluhan berhasil diperbarui.');
    }
}