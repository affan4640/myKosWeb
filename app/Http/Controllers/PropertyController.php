<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use App\Models\Property;
use App\Models\PropertyImage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class PropertyController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
{
    $properties = Property::with('owner')

        ->when($request->search, function ($query, $search) {

            $query->where(function ($q) use ($search) {

                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('address', 'like', "%{$search}%")
                  ->orWhere('city', 'like', "%{$search}%")
                  ->orWhereHas('owner', function ($ownerQuery) use ($search) {
                      $ownerQuery->where('name', 'like', "%{$search}%");
                  });

            });

        })
        ->latest()
        ->paginate(10)
        ->withQueryString();

    return Inertia::render('Admin/Properties', [
        'properties' => $properties,
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
        $property = Property::with([
            'owner',
            'images',
            'facilities',
            'roomTypes'])
            ->findOrFail($id);

        return Inertia::render('Admin/PropertyDetail', [
            'property' => $property
        ]);
    }

    public function detail(string $id)
    {
        $property = Property::with([
            'images', 'facilities'
        ])->findOrFail($id);

        return Inertia::render('Owner/PropertyDetail', [
            'property' => $property
        ]);
    }

    /**
     * Update the specified resource in storage.
     */

    public function edit(string $id) {
        $property = Property::with([
            'images'
        ])->findOrFail($id);

        return Inertia::render('Owner/Edit/EditProperty', [
            'property' => $property
        ]);
    }

    public function update(Request $request, string $id)
    {
        $property = Property::where('owner_id', auth()->id())
            ->findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string',
            'address' => 'required|string',
            'city' => 'required|string',
            'description' => 'nullable|string',
            'rules' => 'nullable|string',
            'latitude' => 'required|numeric',
            'longitude' => 'required|numeric',

            'images' => 'required|array',
            'images.*' => 'image|mimes:jpg,jpeg,png|max:2048',
        ], [
            'name.required' => 'Nama Properti Harus Diisi.',
            'address.required' => 'Alamat Properti Harus Diisi.',
            'city.required' => 'Kota Properti Harus Diisi.',
            'latitude.required' => 'Latitude Properti Harus Diisi.',
            'longitude.required' => 'Longitude Properti Harus Diisi.',
            'images.required' => 'Foto Properti Harus Diunggah.',
            'images.*.image' => 'Setiap file harus berupa gambar.',
            'images.*.mimes' => 'Gambar harus berformat jpg, jpeg, atau png.',
            'images.*.max' => 'Ukuran gambar maksimal 2MB.'
        ]);

        DB::transaction(function () use ($request, $property, $validated) {
            $property->update([
                'name' => $validated['name'],
                'address' => $validated['address'],
                'city' => $validated['city'],
                'description' => $validated['description'],
                'rules' => $validated['rules'],
                'latitude' => $validated['latitude'],
                'longitude' => $validated['longitude'],
            ]);

            if ($request->hasFile('images')) {

                foreach ($request->file('images') as $image) {

                    $path = $image->store('property-images', 'public');

                    PropertyImage::create([
                        'property_id' => $property->id,
                        'image_path' => $path,
                    ]);
                }
            }
        });

        return redirect()
            ->back()
            ->with('success', 'Informasi kos berhasil diperbarui!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, Property $property)
{
    $request->validate([
        'reason' => 'required|string|max:255',
    ]);

    /* SIMPAN OWNER ID SEBELUM PROPERTY DIHAPUS */
    $ownerId = $property->owner_id;

    /* SIMPAN NAMA PROPERTY */
    $propertyName = $property->name;

    /* HAPUS PROPERTY */
    $property->delete();

    /* NOTIFIKASI KE OWNER */
    Notification::create([
        'user_id' => $ownerId,
        'title'   => 'Property Dihapus Admin',
        'message' => "Property '{$propertyName}' dihapus oleh admin. Alasan: {$request->reason}",
        'is_read' => false,
    ]);

    return back()->with(
        'success',
        'Property berhasil dihapus.'
    );
}

    public function deleteImage(string $id) 
    {
        $image = PropertyImage::findOrFail($id);

        if ($image->property->owner_id !== auth()->id()) {
            abort(403);
        }

        Storage::disk('public')->delete($image->image_path);

        $image->delete();

        return redirect()->back()->with('success', 'foto berhasil dihapus!');
    }
}
