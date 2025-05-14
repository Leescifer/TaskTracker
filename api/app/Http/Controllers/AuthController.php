<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Laravel\Sanctum\HasApiTokens;

class AuthController extends Controller
{
    use HasApiTokens;

    public function signup(Request $request)
    {
        $request->validate([
            "name" => "required|string",
            "email" => "required|email|unique:users,email",
            "role" => "required|string|in:admin,user",
            "password" => "required|string"
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'role' => $request->role,
            'password' => bcrypt($request->password)
        ]);

        $token = $user->createToken("auth_token")->plainTextToken;

        return response()->json([
            "status" => true,
            "message" => "User registered successfully",
            "access_token" => $token,
            "token_type" => "Bearer",
            "user" => $user
        ]);
    }

    public function signin(Request $request)
    {
        $request->validate([
            "email" => "required|email",
            "password" => "required"
        ]);

        if (!Auth::attempt($request->only("email", "password"))) {
            return response()->json([
                "status" => false,
                "message" => "Invalid credentials"
            ], 401);
        }

        $user = Auth::user();
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            "status" => true,
            "message" => "Login successful",
            "access_token" => $token,
            "token_type" => "Bearer",
            "user" => $user
        ]);
    }

    public function profile()
    {
        return response()->json([
            "status" => true,
            "user" => Auth::user()
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            "status" => true,
            "message" => "Logged out successfully"
        ]);
    }
}
