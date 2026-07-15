<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Textile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class TextileController extends Controller
{
    public function index()
    {
        return Textile::all();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'slug' => 'required|string|unique:textiles,slug',
            'nom' => 'required|string',
            'origine' => 'nullable|string',
            'tile' => 'nullable|string',
        ]);

        return Textile::create($data);
    }

    public function show(Textile $textile)
    {
        return $textile;
    }

    public function update(Request $request, Textile $textile)
    {
        $data = $request->validate([
            'slug' => 'sometimes|required|string|unique:textiles,slug,'.$textile->id,
            'nom' => 'sometimes|required|string',
            'origine' => 'nullable|string',
            'tile' => 'nullable|string',
        ]);

        $textile->update($data);

        return $textile;
    }

    public function uploadImage(Request $request, Textile $textile)
    {
        $request->validate([
            'image' => 'required|image|max:4096',
        ]);

        if ($textile->image) {
            Storage::disk('public')->delete($textile->image);
        }

        $path = $request->file('image')->store('textiles', 'public');
        $textile->update(['image' => $path]);

        return $textile;
    }

    public function destroy(Textile $textile)
    {
        if ($textile->image) {
            Storage::disk('public')->delete($textile->image);
        }

        $textile->delete();

        return response()->noContent();
    }
}
