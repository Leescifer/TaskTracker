<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Task;
use Illuminate\Support\Facades\Auth;

class TaskController extends Controller
{
    // GET /tasks
    public function index()
    {
        $tasks = Task::with(['user', 'admin'])->get();
        return response()->json($tasks);
    }

    // POST /tasks
    public function store(Request $request)
    {
        if (!Auth::user()->isAdmin()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'date_start' => 'required|date',
            'date_end' => 'required|date|after_or_equal:date_start',
            'user_id' => 'required|exists:users,id',
        ]);

       $task = Task::create([
    'title' => $request->title,
    'description' => $request->description,
    'date_start' => $request->date_start,
    'date_end' => $request->date_end,
    'user_id' => $request->user_id,
    'admin_user_id' => Auth::id(),
    'status' => $request->status,
]);


        return response()->json($task, 201);
    }

    // PUT /tasks/{id}
   public function update(Request $request, $id)
{
    $task = Task::findOrFail($id);
    $user = Auth::user();

    // Allow admins to update everything, users can only update their own task's status
    if (!$user->isAdmin() && $task->user_id !== $user->id) {
        return response()->json(['message' => 'Unauthorized'], 403);
    }

    $rules = [
        'status' => 'required|in:todo,inprogress,done'
    ];

    // Admins can update everything
    if ($user->isAdmin()) {
        $rules = array_merge($rules, [
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'date_start' => 'required|date',
            'date_end' => 'required|date|after_or_equal:date_start',
            'user_id' => 'required|exists:users,id',
        ]);
    }

    $validated = $request->validate($rules);

    // If user is not admin, only allow status update
    if (!$user->isAdmin()) {
        $task->status = $validated['status'];
    } else {
        $task->update([
            'title' => $validated['title'],
            'description' => $validated['description'] ?? null,
            'date_start' => $validated['date_start'],
            'date_end' => $validated['date_end'],
            'user_id' => $validated['user_id'],
            'admin_user_id' => $user->id,
            'status' => $validated['status'],
        ]);
        return response()->json($task);
    }

    $task->save();
    return response()->json($task);
}
    // DELETE /tasks/{id}
    public function destroy($id)
    {
        if (!Auth::user()->isAdmin()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $task = Task::findOrFail($id);
        $task->delete();

        return response()->json(['message' => 'Task deleted successfully.']);
    }
}
