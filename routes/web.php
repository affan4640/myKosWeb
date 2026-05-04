<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\UserController;
use App\Http\Middleware\AdminMiddleware;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Socialite\Facades\Socialite;
use Illuminate\Support\Facades\Auth;
use App\Models\User;

Route::get('/', function () {
    return inertia('Landing');
});


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
});

require __DIR__ . '/auth.php';

Route::middleware(['auth', 'verified', 'admin'])->prefix('admin')->group(function () {

    Route::get('/dashboard', function () {
        return Inertia::render('Dashboard');
    })->name('admin.dashboard');

    Route::get('/users', [UserController::class, 'index'])->name('admin.users');

    Route::get('/kos', function () {
        return Inertia::render('Admin/Kos');
    })->name('admin.kos');

    Route::get('/transaksi', function () {
        return Inertia::render('Admin/Transaksi');
    })->name('admin.transaksi');

    Route::get('/settings', function () {
        return Inertia::render('Admin/Settings');
    })->name('admin.settings');

});

Route::get('/search', function () {
    return Inertia::render('Search');
})->name('search');

Route::get('/DetailKos', function () {
    return Inertia::render('DetailKos');
})->name('detail.kos');

Route::middleware('auth')->group(function () {

    Route::get('/profile', function () {
        return Inertia::render('Profile');
    })->name('profile');

    Route::post('/profile/update', [ProfileController::class, 'update'])
        ->name('profile.update');

    Route::post('/profile/password', [ProfileController::class, 'updatePassword'])
        ->name('profile.password');

});