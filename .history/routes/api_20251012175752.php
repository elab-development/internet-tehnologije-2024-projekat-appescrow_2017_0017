<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\EscrowTransactionController;
use App\Http\Controllers\Api\PaymentAttachmentController;

// test ping (GET) — da proverimo da se fajl učitava
Route::get('ping', fn () => response()->json(['ok' => true]));

// public auth rute
Route::post('register', [AuthController::class, 'register']);
Route::post('login',    [AuthController::class, 'login']);

// protected rute (Sanctum)
Route::middleware('auth:sanctum')->group(function () {
    Route::post('logout', [AuthController::class, 'logout']);

    Route::apiResource('escrows', EscrowTransactionController::class);

    Route::post('escrows/{escrowTransaction}/accept',  [EscrowTransactionController::class, 'accept']);
    Route::post('escrows/{escrowTransaction}/release', [EscrowTransactionController::class, 'release']);
    Route::post('escrows/{escrowTransaction}/cancel',  [EscrowTransactionController::class, 'cancel']);
    Route::post('payments/{payment}/attachment', [PaymentAttachmentController::class, 'store']);
});
