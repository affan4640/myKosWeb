<?php

namespace App\Http\Controllers;

use App\Models\Conversation;
use App\Models\Message;
use App\Models\Notification;
use App\Models\User;
use App\Services\FCMService;
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

        // Kirim notifikasi FCM ke penerima (tenant)
        $conversation = Conversation::find($request->conversation_id);
        if ($conversation) {
            $senderId = Auth::id();
            $senderName = Auth::user()->name;
            $receiverId = $conversation->user_one_id === $senderId
                ? $conversation->user_two_id
                : $conversation->user_one_id;

            $receiver = User::find($receiverId);

            if ($receiver) {
                // Simpan notifikasi di database
                Notification::create([
                    'user_id' => $receiverId,
                    'title'   => 'Pesan Baru dari Pemilik Kost (' . $senderName . ')',
                    'message' => \Illuminate\Support\Str::limit($request->message, 100),
                    'type'    => 'chat',
                    'data'    => [
                        'conversation_id' => $conversation->id,
                        'sender_name'     => $senderName,
                    ],
                ]);

                // Kirim FCM push
                if ($receiver->fcm_token) {
                    FCMService::send(
                        $receiver->fcm_token,
                        'Pesan Baru dari Pemilik Kost (' . $senderName . ')',
                        \Illuminate\Support\Str::limit($request->message, 100),
                        [
                            'type'            => 'chat',
                            'conversation_id' => (string) $conversation->id,
                            'owner_name'      => $senderName,
                        ]
                    );
                }
            }
        }

        return response()->json($message);
    }
}