<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\TaskController;

Route::post("signup", [AuthController::class, "signup"]);
Route::post("signin", [AuthController::class, "signin"]);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    Route::get("profile", [AuthController::class, "profile"]);
    Route::post("logout", [AuthController::class, "logout"]);

    // Task routes
    Route::prefix('tasks')->name('tasks.')->group(function () {
        Route::get('/create', [TaskController::class, 'create'])->name('create'); 
        Route::post('/store', [TaskController::class, 'store'])->name('store');
        Route::put('/{id}/update', [TaskController::class, 'update'])->name('update');
        Route::delete('/{id}/delete', [TaskController::class, 'delete'])->name('delete');
        Route::get('/', [TaskController::class, 'index'])->name('index');
    });
});