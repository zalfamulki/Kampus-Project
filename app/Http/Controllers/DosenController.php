<?php

namespace App\Http\Controllers;

use App\Models\Dosen;
use Illuminate\Http\Request;

class DosenController extends Controller
{
    public function index()
    {
        $dosens = Dosen::orderBy('nama')->get();
        return view('dosen.index', compact('dosens'));
    }

    public function create()
    {
        return view('dosen.create');
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'nidn' => 'required|string|max:50|unique:dosens,nidn',
            'nama' => 'required|string|max:255',
            'email' => 'nullable|email|max:255',
            'departemen' => 'nullable|string|max:255',
        ]);

        Dosen::create($data);

        return redirect()->route('dosen.index')->with('success', 'Data dosen berhasil disimpan.');
    }

    public function edit(Dosen $dosen)
    {
        return view('dosen.edit', compact('dosen'));
    }

    public function update(Request $request, Dosen $dosen)
    {
        $data = $request->validate([
            'nidn' => 'required|string|max:50|unique:dosens,nidn,' . $dosen->id,
            'nama' => 'required|string|max:255',
            'email' => 'nullable|email|max:255',
            'departemen' => 'nullable|string|max:255',
        ]);

        $dosen->update($data);

        return redirect()->route('dosen.index')->with('success', 'Data dosen berhasil diperbarui.');
    }

    public function destroy(Dosen $dosen)
    {
        $dosen->delete();
        return redirect()->route('dosen.index')->with('success', 'Data dosen berhasil dihapus.');
    }
}
