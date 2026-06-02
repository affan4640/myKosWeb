<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Notification;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    /**
     * Ambil daftar notifikasi user yang sedang login.
     */
    public function index(Request $request)
    {
        $notifications = Notification::where('user_id', $request->user()->id)
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($notif) {
                return [
                    'id'      => $notif->id,
                    'title'   => $notif->title,
                    'desc'    => $notif->message,
                    'type'    => $notif->type ?? 'info',
                    'time'    => $notif->created_at->diffForHumans(),
                    'isRead'  => (bool) $notif->is_read,
                    // Sertakan data tambahan untuk navigasi di mobile
                    'rental_request_id' => $notif->data['rental_request_id'] ?? null,
                    'conversation_id'   => $notif->data['conversation_id'] ?? null,
                    'sender_name'       => $notif->data['sender_name'] ?? null,
                ];
            });

        return response()->json(['data' => $notifications]);
    }

    /**
     * Tandai semua notifikasi sebagai dibaca.
     */
    public function markAllAsRead(Request $request)
    {
        Notification::where('user_id', $request->user()->id)
            ->where('is_read', false)
            ->update(['is_read' => true]);

        return response()->json(['message' => 'Semua notifikasi telah ditandai sebagai dibaca']);
    }

    /**
     * Tandai satu notifikasi sebagai dibaca.
     */
    public function markAsRead(Request $request, $id)
    {
        $notification = Notification::where('user_id', $request->user()->id)
            ->findOrFail($id);

        $notification->update(['is_read' => true]);

        return response()->json(['message' => 'Notifikasi ditandai sebagai dibaca']);
    }

    /**
     * Hapus satu notifikasi.
     */
    public function destroy(Request $request, $id)
    {
        $notification = Notification::where('user_id', $request->user()->id)
            ->findOrFail($id);

        $notification->delete();

        return response()->json(['message' => 'Notifikasi berhasil dihapus']);
    }

    /**
     * Simpan/update FCM token dari mobile app.
     */
    public function storeFcmToken(Request $request)
    {
        $request->validate([
            'fcm_token' => 'required|string',
        ]);

        $request->user()->update([
            'fcm_token' => $request->fcm_token,
        ]);

        return response()->json(['message' => 'FCM token berhasil disimpan']);
    }
}
