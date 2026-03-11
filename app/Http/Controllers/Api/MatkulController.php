<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Matkul;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class MatkulController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:api');
        $this->middleware('admin')->except(['index', 'show']);
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        $matkuls = Matkul::all();
        return response()->json($matkuls);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'kode' => 'required|string|max:50|unique:matkuls,kode',
            'nama' => 'required|string|max:255',
            'jurusan' => 'nullable|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $matkul = Matkul::create($request->all());

        return response()->json([
            'message' => 'Mata kuliah successfully created',
            'data' => $matkul
        ], 201);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function show($id)
    {
        $matkul = Matkul::find($id);

        if (is_null($matkul)) {
            return response()->json(['message' => 'Record not found'], 404);
        }

        return response()->json($matkul);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, $id)
    {
        $matkul = Matkul::find($id);

        if (is_null($matkul)) {
            return response()->json(['message' => 'Record not found'], 404);
        }

        $validator = Validator::make($request->all(), [
            'kode' => 'required|string|max:50|unique:matkuls,kode,' . $id,
            'nama' => 'required|string|max:255',
            'jurusan' => 'nullable|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $matkul->update($request->all());

        return response()->json([
            'message' => 'Mata kuliah successfully updated',
            'data' => $matkul
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy($id)
    {
        $matkul = Matkul::find($id);

        if (is_null($matkul)) {
            return response()->json(['message' => 'Record not found'], 404);
        }

        $matkul->delete();

        return response()->json([
            'message' => 'Mata kuliah successfully deleted'
        ], 200);
    }
}
