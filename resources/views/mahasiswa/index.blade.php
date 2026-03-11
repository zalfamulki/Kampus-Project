@extends('layouts.app')

@section('content')
    <div class="page-header">
        <div>
            <h1 class="page-title">Data Mahasiswa</h1>
            <p class="page-subtitle">Kelola data mahasiswa secara terpusat dan efisien.</p>
        </div>

        <div class="page-actions">
            <a href="{{ route('mahasiswa.create') }}" class="btn-academic btn--primary">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                Tambah Mahasiswa
            </a>
        </div>
    </div>

    <div class="card-table">
        <div class="card__header" style="background: rgba(255,255,255,0.2); padding: 1.5rem; border-bottom: 1px solid var(--glass-border); display: flex; justify-content: space-between; align-items: center;">
            <div class="search-academic">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="var(--text-muted)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                <input id="searchInput" class="search__input" type="search" placeholder="Cari nama, NIM, atau jurusan..." style="background:transparent; border:none; outline:none; font-family:inherit; width:100%;" />
            </div>
            <span class="badge-academic">Total: {{ $mahasiswas->count() }}</span>
        </div>

        <div class="table-wrapper">
            <table class="table">
                <thead>
                    <tr>
                        <th>NIM</th>
                        <th>Nama</th>
                        <th>Email</th>
                        <th>Jurusan</th>
                        <th class="text-right">Aksi</th>
                    </tr>
                </thead>
                <tbody id="dataTable">
                    @forelse($mahasiswas as $mahasiswa)
                        <tr>
                            <td style="font-weight: 700; color: var(--primary);">{{ $mahasiswa->nim }}</td>
                            <td style="font-weight: 500;">{{ $mahasiswa->nama }}</td>
                            <td style="color: var(--text-muted);">{{ $mahasiswa->email ?? '-' }}</td>
                            <td><span style="background: var(--primary-glow); color: var(--primary); padding: 0.2rem 0.8rem; border-radius: 8px; font-size: 0.85rem; font-weight: 600;">{{ $mahasiswa->jurusan ?? '-' }}</span></td>
                            <td class="text-right">
                                <a href="{{ route('mahasiswa.edit', $mahasiswa) }}" class="btn--text" style="margin-right: 0.5rem; font-weight: 600;">Edit</a>
                                <form class="inline-form" action="{{ route('mahasiswa.destroy', $mahasiswa) }}" method="POST" onsubmit="return confirm('Hapus data mahasiswa ini?');">
                                    @csrf
                                    @method('DELETE')
                                    <button type="submit" class="btn--text" style="color: var(--danger); font-weight: 600; cursor: pointer; border: none; background: transparent; font-family: inherit;">Hapus</button>
                                </form>
                            </td>
                        </tr>
                    @empty
                        <tr>
                            <td colspan="5" class="text-center" style="padding: 3rem; color: var(--text-muted);">Belum ada data mahasiswa.</td>
                        </tr>
                    @endforelse
                </tbody>
            </table>
        </div>
    </div>
@endsection
