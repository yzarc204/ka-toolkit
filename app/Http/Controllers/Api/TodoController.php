<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Todo;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

class TodoController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        $todos = Todo::where('user_id', Auth::id())
            ->orderBy('order')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($todos);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'status' => ['nullable', Rule::in(['todo', 'in_progress', 'completed'])],
            'priority' => ['nullable', Rule::in(['low', 'medium', 'high'])],
            'due_date' => 'nullable|date|after_or_equal:today',
        ]);

        $validated['user_id'] = Auth::id();
        $validated['status'] = $validated['status'] ?? 'todo';
        $validated['priority'] = $validated['priority'] ?? 'medium';

        // Set order to be last
        $maxOrder = Todo::where('user_id', Auth::id())->max('order') ?? 0;
        $validated['order'] = $maxOrder + 1;

        $todo = Todo::create($validated);

        return response()->json($todo, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Todo $todo): JsonResponse
    {
        $this->authorize('view', $todo);
        return response()->json($todo);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Todo $todo): JsonResponse
    {
        $this->authorize('update', $todo);

        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'status' => ['sometimes', Rule::in(['todo', 'in_progress', 'completed'])],
            'priority' => ['sometimes', Rule::in(['low', 'medium', 'high'])],
            'due_date' => 'nullable|date|after_or_equal:today',
            'order' => 'sometimes|integer|min:0',
        ]);

        $todo->update($validated);

        return response()->json($todo);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Todo $todo): JsonResponse
    {
        $this->authorize('delete', $todo);
        $todo->delete();

        return response()->json(['message' => 'Todo deleted successfully']);
    }

    /**
     * Update todo order (for drag and drop)
     */
    public function updateOrder(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'todos' => 'required|array',
            'todos.*.id' => 'required|integer|exists:todos,id',
            'todos.*.order' => 'required|integer|min:0',
        ]);

        foreach ($validated['todos'] as $todoData) {
            $todo = Todo::find($todoData['id']);
            if ($todo && $todo->user_id === Auth::id()) {
                $todo->update(['order' => $todoData['order']]);
            }
        }

        return response()->json(['message' => 'Order updated successfully']);
    }
}
