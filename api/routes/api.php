<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\UserController;

Route::post("signup", [AuthController::class, "signup"]);
Route::post("signin", [AuthController::class, "signin"]);

// Protected routes with sanctum auth
Route::middleware('auth:sanctum')->group(function () {
    Route::get("profile", [AuthController::class, "profile"]);
    Route::post("logout", [AuthController::class, "logout"]);

    // RESTful task routes
    Route::apiResource('tasks', TaskController::class)->except(['show', 'create', 'edit']);

    Route::get('/users', [UserController::class, 'index']);
});