<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Notifications\PasswordResetOtpNotification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Storage;
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

        $deviceName = $request->header('User-Agent', 'flutter-app');
        $token = $user->createToken($deviceName)->plainTextToken;

        return response()->json([
            'message' => 'Login berhasil',
            'token'   => $token,
            'user'    => [
                'name'   => $user->name,
                'email'  => $user->email,
                'role'   => $user->role ?? 'tenant',
                'phone'  => $user->phone,
                'avatar' => $this->avatarUrl($user->avatar),
            ],
        ]);
    }

    public function register(Request $request)
    {
        $request->validate([
            'name'     => 'required|string|max:255',
            'email'    => 'required|email|unique:users,email',
            'password' => 'required|min:6|confirmed',
            'role'     => 'sometimes|in:tenant,owner',
        ]);

        $role = $request->input('role', 'tenant');

        $user = User::create([
            'name'              => $request->name,
            'email'             => $request->email,
            'password'          => Hash::make($request->password),
            'role'              => $role,
            'email_verified_at' => now(),
        ]);

        $token = $user->createToken('flutter-app')->plainTextToken;

        return response()->json([
            'message' => 'Pendaftaran berhasil',
            'token'   => $token,
            'user'    => [
                'name'   => $user->name,
                'email'  => $user->email,
                'role'   => $user->role,
                'avatar' => $this->avatarUrl($user->avatar),
            ],
        ], 201);
    }

    public function sendOtp(Request $request)
    {
        $request->validate(['email' => 'required|email|exists:users,email']);

        $expiresMinutes = 10;

        $otp = str_pad(random_int(0, 9999), 4, '0', STR_PAD_LEFT);

        Cache::put('otp_' . $request->email, $otp, now()->addMinutes($expiresMinutes));

        $user = User::where('email', $request->email)->first();
        if ($user) {
            $smtpUsername = (string) config('mail.mailers.smtp.username');
            $smtpPassword = (string) config('mail.mailers.smtp.password');

            if (config('mail.default') === 'smtp' && ($smtpUsername === '' || $smtpPassword === '')) {
                return response()->json([
                    'message' => 'Konfigurasi email belum lengkap. Isi MAIL_USERNAME dan MAIL_PASSWORD (App Password Gmail) di .env.'
                ], 500);
            }

            try {
                $user->notify(new PasswordResetOtpNotification($otp, $expiresMinutes));
            } catch (\Throwable $e) {
                report($e);
                return response()->json([
                    'message' => 'Gagal mengirim OTP ke email. Silakan coba lagi.'
                ], 500);
            }
        }

        return response()->json([
            'message' => 'Kode OTP telah dikirim ke ' . $request->email,
        ]);
    }

    public function verifyOtp(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'otp'   => 'required|digits:4',
        ]);

        $cachedOtp = Cache::get('otp_' . $request->email);

        if (!$cachedOtp || $cachedOtp !== $request->otp) {
            return response()->json(['message' => 'OTP tidak valid atau sudah kadaluarsa'], 400);
        }

        Cache::put('otp_verified_' . $request->email, true, now()->addMinutes(10));
        Cache::forget('otp_' . $request->email);

        return response()->json(['message' => 'OTP terverifikasi']);
    }

    public function resetPassword(Request $request)
    {
        $request->validate([
            'email'    => 'required|email|exists:users,email',
            'password' => 'required|min:6|confirmed',
        ]);

        if (!Cache::get('otp_verified_' . $request->email)) {
            return response()->json([
                'message' => 'Verifikasi OTP diperlukan sebelum reset password'
            ], 403);
        }

        $user = User::where('email', $request->email)->first();
        $user->password = Hash::make($request->password);
        $user->save();

        $user->tokens()->delete();
        Cache::forget('otp_verified_' . $request->email);

        return response()->json(['message' => 'Password berhasil diubah']);
    }

    public function redirectToGoogle(Request $request)
    {
        $platform = $request->query('platform', 'web');
        $state    = Str::random(40);

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
        $state    = $request->query('state');
        $platform = Cache::get('oauth_platform_' . $state, 'web');
        Cache::forget('oauth_platform_' . $state);

        $flutterUrl = config('app.flutter_url'); 

        try {
            $googleUser = Socialite::driver('google')
                ->stateless()
                ->redirectUrl(url('/api/auth/google/mobile/callback'))
                ->user();
        } catch (\Exception $e) {
            return $platform === 'mobile'
                ? redirect('mykost://auth/callback?error=gagal')
                : redirect($flutterUrl . '/#/login?error=gagal');
        }

        $user = User::firstOrCreate(
            ['email' => $googleUser->getEmail()],
            [
                'name'              => $googleUser->getName(),
                'password'          => null,
                'role'              => 'tenant', 
                'email_verified_at' => now(),
            ]
        );

        $deviceName = $request->header('User-Agent', 'flutter-app');
        $token  = $user->createToken($deviceName)->plainTextToken;
        $params = http_build_query([  
            'token' => $token,
            'name'  => $user->name,
            'email' => $user->email,
            'role'  => $user->role ?? 'tenant',
        ]);

        return $platform === 'mobile'
            ? redirect('mykost://auth/callback?' . $params)
            : redirect($flutterUrl . '/#/auth/callback?' . $params);
    }

    public function me(Request $request)
    {
        return response()->json([
            'name'   => $request->user()->name,
            'email'  => $request->user()->email,
            'role'   => $request->user()->role ?? 'tenant',
            'phone'  => $request->user()->phone,
            'avatar' => $this->avatarUrl($request->user()->avatar),
        ]);
    }

    public function getTokens(Request $request)
    {
        $tokens = $request->user()->tokens->map(function ($token) use ($request) {
            return [
                'id' => $token->id,
                'name' => $token->name,
                'last_used_at' => $token->last_used_at ? $token->last_used_at->format('Y-m-d H:i:s') : null,
                'created_at' => $token->created_at->format('Y-m-d H:i:s'),
                'is_current' => $token->id === $request->user()->currentAccessToken()->id,
            ];
        });

        return response()->json(['data' => $tokens]);
    }

    public function revokeToken(Request $request, $id)
    {
        $token = $request->user()->tokens()->where('id', $id)->first();
        if ($token) {
            $token->delete();
            return response()->json(['message' => 'Akses perangkat berhasil dicabut']);
        }
        return response()->json(['message' => 'Perangkat tidak ditemukan'], 404);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Logout berhasil']);
    }

    public function updateProfile(Request $request)
    {
        $request->validate([
            'name'   => 'required|string|max:255',
            'phone'  => 'nullable|string|max:20',
            'avatar' => 'nullable|image|max:2048',
        ]);

        $user         = $request->user();
        $user->name    = $request->name;
        $user->phone   = $request->phone;

        if ($request->hasFile('avatar')) {
            if ($user->avatar && !filter_var($user->avatar, FILTER_VALIDATE_URL)) {
                Storage::disk('public')->delete($user->avatar);
            }

            $user->avatar = $request->file('avatar')->store('avatars', 'public');
        }

        $user->save();

        return response()->json([
            'message' => 'Profil berhasil diperbarui',
            'user'    => [
                'name'   => $user->name,
                'email'  => $user->email,
                'role'   => $user->role ?? 'tenant',
                'phone'  => $user->phone,
                'avatar' => $this->avatarUrl($user->avatar),
            ],
        ]);
    }

    private function avatarUrl(?string $avatar): string
    {
        if (!$avatar) {
            return '';
        }

        if (filter_var($avatar, FILTER_VALIDATE_URL)) {
            $path = parse_url($avatar, PHP_URL_PATH) ?: '';
            if ($path !== '') {
                return request()->getSchemeAndHttpHost() . $path;
            }

            return $avatar;
        }

        return request()->getSchemeAndHttpHost() . '/storage/' . ltrim($avatar, '/');
    }
}