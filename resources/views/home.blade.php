@extends('layouts.app')

@section('content')
    <section class="hero">
        <div class="hero__content">
            <h1 class="hero__title">Pusat Informasi <br><span class="text-primary">Akademik Terpadu</span></h1>
            <p class="hero__subtitle">
                Sistem pengelolaan data kampus modern yang dirancang untuk efisiensi dan kemudahan akses informasi bagi seluruh civitas akademika.
            </p>

            <div class="grid grid--cards">
                <a href="{{ route('mahasiswa.index') }}" class="card--academic">
                    <div class="card__icon-wrapper">
                        <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                            <circle cx="9" cy="7" r="4"></circle>
                            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                        </svg>
                    </div>
                    <h2>Mahasiswa</h2>
                    <p>Kelola data profil, NIM, dan administrasi mahasiswa secara terstruktur.</p>
                </a>

                <a href="{{ route('dosen.index') }}" class="card--academic">
                    <div class="card__icon-wrapper">
                        <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                        </svg>
                    </div>
                    <h2>Dosen</h2>
                    <p>Manajemen data tenaga pengajar, NIDN, dan departemen akademik.</p>
                </a>

                <a href="{{ route('matkul.index') }}" class="card--academic">
                    <div class="card__icon-wrapper">
                        <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                        </svg>
                    </div>
                    <h2>Mata Kuliah</h2>
                    <p>Penyusunan kurikulum, kode mata kuliah, dan distribusi jurusan.</p>
                </a>
            </div>
        </div>
    </section>
@endsection
