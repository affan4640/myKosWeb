<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;
use Laravel\Socialite\Facades\Socialite;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'email'    => 'required|email',
            'password' => 'required|min:6',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json(['message' => 'Email atau password salah'], 401);
        }

        $token = $user->createToken('flutter-app')->plainTextToken;

        return response()->json([
            'message' => 'Login berhasil',
            'token'   => $token,
            'user'    => [
                'name'  => $user->name,
                'email' => $user->email,
                'role'  => $user->role ?? 'tenant',
            ],
        ], 200);
    }

    public function register(Request $request)
    {
        $request->validate([
            'name'     => 'required|string|max:255',
            'email'    => 'required|email|unique:users,email',
            'password' => 'required|min:6|confirmed',
        ]);

        User::create([
            'name'              => $request->name,
            'email'             => $request->email,
            'password'          => Hash::make($request->password),
            'role'              => 'tenant',
            'email_verified_at' => now(),
        ]);

        return response()->json(['message' => 'Pendaftaran berhasil'], 201);
    }

    public function sendOtp(Request $request)
    {
        $request->validate(['email' => 'required|email|exists:users,email']);

        $otp = str_pad(rand(0, 9999), 4, '0', STR_PAD_LEFT);
        Cache::put('otp_' . $request->email, $otp, now()->addMinutes(10));

        return response()->json([
            'message' => 'Kode OTP telah dikirim ke ' . $request->email,
            'otp'     => $otp,
        ], 200);
    }

    public function verifyOtp(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'otp'   => 'required|size:4',
        ]);

        $cachedOtp = Cache::get('otp_' . $request->email);

        if (!$cachedOtp || $cachedOtp !== $request->otp) {
            return response()->json(['message' => 'OTP tidak valid atau sudah kadaluarsa'], 400);
        }

        return response()->json(['message' => 'OTP terverifikasi'], 200);
    }

    public function resetPassword(Request $request)
    {
        $request->validate([
            'email'    => 'required|email|exists:users,email',
            'password' => 'required|min:6|confirmed',
        ]);

        $user = User::where('email', $request->email)->first();
        $user->password = Hash::make($request->password);
        $user->save();

        Cache::forget('otp_' . $request->email);

        return response()->json(['message' => 'Password berhasil diubah'], 200);
    }

    public function redirectToGoogle(Request $request)
    {
        $platform = $request->query('platform', 'web');
        $state = Str::random(40);
        Cache::put('oauth_platform_' . $state, $platform, now()->addMinutes(10));

        $url = Socialite::driver('google')
            ->stateless()
            ->with(['state' => $state])
            ->redirectUrl(url('/api/auth/google/mobile/callback'))
            ->redirect()
            ->getTargetUrl();

        return response()->json(['url' => $url]);
    }

    public function handleGoogleCallback(Request $request)
    {
        $state = $request->query('state');
        $platform = Cache::get('oauth_platform_' . $state, 'web');
        Cache::forget('oauth_platform_' . $state);

        try {
            $googleUser = Socialite::driver('google')
                ->stateless()
                ->redirectUrl(url('/api/auth/google/mobile/callback'))
                ->user();
        } catch (\Exception $e) {
            if ($platform === 'mobile') {
                return redirect('mykost://auth/callback?error=gagal');
            }
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
        $params = '?token=' . $token .
            '&name=' . urlencode($user->name) .
            '&email=' . urlencode($user->email) .
            '&role=' . urlencode($user->role ?? 'tenant');

        if ($platform === 'mobile') {
            return redirect('mykost://auth/callback' . $params);
        }

        return redirect(env('FLUTTER_URL') . '/#/auth/callback' . $params);
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

    public function updateProfile(Request $request)
{
    $request->validate([
        'name'  => 'required|string|max:255',
        'phone' => 'nullable|string|max:20',
    ]);

    $user = $request->user();
    $user->name  = $request->name;
    $user->phone = $request->phone;
    $user->save();

    return response()->json([
        'message' => 'Profil berhasil diperbarui',
        'user'    => $user,
    ], 200);
}
}