<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\EscrowTransactionController;

// Public routes
Route::get('ping', fn () => response()->json(['ok' => true]));
Route::post('register', [AuthController::class, 'register']);
Route::post('login',    [AuthController::class, 'login']);

// Protected routes (require Sanctum token)
Route::middleware('auth:sanctum')->group(function () {
    Route::post('logout', [AuthController::class, 'logout']);
    Route::apiResource('escrows', EscrowTransactionController::class);
    Route::post('escrows/{escrowTransaction}/accept',  [EscrowTransactionController::class, 'accept']);
    Route::post('escrows/{escrowTransaction}/release', [EscrowTransactionController::class, 'release']);
    Route::post('escrows/{escrowTransaction}/cancel',  [EscrowTransactionController::class, 'cancel']);
});
