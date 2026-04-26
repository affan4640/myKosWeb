<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Laravel\Socialite\Facades\Socialite;

class AuthController extends Controller
{
    public function redirectToGoogle()
    {
        $url = Socialite::driver('google')
            ->stateless()
            ->redirectUrl(url('/api/auth/google/mobile/callback'))
            ->redirect()
            ->getTargetUrl();

        return response()->json(['url' => $url]);
    }

    public function handleGoogleCallback()
    {
        try {
            $googleUser = Socialite::driver('google')
                ->stateless()
                ->redirectUrl(url('/api/auth/google/mobile/callback'))
                ->user();
        } catch (\Exception $e) {
            return redirect(env('FLUTTER_URL') . '/#/login?error=gagal');
        }

        $user = User::firstOrCreate(
            ['email' => $googleUser->getEmail()],
            [
                'name'              => $googleUser->getName(),
                'password'          => null,
                'email_verified_at' => now(),
            ]
        );

        $token = $user->createToken('flutter-app')->plainTextToken;

        return redirect(
            env('FLUTTER_URL') . '/#/auth/callback' .
            '?token=' . $token .
            '&name=' . urlencode($user->name) .
            '&email=' . urlencode($user->email) .
            '&role=' . urlencode($user->role ?? 'tenant')
        );
    }

    public function me(Request $request)
    {
        return response()->json($request->user());
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Logout berhasil']);
    }
}