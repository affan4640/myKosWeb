<?php

namespace App\Http\Controllers;

use App\Models\Contract;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TenantController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
         $tenants = User::query()
        ->when($request->search, function ($query, $search) {
            $query->where('name', 'like', "%{$search}%")
            ->orWhere('email', 'like', "{$search}")
            ->orWhere('phone', 'like', "{$search}");
        })->paginate(10)->withQueryString();

        return Inertia::render('Owner/Tenants', [
            'tenants' => $tenants,
            'filters' => $request->only(['search'])
        ]);
    }

    public function tenants(Request $request, string $id)
{
    $tenants = Contract::with([
            'tenant:id,name,email,phone',
            'roomType:id,name,property_id',
        ])
        ->whereHas('roomType', function ($query) use ($id) {
            $query->where('property_id', $id);
        })
        ->when($request->search, function ($query, $search) {
            $query->where(function ($q) use ($search) {
                $q->whereHas('tenant', function ($tenantQuery) use ($search) {
                    $tenantQuery->where('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%")
                        ->orWhere('phone', 'like', "%{$search}%");
                })
                ->orWhereHas('roomType', function ($roomTypeQuery) use ($search) {
                    $roomTypeQuery->where('name', 'like', "%{$search}%");
                });
            });
        })
        ->latest()
        ->paginate(10)
        ->withQueryString();

    $tenants->through(function ($contract) {
        return [
            'id' => $contract->id,
            'name' => $contract->tenant?->name,
            'email' => $contract->tenant?->email,
            'phone' => $contract->tenant?->phone,
            'room_type' => $contract->roomType,
            'check_in' => $contract->start_date
                ? \Carbon\Carbon::parse($contract->start_date)->format('d M Y')
                : null,
            'check_out' => $contract->end_date
                ? \Carbon\Carbon::parse($contract->end_date)->format('d M Y')
                : null,
            'status' => $contract->status,
        ];
    });

    return Inertia::render('Owner/Tenants', [
        'tenants' => $tenants,
        'filters' => $request->only(['search']),
    ]);
}

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
