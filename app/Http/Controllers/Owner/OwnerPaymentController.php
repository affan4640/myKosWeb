<?php

namespace App\Http\Controllers\Owner;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OwnerPaymentController extends Controller
{
    public function index(Request $request, string $id)
    {
        $ownerId = auth()->id();

        $payments = Payment::query()

            ->whereHas(
                'invoice.contract.roomType.property',
                function ($query) use ($ownerId, $id) {
                    $query->where('owner_id', $ownerId)
                          ->where('id', $id);
                }
            )

            ->when($request->search, function ($query) use ($request) {

                $query->where(function ($q) use ($request) {

                    $q->where('payment_method', 'like', '%' . $request->search . '%')

                      ->orWhere('payment_channel', 'like', '%' . $request->search . '%')

                      ->orWhereHas(
                          'invoice.contract.tenant',
                          function ($tenant) use ($request) {

                              $tenant->where(
                                  'name',
                                  'like',
                                  '%' . $request->search . '%'
                              );
                          }
                      )

                      ->orWhereHas(
                          'invoice.contract.roomType.property',
                          function ($property) use ($request) {

                              $property->where(
                                  'name',
                                  'like',
                                  '%' . $request->search . '%'
                              );
                          }
                      );
                });
            })

            ->with([
                'invoice.contract.tenant',
                'invoice.contract.roomType.property'
            ])

            ->latest()

            ->paginate(20)

            ->withQueryString();

        return Inertia::render('Owner/Payments', [
            'payments' => $payments,
            'filters' => [
                'search' => $request->search
            ]
        ]);
    }
}