<?php

namespace App\Http\Controllers;

use App\Models\Conversation;
use App\Models\Message;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class ChatController extends Controller
{
    public function index()
    {
        $conversations = Conversation::with(['userOne', 'userTwo', 'lastMessage'])
            ->where('user_two_id', Auth::id())
            ->orderByDesc(
                Message::select('id')
                    ->whereColumn('conversation_id', 'conversations.id')
                    ->orderBy('id', 'desc')
                    ->limit(1)
            )
            ->get();

        return Inertia::render('Owner/Messages', [
            'conversations' => $conversations,
        ]);
    }

    public function getMessages($id)
    {
        $messages = Message::where('conversation_id', $id)
            ->orderBy('created_at', 'asc')
            ->get();

        return response()->json($messages);
    }

    public function sendMessage(Request $request)
    {
        $request->validate([
            'conversation_id' => 'required',
            'message'         => 'required',
        ]);

        $message = Message::create([
            'conversation_id' => $request->conversation_id,
            'sender_id'       => Auth::id(),
            'message'         => $request->message,
            'is_read'         => false,
        ]);

        Conversation::where('id', $request->conversation_id)
            ->update(['last_message_at' => now()]);

        return response()->json($message);
    }
}