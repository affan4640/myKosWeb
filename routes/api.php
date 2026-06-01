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
use App\Http\Controllers\Api\ComplaintController;
use App\Http\Controllers\Api\InvoiceController;

Route::get('/auth/google/mobile', [AuthController::class, 'redirectToGoogle']);
Route::get('/auth/google/mobile/callback', [AuthController::class, 'handleGoogleCallback']);

Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);
Route::post('/forgot-password', [AuthController::class, 'sendOtp']);
Route::post('/verify-otp', [AuthController::class, 'verifyOtp']);
Route::post('/reset-password', [AuthController::class, 'resetPassword']);

Route::post('/xendit/callback', [PaymentController::class, 'callback']);
Route::post('/xendit/webhook',  [PaymentController::class, 'callback']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user/devices', [AuthController::class, 'getTokens']);
    Route::delete('/user/devices/{id}', [AuthController::class, 'revokeToken']);
    Route::put('/profile', [AuthController::class, 'updateProfile']);


    Route::get('/properties', [PropertyController::class, 'index']);
    Route::get('/properties/{id}', [PropertyController::class, 'show']);

    Route::get('/contracts', [ContractController::class, 'index']);

    Route::get('/wishlists', [WishlistController::class, 'index']);
    Route::post('/wishlists/toggle', [WishlistController::class, 'toggle']);
    Route::get('/wishlists/check/{propertyId}', [WishlistController::class, 'check']);

    Route::post('/rental-requests', [RentalRequestController::class, 'store']);
    Route::get('/rental-requests', [RentalRequestController::class, 'index']);
    Route::get('/rental-requests/{id}', [RentalRequestController::class, 'show']);
    Route::post('rental-requests/{id}/invoice', [PaymentController::class, 'createInvoiceForRentalRequest']);

    Route::get('/conversations', [ChatController::class, 'getConversations']);
    Route::get('/conversations/{id}/messages', [ChatController::class, 'getMessages']);
    Route::post('/conversations/create', [ChatController::class, 'createOrGetConversation']);
    Route::post('/messages', [ChatController::class, 'sendMessage']);
    Route::delete('conversations/{id}', [ChatController::class, 'deleteConversation']);

    Route::post('/reviews', [ReviewController::class, 'store']);

    Route::get('/complaints', [ComplaintController::class, 'index']);
    Route::post('/complaints', [ComplaintController::class, 'store']);
    Route::put('/complaints/{id}', [ComplaintController::class, 'update']);

    Route::post('/invoices/create',[PaymentController::class, 'createInvoice']);
    Route::post('/invoices/{id}/mark-paid', [PaymentController::class, 'markPaid']);
});
