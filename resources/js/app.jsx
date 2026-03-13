import './bootstrap';
import '../css/app.css';

import React, { useState, useEffect, createContext, useContext } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useNavigate, useParams, useLocation } from 'react-router-dom';
import axios from 'axios';
import { 
    LayoutDashboard, Users, UserSquare2, BookOpen, Calendar, 
    GraduationCap, ClipboardList, Bell, Search, Menu, X, 
    LogOut, ChevronRight, User, Settings, Info, TrendingUp,
    Plus, Edit, Trash2, CheckCircle2, AlertCircle, ArrowLeft, Key
} from 'lucide-react';

// --- Axios Setup ---
axios.defaults.baseURL = '/api';
axios.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, error => Promise.reject(error));

// --- Layout Components ---

const SidebarItem = ({ icon: Icon, label, to, active }) => (
    <Link to={to} className={`flex items-center px-6 py-3 transition-all duration-200 group border-r-4 ${
        active 
        ? 'bg-indigo-50 border-indigo-600 text-indigo-700 shadow-[inset_0_0_10px_rgba(99,102,241,0.05)]' 
        : 'border-transparent text-slate-500 hover:bg-slate-50 hover:text-slate-800'
    }`}>
        <Icon size={20} className={`${active ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-600'} mr-3`} />
        <span className="font-semibold text-sm">{label}</span>
    </Link>
);

const MainLayout = ({ children, user, setUser }) => {
    const [isSidebarOpen, setSidebarOpen] = useState(true);
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await axios.post('/auth/logout');
        } catch (error) {}
        localStorage.removeItem('token');
        setUser(null);
        navigate('/login');
    };

    const isAdmin = user?.role === 'admin';

    return (
        <div className="flex min-h-screen bg-[#F8FAFC] font-sans text-slate-900">
            {/* Sidebar */}
            <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-200 transition-all duration-300 shadow-sm
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:inset-0`}>
                <div className="flex flex-col h-full">
                    <div className="p-8 flex items-center">
                        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white mr-3 shadow-indigo-100 shadow-xl">
                            <GraduationCap size={24} strokeWidth={2.5} />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xl font-black tracking-tight text-slate-800 leading-none">Tech</span>
                            <span className="text-[10px] font-bold text-indigo-600 tracking-[0.2em] uppercase">University</span>
                        </div>
                    </div>

                    <nav className="flex-grow mt-2 overflow-y-auto">
                        <div className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em]">Main Menu</div>
                        <SidebarItem icon={LayoutDashboard} label="Dashboard" to="/dashboard" active={location.pathname === '/dashboard'} />
                        
                        <div className="px-8 py-6 text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em]">Academic</div>
                        <SidebarItem icon={Calendar} label="Jadwal Kuliah" to="/schedule" active={location.pathname === '/schedule'} />
                        <SidebarItem icon={ClipboardList} label={isAdmin ? "Sistem KRS" : "Kontrak KRS"} to="/krs" active={location.pathname === '/krs'} />
                        <SidebarItem icon={GraduationCap} label="Nilai Mahasiswa" to="/grades" active={location.pathname === '/grades'} />
                        
                        <div className="px-8 py-6 text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em]">Master Data</div>
                        <SidebarItem icon={Users} label="Data Mahasiswa" to="/students" active={location.pathname === '/students'} />
                        <SidebarItem icon={UserSquare2} label="Data Dosen" to="/lecturers" active={location.pathname === '/lecturers'} />
                        <SidebarItem icon={BookOpen} label="Mata Kuliah" to="/matkuls" active={location.pathname.startsWith('/matkuls')} />

                        <div className="px-8 py-6 text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em]">Account</div>
                        <SidebarItem icon={User} label="Profil Saya" to="/profile" active={location.pathname === '/profile'} />
                    </nav>

                    <div className="p-6">
                        <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 py-3 rounded-xl font-bold text-sm transition-colors">
                            <LogOut size={18} /> Logout
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Topbar */}
                <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-40">
                    <div className="flex items-center">
                        <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="p-2 text-slate-500 hover:bg-slate-100 rounded-xl transition lg:mr-4">
                            <Menu size={20} />
                        </button>
                        <div className="hidden md:flex items-center bg-slate-100 rounded-xl px-4 py-2 w-80">
                            <Search className="text-slate-400 mr-3" size={16} />
                            <input type="text" placeholder="Search anything..." className="bg-transparent border-none text-sm outline-none w-full text-slate-600 placeholder:text-slate-400" />
                        </div>
                    </div>

                    <div className="flex items-center space-x-6">
                        <div className="flex items-center pl-4 border-l border-slate-200">
                            <div className="text-right mr-4 hidden sm:block">
                                <p className="text-sm font-bold text-slate-800 leading-none">{user?.name}</p>
                                <p className="text-[10px] font-bold text-indigo-600 mt-1 uppercase tracking-wider">{user?.role === 'admin' ? 'Administrator' : 'Mahasiswa'}</p>
                            </div>
                            <Link to="/profile" className="relative cursor-pointer group">
                                <img src={`https://ui-avatars.com/api/?name=${user?.name || 'U'}&background=6366f1&color=fff&bold=true`} 
                                     className="w-10 h-10 rounded-xl ring-2 ring-indigo-50 transition-all group-hover:ring-indigo-200" alt="Profile" />
                            </Link>
                        </div>
                    </div>
                </header>

                <main className="flex-1 p-8">
                    {children}
                </main>
            </div>
        </div>
    );
};

// --- Profile Component ---

const Profile = ({ user, setUser }) => {
    const [formData, setFormData] = useState({
        name: user?.name || '',
        username: user?.username || '',
        email: user?.email || '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);
    const [errors, setErrors] = useState({});

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);
        setErrors({});
        try {
            const res = await axios.post('/auth/update-profile', formData);
            setUser(res.data.user);
            setMessage({ type: 'success', text: 'Profil berhasil diperbarui!' });
            setFormData(prev => ({ ...prev, password: '' }));
        } catch (err) {
            if (err.response && err.response.data) setErrors(err.response.data);
            setMessage({ type: 'error', text: 'Gagal memperbarui profil.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-black text-slate-800 tracking-tight">Pengaturan Profil</h1>
                <p className="text-slate-500 font-medium">Hanya nama yang dapat diubah sesuai kebijakan akademik.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-[32px] border border-slate-100 p-8 text-center shadow-sm">        
                        <div className="relative inline-block mb-6">
                            <img src={`https://ui-avatars.com/api/?name=${user?.name || 'U'}&background=6366f1&color=fff&bold=true&size=128`}
                                 className="w-32 h-32 rounded-[40px] shadow-xl shadow-indigo-100" alt="Profile Large" />
                            <div className="absolute -bottom-2 -right-2 bg-emerald-500 w-8 h-8 rounded-full border-4 border-white"></div>
                        </div>
                        <h3 className="text-xl font-black text-slate-800">{user?.name}</h3>
                        <p className="text-indigo-600 font-bold text-xs uppercase tracking-widest mt-1">{user?.role}</p>
                        <div className="mt-8 pt-8 border-t border-slate-50 space-y-4">
                            <div className="flex justify-between text-xs">
                                <span className="text-slate-400 font-bold uppercase">Username</span>
                                <span className="text-slate-700 font-bold">@{user?.username}</span>
                            </div>
                            <div className="flex justify-between text-xs">
                                <span className="text-slate-400 font-bold uppercase">Terdaftar</span>
                                <span className="text-slate-700 font-bold">{new Date(user?.created_at).toLocaleDateString()}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-2">
                    <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">        
                        <form onSubmit={handleSubmit} className="p-10 space-y-6">
                            {message && (
                                <div className={`p-5 rounded-2xl flex items-center gap-3 ${message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>       
                                    {message.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
                                    <p className="text-sm font-bold">{message.text}</p>
                                </div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-slate-500 font-black text-[10px] uppercase tracking-widest mb-2 ml-1">Nama Lengkap</label>
                                    <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 text-sm focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-bold" />
                                    {errors.name && <p className="text-red-500 text-[10px] font-bold mt-1 uppercase">{errors.name[0]}</p>}
                                </div>
                                <div>
                                    <label className="block text-slate-500 font-black text-[10px] uppercase tracking-widest mb-2 ml-1">Username</label>
                                    <input type="text" value={formData.username} disabled
                                        className="w-full bg-slate-100 border border-slate-200 rounded-2xl py-4 px-6 text-sm outline-none transition-all font-bold text-slate-400 cursor-not-allowed" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-slate-500 font-black text-[10px] uppercase tracking-widest mb-2 ml-1">Alamat Email</label>
                                <input type="email" value={formData.email} disabled
                                    className="w-full bg-slate-100 border border-slate-200 rounded-2xl py-4 px-6 text-sm outline-none transition-all font-bold text-slate-400 cursor-not-allowed" />
                            </div>
                            <div className="pt-4">
                                <button type="submit" disabled={loading}
                                    className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-700 transition shadow-xl shadow-indigo-100 flex items-center justify-center">
                                    {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : 'Perbarui Profil'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- Dashboard Component ---

const StatCard = ({ title, value, icon: Icon, color, trend, trendUp }) => (
    <div className="bg-white p-7 rounded-[24px] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
        <div className="flex justify-between items-center mb-6">
            <div className={`w-12 h-12 rounded-2xl ${color} flex items-center justify-center text-white shadow-lg`}>
                <Icon size={24} />
            </div>
            {trend && (
                <div className={`flex items-center px-2 py-1 rounded-lg text-[10px] font-bold ${trendUp ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                    <TrendingUp size={12} className={`mr-1 ${!trendUp && 'rotate-180'}`} /> {trend}%
                </div>
            )}
        </div>
        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">{title}</p>
        <h3 className="text-3xl font-black text-slate-800 mt-2 tracking-tight">{value}</h3>
    </div>
);

const Dashboard = ({ user }) => (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
                <h1 className="text-3xl font-black text-slate-800 tracking-tight">Selamat Datang, {user?.name}!</h1>
                <p className="text-slate-500 font-medium">Monitoring real-time data akademik kampus.</p>
            </div>
            <div className="flex gap-3">
                <button className="bg-white border border-slate-200 text-slate-600 px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-slate-50 transition shadow-sm">Export Report</button>
                <Link to="/krs" className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-indigo-700 transition shadow-lg shadow-indigo-100">Cek KRS</Link>
            </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <StatCard title="Mahasiswa Aktif" value="1,420" icon={Users} color="bg-indigo-600" trend="12.5" trendUp={true} />
            <StatCard title="Total Dosen" value="86" icon={UserSquare2} color="bg-blue-500" trend="2.1" trendUp={true} />
            <StatCard title="Mata Kuliah" value="132" icon={BookOpen} color="bg-purple-600" />
            <StatCard title="Rata-rata IPK" value="3.48" icon={TrendingUp} color="bg-emerald-500" trend="0.4" trendUp={false} />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            <div className="xl:col-span-2 bg-indigo-600 rounded-[32px] p-8 text-white shadow-2xl shadow-indigo-100 relative overflow-hidden group">
                <div className="relative z-10 flex flex-col h-full justify-between">
                    <div>
                        <div className="bg-white/20 w-12 h-12 rounded-2xl flex items-center justify-center mb-6">
                            <Info size={24} />
                        </div>
                        <h3 className="font-black text-3xl mb-3 tracking-tight">Portal KRS Online</h3>
                        <p className="text-indigo-100 text-lg leading-relaxed mb-8 font-medium max-w-md">Pengisian KRS Semester Genap akan dibuka mulai tanggal 15 Maret 2026. Pastikan seluruh administrasi telah selesai.</p>
                    </div>
                    <Link to="/krs" className="w-fit bg-white text-indigo-700 px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-50 transition shadow-xl">Buka Sistem KRS</Link>
                </div>
                <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-white/10 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-700"></div>
                <ClipboardList size={200} className="absolute -right-20 top-1/2 -translate-y-1/2 text-white/5 rotate-12" />
            </div>

            <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm p-8 flex flex-col justify-center items-center text-center">
                 <div className="w-20 h-20 bg-indigo-50 rounded-[28px] flex items-center justify-center text-indigo-600 mb-6">
                    <Calendar size={32} />
                 </div>
                 <h3 className="font-black text-slate-800 text-xl mb-2">Jadwal Hari Ini</h3>
                 <p className="text-slate-400 font-medium text-sm mb-6">Anda tidak memiliki jadwal kuliah untuk hari ini.</p>
                 <Link to="/schedule" className="text-indigo-600 text-xs font-black uppercase tracking-widest hover:underline">Lihat Kalender Lengkap</Link>
            </div>
        </div>
    </div>
);

// --- Course Module ---

const MatkulList = ({ user }) => {
    const [matkuls, setMatkuls] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const navigate = useNavigate();
    const isAdmin = user?.role === 'admin';

    const fetchMatkuls = async () => {
        try {
            const res = await axios.get('/matkuls');
            setMatkuls(res.data);
            setLoading(false);
        } catch (e) { setLoading(false); }
    };

    useEffect(() => { fetchMatkuls(); }, []);

    const handleDelete = async (id) => {
        if(confirm('Hapus mata kuliah ini?')) {
            try {
                await axios.delete(`/matkuls/${id}`);
                fetchMatkuls();
            } catch(e) { alert('Gagal menghapus'); }
        }
    };

    const filtered = matkuls.filter(m => 
        m.nama.toLowerCase().includes(search.toLowerCase()) || 
        m.kode.toLowerCase().includes(search.toLowerCase())
    );

    if (loading) return <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div></div>;

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-800 tracking-tight">Data Mata Kuliah</h1>
                    <p className="text-slate-500 font-medium">Kelola kurikulum dan mata kuliah universitas.</p>
                </div>
                {isAdmin && (
                    <Link to="/matkuls/create" className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold text-sm flex items-center shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition">
                        <Plus size={18} className="mr-2" /> Tambah Mata Kuliah
                    </Link>
                )}
            </div>

            <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input type="text" placeholder="Cari berdasarkan nama atau kode..." value={search} onChange={e => setSearch(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3.5 pl-12 pr-6 text-sm focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all" />
                    </div>
                    <div className="flex items-center text-slate-400 text-sm font-bold uppercase tracking-widest">
                        Total {filtered.length} Mata Kuliah
                    </div>
                </div>
                
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50/50">
                                <th className="px-8 py-5 font-black text-slate-400 text-[10px] uppercase tracking-[0.2em]">Kode</th>
                                <th className="px-8 py-5 font-black text-slate-400 text-[10px] uppercase tracking-[0.2em]">Nama Mata Kuliah</th>
                                <th className="px-8 py-5 font-black text-slate-400 text-[10px] uppercase tracking-[0.2em]">Jurusan</th>
                                {isAdmin && <th className="px-8 py-5 font-black text-slate-400 text-[10px] uppercase tracking-[0.2em] text-center">Aksi</th>}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filtered.length > 0 ? filtered.map((m) => (
                                <tr key={m.id} className="hover:bg-indigo-50/30 transition-colors">
                                    <td className="px-8 py-6">
                                        <span className="font-black text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-xl text-xs">{m.kode}</span>
                                    </td>
                                    <td className="px-8 py-6 text-sm font-bold text-slate-800">{m.nama}</td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center">
                                            <div className="w-2 h-2 rounded-full bg-indigo-500 mr-2"></div>
                                            <span className="text-slate-500 text-xs font-bold uppercase">{m.jurusan || 'Umum'}</span>
                                        </div>
                                    </td>
                                    {isAdmin && (
                                        <td className="px-8 py-6">
                                            <div className="flex justify-center items-center space-x-3">
                                                <button onClick={() => navigate(`/matkuls/edit/${m.id}`)} className="p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all">
                                                    <Edit size={18} />
                                                </button>
                                                <button onClick={() => handleDelete(m.id)} className="p-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all">
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    )}
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={isAdmin ? 4 : 3} className="py-24 text-center">
                                        <div className="bg-slate-50 w-20 h-20 rounded-[24px] flex items-center justify-center mx-auto mb-6 text-slate-200">
                                            <Search size={40} />
                                        </div>
                                        <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Mata kuliah tidak ditemukan</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

const MatkulForm = ({ isEdit }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ 
        kode: '', 
        nama: '', 
        jurusan: '',
        hari: '',
        jam_mulai: '',
        jam_selesai: '',
        ruangan: ''
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isEdit && id) {
            axios.get(`/matkuls/${id}`).then(res => setFormData(res.data)).catch(() => navigate('/matkuls'));
        }
    }, [isEdit, id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        setLoading(true);
        try {
            if (isEdit) await axios.put(`/matkuls/${id}`, formData);
            else await axios.post('/matkuls', formData);
            navigate('/matkuls');
        } catch (err) {
            if (err.response && err.response.data) setErrors(err.response.data);
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto animate-in slide-in-from-top-4 duration-500">
            <button onClick={() => navigate('/matkuls')} className="flex items-center text-slate-400 hover:text-indigo-600 font-bold text-xs uppercase tracking-widest mb-8 transition-colors">
                <ArrowLeft size={16} className="mr-2" /> Kembali ke Daftar
            </button>

            <div className="bg-white rounded-[32px] border border-slate-100 shadow-xl overflow-hidden">
                <div className="p-10 bg-slate-900 text-white relative">
                    <h2 className="text-3xl font-black tracking-tight">{isEdit ? 'Edit Mata Kuliah' : 'Tambah Mata Kuliah'}</h2>
                    <p className="text-slate-400 font-medium mt-1">Masukkan detail informasi mata kuliah dan jadwal dengan benar.</p>
                    <BookOpen size={100} className="absolute top-1/2 -translate-y-1/2 right-10 text-white/5" />
                </div>
                
                <form onSubmit={handleSubmit} className="p-10 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <label className="block text-slate-500 font-black text-[10px] uppercase tracking-[0.2em] mb-3">Kode Mata Kuliah</label>
                            <input type="text" value={formData.kode} onChange={e => setFormData({...formData, kode: e.target.value})} required 
                                className={`w-full bg-slate-50 border ${errors.kode ? 'border-red-300 ring-4 ring-red-50' : 'border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10'} rounded-2xl py-4 px-6 text-sm outline-none transition-all font-bold`} 
                                placeholder="Misal: IF101" />
                            {errors.kode && <p className="text-red-500 text-[10px] font-bold uppercase mt-2">{errors.kode[0]}</p>}
                        </div>
                        <div>
                            <label className="block text-slate-500 font-black text-[10px] uppercase tracking-[0.2em] mb-3">Jurusan</label>
                            <input type="text" value={formData.jurusan} onChange={e => setFormData({...formData, jurusan: e.target.value})} required
                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-6 text-sm focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-bold" 
                                placeholder="Misal: Teknik Informatika" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-slate-500 font-black text-[10px] uppercase tracking-[0.2em] mb-3">Nama Mata Kuliah</label>
                        <input type="text" value={formData.nama} onChange={e => setFormData({...formData, nama: e.target.value})} required
                            className={`w-full bg-slate-50 border ${errors.nama ? 'border-red-300 ring-4 ring-red-50' : 'border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10'} rounded-2xl py-4 px-6 text-sm outline-none transition-all font-bold`} 
                            placeholder="Misal: Pemrograman Web" />
                        {errors.nama && <p className="text-red-500 text-[10px] font-bold uppercase mt-2">{errors.nama[0]}</p>}
                    </div>

                    <div className="border-t border-slate-50 pt-8">
                        <h3 className="text-slate-800 font-black text-sm uppercase tracking-widest mb-6">Informasi Jadwal</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div>
                                <label className="block text-slate-500 font-black text-[10px] uppercase tracking-[0.2em] mb-3">Hari</label>
                                <select value={formData.hari} onChange={e => setFormData({...formData, hari: e.target.value})}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-6 text-sm font-bold focus:ring-4 focus:ring-indigo-500/10 outline-none">
                                    <option value="">Pilih Hari</option>
                                    <option value="Senin">Senin</option>
                                    <option value="Selasa">Selasa</option>
                                    <option value="Rabu">Rabu</option>
                                    <option value="Kamis">Kamis</option>
                                    <option value="Jumat">Jumat</option>
                                    <option value="Sabtu">Sabtu</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-slate-500 font-black text-[10px] uppercase tracking-[0.2em] mb-3">Jam Mulai</label>
                                <input type="time" value={formData.jam_mulai} onChange={e => setFormData({...formData, jam_mulai: e.target.value})}
                                       className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-6 text-sm font-bold outline-none" />
                            </div>
                            <div>
                                <label className="block text-slate-500 font-black text-[10px] uppercase tracking-[0.2em] mb-3">Jam Selesai</label>
                                <input type="time" value={formData.jam_selesai} onChange={e => setFormData({...formData, jam_selesai: e.target.value})}
                                       className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-6 text-sm font-bold outline-none" />
                            </div>
                            <div>
                                <label className="block text-slate-500 font-black text-[10px] uppercase tracking-[0.2em] mb-3">Ruangan</label>
                                <input type="text" value={formData.ruangan} onChange={e => setFormData({...formData, ruangan: e.target.value})}
                                       className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-6 text-sm font-bold outline-none" placeholder="Misal: R. 302" />
                            </div>
                        </div>
                    </div>

                    <div className="pt-6 flex gap-4">
                        <button type="submit" disabled={loading}
                            className="flex-grow bg-indigo-600 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-700 transition shadow-xl shadow-indigo-100 flex items-center justify-center">
                            {loading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : (isEdit ? 'Update Perubahan' : 'Simpan Mata Kuliah')}
                        </button>
                        <button type="button" onClick={() => navigate('/matkuls')} className="bg-slate-100 text-slate-600 px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition">
                            Batal
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// --- Student & Lecturer List ---

const ResourceList = ({ title, icon: Icon, endpoint, codeKey, nameKey, isAdmin }) => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`/${endpoint}`);
            setItems(res.data);
        } catch (e) {}
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, [endpoint]);

    const handleDelete = async (id) => {
        if (confirm('Hapus data ini?')) {
            try {
                await axios.delete(`/${endpoint}/${id}`);
                fetchData();
            } catch (e) {
                alert('Gagal menghapus data');
            }
        }
    };

    if (loading) return <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div></div>;

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-800 tracking-tight">{title}</h1>
                    <p className="text-slate-500 font-medium">Manajemen data {title.toLowerCase()} universitas.</p>
                </div>
                {isAdmin && (
                    <button onClick={() => navigate(`/${endpoint}/create`)} className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold text-sm flex items-center shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition">
                        <Plus size={18} className="mr-2" /> Tambah Data
                    </button>
                )}
            </div>
            <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-slate-50/50">
                            <th className="px-8 py-5 font-black text-slate-400 text-[10px] uppercase tracking-widest">{codeKey.toUpperCase()}</th>
                            <th className="px-8 py-5 font-black text-slate-400 text-[10px] uppercase tracking-widest">NAMA LENGKAP</th>
                            <th className="px-8 py-5 font-black text-slate-400 text-[10px] uppercase tracking-widest">EMAIL / DEPT</th>
                            {isAdmin && <th className="px-8 py-5 font-black text-slate-400 text-[10px] uppercase tracking-widest text-center">AKSI</th>}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {items.length > 0 ? items.map(item => (
                            <tr key={item.id} className="hover:bg-indigo-50/30 transition-colors">
                                <td className="px-8 py-6 font-bold text-indigo-600">{item[codeKey]}</td>
                                <td className="px-8 py-6 font-bold text-slate-800">{item[nameKey]}</td>
                                <td className="px-8 py-6 text-slate-500 text-sm">{item.email || item.departemen || item.jurusan}</td>
                                {isAdmin && (
                                    <td className="px-8 py-6 text-center">
                                        <div className="flex justify-center gap-2">
                                            <button onClick={() => navigate(`/${endpoint}/edit/${item.id}`)} className="p-2 text-slate-400 hover:text-indigo-600 transition-colors"><Edit size={16} /></button>
                                            <button onClick={() => handleDelete(item.id)} className="p-2 text-slate-400 hover:text-red-600 transition-colors"><Trash2 size={16} /></button>
                                        </div>
                                    </td>
                                )}
                            </tr>
                        )) : (
                            <tr><td colSpan={isAdmin ? 4 : 3} className="py-20 text-center text-slate-400 font-bold uppercase text-xs tracking-widest">Tidak ada data</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const ResourceForm = ({ endpoint, title, codeKey, nameKey, extraKey, extraLabel, isEdit }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ [codeKey]: '', [nameKey]: '', email: '', [extraKey]: '' });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isEdit && id) {
            axios.get(`/${endpoint}/${id}`).then(res => setFormData(res.data)).catch(() => navigate(`/${endpoint}`));
        }
    }, [isEdit, id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        setLoading(true);
        try {
            if (isEdit) await axios.put(`/${endpoint}/${id}`, formData);
            else await axios.post(`/${endpoint}`, formData);
            navigate(`/${endpoint === 'mahasiswas' ? 'students' : 'lecturers'}`);
        } catch (err) {
            if (err.response && err.response.data) setErrors(err.response.data);
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto animate-in slide-in-from-top-4 duration-500">
            <button onClick={() => navigate(`/${endpoint === 'mahasiswas' ? 'students' : 'lecturers'}`)} className="flex items-center text-slate-400 hover:text-indigo-600 font-bold text-xs uppercase tracking-widest mb-8 transition-colors">
                <ArrowLeft size={16} className="mr-2" /> Kembali ke Daftar
            </button>

            <div className="bg-white rounded-[32px] border border-slate-100 shadow-xl overflow-hidden">
                <div className="p-10 bg-slate-900 text-white relative">
                    <h2 className="text-3xl font-black tracking-tight">{isEdit ? `Edit ${title}` : `Tambah ${title}`}</h2>
                    <p className="text-slate-400 font-medium mt-1">Masukkan detail informasi {title.toLowerCase()} dengan benar.</p>
                </div>
                
                <form onSubmit={handleSubmit} className="p-10 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <label className="block text-slate-500 font-black text-[10px] uppercase tracking-[0.2em] mb-3">{codeKey.toUpperCase()}</label>
                            <input type="text" value={formData[codeKey]} onChange={e => setFormData({...formData, [codeKey]: e.target.value})} required 
                                className={`w-full bg-slate-50 border ${errors[codeKey] ? 'border-red-300 ring-4 ring-red-50' : 'border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10'} rounded-2xl py-4 px-6 text-sm outline-none transition-all font-bold`} />
                            {errors[codeKey] && <p className="text-red-500 text-[10px] font-bold uppercase mt-2">{errors[codeKey][0]}</p>}
                        </div>
                        <div>
                            <label className="block text-slate-500 font-black text-[10px] uppercase tracking-[0.2em] mb-3">EMAIL</label>
                            <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})}
                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-6 text-sm focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-bold" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-slate-500 font-black text-[10px] uppercase tracking-[0.2em] mb-3">NAMA LENGKAP</label>
                        <input type="text" value={formData[nameKey]} onChange={e => setFormData({...formData, [nameKey]: e.target.value})} required
                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-6 text-sm focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-bold" />
                    </div>

                    <div>
                        <label className="block text-slate-500 font-black text-[10px] uppercase tracking-[0.2em] mb-3">{extraLabel.toUpperCase()}</label>
                        <input type="text" value={formData[extraKey]} onChange={e => setFormData({...formData, [extraKey]: e.target.value})}
                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-6 text-sm focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-bold" />
                    </div>

                    <div className="pt-6 flex gap-4">
                        <button type="submit" disabled={loading}
                            className="flex-grow bg-indigo-600 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-700 transition shadow-xl shadow-indigo-100 flex items-center justify-center">
                            {loading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : (isEdit ? 'Update Perubahan' : `Simpan ${title}`)}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// --- KRS Logic ---

const KRS = ({ user }) => {
    const isAdmin = user?.role === 'admin';
    const [matkuls, setMatkuls] = useState([]);
    const [selected, setSelected] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get('/matkuls').then(res => setMatkuls(res.data)).finally(() => setLoading(false));
    }, []);

    const toggleSelect = (id) => {
        if (selected.includes(id)) setSelected(selected.filter(i => i !== id));
        else setSelected([...selected, id]);
    };

    if (isAdmin) return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">Sistem KRS (Admin)</h1>
            <div className="bg-white p-10 rounded-[32px] border border-slate-100 shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="p-8 bg-indigo-50 rounded-3xl border border-indigo-100">
                        <h4 className="font-black text-indigo-900 mb-2 uppercase text-xs tracking-widest">Periode Aktif</h4>
                        <p className="text-2xl font-black text-indigo-600">Semester Genap 2026</p>
                    </div>
                    <div className="p-8 bg-emerald-50 rounded-3xl border border-emerald-100">
                        <h4 className="font-black text-emerald-900 mb-2 uppercase text-xs tracking-widest">Status Sistem</h4>
                        <p className="text-2xl font-black text-emerald-600">Terbuka</p>
                    </div>
                    <div className="p-8 bg-slate-50 rounded-3xl border border-slate-100 text-center flex flex-col justify-center">
                        <button className="bg-slate-900 text-white py-3 px-6 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-800 transition">Tutup Periode KRS</button>
                    </div>
                </div>
                
                <div className="mt-12">
                    <h3 className="text-xl font-black text-slate-800 mb-6 uppercase tracking-tight">Daftar Pengajuan KRS Mahasiswa</h3>
                    <div className="text-center py-20 border-2 border-dashed border-slate-100 rounded-[32px]">
                        <Users size={48} className="mx-auto text-slate-100 mb-4" />
                        <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">Tidak ada pengajuan KRS yang perlu divalidasi</p>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-black text-slate-800 tracking-tight">Kontrak KRS</h1>
                    <p className="text-slate-500 font-medium">Pilih mata kuliah yang akan diambil semester ini.</p>
                </div>
                <div className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-black text-sm shadow-xl shadow-indigo-100">
                    Total: {selected.length} Matkul
                </div>
            </div>

            <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-8 bg-slate-900 text-white flex justify-between items-center">
                    <div>
                        <h3 className="font-black uppercase tracking-widest text-xs text-slate-400 mb-1">Daftar Mata Kuliah Tersedia</h3>
                        <p className="text-sm font-medium text-slate-300">Silakan klik untuk memilih atau membatalkan.</p>
                    </div>
                    <button className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition shadow-lg" 
                            disabled={selected.length === 0} onClick={() => alert('KRS Berhasil Disimpan!')}>
                        Simpan Kontrak Matkul
                    </button>
                </div>

                {loading ? <div className="p-20 text-center animate-pulse text-slate-200"><BookOpen size={64} className="mx-auto" /></div> : (
                    <div className="p-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                        {matkuls.map(m => (
                            <div key={m.id} onClick={() => toggleSelect(m.id)}
                                 className={`p-6 rounded-2xl cursor-pointer transition-all border-2 flex items-start gap-4 group ${
                                    selected.includes(m.id) 
                                    ? 'bg-indigo-50 border-indigo-600 shadow-lg shadow-indigo-50' 
                                    : 'bg-white border-slate-50 hover:border-indigo-200'
                                 }`}>
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                                    selected.includes(m.id) ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400 group-hover:bg-indigo-100 group-hover:text-indigo-600'
                                }`}>
                                    {selected.includes(m.id) ? <CheckCircle2 size={20} /> : <Plus size={20} />}
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{m.kode}</p>
                                    <h4 className={`font-black transition-colors ${selected.includes(m.id) ? 'text-indigo-900' : 'text-slate-700'}`}>{m.nama}</h4>
                                    <p className="text-xs text-slate-500 font-medium mt-1">{m.jurusan || 'Umum'}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

// --- Schedule Component ---

const Schedule = () => {
    const [matkuls, setMatkuls] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get('/matkuls').then(res => setMatkuls(res.data)).finally(() => setLoading(false));
    }, []);

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-black text-slate-800 tracking-tight">Jadwal Kuliah</h1>
                <p className="text-slate-500 font-medium">Jadwal mata kuliah yang tersedia di semester ini.</p>
            </div>

            {loading ? <div className="p-20 text-center animate-pulse text-slate-200"><Calendar size={64} className="mx-auto" /></div> : (
                <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-slate-50/50">
                                    <th className="px-8 py-5 font-black text-slate-400 text-[10px] uppercase tracking-widest">HARI & WAKTU</th>
                                    <th className="px-8 py-5 font-black text-slate-400 text-[10px] uppercase tracking-widest">MATA KULIAH</th>
                                    <th className="px-8 py-5 font-black text-slate-400 text-[10px] uppercase tracking-widest">RUANGAN</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {matkuls.length > 0 ? matkuls.map((m) => {
                                    return (
                                        <tr key={m.id} className="hover:bg-indigo-50/30 transition-colors">
                                            <td className="px-8 py-6">
                                                <div className="flex flex-col">
                                                    <span className="font-black text-slate-800 text-sm">{m.hari || 'Belum diatur'}</span>
                                                    <span className="text-indigo-600 font-bold text-xs">
                                                        {m.jam_mulai && m.jam_selesai ? `${m.jam_mulai.substring(0, 5)} - ${m.jam_selesai.substring(0, 5)}` : 'Waktu belum diatur'}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex flex-col">
                                                    <span className="font-black text-slate-800 text-sm">{m.nama}</span>
                                                    <span className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">{m.kode}</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-lg text-xs font-bold">{m.ruangan || 'TBA'}</span>
                                            </td>
                                        </tr>
                                    );
                                }) : (
                                    <tr><td colSpan="3" className="py-20 text-center text-slate-400 font-bold uppercase text-xs tracking-widest">Belum ada jadwal</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

// --- Grades Component ---

const Grades = ({ user }) => {
    const isAdmin = user?.role === 'admin';
    const [mahasiswas, setMahasiswas] = useState([]);
    const [matkuls, setMatkuls] = useState([]);
    const [grades, setGrades] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedMahasiswa, setSelectedMahasiswa] = useState(null);
    const [formData, setFormData] = useState({ matkul_id: '', nilai: '' });

    const fetchData = async () => {
        setLoading(true);
        try {
            if (isAdmin) {
                const [mRes, mtRes, gRes] = await Promise.all([
                    axios.get('/mahasiswas'),
                    axios.get('/matkuls'),
                    axios.get('/grades')
                ]);
                setMahasiswas(mRes.data);
                setMatkuls(mtRes.data);
                setGrades(gRes.data);
            } else {
                // Find student ID by looking at mahasiswas table for matching name/email if possible
                // For now, let's assume we can fetch by current user info if matched
                const mRes = await axios.get('/mahasiswas');
                const student = mRes.data.find(m => m.nama === user.name || m.email === user.email);
                if (student) {
                    const gRes = await axios.get(`/grades/mahasiswa/${student.id}`);
                    setGrades(gRes.data);
                }
            }
        } catch (e) {}
        setLoading(false);
    };

    useEffect(() => { fetchData(); }, [isAdmin, user]);

    const handleSaveGrade = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/grades', {
                mahasiswa_id: selectedMahasiswa.id,
                matkul_id: formData.matkul_id,
                nilai: formData.nilai
            });
            alert('Nilai berhasil disimpan!');
            fetchData();
            setFormData({ matkul_id: '', nilai: '' });
        } catch (e) { alert('Gagal menyimpan nilai'); }
    };

    if (loading) return <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div></div>;

    if (!isAdmin) return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-black text-slate-800 tracking-tight">Transkrip Nilai</h1>
                <p className="text-slate-500 font-medium">Hasil studi akademik Anda selama ini.</p>
            </div>
            <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-slate-50/50">
                            <th className="px-8 py-5 font-black text-slate-400 text-[10px] uppercase tracking-widest">KODE</th>
                            <th className="px-8 py-5 font-black text-slate-400 text-[10px] uppercase tracking-widest">MATA KULIAH</th>
                            <th className="px-8 py-5 font-black text-slate-400 text-[10px] uppercase tracking-widest text-center">NILAI</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {grades.length > 0 ? grades.map(g => (
                            <tr key={g.id}>
                                <td className="px-8 py-6 font-bold text-indigo-600">{g.matkul?.kode}</td>
                                <td className="px-8 py-6 font-bold text-slate-800">{g.matkul?.nama}</td>
                                <td className="px-8 py-6 text-center">
                                    <span className="bg-indigo-600 text-white w-10 h-10 rounded-xl flex items-center justify-center mx-auto font-black">{g.nilai}</span>
                                </td>
                            </tr>
                        )) : (
                            <tr><td colSpan="3" className="py-20 text-center text-slate-400 font-bold uppercase text-xs tracking-widest">Belum ada nilai yang keluar</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">Manajemen Nilai Mahasiswa</h1>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 space-y-4">
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest ml-4">Daftar Mahasiswa</h3>
                    <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
                        <div className="max-h-[600px] overflow-y-auto divide-y divide-slate-50">
                            {mahasiswas.map(m => (
                                <div key={m.id} onClick={() => setSelectedMahasiswa(m)}
                                     className={`p-6 cursor-pointer transition-all flex items-center gap-4 ${selectedMahasiswa?.id === m.id ? 'bg-indigo-50 border-l-4 border-indigo-600' : 'hover:bg-slate-50'}`}>
                                    <img src={`https://ui-avatars.com/api/?name=${m.nama}&background=random`} className="w-10 h-10 rounded-xl" />
                                    <div>
                                        <p className="font-black text-slate-800 text-sm leading-none">{m.nama}</p>
                                        <p className="text-[10px] font-bold text-slate-400 mt-1">{m.nim}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-2 space-y-8">
                    {selectedMahasiswa ? (
                        <div className="space-y-8">
                            <div className="bg-slate-900 rounded-[32px] p-8 text-white flex justify-between items-center">
                                <div>
                                    <h2 className="text-2xl font-black">{selectedMahasiswa.nama}</h2>
                                    <p className="text-slate-400 font-medium">{selectedMahasiswa.nim} • {selectedMahasiswa.jurusan}</p>
                                </div>
                                <GraduationCap size={48} className="text-white/10" />
                            </div>

                            <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm p-8">
                                <h3 className="font-black text-slate-800 mb-6 flex items-center gap-2"><Plus size={20} className="text-indigo-600" /> Input Nilai Baru</h3>
                                <form onSubmit={handleSaveGrade} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                                    <div className="md:col-span-1">
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Mata Kuliah</label>
                                        <select value={formData.matkul_id} onChange={e => setFormData({...formData, matkul_id: e.target.value})} required
                                                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 px-6 text-sm font-bold outline-none focus:ring-4 focus:ring-indigo-500/10">
                                            <option value="">Pilih Matkul</option>
                                            {matkuls.map(m => <option key={m.id} value={m.id}>{m.nama}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Grade (A-E)</label>
                                        <input type="text" value={formData.nilai} onChange={e => setFormData({...formData, nilai: e.target.value.toUpperCase()})} required maxLength="2" placeholder="Mis: A"
                                               className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 px-6 text-sm font-bold outline-none focus:ring-4 focus:ring-indigo-500/10" />
                                    </div>
                                    <button type="submit" className="bg-indigo-600 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-700 transition shadow-lg">Simpan Nilai</button>
                                </form>
                            </div>

                            <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="bg-slate-50/50">
                                            <th className="px-8 py-5 font-black text-slate-400 text-[10px] uppercase tracking-widest">MATA KULIAH</th>
                                            <th className="px-8 py-5 font-black text-slate-400 text-[10px] uppercase tracking-widest text-center">NILAI</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {grades.filter(g => g.mahasiswa_id === selectedMahasiswa.id).length > 0 ? 
                                            grades.filter(g => g.mahasiswa_id === selectedMahasiswa.id).map(g => (
                                            <tr key={g.id}>
                                                <td className="px-8 py-6 font-bold text-slate-800">{g.matkul?.nama}</td>
                                                <td className="px-8 py-6 text-center">
                                                    <span className="bg-indigo-50 text-indigo-600 w-10 h-10 rounded-xl flex items-center justify-center mx-auto font-black">{g.nilai}</span>
                                                </td>
                                            </tr>
                                        )) : (
                                            <tr><td colSpan="2" className="py-20 text-center text-slate-400 font-bold uppercase text-[10px] tracking-widest">Belum ada nilai untuk mahasiswa ini</td></tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm p-20 text-center">
                            <Users size={80} className="mx-auto text-indigo-100 mb-6" />
                            <h2 className="text-2xl font-black text-slate-800">Pilih Mahasiswa</h2>
                            <p className="text-slate-400 font-medium">Silakan pilih mahasiswa dari daftar di samping untuk mengelola nilai.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// --- Auth Module ---

const Login = ({ setUser }) => {
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const res = await axios.post('/auth/login', { login, password });
            localStorage.setItem('token', res.data.access_token);
            setUser(res.data.user);
            navigate('/dashboard');
        } catch (err) { 
            setError(err.response?.data?.error || 'Autentikasi gagal. Periksa kembali detail Anda.');
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col lg:flex-row bg-white overflow-hidden font-sans selection:bg-indigo-100 selection:text-indigo-700">
            <div className="hidden lg:flex lg:w-3/5 bg-slate-950 p-20 flex-col justify-between relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600 rounded-full blur-[160px] opacity-20 translate-x-1/2 -translate-y-1/2"></div>
                <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-blue-600 rounded-full blur-[120px] opacity-10 -translate-x-1/2 translate-y-1/2"></div>
                
                <div className="relative z-10">
                    <div className="flex items-center text-white mb-20 group cursor-default">
                        <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-2xl flex items-center justify-center mr-4 shadow-2xl shadow-indigo-500/40 group-hover:scale-110 transition-transform duration-500">
                            <GraduationCap size={28} strokeWidth={2.5} />
                        </div>
                        <span className="text-2xl font-black tracking-tighter uppercase italic">Tech University</span>
                    </div>
                    <div className="max-w-xl">
                        <h2 className="text-6xl font-black text-white leading-tight tracking-tighter mb-8 italic">Limitless <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-blue-400">Education</span> for Everyone.</h2>
                        <p className="text-xl text-slate-400 font-medium leading-relaxed">Satu platform terintegrasi untuk mengelola data mahasiswa, kurikulum, dan nilai secara efisien dan aman.</p>
                    </div>
                </div>
                
                <div className="relative z-10 flex items-center gap-4">
                    <div className="flex -space-x-3">
                        {[1, 2, 3, 4].map(i => (
                            <img key={i} src={`https://i.pravatar.cc/150?u=${i}`} className="w-10 h-10 rounded-full border-2 border-slate-950 object-cover" alt="User" />
                        ))}
                    </div>
                    <p className="text-slate-500 text-sm font-bold tracking-tight">Joined by <span className="text-white">2,000+</span> students this year</p>
                </div>
            </div>

            <div className="flex-1 flex items-center justify-center p-8 lg:p-16 bg-white relative">
                <div className="max-w-md w-full animate-in fade-in slide-in-from-right-4 duration-700">
                    <div className="mb-10">
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-none">Welcome Back</h1>
                        <p className="text-slate-500 font-medium mt-3 text-lg">Masuk untuk mengakses dashboard akademik Anda.</p>
                    </div>
                    
                    {error && (
                        <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-2xl mb-6 flex items-start gap-3 animate-shake">
                            <AlertCircle size={18} className="shrink-0 mt-0.5" />
                            <p className="text-xs font-bold leading-relaxed">{error}</p>
                        </div>
                    )}
                    
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-slate-400 font-black text-[10px] uppercase tracking-[0.2em] ml-1">Account Identity</label>
                            <input type="text" value={login} onChange={e => setLogin(e.target.value)} required 
                                className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-bold placeholder:text-slate-300" placeholder="Username or Email" />
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between items-center px-1">
                                <label className="text-slate-400 font-black text-[10px] uppercase tracking-[0.2em]">Security Key</label>
                                <button type="button" className="text-indigo-600 font-bold text-[10px] uppercase tracking-widest hover:text-indigo-700 transition-colors">Forgot Password?</button>
                            </div>
                            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required 
                                className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-bold placeholder:text-slate-300" placeholder="••••••••" />
                        </div>
                        
                        <button type="submit" disabled={loading} 
                            className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 text-white py-4.5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-indigo-200 hover:shadow-indigo-300 hover:-translate-y-1 active:scale-[0.98] transition-all flex items-center justify-center group overflow-hidden relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                            {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : (
                                <>Sign In Now <ChevronRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" /></>
                            )}
                        </button>
                    </form>
                    <p className="text-center text-slate-400 mt-10 font-bold text-[10px] uppercase tracking-[0.2em]">
                        Don't have an account? <Link to="/register" className="text-indigo-600 hover:text-indigo-700 transition-colors border-b-2 border-indigo-100 hover:border-indigo-600 pb-0.5">Create one</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

// --- Interactive Background Component ---

const ParticleBackground = () => {
    useEffect(() => {
        const canvas = document.getElementById('particleCanvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let particles = [];
        let animationFrameId;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        window.addEventListener('resize', resize);
        resize();

        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 2 + 1;
                this.speedX = Math.random() * 0.5 - 0.25;
                this.speedY = Math.random() * 0.5 - 0.25;
            }
            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                if (this.x > canvas.width) this.x = 0;
                else if (this.x < 0) this.x = canvas.width;
                if (this.y > canvas.height) this.y = 0;
                else if (this.y < 0) this.y = canvas.height;
            }
            draw() {
                ctx.fillStyle = 'rgba(99, 102, 241, 0.4)';
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        const init = () => {
            particles = [];
            for (let i = 0; i < 80; i++) {
                particles.push(new Particle());
            }
        };

        const connect = () => {
            for (let a = 0; a < particles.length; a++) {
                for (let b = a; b < particles.length; b++) {
                    let dx = particles[a].x - particles[b].x;
                    let dy = particles[a].y - particles[b].y;
                    let distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < 160) {
                        ctx.strokeStyle = `rgba(99, 102, 241, ${0.15 * (1 - distance/160)})`;
                        ctx.lineWidth = 0.8;
                        ctx.beginPath();
                        ctx.moveTo(particles[a].x, particles[a].y);
                        ctx.lineTo(particles[b].x, particles[b].y);
                        ctx.stroke();
                    }
                }
            }
        };

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => {
                p.update();
                p.draw();
            });
            connect();
            animationFrameId = requestAnimationFrame(animate);
        };

        init();
        animate();

        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return <canvas id="particleCanvas" className="absolute inset-0 z-0 bg-slate-950" />;
};

const Register = () => {
    const [formData, setFormData] = useState({ name: '', username: '', email: '', password: '', role: 'user' });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});
        try {
            await axios.post('/auth/register', formData);
            alert('Registrasi berhasil! Silakan login.');
            navigate('/login');
        } catch (err) {
            if (err.response && err.response.data) setErrors(err.response.data);
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden p-6 font-sans">
            <ParticleBackground />

            <div className="max-w-md w-full relative z-10 animate-in zoom-in duration-700">
                <div className="bg-slate-900/60 backdrop-blur-2xl border border-white/10 rounded-[48px] shadow-2xl p-10 text-white overflow-hidden relative group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                    
                    <div className="text-center mb-8 relative z-10">
                        <div className="w-16 h-16 bg-gradient-to-tr from-indigo-500 to-indigo-700 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-2xl shadow-indigo-500/40">
                            <GraduationCap size={32} strokeWidth={2.5} />
                        </div>
                        <h3 className="text-3xl font-black tracking-tighter mb-2 italic">Create Account</h3>
                        <p className="text-slate-400 font-medium text-sm">Bergabung dalam ekosistem akademik modern.</p>
                    </div>
                    
                    <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="block text-indigo-300 font-black text-[9px] uppercase tracking-[0.2em] ml-1">Full Name</label>
                                <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required 
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-5 text-sm focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500/50 outline-none transition-all font-bold placeholder:text-slate-600" placeholder="John Doe" />
                                {errors.name && <p className="text-red-400 text-[8px] font-bold uppercase ml-1">{errors.name[0]}</p>}
                            </div>
                            <div className="space-y-1.5">
                                <label className="block text-indigo-300 font-black text-[9px] uppercase tracking-[0.2em] ml-1">Username</label>
                                <input type="text" value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} required 
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-5 text-sm focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500/50 outline-none transition-all font-bold placeholder:text-slate-600" placeholder="john.doe" />
                                {errors.username && <p className="text-red-400 text-[8px] font-bold uppercase ml-1">{errors.username[0]}</p>}
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="block text-indigo-300 font-black text-[9px] uppercase tracking-[0.2em] ml-1">Email Address</label>
                            <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required 
                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-5 text-sm focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500/50 outline-none transition-all font-bold placeholder:text-slate-600" placeholder="johndoe@email.com" />
                            {errors.email && <p className="text-red-400 text-[8px] font-bold uppercase ml-1">{errors.email[0]}</p>}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="block text-indigo-300 font-black text-[9px] uppercase tracking-[0.2em] ml-1">Password</label>
                                <input type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} required 
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-5 text-sm focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500/50 outline-none transition-all font-bold placeholder:text-slate-600" placeholder="••••••••" />
                                {errors.password && <p className="text-red-400 text-[8px] font-bold uppercase ml-1">{errors.password[0]}</p>}
                            </div>
                            <div className="space-y-1.5">
                                <label className="block text-indigo-300 font-black text-[9px] uppercase tracking-[0.2em] ml-1">User Role</label>
                                <div className="relative">
                                    <select value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} required
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-5 text-sm focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500/50 outline-none transition-all font-bold appearance-none cursor-pointer">
                                        <option value="user" className="bg-slate-900">Mahasiswa</option>
                                        <option value="admin" className="bg-slate-900">Administrator</option>
                                    </select>
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-indigo-300">
                                        <ChevronRight size={14} className="rotate-90" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="pt-6">
                            <button type="submit" disabled={loading} 
                                className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 text-white py-4 rounded-[20px] font-black text-[11px] uppercase tracking-[0.25em] hover:shadow-2xl hover:shadow-indigo-500/40 hover:-translate-y-1 active:scale-[0.98] transition-all flex items-center justify-center group relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                                {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : (
                                    <>Start Registration <ChevronRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" /></>
                                )}
                            </button>
                        </div>
                        
                        <p className="text-center text-slate-500 font-bold text-[9px] uppercase tracking-[0.2em] pt-6">
                            Already a member? <Link to="/login" className="text-indigo-400 hover:text-indigo-300 transition-colors border-b-2 border-indigo-900 hover:border-indigo-400 pb-0.5">Sign In Here</Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
};

// --- Main App Logic ---

const App = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            axios.get('/auth/user-profile')
                 .then(res => setUser(res.data))
                 .catch(() => localStorage.removeItem('token'))
                 .finally(() => setLoading(false));
        } else setLoading(false);
    }, []);

    if (loading) return (
        <div className="flex items-center justify-center min-h-screen bg-slate-900">
            <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-indigo-600 rounded-3xl flex items-center justify-center text-white animate-bounce shadow-2xl shadow-indigo-500/20">
                    <GraduationCap size={32} />
                </div>
                <div className="mt-8 flex gap-2">
                    <div className="w-2 h-2 bg-indigo-600 rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-indigo-600 rounded-full animate-pulse [animation-delay:0.2s]"></div>
                    <div className="w-2 h-2 bg-indigo-600 rounded-full animate-pulse [animation-delay:0.4s]"></div>
                </div>
            </div>
        </div>
    );

    const isAdmin = user?.role === 'admin';

    return (
        <Router>
            <Routes>
                <Route path="/login" element={!user ? <Login setUser={setUser} /> : <Navigate to="/dashboard" />} />
                <Route path="/register" element={!user ? <Register /> : <Navigate to="/dashboard" />} />
                
                {/* Protected Application Frame */}
                <Route path="/*" element={user ? (
                    <MainLayout user={user} setUser={setUser}>
                        <Routes>
                            <Route path="/dashboard" element={<Dashboard user={user} />} />
                            <Route path="/profile" element={<Profile user={user} setUser={setUser} />} />
                            <Route path="/students" element={<ResourceList title="Data Mahasiswa" icon={Users} endpoint="mahasiswas" codeKey="nim" nameKey="nama" isAdmin={isAdmin} />} />
                            <Route path="/mahasiswas/create" element={isAdmin ? <ResourceForm endpoint="mahasiswas" title="Mahasiswa" codeKey="nim" nameKey="nama" extraKey="jurusan" extraLabel="Jurusan" isEdit={false} /> : <Navigate to="/students" />} />
                            <Route path="/mahasiswas/edit/:id" element={isAdmin ? <ResourceForm endpoint="mahasiswas" title="Mahasiswa" codeKey="nim" nameKey="nama" extraKey="jurusan" extraLabel="Jurusan" isEdit={true} /> : <Navigate to="/students" />} />

                            <Route path="/lecturers" element={<ResourceList title="Data Dosen" icon={UserSquare2} endpoint="dosens" codeKey="nidn" nameKey="nama" isAdmin={isAdmin} />} />
                            <Route path="/dosens/create" element={isAdmin ? <ResourceForm endpoint="dosens" title="Dosen" codeKey="nidn" nameKey="nama" extraKey="departemen" extraLabel="Departemen" isEdit={false} /> : <Navigate to="/lecturers" />} />
                            <Route path="/dosens/edit/:id" element={isAdmin ? <ResourceForm endpoint="dosens" title="Dosen" codeKey="nidn" nameKey="nama" extraKey="departemen" extraLabel="Departemen" isEdit={true} /> : <Navigate to="/lecturers" />} />
                            
                            <Route path="/schedule" element={<Schedule />} />
                            <Route path="/krs" element={<KRS user={user} />} />
                            <Route path="/grades" element={<Grades user={user} />} />
                            
                            <Route path="/matkuls" element={<MatkulList user={user} />} />
                            <Route path="/matkuls/create" element={isAdmin ? <MatkulForm isEdit={false} /> : <Navigate to="/matkuls" />} />
                            <Route path="/matkuls/edit/:id" element={isAdmin ? <MatkulForm isEdit={true} /> : <Navigate to="/matkuls" />} />
                            
                            <Route path="*" element={<Navigate to="/dashboard" />} />
                        </Routes>
                    </MainLayout>
                ) : <Navigate to="/login" />} />
            </Routes>
        </Router>
    );
};

const container = document.getElementById('app');
if (container) {
    const root = createRoot(container);
    root.render(<App />);
}

export default App;
