<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $users = User::query()
            ->when($request->search, function ($query, $search) {
                $query->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "{$search}")
                    ->orWhere('role', 'like', "{$search}")
                    ->orWhere('phone', 'like', "{$search}");
            })->latest()->paginate(10)->withQueryString();

        return Inertia::render('Admin/Users', [
            'users' => $users,
            'filters' => $request->only(['search'])
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function updateRole(Request $request, User $user)
    {
        $request->validate([
            'role' => 'required|in:tenant,owner,admin',
        ]);

        /* TIDAK BISA UBAH ROLE DIRI SENDIRI */
        if (auth()->id() === $user->id) {
            return back()->with(
                'error',
                'Anda tidak dapat mengubah role akun sendiri.'
            );
        }

        /* TIDAK BISA UBAH ROLE OWNER JIKA SUDAH PUNYA PROPERTY */
        if (
            $user->role === 'owner' &&
            $request->role !== 'owner' &&
            $user->properties()->exists()
        ) {
            return back()->with(
                'error',
                'Role owner tidak dapat diubah karena user masih memiliki properti.'
            );
        }

        /* TIDAK BISA UBAH ROLE ADMIN JIKA ADMIN TERSISA 1 */
        if (
            $user->role === 'admin' &&
            $request->role !== 'admin'
        ) {

            $totalAdmin = User::where('role', 'admin')->count();

            if ($totalAdmin <= 1) {
                return back()->with(
                    'error',
                    'Minimal harus ada 1 admin dalam sistem.'
                );
            }
        }

        $user->update([
            'role' => $request->role,
        ]);

        return back()->with(
            'success',
            'Role user berhasil diubah.'
        );
    }

    public function destroy(User $user)
    {
        if (auth()->id() === $user->id) {
            return back()->withErrors([
                'user' => 'Kamu tidak bisa menghapus akun sendiri.',
            ]);
        }

        $user->delete();

        return back()->with('success', 'User berhasil dihapus.');
    }
}
