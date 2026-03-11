<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Dosen;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class DosenController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:api');
        $this->middleware('admin')->except(['index', 'show']);
    }

    public function index()
    {
        $dosens = Dosen::orderBy('nama')->get();
        return response()->json($dosens);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nidn' => 'required|string|max:50|unique:dosens,nidn',
            'nama' => 'required|string|max:255',
            'email' => 'nullable|email|max:255',
            'departemen' => 'nullable|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $dosen = Dosen::create($request->all());

        return response()->json([
            'message' => 'Dosen successfully created',
            'data' => $dosen
        ], 201);
    }

    public function show($id)
    {
        $dosen = Dosen::find($id);

        if (is_null($dosen)) {
            return response()->json(['message' => 'Record not found'], 404);
        }

        return response()->json($dosen);
    }

    public function update(Request $request, $id)
    {
        $dosen = Dosen::find($id);

        if (is_null($dosen)) {
            return response()->json(['message' => 'Record not found'], 404);
        }

        $validator = Validator::make($request->all(), [
            'nidn' => 'required|string|max:50|unique:dosens,nidn,' . $id,
            'nama' => 'required|string|max:255',
            'email' => 'nullable|email|max:255',
            'departemen' => 'nullable|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $dosen->update($request->all());

        return response()->json([
            'message' => 'Dosen successfully updated',
            'data' => $dosen
        ], 200);
    }

    public function destroy($id)
    {
        $dosen = Dosen::find($id);

        if (is_null($dosen)) {
            return response()->json(['message' => 'Record not found'], 404);
        }

        $dosen->delete();

        return response()->json([
            'message' => 'Dosen successfully deleted'
        ], 200);
    }
}
