<?php

namespace App\Http\Controllers;

use App\Models\Facility;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FacilityController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $facilities = Facility::query()
        ->when($request->search, function ($query, $search) {
            $query->where('name', 'like', "%{$search}%");
        })->latest()->paginate(10)->withQueryString();

        return Inertia::render('Admin/Facilities' , [
            'facilities' => $facilities,
            'filters' => $request->only(['search'])
        ]);
    }

    public function create() {
        return Inertia::render('Admin/Create/CreateFacility');
    }
    
    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:facilities,name',
            'type'=> 'required|in:property,room',
            'icon' => 'nullable|string'
        ], [
            'name.required' => 'Name Fasilitas Harus Diisi.',
            'name.string' => 'Nama Fasilitas Harus Berupa Teks.',
            'name.unique' => 'Nama Fasilitas Sudah Terdaftar.'
        ]);

        Facility::create($validated);

        return redirect()
            ->route('admin.facilities.create')
            ->with('success', 'Fasilitas Berhasil Ditambahkan');
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
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $facility = Facility::findOrFail($id);
        $facility->delete();

        return back()->with('success', 'fasilitas berhasil dihapus');
    }
}
