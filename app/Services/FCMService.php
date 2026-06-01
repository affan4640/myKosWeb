<?php

namespace App\Services;

use Google\Auth\Credentials\ServiceAccountCredentials;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class FCMService
{
    /**
     * Mengirim pesan via FCM HTTP v1 API.
     */
    public static function send($deviceToken, $title, $body, $data = [])
    {
        if (empty($deviceToken)) {
            return false;
        }

        $credentialsFilePath = env('GOOGLE_APPLICATION_CREDENTIALS', base_path('storage/app/firebase-auth.json'));

        if (!file_exists($credentialsFilePath)) {
            Log::error("FCMService: credentials file tidak ditemukan di " . $credentialsFilePath);
            return false;
        }

        try {
            $credentials = new ServiceAccountCredentials(
                'https://www.googleapis.com/auth/firebase.messaging',
                $credentialsFilePath
            );

            // Disable SSL verification for local dev (Laragon cURL error 77)
            $httpHandler = function ($request, $options = []) {
                $client = new \GuzzleHttp\Client(['verify' => false]);
                return $client->send($request, $options);
            };

            // Get access token
            $token = $credentials->fetchAuthToken($httpHandler);
            if (!isset($token['access_token'])) {
                Log::error("FCMService: Gagal mendapatkan access token.");
                return false;
            }
            $accessToken = $token['access_token'];

            // Project ID can be provided explicitly or read from the credentials file.
            $projectId = env('FCM_PROJECT_ID');

            if (!$projectId) {
                $json = json_decode(file_get_contents($credentialsFilePath), true);
                $projectId = $json['project_id'] ?? null;
            }

            if (!$projectId) {
                Log::error("FCMService: project_id tidak ditemukan. Set FCM_PROJECT_ID atau pastikan credentials JSON valid.");
                return false;
            }

            $url = "https://fcm.googleapis.com/v1/projects/{$projectId}/messages:send";

            // Pastikan data bernilai scalar (string, integer). FCM tidak mendukung object bersarang dalam data.
            $formattedData = [];
            foreach ($data as $key => $value) {
                $formattedData[$key] = (string)$value;
            }

            $message = [
                'message' => [
                    'token' => $deviceToken,
                    'notification' => [
                        'title' => $title,
                        'body' => $body,
                    ],
                    'android' => [
                        'priority' => 'high',
                        'notification' => [
                            'sound' => 'default',
                            'default_vibrate_timings' => true,
                            'default_light_settings' => true,
                        ]
                    ]
                ]
            ];

            if (!empty($formattedData)) {
                $message['message']['data'] = $formattedData;
            }

            $response = Http::withToken($accessToken)
                ->withOptions(['verify' => false]) // Disable SSL for local dev
                ->post($url, $message);

            if ($response->successful()) {
                Log::info("FCMService: Berhasil mengirim notifikasi ke {$deviceToken}");
                return true;
            } else {
                Log::error("FCMService: Gagal mengirim notifikasi. " . $response->body());
                return false;
            }
        } catch (\Throwable $e) {
            Log::error("FCMService: Error saat mengirim push notification - " . $e->getMessage());
            return false;
        }
    }
}
