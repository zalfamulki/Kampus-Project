@extends('layouts.app')

@section('content')
    <div class="page-header">
        <div>
            <h1 class="page-title">Edit Mahasiswa</h1>
            <p class="page-subtitle">Perbarui informasi data mahasiswa: <strong>{{ $mahasiswa->nama }}</strong></p>
        </div>
        <div class="page-actions">
            <a href="{{ route('mahasiswa.index') }}" class="btn-academic btn--secondary-grad">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
                Kembali
            </a>
        </div>
    </div>

    <div class="card-table">
        <form action="{{ route('mahasiswa.update', $mahasiswa) }}" method="POST" class="form-academic">
            @csrf
            @method('PUT')

            <div class="form__row">
                <label class="form__label" for="nim">
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="16" rx="2" ry="2"></rect><line x1="7" y1="8" x2="17" y2="8"></line><line x1="7" y1="12" x2="17" y2="12"></line><line x1="7" y1="16" x2="13" y2="16"></line></svg>
                    NIM
                </label>
                <input class="form__input" type="text" name="nim" id="nim" value="{{ old('nim', $mahasiswa->nim) }}" required />
            </div>

            <div class="form__row">
                <label class="form__label" for="nama">
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                    Nama Lengkap
                </label>
                <input class="form__input" type="text" name="nama" id="nama" value="{{ old('nama', $mahasiswa->nama) }}" required />
            </div>

            <div class="form__row">
                <label class="form__label" for="email">
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                    Email
                </label>
                <input class="form__input" type="email" name="email" id="email" value="{{ old('email', $mahasiswa->email) }}" />
            </div>

            <div class="form__row">
                <label class="form__label" for="jurusan">
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"></path><path d="M6 12v5c3 3 9 3 12 0v-5"></path></svg>
                    Jurusan
                </label>
                <input class="form__input" type="text" name="jurusan" id="jurusan" value="{{ old('jurusan', $mahasiswa->jurusan) }}" />
            </div>

            <div class="form__actions">
                <button class="btn-academic btn--primary" type="submit">
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>
                    Perbarui Data
                </button>
            </div>
        </form>
    </div>
@endsection
