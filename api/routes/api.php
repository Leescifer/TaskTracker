<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProductController;

Route::post("signup", [AuthController::class, "signup"]);
Route::post("signin", [AuthController::class, "signin"]);

Route::middleware('auth:sanctum')->group(function () {
    Route::get("profile", [AuthController::class, "profile"]);
    Route::post("logout", [AuthController::class, "logout"]);
});
