<?php
namespace App\Http\Controllers;

use App\Models\Matkul;
use Illuminate\Http\Request;

class MatkulController extends Controller
{
    public function index()
    {
        $matkuls = Matkul::orderBy('nama')->get();
        return view('matkul.index', compact('matkuls'));
    }

    public function create()
    {
        return view('matkul.create');
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'kode' => 'required|string|max:50|unique:matkuls,kode',
            'nama' => 'required|string|max:255',
            'jurusan' => 'nullable|string|max:255',
        ]);

        Matkul::create($data);

        return redirect()->route('matkul.index')->with('success', 'Data mata kuliah berhasil disimpan.');
    }

    public function edit(Matkul $matkul)
    {
        return view('matkul.edit', compact('matkul'));
    }

    public function update(Request $request, Matkul $matkul)
    {
        $data = $request->validate([
            'kode' => 'required|string|max:50|unique:matkuls,kode,' . $matkul->id,
            'nama' => 'required|string|max:255',
            'jurusan' => 'nullable|string|max:255',
        ]);

        $matkul->update($data);

        return redirect()->route('matkul.index')->with('success', 'Data mata kuliah berhasil diperbarui.');
    }

    public function destroy(Matkul $matkul)
    {
        $matkul->delete();
        return redirect()->route('matkul.index')->with('success', 'Data mata kuliah berhasil dihapus.');
    }
}
