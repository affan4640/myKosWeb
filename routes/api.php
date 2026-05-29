<?php
use App\Http\Controllers\Api\PaymentController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\PropertyController;
use App\Http\Controllers\Api\ContractController;
use App\Http\Controllers\Api\WishlistController;
use App\Http\Controllers\Api\RentalRequestController;
use App\Http\Controllers\Api\ChatController;
use App\Http\Controllers\Api\ReviewController;

Route::get('/auth/google/mobile', [AuthController::class, 'redirectToGoogle']);
Route::get('/auth/google/mobile/callback', [AuthController::class, 'handleGoogleCallback']);

Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);
Route::post('/forgot-password', [AuthController::class, 'sendOtp']);
Route::post('/verify-otp', [AuthController::class, 'verifyOtp']);
Route::post('/reset-password', [AuthController::class, 'resetPassword']);

Route::middleware('auth:sanctum')->group(function () {
Route::get('/user', [AuthController::class, 'me']);
Route::post('/logout', [AuthController::class, 'logout']);
Route::put('/profile', [AuthController::class, 'updateProfile']);


Route::get('/properties', [PropertyController::class, 'index']);
Route::get('/properties/{id}', [PropertyController::class, 'show']);

Route::get('/contracts', [ContractController::class, 'index']);

Route::get('/wishlists', [WishlistController::class, 'index']);
Route::post('/wishlists/toggle', [WishlistController::class, 'toggle']);
Route::get('/wishlists/check/{propertyId}', [WishlistController::class, 'check']);

Route::post('/rental-requests',[RentalRequestController::class, 'store']);

Route::post('/reviews', [ReviewController::class, 'store']);

Route::post(
        '/invoice/{invoice}/pay',
        [PaymentController::class, 'createInvoice']
    );

});

Route::post(
    '/xendit/callback',
    [PaymentController::class, 'callback']
);

Route::get('/conversations', [ChatController::class, 'getConversations']);
Route::get('/conversations/{id}/messages', [ChatController::class, 'getMessages']);
Route::post('/messages', [ChatController::class, 'sendMessage']);