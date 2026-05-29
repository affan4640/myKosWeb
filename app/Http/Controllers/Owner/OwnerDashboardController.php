<?php

namespace App\Http\Controllers\Owner;

use App\Http\Controllers\Controller;
use App\Models\Property;
use App\Models\RoomType;
use App\Models\Review;
use App\Models\Contract;
use App\Models\Payment;
use App\Models\Complaint;
use Carbon\Carbon;
use Inertia\Inertia;

class OwnerDashboardController extends Controller
{
    public function index()
    {
        $ownerId = auth()->id();

        $propertyIds = Property::where(
            'owner_id',
            $ownerId
        )->pluck('id');

        $totalProperties = $propertyIds->count();

        $totalRooms = RoomType::whereIn(
            'property_id',
            $propertyIds
        )->sum('total_rooms');

        $occupiedRooms = Contract::whereHas(
            'roomType',
            function ($q) use ($propertyIds) {
                $q->whereIn('property_id', $propertyIds);
            }
        )
        ->where('status', 'active')
        ->count();

        /*
        |--------------------------------------------------------------------------
        | PAYMENT QUERY
        |--------------------------------------------------------------------------
        */

        $paymentQuery = Payment::where(
            'status',
            'paid'
        )->whereHas(
            'invoice.contract.roomType.property',
            function ($query) use ($ownerId) {
                $query->where('owner_id', $ownerId);
            }
        );

        /*
        |--------------------------------------------------------------------------
        | PENDAPATAN BULAN INI
        |--------------------------------------------------------------------------
        */

        $monthlyRevenue = (clone $paymentQuery)
            ->whereMonth('paid_at', now()->month)
            ->whereYear('paid_at', now()->year)
            ->sum('paid_amount');

        /*
        |--------------------------------------------------------------------------
        | TOTAL PENDAPATAN
        |--------------------------------------------------------------------------
        */

        $totalRevenue = (clone $paymentQuery)
            ->sum('paid_amount');

        /*
        |--------------------------------------------------------------------------
        | DATA CHART 6 BULAN
        |--------------------------------------------------------------------------
        */

        $revenueData = collect(range(5, 0))->map(function ($month) use ($ownerId) {

            $date = now()->subMonths($month);

            $revenue = Payment::where(
                'status',
                'verified'
            )
            ->whereHas(
                'invoice.contract.roomType.property',
                function ($query) use ($ownerId) {
                    $query->where('owner_id', $ownerId);
                }
            )
            ->whereMonth('paid_at', $date->month)
            ->whereYear('paid_at', $date->year)
            ->sum('paid_amount');

            return [
                'name' => $date->translatedFormat('M'),
                'revenue' => (int) $revenue,
            ];
        });

        $avgRating = Review::whereIn(
            'property_id',
            $propertyIds
        )->avg('rating');

        $pendingComplaints = Complaint::whereIn(
            'property_id',
            $propertyIds
        )
        ->where('status', 'pending')
        ->count();

        $recentReviews = Review::with('user:id,name')
            ->whereIn('property_id', $propertyIds)
            ->latest()
            ->limit(3)
            ->get([
                'id',
                'user_id',
                'property_id',
                'rating',
                'comment',
                'created_at'
            ]);

        /*
        |--------------------------------------------------------------------------
        | RECENT PAYMENTS
        |--------------------------------------------------------------------------
        */

        $recentPayments = Payment::with([
                'invoice.contract.tenant:id,name',
                'invoice.contract.roomType.property:id,name',
            ])
            ->where('status', 'verified')
            ->whereHas(
                'invoice.contract.roomType.property',
                function ($query) use ($ownerId) {
                    $query->where('owner_id', $ownerId);
                }
            )
            ->latest()
            ->limit(5)
            ->get();

        $complaints = Complaint::with('property:id,name')
            ->whereIn('property_id', $propertyIds)
            ->where('status', 'pending')
            ->latest()
            ->limit(5)
            ->get([
                'id',
                'property_id',
                'title',
                'status',
                'created_at'
            ]);

        /*
        |--------------------------------------------------------------------------
        | ACTIVITIES
        |--------------------------------------------------------------------------
        */

        $activities = collect();

        Review::whereIn('property_id', $propertyIds)
            ->latest()
            ->limit(2)
            ->get()
            ->each(fn($r) => $activities->push([
                'type' => 'review',
                'text' => "Review baru masuk",
                'time' => $r->created_at->diffForHumans(),
                'created_at' => $r->created_at->toISOString(),
            ]));

        Payment::where('status', 'paid')
            ->whereHas(
                'invoice.contract.roomType.property',
                function ($query) use ($ownerId) {
                    $query->where('owner_id', $ownerId);
                }
            )
            ->latest()
            ->limit(2)
            ->get()
            ->each(fn($p) => $activities->push([
                'type' => 'payment',
                'text' => "Pembayaran baru diterima",
                'time' => $p->created_at->diffForHumans(),
                'created_at' => $p->created_at->toISOString(),
            ]));

        Complaint::whereIn('property_id', $propertyIds)
            ->latest()
            ->limit(2)
            ->get()
            ->each(fn($c) => $activities->push([
                'type' => 'complaint',
                'text' => "Keluhan baru: {$c->title}",
                'time' => $c->created_at->diffForHumans(),
                'created_at' => $c->created_at->toISOString(),
            ]));

        $activities = $activities
            ->sortByDesc('created_at')
            ->take(6)
            ->values();

        return Inertia::render('Owner/Dashboard', [

            'stats' => [
                'totalProperties'   => $totalProperties,
                'totalRooms'        => $totalRooms,
                'occupiedRooms'     => $occupiedRooms,
                'monthlyRevenue'    => $monthlyRevenue,
                'totalRevenue'      => $totalRevenue,
                'avgRating'         => round($avgRating, 1),
                'pendingComplaints' => $pendingComplaints,
            ],

            'revenueData'    => $revenueData,
            'recentReviews'  => $recentReviews,
            'recentPayments' => $recentPayments,
            'complaints'     => $complaints,
            'activities'     => $activities,
        ]);
    }
}