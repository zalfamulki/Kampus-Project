@extends('layouts.app')

@section('content')
    <div class="page-header">
        <div>
            <h1 class="page-title">Tambah Mata Kuliah</h1>
            <p class="page-subtitle">Input data kurikulum mata kuliah baru.</p>
        </div>
        <div class="page-actions">
            <a href="{{ route('matkul.index') }}" class="btn-academic btn--secondary-grad">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
                Kembali
            </a>
        </div>
    </div>

    <div class="card-table">
        <form action="{{ route('matkul.store') }}" method="POST" class="form-academic">
            @csrf

            <div class="form__row">
                <label class="form__label" for="kode">
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>
                    Kode Mata Kuliah
                </label>
                <input class="form__input" type="text" name="kode" id="kode" placeholder="Contoh: MK001" value="{{ old('kode') }}" required />
            </div>

            <div class="form__row">
                <label class="form__label" for="nama">
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path></svg>
                    Nama Mata Kuliah
                </label>
                <input class="form__input" type="text" name="nama" id="nama" placeholder="Masukkan nama mata kuliah" value="{{ old('nama') }}" required />
            </div>

            <div class="form__row">
                <label class="form__label" for="sks">
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                    SKS (Satuan Kredit Semester)
                </label>
                <input class="form__input" type="number" name="sks" id="sks" value="{{ old('sks') }}" required />
            </div>

            <div class="form__row">
                <label class="form__label" for="semester">
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
                    Semester
                </label>
                <input class="form__input" type="number" name="semester" id="semester" value="{{ old('semester') }}" required />
            </div>

            <div class="form__actions">
                <button class="btn-academic btn--primary" type="submit">
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>
                    Simpan Data
                </button>
            </div>
        </form>
    </div>
@endsection
