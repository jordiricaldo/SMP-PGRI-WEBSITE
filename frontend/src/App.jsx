import { useState, useEffect } from 'react';
// PERBAIKAN: useNavigate sudah ditambahkan di sini
import { BrowserRouter, Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom';
import { Camera, Youtube, MapPin, Phone, Mail, Menu, X, Lock, LogOut, Edit } from 'lucide-react';
import api from './services/api';
import AdminDashboard from './AdminDashboard';

// ==================== NAVBAR COMPONENT ====================
function Navbar({ isAdmin }) {
  const [isOpen, setIsOpen] = useState(false);

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setIsOpen(false);
  };

  return (
    <header className="bg-gradient-to-r from-blue-900 to-blue-700 text-white sticky top-0 z-50 shadow-lg">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <img 
              src="/PGRI logo.png" 
              alt="Logo SMP PGRI 1 CIPUTAT" 
              className="h-10 w-10 object-contain"
            />
            <span className="font-bold text-lg">SMP PGRI 1 CIPUTAT</span>
        </div>

          <div className="hidden md:flex items-center space-x-8">
            <button onClick={() => scrollToSection('beranda')} className="hover:text-blue-200 transition">Beranda</button>
            <button onClick={() => scrollToSection('tentang')} className="hover:text-blue-200 transition">Tentang</button>
            <button onClick={() => scrollToSection('berita')} className="hover:text-blue-200 transition">Berita</button>
            <button onClick={() => scrollToSection('sosial-media')} className="hover:text-blue-200 transition">Sosial Media</button>
            <button onClick={() => scrollToSection('kontak')} className="hover:text-blue-200 transition">Kontak</button>
            {!isAdmin && (
              <Link to="/login" className="text-blue-300 hover:text-white transition"><Lock size={18} /></Link>
            )}
          </div>

          <button onClick={() => setIsOpen(!isOpen)} className="md:hidden">
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {isOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <button onClick={() => scrollToSection('beranda')} className="block w-full text-left py-2 hover:text-blue-200">Beranda</button>
            <button onClick={() => scrollToSection('tentang')} className="block w-full text-left py-2 hover:text-blue-200">Tentang</button>
            <button onClick={() => scrollToSection('berita')} className="block w-full text-left py-2 hover:text-blue-200">Berita</button>
            <button onClick={() => scrollToSection('sosial-media')} className="block w-full text-left py-2 hover:text-blue-200">Sosial Media</button>
            <button onClick={() => scrollToSection('kontak')} className="block w-full text-left py-2 hover:text-blue-200">Kontak</button>
          </div>
        )}
      </nav>
    </header>
  );
}

// ==================== LOGIN COMPONENT (SUDAH DIPERBAIKI) ====================
function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  // PERBAIKAN UTAMA: useNavigate dipanggil dengan benar di sini
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.auth.login(username, password);
      if (response.success) {
        navigate('/admin'); 
      }
    } catch (err) {
      setError(err.message || 'Login gagal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-700 to-purple-800 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🏫</div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Admin Login</h2>
          <p className="text-gray-600">SMP PGRI 1 CIPUTAT</p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition"
              placeholder="Masukkan username"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition"
              placeholder="Masukkan password"
              onKeyPress={(e) => e.key === 'Enter' && handleSubmit(e)}
            />
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Loading...' : 'Login'}
          </button>
        </div>

        <div className="mt-6 text-center">
          <Link to="/" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
            ← Kembali ke Website
          </Link>
        </div>
      </div>
    </div>
  );
}

// ==================== HERO COMPONENT ====================
function Hero() {
  return (
    <section 
      id="beranda" 
      className="relative text-white text-center py-24 px-4 min-h-[500px] flex items-center justify-center"
      style={{
        backgroundImage: 'linear-gradient(rgba(88, 28, 135, 0.7), rgba(37, 99, 235, 0.7)), url("/gedungsekolah.JPG")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div className="max-w-4xl mx-auto relative z-10">
        <img 
          src="/PGRI logo.png" 
          alt="Logo SMP PGRI 1 CIPUTAT" 
          className="h-24 w-24 mx-auto mb-6 drop-shadow-2xl"
        />
        <h1 className="text-4xl md:text-6xl font-bold mb-4 animate-fade-in drop-shadow-lg">SMP PGRI 1 CIPUTAT</h1>
        <p className="text-xl md:text-2xl opacity-90 drop-shadow-md">Membentuk Generasi Cerdas, Berkarakter, dan Berprestasi</p>
      </div>
    </section>
  );
}

// ==================== ABOUT COMPONENT ====================
function About({ data }) {
  const cards = [
    { icon: '📚', title: 'Visi', content: data?.visi || 'Memuat visi sekolah...' },
    { icon: '🎯', title: 'Misi', content: data?.misi || 'Memuat misi sekolah...' },
    { icon: '🏆', title: 'Prestasi', content: data?.prestasi || 'Memuat prestasi sekolah...' }
  ];

  return (
    <section id="tentang" className="py-20 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-12 text-blue-900">Tentang Sekolah</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {cards.map((card, index) => (
            <div key={index} className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition transform hover:-translate-y-2">
              <div className="text-4xl mb-4">{card.icon}</div>
              <h3 className="text-2xl font-bold mb-3 text-blue-900">{card.title}</h3>
              <p className="text-gray-700 leading-relaxed">{card.content}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ==================== NEWS SECTION ====================
function NewsSection() {
  const [news, setNews] = useState([]);

  useEffect(() => {
    api.news.getAllNews()
      .then(res => setNews(res.data))
      .catch(err => console.error("Gagal load berita:", err));
  }, []);

  return (
    <section id="berita" className="py-20 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-12 text-blue-900">Berita & Kegiatan</h2>
        {news.length === 0 ? (
          <p className="text-center text-gray-500">Belum ada berita terbaru.</p>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            {news.map((item) => (
              <div key={item._id} className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition">
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2 text-gray-800 line-clamp-2">{item.title}</h3>
                  <p className="text-gray-600 mb-4 text-sm line-clamp-3">{item.content}</p>
                  <div className="flex justify-between items-center text-xs text-gray-400 border-t pt-4">
                    <span>{new Date(item.createdAt).toLocaleDateString('id-ID')}</span>
                    <span>Admin</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

// ==================== SOCIAL MEDIA COMPONENT ====================
function SocialMedia({ socialData }) {
  const getYouTubeVideoId = (url) => {
    if (!url) return null;
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\?\/]+)/);
    return match ? match[1] : null;
  };
  const videoId = getYouTubeVideoId(socialData?.youtubeUrl || '');

  return (
    <section id="sosial-media" className="py-20 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-12 text-blue-900">Sosial Media Kami</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="flex items-center space-x-3 mb-6 pb-4 border-b-2">
              <Youtube className="text-red-600" size={32} />
              <h3 className="text-xl font-bold">YouTube Channel</h3>
            </div>
            {videoId ? (
              <div className="relative pb-[56.25%] h-0 overflow-hidden rounded-lg">
                <iframe src={`https://www.youtube.com/embed/${videoId}`} className="absolute top-0 left-0 w-full h-full" allowFullScreen></iframe>
              </div>
            ) : (
              <div className="bg-gray-200 rounded-lg h-64 flex items-center justify-center"><Youtube size={64} className="text-gray-400" /></div>
            )}
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="flex items-center space-x-3 mb-6 pb-4 border-b-2">
              <Camera className="text-pink-600" size={32} />
              <h3 className="text-xl font-bold">Instagram</h3>
            </div>
            <div className="text-center py-12">
               <p className="mb-4 text-lg">Ikuti kami di: <strong>@{socialData?.instagramUsername || '...'}</strong></p>
               <a href={`https://instagram.com/${socialData?.instagramUsername}`} target="_blank" className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-full">Buka Instagram</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ==================== CONTACT & FOOTER ====================
function Contact({ data }) {
  return (
    <section id="kontak" className="py-20 px-4 bg-white">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-12 text-blue-900">Hubungi Kami</h2>
        <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 space-y-4">
          <p className="flex items-center gap-4"><MapPin className="text-blue-600"/> {data?.alamat || '...'}</p>
          <p className="flex items-center gap-4"><Phone className="text-blue-600"/> {data?.telepon || '...'}</p>
          <p className="flex items-center gap-4"><Mail className="text-blue-600"/> {data?.email || '...'}</p>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-blue-900 text-white py-8 text-center">
      <p>&copy; 2024 SMP PGRI 1 CIPUTAT. All Rights Reserved.</p>
    </footer>
  );
}

// ==================== PUBLIC HOME WRAPPER ====================
function PublicHome() {
  const [aboutData, setAboutData] = useState({});
  const [socialData, setSocialData] = useState({});
  const [contactData, setContactData] = useState({});

  useEffect(() => {
    const loadData = async () => {
      try {
        const about = await api.school.getAboutData();
        const social = await api.school.getSocialMediaData();
        const contact = await api.school.getContactData();
        setAboutData(about.data);
        setSocialData(social.data);
        setContactData(contact.data);
      } catch (err) {
        console.error("Gagal load data:", err);
      }
    };
    loadData();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Navbar isAdmin={false} />
      <Hero />
      <About data={aboutData} />
      <NewsSection />
      <SocialMedia socialData={socialData} />
      <Contact data={contactData} />
      <Footer />
    </div>
  );
}

// ==================== MAIN APP ====================
export default function App() {
  const ProtectedRoute = ({ children }) => {
    if (!api.auth.isLoggedIn()) return <Navigate to="/login" replace />;
    return children;
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PublicHome />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}