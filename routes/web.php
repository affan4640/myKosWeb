<?php

use App\Http\Controllers\Admin\PaymentController;
use App\Http\Controllers\FacilityController;
use App\Http\Controllers\Owner\OwnerPaymentController;
use App\Http\Controllers\Owner\OwnerWalletController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\PropertyApplicationController;
use App\Http\Controllers\PropertyController;
use App\Http\Controllers\PropertyFacilityController;
use App\Http\Controllers\RentalRequestController;
use App\Http\Controllers\RoomTypeController;
use App\Http\Controllers\TenantController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\SearchController;
use App\Http\Controllers\KosController;
use App\Http\Controllers\Admin\DashboardController;

use App\Http\Controllers\Owner\OwnerComplaintController;
use App\Http\Controllers\Owner\OwnerDashboardController;
use App\Http\Controllers\WalletController;
use App\Http\Controllers\WishlistController;
use App\Models\Review;
use App\Models\Property;
use Illuminate\Http\Request;

use App\Http\Controllers\ChatController;

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Socialite\Facades\Socialite;
use Illuminate\Support\Facades\Auth;
use App\Models\User;

Route::get('/', function () {
    return inertia('Landing');
})->name('landing');


Route::get('/auth/google', function () {
    return Socialite::driver('google')->redirect();
})->name('google.redirect');

Route::get('/auth/google/callback', function () {
    $googleUser = Socialite::driver('google')->user();

    $user = User::updateOrCreate(
        ['email' => $googleUser->getEmail()],
        ['name' => $googleUser->getName()]
    );

    Auth::login($user);
    if ($user->role === 'admin') {
        return redirect('admin/dashboard');
    }

    return redirect('/');
})->name('google.callback');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    Route::put('/profile/password', [ProfileController::class, 'updatePassword'])
        ->name('profile.password');
});

require __DIR__ . '/auth.php';

Route::middleware(['auth', 'verified', 'admin'])->prefix('admin')->group(function () {

    Route::get('/dashboard', [DashboardController::class, 'index'])
        ->name('admin.dashboard');

    Route::get('/users', [UserController::class, 'index'])->name('admin.users');

    Route::get('/kos', function () {
        return Inertia::render('Admin/Kos');
    })->name('admin.kos');

    Route::get('/transaksi', [PaymentController::class, 'index'])->name('admin.transaksi');

    Route::get('/transactions/{id}', [PaymentController::class, 'detail'])->name('admin.transactions.detail');

    Route::put('/users/{user}/role', [UserController::class, 'updateRole'])
        ->name('admin.users.updateRole');

    Route::delete('/users/{user}', [UserController::class, 'destroy'])
        ->name('admin.users.destroy');

    Route::get('/properties', [PropertyController::class, 'index'])->name('admin.properties');

    Route::get('/properties/{id}', [PropertyController::class, 'show'])->name('admin.properties.detail');

    Route::delete('/properties/{property}', [PropertyController::class, 'destroy'])->name('admin.properties.destroy');

    Route::get('/request', [PropertyApplicationController::class, 'index'])->name('admin.request');

    Route::get('/request/{id}', [PropertyApplicationController::class, 'show'])->name('admin.request.detail');

    Route::put('/request/update/{id}', [PropertyApplicationController::class, 'update'])->name('admin.request.update');

    Route::get('/facilities', [FacilityController::class, 'index'])->name('admin.facilities');

    Route::get('/facilities/create', [FacilityController::class, 'create'])->name('admin.facilities.create');

    Route::get('/facilities/edit', [FacilityController::class, 'edit'])->name('admin.facilities.edit');

    Route::post('/facilities/store', [FacilityController::class, 'store'])->name('admin.facilities.store');

    Route::delete('/facilities/{id}', [FacilityController::class, 'destroy'])->name('admin.facilities.destroy');

    Route::get('/settings', function () {
        return Inertia::render('Admin/Settings');
    })->name('admin.settings');
    Route::get('/admin/request/{id}', [PropertyApplicationController::class, 'show'])
        ->name('admin.request.show');
});

Route::middleware(['auth', 'verified', 'owner'])->prefix('owner')->group(function () {
    Route::get('/dashboard', [OwnerDashboardController::class, 'index'])
    ->name('owner.dashboard');

    Route::get('/tenants/{id}', [
        TenantController::class,
        'tenants'
    ])->name('owner.tenants');

    Route::get('/messages', [
        ChatController::class, 'index'
    ])->name('owner.messages');

    Route::get('/messages/{id}', [
    ChatController::class,
    'getMessages'
]);

Route::post('/messages/send', [
    ChatController::class,
    'sendMessage'
]);

    Route::get('/property/detail/{id}', [
        PropertyController::class,
        'detail'
    ])->name('owner.property.detail');

    Route::put('/property/update/{id}', [
        PropertyController::class,
        'update'
    ])->name('owner.property.update');

    Route::get('/property/edit/{id}', [
        PropertyController::class,
        'edit'
    ])->name('owner.property.edit');

    Route::delete('/property-image/delete/{id}', [
        PropertyController::class,
        'deleteImage'
    ])->name('owner.propertyImage.delete');

    Route::get('/facilities/{id}', [
        PropertyFacilityController::class,
        'editFacilities'
    ])->name('owner.property.facilities');

    Route::post('/facilities/{property}', [
        PropertyFacilityController::class,
        'store'
    ])->name('owner.property.facilities.store');

    Route::get(
        '/room-types/create',
        [
            RoomTypeController::class,
            'create'
        ]
    )->name('owner.room-types.create');

    Route::post('/room-types/store', [
        RoomTypeController::class,
        'store'
    ])->name('owner.room-types.store');

    Route::get('/room-types/edit/{id}', [
        RoomTypeController::class,
        'edit'
    ])->name('owner.room-types.edit');

    Route::get('/room-types/{property}',[
        RoomTypeController::class, 'index'
    ])->name('owner.room-types');

    Route::put('/room-types/update/{id}', [
        RoomTypeController::class,
        'update'
    ])->name('owner.room-type.update');

    Route::delete('/room-types/delete/{id}', [
        RoomTypeController::class,
        'destroy'
    ])->name('owner.room-type.delete');

    Route::delete('/room-types-image/delete/{id}', [
        RoomTypeController::class,
        'deleteImage'
    ])->name('owner.room-type-image.delete');


    Route::get('/rental-request/{property}', [
        RentalRequestController::class,
        'index'
    ])->name('owner.rental-request');

    Route::get('/rental-request/detail/{id}', [
        RentalRequestController::class, 'edit'
    ])->name('owner.rental-request.detail');

    Route::put('/rental-request/update/{id}', [
        RentalRequestController::class, 'update'
    ])->name('owner.rental-request.update');

    Route::post('/notifications/mark-all-read', function () {
        \App\Models\Notification::where('user_id', auth()->id())
            ->where('is_read', false)
            ->update(['is_read' => true]);
        return back();
    })->name('owner.notifications.markAllRead');

    Route::post('/notifications/{id}/mark-read', function ($id) {
        \App\Models\Notification::where('id', $id)
            ->where('user_id', auth()->id())
            ->update(['is_read' => true]);
        return back();
    })->name('owner.notifications.markOneRead');

    Route::get('/complaints/{property}', function ($property) {
        return Inertia::render('Owner/Complaints', [
            'propertyId' => $property,
        ]);
    })->name('complaints.index');



    Route::get('/reviews/{property}', function (Request $request, Property $property) {
        $reviewsQuery = Review::with(['user', 'property'])
            ->where('property_id', $property->id)
            ->latest();

        if ($request->filled('search')) {
            $search = $request->search;

            $reviewsQuery->where(function ($q) use ($search) {
                $q->where('comment', 'like', "%{$search}%")
                    ->orWhereHas('user', function ($user) use ($search) {
                        $user->where('name', 'like', "%{$search}%");
                    })
                    ->orWhereHas('property', function ($property) use ($search) {
                        $property->where('name', 'like', "%{$search}%");
                    });
            });
        }

        if ($request->filled('rating')) {
            $reviewsQuery->where('rating', $request->rating);
        }

        $statsQuery = Review::where('property_id', $property->id);

        return Inertia::render('Owner/Reviews', [
            'propertyId' => $property->id,

            'reviews' => $reviewsQuery
                ->paginate(10)
                ->withQueryString(),

            'stats' => [
                'total' => (clone $statsQuery)->count(),
                'average' => round((clone $statsQuery)->avg('rating') ?? 0, 1),
                'five' => (clone $statsQuery)->where('rating', 5)->count(),
                'four' => (clone $statsQuery)->where('rating', 4)->count(),
                'three' => (clone $statsQuery)->where('rating', 3)->count(),
                'two' => (clone $statsQuery)->where('rating', 2)->count(),
                'one' => (clone $statsQuery)->where('rating', 1)->count(),
            ],

            'filters' => [
                'search' => $request->search,
                'rating' => $request->rating,
            ],
        ]);
    })->name('owner.reviews.index');

    Route::get('/complaints', [OwnerComplaintController::class, 'index'])
        ->name('owner.complaints.index');

    Route::put('/complaints/{complaint}/status', [OwnerComplaintController::class, 'updateStatus'])
        ->name('owner.complaints.status');

    Route::get(
            '/wallet',
            [OwnerWalletController::class, 'index']
        );

        Route::post(
            '/wallet/bank-account',
            [OwnerWalletController::class, 'storeBankAccount']
        );

        Route::delete(
            '/wallet/bank-account/{id}',
            [OwnerWalletController::class, 'destroyBankAccount']
        );

        Route::post(
            '/wallet/withdraw',
            [OwnerWalletController::class, 'withdraw']
        );

    Route::get('/payments/{id}', [
        OwnerPaymentController::class, 'index'
    ])->name('owner.payments');
});

Route::post('/admin/notifications/mark-all-read', function () {
    \App\Models\Notification::where('user_id', auth()->id())
        ->where('is_read', false)
        ->update(['is_read' => true]);
    return back();
})->middleware('auth')->name('admin.notifications.markAllRead');
Route::post('/notifications/{id}/mark-read', function ($id) {
    \App\Models\Notification::where('id', $id)
        ->where('user_id', auth()->id())
        ->update(['is_read' => true]);
    return back();
})->name('admin.notifications.markOneRead');

Route::get('/search', [SearchController::class, 'index'])->name('search');

Route::get('/kos/{id}', [KosController::class, 'detail'])->name('kos.detail');

Route::middleware('auth')->group(function () {

    Route::get('/profile', function () {
        return Inertia::render('Profile');
    })->name('profile');

    

    Route::put('/profile/update', [ProfileController::class, 'update'])
        ->name('profile.update');

    Route::post('/profile/password', [ProfileController::class, 'updatePassword'])
        ->name('profile.password');

    Route::get('/form-pengajuan', function () {
        return Inertia::render('FormPengajuan');
    })->name('form-pengajuan');

    Route::post('/pengajuan-kos', [PropertyApplicationController::class, 'store'])
        ->name('pengajuan-kos.store');
    
    Route::get('/DetailKos', function () {
        return Inertia::render('DetailKos');
    })->name('detail.kos');

    

    Route::post('/wishlist', [WishlistController::class, 'toggle'])->name('wishlist.update');
});
