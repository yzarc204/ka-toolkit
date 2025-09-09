<?php

namespace App\Http\Controllers;

use App\Models\Note;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

class NoteController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        $user = Auth::user();

        $notes = Note::where('user_id', $user->id)
            ->orWhereHas('sharedWith', function ($query) use ($user) {
                $query->where('user_id', $user->id);
            })
            ->with(['user', 'sharedWith'])
            ->orderBy('updated_at', 'desc')
            ->get();

        return response()->json($notes);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'nullable|string',
            'is_public' => 'boolean',
        ]);

        $note = Note::create([
            'user_id' => Auth::id(),
            'title' => $validated['title'],
            'content' => $validated['content'] ?? '',
            'is_public' => $validated['is_public'] ?? false,
        ]);

        return response()->json($note->load('user'), 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Note $note): JsonResponse
    {
        $user = Auth::user();

        // Check if user owns the note or has access to it
        if ($note->user_id !== $user->id && !$note->sharedWith->contains($user->id)) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        return response()->json($note->load(['user', 'sharedWith']));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Note $note): JsonResponse
    {
        // Only the owner can update the note
        if ($note->user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'title' => 'nullable|string|max:255',
            'content' => 'nullable|string',
            'is_public' => 'nullable|boolean',
        ]);

        // Only update fields that are provided
        $updateData = [];
        if (isset($validated['title'])) {
            $updateData['title'] = $validated['title'];
        }
        if (isset($validated['content'])) {
            $updateData['content'] = $validated['content'];
        }
        if (isset($validated['is_public'])) {
            $updateData['is_public'] = $validated['is_public'];
        }

        $note->update($updateData);

        return response()->json($note->load('user'));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Note $note): JsonResponse
    {
        // Only the owner can delete the note
        if ($note->user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $note->delete();

        return response()->json(['message' => 'Note deleted successfully']);
    }

    /**
     * Share note with another user
     */
    public function share(Request $request, Note $note): JsonResponse
    {
        // Only the owner can share the note
        if ($note->user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
        ]);

        $userToShare = User::find($validated['user_id']);

        // Don't share with the owner
        if ($userToShare->id === Auth::id()) {
            return response()->json(['message' => 'Cannot share with yourself'], 400);
        }

        // Check if already shared
        if ($note->sharedWith->contains($userToShare->id)) {
            return response()->json(['message' => 'Note already shared with this user'], 400);
        }

        $note->sharedWith()->attach($userToShare->id);

        return response()->json([
            'message' => 'Note shared successfully',
            'shared_with' => $note->sharedWith
        ]);
    }

    /**
     * Unshare note with another user
     */
    public function unshare(Request $request, Note $note): JsonResponse
    {
        // Only the owner can unshare the note
        if ($note->user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
        ]);

        $note->sharedWith()->detach($validated['user_id']);

        return response()->json([
            'message' => 'Note unshared successfully',
            'shared_with' => $note->sharedWith
        ]);
    }
}