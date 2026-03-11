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
    Plus, Edit, Trash2, CheckCircle2, AlertCircle, ArrowLeft
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
            localStorage.removeItem('token');
            setUser(null);
            navigate('/login');
        } catch (error) {
            localStorage.removeItem('token');
            setUser(null);
            navigate('/login');
        }
    };

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
                            <span className="text-xl font-black tracking-tight text-slate-800 leading-none">SIAKAD</span>
                            <span className="text-[10px] font-bold text-indigo-600 tracking-[0.2em] uppercase">University</span>
                        </div>
                    </div>

                    <nav className="flex-grow mt-2 overflow-y-auto">
                        <div className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em]">Main Menu</div>
                        <SidebarItem icon={LayoutDashboard} label="Dashboard" to="/dashboard" active={location.pathname === '/dashboard'} />
                        <SidebarItem icon={Bell} label="Pengumuman" to="/announcements" active={location.pathname === '/announcements'} />
                        
                        <div className="px-8 py-6 text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em]">Academic</div>
                        <SidebarItem icon={Calendar} label="Jadwal Kuliah" to="/schedule" active={location.pathname === '/schedule'} />
                        <SidebarItem icon={ClipboardList} label="Sistem KRS" to="/krs" active={location.pathname === '/krs'} />
                        <SidebarItem icon={GraduationCap} label="Nilai Mahasiswa" to="/grades" active={location.pathname === '/grades'} />
                        
                        <div className="px-8 py-6 text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em]">Master Data</div>
                        <SidebarItem icon={Users} label="Data Mahasiswa" to="/students" active={location.pathname === '/students'} />
                        <SidebarItem icon={UserSquare2} label="Data Dosen" to="/lecturers" active={location.pathname === '/lecturers'} />
                        <SidebarItem icon={BookOpen} label="Mata Kuliah" to="/matkuls" active={location.pathname.startsWith('/matkuls')} />
                    </nav>

                    <div className="p-6">
                        <div className="bg-slate-900 rounded-2xl p-5 text-white relative overflow-hidden group">
                            <div className="relative z-10">
                                <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-1">Support</p>
                                <p className="text-xs text-slate-300 mb-3">Butuh bantuan teknis?</p>
                                <button className="bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-bold py-2 px-4 rounded-lg transition-colors">Hubungi Kami</button>
                            </div>
                            <Info size={80} className="absolute -right-6 -bottom-6 text-white opacity-5 group-hover:scale-110 transition-transform" />
                        </div>
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
                        <button className="relative p-2.5 text-slate-500 hover:bg-slate-100 rounded-xl transition">
                            <Bell size={20} />
                            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-indigo-600 rounded-full border-2 border-white"></span>
                        </button>
                        
                        <div className="flex items-center pl-4 border-l border-slate-200">
                            <div className="text-right mr-4 hidden sm:block">
                                <p className="text-sm font-bold text-slate-800 leading-none">{user?.name || 'Admin'}</p>
                                <p className="text-[10px] font-bold text-indigo-600 mt-1 uppercase tracking-wider">Super Admin</p>
                            </div>
                            <div className="relative cursor-pointer group">
                                <img src={`https://ui-avatars.com/api/?name=${user?.name || 'A'}&background=6366f1&color=fff&bold=true`} 
                                     className="w-10 h-10 rounded-xl ring-2 ring-indigo-50 transition-all group-hover:ring-indigo-200" alt="Profile" />
                                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                            </div>
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

const Dashboard = () => (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
                <h1 className="text-3xl font-black text-slate-800 tracking-tight">System Overview</h1>
                <p className="text-slate-500 font-medium">Monitoring real-time data akademik kampus.</p>
            </div>
            <div className="flex gap-3">
                <button className="bg-white border border-slate-200 text-slate-600 px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-slate-50 transition shadow-sm">Export Report</button>
                <button className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-indigo-700 transition shadow-lg shadow-indigo-100">Quick Action</button>
            </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <StatCard title="Active Students" value="1,420" icon={Users} color="bg-indigo-600" trend="12.5" trendUp={true} />
            <StatCard title="Total Lecturers" value="86" icon={UserSquare2} color="bg-blue-500" trend="2.1" trendUp={true} />
            <StatCard title="Total Courses" value="132" icon={BookOpen} color="bg-purple-600" />
            <StatCard title="Avg. GPA" value="3.48" icon={TrendingUp} color="bg-emerald-500" trend="0.4" trendUp={false} />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            <div className="xl:col-span-2 bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-8 border-b border-slate-50 flex justify-between items-center">
                    <h3 className="font-black text-slate-800 text-lg uppercase tracking-tight">Recent Academic News</h3>
                    <Link to="/announcements" className="text-indigo-600 text-xs font-bold hover:underline uppercase tracking-widest">View All</Link>
                </div>
                <div className="p-2">
                    {[
                        { title: 'Update Jadwal UTS Semester Genap', date: 'Just now', type: 'Academic' },
                        { title: 'Pembukaan Beasiswa Prestasi 2026', date: '2 hours ago', type: 'Scholarship' },
                        { title: 'Workshop UI/UX bersama Google', date: 'Yesterday', type: 'Event' },
                    ].map((news, i) => (
                        <div key={i} className="flex items-center p-6 hover:bg-slate-50 transition-colors rounded-2xl group cursor-pointer">
                            <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 mr-5 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                                <Bell size={24} />
                            </div>
                            <div className="flex-grow">
                                <p className="text-slate-800 font-bold group-hover:text-indigo-600 transition-colors">{news.title}</p>
                                <p className="text-xs text-slate-400 mt-1 font-medium">{news.type} • {news.date}</p>
                            </div>
                            <ChevronRight size={18} className="text-slate-300 group-hover:text-indigo-600 transform group-hover:translate-x-1 transition-all" />
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex flex-col gap-8">
                <div className="bg-indigo-600 rounded-[32px] p-8 text-white shadow-2xl shadow-indigo-100 relative overflow-hidden group">
                    <div className="relative z-10">
                        <div className="bg-white/20 w-12 h-12 rounded-2xl flex items-center justify-center mb-6">
                            <Info size={24} />
                        </div>
                        <h3 className="font-black text-2xl mb-3 tracking-tight">KRS Online</h3>
                        <p className="text-indigo-100 text-sm leading-relaxed mb-8 font-medium">Pengisian KRS Semester Genap akan dibuka mulai tanggal 15 Maret 2026. Pastikan tagihan lunas.</p>
                        <button className="w-full bg-white text-indigo-700 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-50 transition shadow-xl">Go to KRS System</button>
                    </div>
                    <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-white/10 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-700"></div>
                </div>
            </div>
        </div>
    </div>
);

// --- Course Module (Functional & Beautiful) ---

const MatkulList = () => {
    const [matkuls, setMatkuls] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const navigate = useNavigate();

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
                    <h1 className="text-3xl font-black text-slate-800 tracking-tight">Course Management</h1>
                    <p className="text-slate-500 font-medium">Kelola kurikulum dan mata kuliah universitas.</p>
                </div>
                <Link to="/matkuls/create" className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold text-sm flex items-center shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition">
                    <Plus size={18} className="mr-2" /> Add New Course
                </Link>
            </div>

            <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input type="text" placeholder="Search by name or code..." value={search} onChange={e => setSearch(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3.5 pl-12 pr-6 text-sm focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all" />
                    </div>
                    <div className="flex items-center text-slate-400 text-sm font-bold uppercase tracking-widest">
                        Total {filtered.length} Items
                    </div>
                </div>
                
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50/50">
                                <th className="px-8 py-5 font-black text-slate-400 text-[10px] uppercase tracking-[0.2em]">Code</th>
                                <th className="px-8 py-5 font-black text-slate-400 text-[10px] uppercase tracking-[0.2em]">Course Name</th>
                                <th className="px-8 py-5 font-black text-slate-400 text-[10px] uppercase tracking-[0.2em]">Major</th>
                                <th className="px-8 py-5 font-black text-slate-400 text-[10px] uppercase tracking-[0.2em] text-center">Actions</th>
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
                                            <span className="text-slate-500 text-xs font-bold uppercase">{m.jurusan || 'General'}</span>
                                        </div>
                                    </td>
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
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="4" className="py-24 text-center">
                                        <div className="bg-slate-50 w-20 h-20 rounded-[24px] flex items-center justify-center mx-auto mb-6 text-slate-200">
                                            <Search size={40} />
                                        </div>
                                        <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No records found matching your search</p>
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
    const [formData, setFormData] = useState({ kode: '', nama: '', jurusan: '' });
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
        <div className="max-w-2xl mx-auto animate-in slide-in-from-top-4 duration-500">
            <button onClick={() => navigate('/matkuls')} className="flex items-center text-slate-400 hover:text-indigo-600 font-bold text-xs uppercase tracking-widest mb-8 transition-colors">
                <ArrowLeft size={16} className="mr-2" /> Back to List
            </button>

            <div className="bg-white rounded-[32px] border border-slate-100 shadow-xl overflow-hidden">
                <div className="p-10 bg-slate-900 text-white relative">
                    <h2 className="text-3xl font-black tracking-tight">{isEdit ? 'Edit Course' : 'Add New Course'}</h2>
                    <p className="text-slate-400 font-medium mt-1">Masukkan detail informasi mata kuliah dengan benar.</p>
                    <BookOpen size={100} className="absolute top-1/2 -translate-y-1/2 right-10 text-white/5" />
                </div>
                
                <form onSubmit={handleSubmit} className="p-10 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <label className="block text-slate-500 font-black text-[10px] uppercase tracking-[0.2em] mb-3">Course Code</label>
                            <input type="text" value={formData.kode} onChange={e => setFormData({...formData, kode: e.target.value})} required 
                                className={`w-full bg-slate-50 border ${errors.kode ? 'border-red-300 ring-4 ring-red-50' : 'border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10'} rounded-2xl py-4 px-6 text-sm outline-none transition-all font-bold`} 
                                placeholder="e.g. CS101" />
                            {errors.kode && <p className="text-red-500 text-[10px] font-bold uppercase mt-2">{errors.kode[0]}</p>}
                        </div>
                        <div>
                            <label className="block text-slate-500 font-black text-[10px] uppercase tracking-[0.2em] mb-3">Major / Department</label>
                            <input type="text" value={formData.jurusan} onChange={e => setFormData({...formData, jurusan: e.target.value})} required
                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-6 text-sm focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-bold" 
                                placeholder="e.g. Informatics" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-slate-500 font-black text-[10px] uppercase tracking-[0.2em] mb-3">Full Course Name</label>
                        <input type="text" value={formData.nama} onChange={e => setFormData({...formData, nama: e.target.value})} required
                            className={`w-full bg-slate-50 border ${errors.nama ? 'border-red-300 ring-4 ring-red-50' : 'border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10'} rounded-2xl py-4 px-6 text-sm outline-none transition-all font-bold`} 
                            placeholder="e.g. Advanced Web Development" />
                        {errors.nama && <p className="text-red-500 text-[10px] font-bold uppercase mt-2">{errors.nama[0]}</p>}
                    </div>

                    <div className="pt-6 flex gap-4">
                        <button type="submit" disabled={loading}
                            className="flex-grow bg-indigo-600 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-700 transition shadow-xl shadow-indigo-100 flex items-center justify-center">
                            {loading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : (isEdit ? 'Update Changes' : 'Save New Course')}
                        </button>
                        <button type="button" onClick={() => navigate('/matkuls')} className="bg-slate-100 text-slate-600 px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition">
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// --- Other Module Placeholders ---

const StudentList = () => (
    <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
                <h1 className="text-3xl font-black text-slate-800 tracking-tight">Student Management</h1>
                <p className="text-slate-500 font-medium">Data mahasiswa aktif universitas.</p>
            </div>
            <button className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold text-sm flex items-center shadow-xl shadow-indigo-100">
                <Plus size={18} className="mr-2" /> Add New Student
            </button>
        </div>
        <div className="bg-white rounded-[32px] border border-slate-100 p-20 text-center">
             <Users size={64} className="mx-auto text-slate-100 mb-6" />
             <h2 className="text-xl font-black text-slate-800">No Student Records</h2>
             <p className="text-slate-400 font-medium mt-2">Halaman ini sedang dalam pengembangan desain final.</p>
        </div>
    </div>
);

// --- Auth Module (Modern Dark Theme) ---

const Login = ({ setUser }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const res = await axios.post('/auth/login', { email, password });
            localStorage.setItem('token', res.data.access_token);
            setUser(res.data.user);
            navigate('/dashboard');
        } catch (err) { 
            setError('Autentikasi gagal. Cek kembali email & password.');
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col lg:flex-row bg-white overflow-hidden">
            {/* Left Side: Illustration & Branding */}
            <div className="hidden lg:flex lg:w-3/5 bg-slate-900 p-20 flex-col justify-between relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600 rounded-full blur-[160px] opacity-20 translate-x-1/2 -translate-y-1/2"></div>
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600 rounded-full blur-[160px] opacity-10 -translate-x-1/2 translate-y-1/2"></div>
                
                <div className="relative z-10">
                    <div className="flex items-center text-white mb-20">
                        <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center mr-4">
                            <GraduationCap size={28} strokeWidth={2.5} />
                        </div>
                        <span className="text-2xl font-black tracking-tighter uppercase">Siakad PRO</span>
                    </div>
                    
                    <div className="max-w-xl">
                        <h2 className="text-6xl font-black text-white leading-tight tracking-tighter mb-8">
                            Modern Solution for <span className="text-indigo-500">Academic</span> Management.
                        </h2>
                        <p className="text-xl text-slate-400 font-medium leading-relaxed">
                            Satu platform terintegrasi untuk mengelola data mahasiswa, kurikulum, dan nilai secara efisien dan aman.
                        </p>
                    </div>
                </div>

                <div className="relative z-10 flex gap-10">
                    <div>
                        <p className="text-4xl font-black text-white">12k+</p>
                        <p className="text-sm text-slate-500 font-bold uppercase tracking-widest mt-2">Active Users</p>
                    </div>
                    <div>
                        <p className="text-4xl font-black text-white">99.9%</p>
                        <p className="text-sm text-slate-500 font-bold uppercase tracking-widest mt-2">Server Uptime</p>
                    </div>
                </div>
            </div>

            {/* Right Side: Login Form */}
            <div className="flex-1 flex items-center justify-center p-10 lg:p-24 bg-white relative">
                <div className="max-w-md w-full animate-in fade-in slide-in-from-right-4 duration-700">
                    <div className="lg:hidden flex justify-center mb-10">
                         <div className="w-16 h-16 bg-indigo-600 rounded-3xl flex items-center justify-center text-white shadow-2xl shadow-indigo-100">
                            <GraduationCap size={32} />
                        </div>
                    </div>
                    
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight">Sign In</h1>
                    <p className="text-slate-500 font-medium mt-2 mb-10 text-lg">Enter your details to access your dashboard.</p>
                    
                    {error && (
                        <div className="bg-red-50 border border-red-100 text-red-600 p-5 rounded-3xl mb-8 flex items-start">
                            <AlertCircle size={20} className="mr-3 shrink-0 mt-0.5" />
                            <p className="text-sm font-bold">{error}</p>
                        </div>
                    )}
                    
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-slate-400 font-black text-[10px] uppercase tracking-[0.2em] mb-3 ml-1">Email Address</label>
                            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required 
                                className="w-full bg-slate-50 border border-slate-100 rounded-3xl px-8 py-5 text-sm focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white outline-none transition-all font-bold placeholder:text-slate-300" placeholder="name@university.com" />
                        </div>
                        <div>
                            <label className="block text-slate-400 font-black text-[10px] uppercase tracking-[0.2em] mb-3 ml-1">Secret Password</label>
                            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required 
                                className="w-full bg-slate-50 border border-slate-100 rounded-3xl px-8 py-5 text-sm focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white outline-none transition-all font-bold placeholder:text-slate-300" placeholder="••••••••" />
                        </div>
                        <div className="flex items-center justify-between px-1">
                             <label className="flex items-center cursor-pointer group">
                                <input type="checkbox" className="w-5 h-5 rounded-lg border-slate-200 text-indigo-600 focus:ring-indigo-500 transition-all cursor-pointer" />
                                <span className="ml-3 text-sm font-bold text-slate-500 group-hover:text-slate-700 transition-colors">Remember me</span>
                             </label>
                             <Link to="#" className="text-sm font-bold text-indigo-600 hover:text-indigo-800 transition-colors">Forgot Password?</Link>
                        </div>
                        <button type="submit" disabled={loading}
                            className="w-full bg-indigo-600 text-white py-6 rounded-3xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-indigo-100 hover:bg-indigo-700 hover:-translate-y-1 transition-all flex items-center justify-center">
                            {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : 'Authorize & Sign In'}
                        </button>
                    </form>
                    
                    <p className="text-center text-slate-400 mt-12 font-medium">
                        Protected by university security protocols. <br/>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-300">© 2026 Siakad PRO Edition</span>
                    </p>
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

    return (
        <Router>
            <Routes>
                <Route path="/login" element={!user ? <Login setUser={setUser} /> : <Navigate to="/dashboard" />} />
                
                {/* Protected Application Frame */}
                <Route path="/*" element={user ? (
                    <MainLayout user={user} setUser={setUser}>
                        <Routes>
                            <Route path="/dashboard" element={<Dashboard />} />
                            <Route path="/announcements" element={<div className="bg-white p-20 rounded-[40px] text-center border border-slate-100 shadow-sm"><Bell size={80} className="mx-auto text-indigo-100 mb-6" /><h2 className="text-2xl font-black text-slate-800">No Announcements</h2><p className="text-slate-400 font-medium">Semua berita terbaru akan muncul di sini.</p></div>} />
                            <Route path="/schedule" element={<div className="bg-white p-20 rounded-[40px] text-center border border-slate-100 shadow-sm"><Calendar size={80} className="mx-auto text-indigo-100 mb-6" /><h2 className="text-2xl font-black text-slate-800">Schedule Module</h2><p className="text-slate-400 font-medium">Fitur kalender akademik sedang disiapkan.</p></div>} />
                            <Route path="/krs" element={<div className="bg-white p-20 rounded-[40px] text-center border border-slate-100 shadow-sm"><ClipboardList size={80} className="mx-auto text-indigo-100 mb-6" /><h2 className="text-2xl font-black text-slate-800">KRS System</h2><p className="text-slate-400 font-medium">Modul pengisian mata kuliah online.</p></div>} />
                            <Route path="/grades" element={<div className="bg-white p-20 rounded-[40px] text-center border border-slate-100 shadow-sm"><GraduationCap size={80} className="mx-auto text-indigo-100 mb-6" /><h2 className="text-2xl font-black text-slate-800">Grades Center</h2><p className="text-slate-400 font-medium">Transkrip nilai dan IPK mahasiswa.</p></div>} />
                            <Route path="/students" element={<StudentList />} />
                            <Route path="/lecturers" element={<div className="bg-white p-20 rounded-[40px] text-center border border-slate-100 shadow-sm"><UserSquare2 size={80} className="mx-auto text-indigo-100 mb-6" /><h2 className="text-2xl font-black text-slate-800">Lecturers Data</h2><p className="text-slate-400 font-medium">Manajemen data tenaga pendidik.</p></div>} />
                            <Route path="/matkuls" element={<MatkulList />} />
                            <Route path="/matkuls/create" element={<MatkulForm isEdit={false} />} />
                            <Route path="/matkuls/edit/:id" element={<MatkulForm isEdit={true} />} />
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
