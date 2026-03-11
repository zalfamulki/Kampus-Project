<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>{{ $title ?? config('app.name', 'Kampus Akademik') }}</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    @vite(['resources/css/app.css', 'resources/js/app.js'])
</head>
<body class="app">
    <!-- Background Animation Shapes -->
    <div class="bg-shapes" aria-hidden="true"></div>

    <header class="site-header">
        <div class="container header-grid">
            <a href="{{ route('home') }}" class="brand">
                <div class="brand__logo">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <path d="M22 10L12 5L2 10L12 15L22 10Z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M6 12.5V16C6 16 8.5 18 12 18C15.5 18 18 16 18 16V12.5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </div>
                <span class="brand__text">{{ config('app.name', 'KampusApp') }}</span>
            </a>

            <nav class="nav" aria-label="Main navigation">
                <a href="{{ route('home') }}" class="nav__link {{ request()->routeIs('home') ? 'active' : '' }}">Beranda</a>
                <a href="{{ route('mahasiswa.index') }}" class="nav__link {{ request()->routeIs('mahasiswa.*') ? 'active' : '' }}">Mahasiswa</a>
                <a href="{{ route('dosen.index') }}" class="nav__link {{ request()->routeIs('dosen.*') ? 'active' : '' }}">Dosen</a>
                <a href="{{ route('matkul.index') }}" class="nav__link {{ request()->routeIs('matkul.*') ? 'active' : '' }}">Mata Kuliah</a>
            </nav>
        </div>
    </header>

    <main class="container">
        @if(session('success'))
            <div class="alert alert--success">
                {{ session('success') }}
            </div>
        @endif

        @if($errors->any())
            <div class="alert alert--error" style="background: #fee2e2; color: #991b1b; padding: 1rem; border-radius: 12px; margin-bottom: 1.5rem; border: 1px solid #fecaca;">
                <strong>Perhatian:</strong>
                <ul style="margin-left: 1.5rem; margin-top: 0.5rem;">
                    @foreach($errors->all() as $error)
                        <li>{{ $error }}</li>
                    @endforeach
                </ul>
            </div>
        @endif

        @yield('content')
    </main>

    <footer class="site-footer">
        <div class="container">
            <p class="footer-text">© {{ date('Y') }} {{ config('app.name', 'KampusApp') }} • Sistem Informasi Akademik Terpadu</p>
        </div>
    </footer>
</body>
</html>
