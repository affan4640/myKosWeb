<?php

namespace App\Http\Controllers;

use App\Models\Contract;
use App\Models\Invoice;
use App\Models\Property;
use App\Models\RentalRequest;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use App\Models\Notification;

class RentalRequestController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request, string $propertyId)
{
    $property = Property::where('id', $propertyId)
        ->where('owner_id', auth()->id())
        ->firstOrFail();

    $rentals = RentalRequest::with([
        'tenant',
        'roomType'
    ])

    ->whereHas('roomType', function ($query) use ($propertyId) {

        $query->where(
            'property_id',
            $propertyId
        );

    })

    ->when($request->search, function ($query, $search) {

        $query->where(function ($q) use ($search) {

            $q->whereHas('tenant', function ($tenantQuery) use ($search) {

                $tenantQuery->where(
                    'name',
                    'like',
                    "%{$search}%"
                );

            })

            ->orWhereHas('roomType', function ($roomTypeQuery) use ($search) {

                $roomTypeQuery->where(
                    'name',
                    'like',
                    "%{$search}%"
                );

            });

        });

    })

    ->latest()
    ->paginate(10)
    ->withQueryString();

    return Inertia::render('Owner/RentalRequest', [
        'rentals' => $rentals,
        'property' => $property,
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

    public function edit(string $id) {
        $rental = RentalRequest::with([
            'roomType',
            'tenant'
        ])->findOrFail($id);

        return Inertia::render('Owner/Edit/RentalRequestDetail', [
            'rental' => $rental
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $rental = RentalRequest::findOrFail($id);
        $status = $request->input('status');

        if ($rental->status === 'approved' || $rental->status === 'rejected') {
            return redirect()->back()->with('error', 'Pengajuan ini telah diproses sebelumnya');
        }

        DB::transaction(function () use ($rental, $status, $request) {
          if ($status === 'approved') {
            $rental->update(['status' => 'approved']);

            $price = $rental->roomType->price;

            $total = $price * $rental->duration_value;

            if ($rental->duration_type === 'monthly') {
                $endDate = Carbon::parse($rental->start_date)
                    ->addMonths($rental->duration_value);
            } else {
                $endDate = Carbon::parse($rental->start_date)
                    ->addDays($rental->duration_value);
            }

            $contract = Contract::create([
                'room_type_id' => $rental->room_type_id,
                'tenant_id' => $rental->tenant_id,
                'start_date' => $rental->start_date,
                'end_date' => $endDate,
                'status' => 'pending_payment',
            ]);


            Invoice::create([
                'contract_id' => $contract->id,
                'amount' => $total,
                'due_date' => now()->addDay(),
                'status' => 'unpaid'
            ]);
          }

          else if ($status === 'rejected') {
            $rental->update(['status' => 'rejected']);
          }
        });

        return redirect()->back()->with(
            'success', 'pengajuan berhasil diproses'
        );
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
