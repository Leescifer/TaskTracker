<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;

class UserController extends Controller
{
    public function index(Request $request)
{
    $role = auth()->user()->role;

    if ($role === 'admin') {
        $users = User::select('id', 'name', 'email', 'role')->get();
    } else {
        $users = User::where('role', 'user')->select('id', 'name', 'role')->get();
    }

    return response()->json($users);
}
}