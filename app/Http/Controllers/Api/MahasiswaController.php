<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Mahasiswa;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class MahasiswaController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:api');
        $this->middleware('admin')->except(['index', 'show']);
    }

    public function index()
    {
        $mahasiswas = Mahasiswa::orderBy('nama')->get();
        return response()->json($mahasiswas);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nim' => 'required|string|max:50|unique:mahasiswas,nim',
            'nama' => 'required|string|max:255',
            'email' => 'nullable|email|max:255',
            'jurusan' => 'nullable|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $mahasiswa = Mahasiswa::create($request->all());

        return response()->json([
            'message' => 'Mahasiswa successfully created',
            'data' => $mahasiswa
        ], 201);
    }

    public function show($id)
    {
        $mahasiswa = Mahasiswa::find($id);

        if (is_null($mahasiswa)) {
            return response()->json(['message' => 'Record not found'], 404);
        }

        return response()->json($mahasiswa);
    }

    public function update(Request $request, $id)
    {
        $mahasiswa = Mahasiswa::find($id);

        if (is_null($mahasiswa)) {
            return response()->json(['message' => 'Record not found'], 404);
        }

        $validator = Validator::make($request->all(), [
            'nim' => 'required|string|max:50|unique:mahasiswas,nim,' . $id,
            'nama' => 'required|string|max:255',
            'email' => 'nullable|email|max:255',
            'jurusan' => 'nullable|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $mahasiswa->update($request->all());

        return response()->json([
            'message' => 'Mahasiswa successfully updated',
            'data' => $mahasiswa
        ], 200);
    }

    public function destroy($id)
    {
        $mahasiswa = Mahasiswa::find($id);

        if (is_null($mahasiswa)) {
            return response()->json(['message' => 'Record not found'], 404);
        }

        $mahasiswa->delete();

        return response()->json([
            'message' => 'Mahasiswa successfully deleted'
        ], 200);
    }
}
