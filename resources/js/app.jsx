import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { LogIn, LogOut, UserPlus, BookOpen, Plus, Edit, Trash2, Home as HomeIcon } from 'lucide-react';

// --- Axios Setup ---
axios.defaults.baseURL = '/api';
axios.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, error => {
    return Promise.reject(error);
});

// --- Components ---

const Layout = ({ children, user, setUser }) => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await axios.post('/auth/logout');
            localStorage.removeItem('token');
            setUser(null);
            navigate('/login');
        } catch (error) {
            console.error('Logout error', error);
            localStorage.removeItem('token');
            setUser(null);
            navigate('/login');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <nav className="bg-blue-600 text-white shadow-lg p-4">
                <div className="container mx-auto flex justify-between items-center">
                    <Link to="/" className="text-xl font-bold flex items-center">
                        <HomeIcon className="mr-2" /> Sistem Akademik
                    </Link>
                    <div className="space-x-4 flex items-center">
                        {user ? (
                            <>
                                <Link to="/matkuls" className="hover:text-blue-200 transition">Matakuliah</Link>
                                <span className="bg-blue-700 px-3 py-1 rounded text-sm">{user.name}</span>
                                <button onClick={handleLogout} className="flex items-center hover:text-blue-200 transition">
                                    <LogOut size={18} className="mr-1" /> Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="flex items-center hover:text-blue-200 transition">
                                    <LogIn size={18} className="mr-1" /> Login
                                </Link>
                                <Link to="/register" className="flex items-center hover:text-blue-200 transition">
                                    <UserPlus size={18} className="mr-1" /> Register
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </nav>
            <main className="container mx-auto p-4 flex-grow">
                {children}
            </main>
            <footer className="bg-white border-t p-4 text-center text-gray-500 text-sm">
                &copy; 2026 Sistem Akademik - PABP Project
            </footer>
        </div>
    );
};

const Home = () => (
    <div className="text-center py-20">
        <h1 className="text-4xl font-extrabold text-blue-600 mb-4">Selamat Datang di Sistem Akademik</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Aplikasi manajemen mata kuliah terpadu dengan autentikasi JWT.
        </p>
    </div>
);

const Login = ({ setUser }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const response = await axios.post('/auth/login', { email, password });
            localStorage.setItem('token', response.data.access_token);
            setUser(response.data.user);
            navigate('/matkuls');
        } catch (err) {
            setError('Invalid email or password');
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6 text-center text-blue-600 flex items-center justify-center">
                <LogIn className="mr-2" /> Login
            </h2>
            {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-gray-700 font-medium mb-1">Email</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required 
                           className="w-full border rounded p-2 focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div>
                    <label className="block text-gray-700 font-medium mb-1">Password</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
                           className="w-full border rounded p-2 focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded font-bold hover:bg-blue-700 transition">
                    Sign In
                </button>
            </form>
        </div>
    );
};

const Register = ({ setUser }) => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '', password_confirmation: '' });
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        try {
            await axios.post('/auth/register', formData);
            // After register, let's login
            const response = await axios.post('/auth/login', { email: formData.email, password: formData.password });
            localStorage.setItem('token', response.data.access_token);
            setUser(response.data.user);
            navigate('/matkuls');
        } catch (err) {
            if (err.response && err.response.data) {
                setErrors(JSON.parse(err.response.data));
            }
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6 text-center text-blue-600 flex items-center justify-center">
                <UserPlus className="mr-2" /> Register
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-gray-700 font-medium mb-1">Name</label>
                    <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required 
                           className="w-full border rounded p-2 focus:ring-2 focus:ring-blue-500 outline-none" />
                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name[0]}</p>}
                </div>
                <div>
                    <label className="block text-gray-700 font-medium mb-1">Email</label>
                    <input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required
                           className="w-full border rounded p-2 focus:ring-2 focus:ring-blue-500 outline-none" />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email[0]}</p>}
                </div>
                <div>
                    <label className="block text-gray-700 font-medium mb-1">Password</label>
                    <input type="password" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} required
                           className="w-full border rounded p-2 focus:ring-2 focus:ring-blue-500 outline-none" />
                    {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password[0]}</p>}
                </div>
                <div>
                    <label className="block text-gray-700 font-medium mb-1">Confirm Password</label>
                    <input type="password" value={formData.password_confirmation} onChange={(e) => setFormData({...formData, password_confirmation: e.target.value})} required
                           className="w-full border rounded p-2 focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded font-bold hover:bg-blue-700 transition">
                    Sign Up
                </button>
            </form>
        </div>
    );
};

const MatkulList = () => {
    const [matkuls, setMatkuls] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchMatkuls = async () => {
        try {
            const response = await axios.get('/matkuls');
            setMatkuls(response.data);
            setLoading(false);
        } catch (err) {
            console.error('Fetch error', err);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMatkuls();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this mata kuliah?')) {
            try {
                await axios.delete(`/matkuls/${id}`);
                fetchMatkuls();
            } catch (err) {
                alert('Failed to delete');
            }
        }
    };

    if (loading) return <div className="text-center py-10">Loading...</div>;

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-blue-600 flex items-center">
                    <BookOpen className="mr-2" /> Daftar Mata Kuliah
                </h2>
                <Link to="/matkuls/create" className="bg-green-600 text-white px-4 py-2 rounded flex items-center hover:bg-green-700 transition">
                    <Plus size={18} className="mr-1" /> Tambah
                </Link>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-100 border-b">
                            <th className="p-3 font-semibold">Kode</th>
                            <th className="p-3 font-semibold">Nama</th>
                            <th className="p-3 font-semibold">Jurusan</th>
                            <th className="p-3 font-semibold text-center">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {matkuls.length > 0 ? matkuls.map((m) => (
                            <tr key={m.id} className="border-b hover:bg-gray-50">
                                <td className="p-3">{m.kode}</td>
                                <td className="p-3">{m.nama}</td>
                                <td className="p-3">{m.jurusan || '-'}</td>
                                <td className="p-3 text-center space-x-2">
                                    <button onClick={() => navigate(`/matkuls/edit/${m.id}`)} className="text-blue-600 hover:text-blue-800">
                                        <Edit size={18} />
                                    </button>
                                    <button onClick={() => handleDelete(m.id)} className="text-red-600 hover:text-red-800">
                                        <Trash2 size={18} />
                                    </button>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="4" className="p-10 text-center text-gray-500 italic">Belum ada data mata kuliah.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const MatkulForm = ({ isEdit }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ kode: '', nama: '', jurusan: '' });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (isEdit && id) {
            axios.get(`/matkuls/${id}`).then(res => setFormData(res.data));
        }
    }, [isEdit, id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        try {
            if (isEdit) {
                await axios.put(`/matkuls/${id}`, formData);
            } else {
                await axios.post('/matkuls', formData);
            }
            navigate('/matkuls');
        } catch (err) {
            if (err.response && err.response.data) {
                setErrors(err.response.data);
            }
        }
    };

    return (
        <div className="max-w-xl mx-auto bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6 text-blue-600 flex items-center">
                {isEdit ? <Edit className="mr-2" /> : <Plus className="mr-2" />} 
                {isEdit ? 'Edit Mata Kuliah' : 'Tambah Mata Kuliah'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-gray-700 font-medium mb-1">Kode</label>
                    <input type="text" value={formData.kode} onChange={(e) => setFormData({...formData, kode: e.target.value})} required 
                           className="w-full border rounded p-2 focus:ring-2 focus:ring-blue-500 outline-none" />
                    {errors.kode && <p className="text-red-500 text-xs mt-1">{errors.kode[0]}</p>}
                </div>
                <div>
                    <label className="block text-gray-700 font-medium mb-1">Nama</label>
                    <input type="text" value={formData.nama} onChange={(e) => setFormData({...formData, nama: e.target.value})} required
                           className="w-full border rounded p-2 focus:ring-2 focus:ring-blue-500 outline-none" />
                    {errors.nama && <p className="text-red-500 text-xs mt-1">{errors.nama[0]}</p>}
                </div>
                <div>
                    <label className="block text-gray-700 font-medium mb-1">Jurusan</label>
                    <input type="text" value={formData.jurusan} onChange={(e) => setFormData({...formData, jurusan: e.target.value})}
                           className="w-full border rounded p-2 focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div className="flex space-x-4 pt-4">
                    <button type="submit" className="flex-grow bg-blue-600 text-white py-2 rounded font-bold hover:bg-blue-700 transition">
                        Simpan
                    </button>
                    <button type="button" onClick={() => navigate('/matkuls')} className="bg-gray-300 text-gray-700 py-2 px-6 rounded font-bold hover:bg-gray-400 transition">
                        Batal
                    </button>
                </div>
            </form>
        </div>
    );
};

// --- Main App ---

const App = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const response = await axios.get('/auth/user-profile');
                    setUser(response.data);
                } catch (err) {
                    localStorage.removeItem('token');
                }
            }
            setLoading(false);
        };
        checkAuth();
    }, []);

    if (loading) return null;

    return (
        <Router>
            <Layout user={user} setUser={setUser}>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={!user ? <Login setUser={setUser} /> : <Navigate to="/matkuls" />} />
                    <Route path="/register" element={!user ? <Register setUser={setUser} /> : <Navigate to="/matkuls" />} />
                    <Route path="/matkuls" element={user ? <MatkulList /> : <Navigate to="/login" />} />
                    <Route path="/matkuls/create" element={user ? <MatkulForm isEdit={false} /> : <Navigate to="/login" />} />
                    <Route path="/matkuls/edit/:id" element={user ? <MatkulForm isEdit={true} /> : <Navigate to="/login" />} />
                </Routes>
            </Layout>
        </Router>
    );
};

export default App;
