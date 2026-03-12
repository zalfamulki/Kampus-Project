<?php

namespace App\Http\Controllers;

use App\Models\Grade;
use App\Models\Mahasiswa;
use App\Models\Matkul;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class GradeController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:api');
    }

    public function index()
    {
        $grades = Grade::with(['mahasiswa', 'matkul'])->get();
        return response()->json($grades);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'mahasiswa_id' => 'required|exists:mahasiswas,id',
            'matkul_id' => 'required|exists:matkuls,id',
            'nilai' => 'required|string|max:5',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $grade = Grade::updateOrCreate(
            ['mahasiswa_id' => $request->mahasiswa_id, 'matkul_id' => $request->matkul_id],
            ['nilai' => $request->nilai]
        );

        return response()->json([
            'message' => 'Grade successfully saved',
            'data' => $grade
        ]);
    }

    public function getByMahasiswa($id)
    {
        $grades = Grade::with('matkul')->where('mahasiswa_id', $id)->get();
        return response()->json($grades);
    }
}
