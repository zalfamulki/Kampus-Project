<?php

namespace App\Http\Controllers;

use App\Models\AcademicSetting;
use App\Models\KrsEnrollment;
use App\Models\Mahasiswa;
use App\Models\Matkul;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class KrsController extends Controller
{
    public function getStatus()
    {
        $isOpen = AcademicSetting::where('key', 'krs_period_open')->first()->value === 'true';
        $semester = AcademicSetting::where('key', 'current_semester')->first()->value;

        return response()->json([
            'isOpen' => $isOpen,
            'semester' => $semester
        ]);
    }

    public function togglePeriod()
    {
        if (Auth::user()->role !== 'admin') {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $setting = AcademicSetting::where('key', 'krs_period_open')->first();
        $setting->value = $setting->value === 'true' ? 'false' : 'true';
        $setting->save();

        return response()->json([
            'isOpen' => $setting->value === 'true',
            'message' => 'KRS Period status updated successfully'
        ]);
    }

    public function submitKrs(Request $request)
    {
        $isOpen = AcademicSetting::where('key', 'krs_period_open')->first()->value === 'true';
        if (!$isOpen) {
            return response()->json(['error' => 'KRS period is closed'], 403);
        }

        $mahasiswa = $this->getMahasiswa();
        if (!$mahasiswa) {
            return response()->json(['error' => 'Mahasiswa data not found for current user'], 404);
        }

        $matkulIds = $request->input('matkul_ids', []);
        $semester = AcademicSetting::where('key', 'current_semester')->first()->value;

        // Simple sync logic: 
        // 1. Get current enrollments
        $existing = KrsEnrollment::where('mahasiswa_id', $mahasiswa->id)
            ->where('semester', $semester)
            ->get();
        
        $existingIds = $existing->pluck('matkul_id')->toArray();

        // 2. Add new ones
        foreach ($matkulIds as $id) {
            if (!in_array($id, $existingIds)) {
                KrsEnrollment::create([
                    'mahasiswa_id' => $mahasiswa->id,
                    'matkul_id' => $id,
                    'semester' => $semester,
                    'status' => 'pending'
                ]);
            }
        }

        // 3. Remove unselected ones (only if pending)
        foreach ($existing as $enrollment) {
            if (!in_array($enrollment->matkul_id, $matkulIds)) {
                // If it was already approved, maybe we should keep it or allow drop? 
                // User said "perbaiki agar ada persetujuan admin dahulu".
                // We'll allow dropping pending ones. If approved, let's keep it for now.
                if ($enrollment->status === 'pending') {
                    $enrollment->delete();
                }
            }
        }

        return response()->json(['message' => 'KRS submitted successfully and awaiting approval']);
    }

    public function getMyKrs()
    {
        $mahasiswa = $this->getMahasiswa();
        if (!$mahasiswa) return response()->json([]);

        $semester = AcademicSetting::where('key', 'current_semester')->first()->value;
        $enrollments = KrsEnrollment::with('matkul')
            ->where('mahasiswa_id', $mahasiswa->id)
            ->where('semester', $semester)
            ->get();

        return response()->json($enrollments);
    }

    public function getPendingKrs()
    {
        if (Auth::user()->role !== 'admin') {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $semester = AcademicSetting::where('key', 'current_semester')->first()->value;
        $pending = KrsEnrollment::with(['mahasiswa', 'matkul'])
            ->where('semester', $semester)
            ->where('status', 'pending')
            ->get();

        return response()->json($pending);
    }

    public function approveKrs(Request $request)
    {
        if (Auth::user()->role !== 'admin') {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $id = $request->input('id');
        $action = $request->input('action'); // 'approved' or 'rejected'

        $enrollment = KrsEnrollment::find($id);
        if (!$enrollment) return response()->json(['error' => 'Enrollment not found'], 404);

        $enrollment->status = $action;
        $enrollment->save();

        return response()->json(['message' => "KRS enrollment {$action}"]);
    }

    public function getSchedule()
    {
        $user = Auth::user();
        
        // If Admin, show all master courses (university schedule)
        if ($user->role === 'admin') {
            return response()->json(Matkul::all());
        }

        // If Student, show only approved enrollments
        $mahasiswa = $this->getMahasiswa();
        if (!$mahasiswa) return response()->json([]);

        $semester = AcademicSetting::where('key', 'current_semester')->first()->value;
        $approved = KrsEnrollment::where('mahasiswa_id', $mahasiswa->id)
            ->where('semester', $semester)
            ->where('status', 'approved')
            ->pluck('matkul_id');

        $matkuls = Matkul::whereIn('id', $approved)->get();

        return response()->json($matkuls);
    }

    private function getMahasiswa()
    {
        $user = Auth::user();
        if (!$user) return null;

        // Try direct relationship
        if ($user->mahasiswa) return $user->mahasiswa;

        // Fallback to name/email matching if direct link missing
        return Mahasiswa::where('email', $user->email)
            ->orWhere('nama', $user->name)
            ->first();
    }
}
