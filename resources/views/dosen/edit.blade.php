@extends('layouts.app')

@section('content')
    <div class="page-header">
        <div>
            <h1 class="page-title">Edit Dosen</h1>
            <p class="page-subtitle">Perbarui data dosen: <strong>{{ $dosen->nama }}</strong></p>
        </div>
        <div class="page-actions">
            <a href="{{ route('dosen.index') }}" class="btn-academic btn--secondary-grad">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
                Kembali
            </a>
        </div>
    </div>

    <div class="card-table">
        <form action="{{ route('dosen.update', $dosen) }}" method="POST" class="form-academic">
            @csrf
            @method('PUT')

            <div class="form__row">
                <label class="form__label" for="nidn">
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><polyline points="17 11 19 13 23 9"></polyline></svg>
                    NIDN
                </label>
                <input class="form__input" type="text" name="nidn" id="nidn" value="{{ old('nidn', $dosen->nidn) }}" required />
            </div>

            <div class="form__row">
                <label class="form__label" for="nama">
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                    Nama Lengkap
                </label>
                <input class="form__input" type="text" name="nama" id="nama" value="{{ old('nama', $dosen->nama) }}" required />
            </div>

            <div class="form__row">
                <label class="form__label" for="email">
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                    Email
                </label>
                <input class="form__input" type="email" name="email" id="email" value="{{ old('email', $dosen->email) }}" />
            </div>

            <div class="form__row">
                <label class="form__label" for="departemen">
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
                    Departemen
                </label>
                <input class="form__input" type="text" name="departemen" id="departemen" value="{{ old('departemen', $dosen->departemen) }}" />
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
