<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Conversation;
use App\Models\Message;
use App\Models\Notification;
use App\Models\User;
use App\Services\FCMService;

class ChatController extends Controller
{
    public function getConversations(Request $request)
    {
        $userId = $request->user()->id;

        $conversations = Conversation::with(['userOne', 'userTwo', 'lastMessage'])
            ->whereHas('messages')
            ->where(function ($q) use ($userId) {
                $q->where('user_one_id', $userId)
                    ->orWhere('user_two_id', $userId);
            })
            ->orderBy('last_message_at', 'desc')
            ->get();

        return response()->json([
            'data' => $conversations->map(function ($conv) use ($userId) {
                $otherUser = $conv->user_one_id === $userId
                    ? $conv->userTwo
                    : $conv->userOne;

                return [
                    'id'             => $conv->id,
                    'user_one_id'    => $conv->user_one_id,
                    'other_user'     => [
                        'id'    => $otherUser?->id,
                        'name'  => $otherUser?->name ?? 'Pengguna',
                        'role'  => $otherUser?->role ?? '-',
                        'phone' => $otherUser?->phone ?? '-',
                    ],
                    'last_message'    => $conv->lastMessage?->message ?? '',
                    'last_message_at' => $conv->last_message_at,
                ];
            }),
        ]);
    }
    public function deleteConversation(Request $request, $id)
    {
        $userId = $request->user()->id;

        $conversation = Conversation::where('id', $id)
            ->where(function ($q) use ($userId) {
                $q->where('user_one_id', $userId)
                    ->orWhere('user_two_id', $userId);
            })->first();

        if (!$conversation) {
            return response()->json(['message' => 'Obrolan tidak ditemukan'], 404);
        }

        Message::where('conversation_id', $id)->delete();
        $conversation->delete();

        return response()->json(['message' => 'Obrolan berhasil dihapus']);
    }

    public function getMessages(Request $request, $id)
    {
        $messages = Message::where('conversation_id', $id)
            ->orderBy('created_at', 'asc')
            ->get();

        return response()->json(['data' => $messages]);
    }

    public function createOrGetConversation(Request $request)
    {
        $request->validate([
            'owner_id' => 'required|integer|exists:users,id',
        ]);

        $userId = $request->user()->id;
        $ownerId = $request->owner_id;

        $conversation = Conversation::where(function ($q) use ($userId, $ownerId) {
            $q->where('user_one_id', $userId)->where('user_two_id', $ownerId);
        })->orWhere(function ($q) use ($userId, $ownerId) {
            $q->where('user_one_id', $ownerId)->where('user_two_id', $userId);
        })->first();

        if (!$conversation) {
            $conversation = Conversation::create([
                'user_one_id' => $userId,
                'user_two_id' => $ownerId,
            ]);
        }

        $otherUser = $conversation->user_one_id === $userId
            ? $conversation->userTwo
            : $conversation->userOne;

        return response()->json([
            'data' => [
                'id'          => $conversation->id,
                'user_one_id' => $conversation->user_one_id,
                'other_user'  => [
                    'id'   => $otherUser?->id,
                    'name' => $otherUser?->name ?? 'Pemilik Kost',
                    'role' => $otherUser?->role ?? '-',
                ],
            ],
        ]);
    }

    public function sendMessage(Request $request)
    {
        $request->validate([
            'conversation_id' => 'required|integer|exists:conversations,id',
            'message'         => 'required|string',
        ]);

        $message = Message::create([
            'conversation_id' => $request->conversation_id,
            'sender_id'       => $request->user()->id,
            'message'         => $request->message,
            'is_read'         => false,
        ]);

        Conversation::where('id', $request->conversation_id)
            ->update(['last_message_at' => now()]);

        // Kirim notifikasi FCM ke penerima
        $conversation = Conversation::find($request->conversation_id);
        if ($conversation) {
            $senderId = $request->user()->id;
            $senderName = $request->user()->name;
            $receiverId = $conversation->user_one_id === $senderId
                ? $conversation->user_two_id
                : $conversation->user_one_id;

            $receiver = User::find($receiverId);

            if ($receiver) {
                // Simpan notifikasi di database
                Notification::create([
                    'user_id' => $receiverId,
                    'title'   => 'Pesan Baru dari ' . $senderName,
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
                        'Pesan Baru dari ' . $senderName,
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

        return response()->json([
            'message' => 'Pesan berhasil dikirim!',
            'data'    => $message,
        ]);
    }
}

