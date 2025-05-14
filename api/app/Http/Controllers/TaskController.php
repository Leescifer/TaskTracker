<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Task;
use App\Models\User;
use Auth;

class TaskController extends Controller
{
    public function create() {
        $users = User::all();
        return view('task.create', compact('users'));
    }


    public function store(Request $request){
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'date_start' => 'required|date',
            'date_end' => 'required|date|after_or_equal:date_start',
            'user_id' => 'required|exists:users,id',
        ]);

        Task::create([
            'title' => $request->title,
            'description' => $request->description,
            'date_start' => $request->date_start,
            'date_end' => $request->date_end,
            'user_id' => $request->user_id,
            'admin_user_id' => Auth::id(),
        ]);

    return redirect()->route('tasks.index')->with('success', 'Task assigned successfully.');

    }



};