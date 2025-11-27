import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom';
import { Camera, Youtube, MapPin, Phone, Mail, Menu, X, Lock } from 'lucide-react';
import api from './services/api';

// IMPORT ANIMASI (AOS)
import AOS from 'aos';
import 'aos/dist/aos.css';

// Layouts & Pages
import PublicLayout from './layouts/PublicLayout';
import AdminDashboard from './AdminDashboard';
import NewsDetail from './pages/NewsDetail';

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
            <img src="/PGRI logo.png" alt="Logo" className="h-10 w-10 object-contain"/>
            <span className="font-bold text-lg">SMP PGRI 1 CIPUTAT</span>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <button onClick={() => scrollToSection('beranda')} className="hover:text-blue-200 transition">Beranda</button>
            <button onClick={() => scrollToSection('tentang')} className="hover:text-blue-200 transition">Tentang</button>
            <button onClick={() => scrollToSection('berita')} className="hover:text-blue-200 transition">Berita</button>
            <button onClick={() => scrollToSection('sosial-media')} className="hover:text-blue-200 transition">Sosial Media</button>
            <button onClick={() => scrollToSection('kontak')} className="hover:text-blue-200 transition">Kontak</button>
          </div>

          <button onClick={() => setIsOpen(!isOpen)} className="md:hidden">
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {isOpen && (
          <div className="md:hidden pb-4 space-y-2 bg-blue-800 p-4 rounded-b-lg">
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

// ==================== LOGIN PAGE ====================
function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await api.auth.login(username, password);
      if (response.success) navigate('/admin'); 
    } catch (err) {
      setError(err.message || 'Login gagal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] bg-gray-100 flex items-center justify-center p-4" data-aos="zoom-in">
      <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-md border-t-4 border-blue-900">
        <h2 className="text-2xl font-bold text-center mb-6 text-blue-900">Login Admin</h2>
        {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input className="w-full border p-3 rounded focus:ring-2 focus:ring-blue-900 outline-none" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} />
          <input className="w-full border p-3 rounded focus:ring-2 focus:ring-blue-900 outline-none" type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
          <button disabled={loading} className="w-full bg-blue-900 text-white py-3 rounded font-bold hover:bg-blue-800 transition disabled:opacity-50">
            {loading ? 'Memproses...' : 'MASUK'}
          </button>
        </form>
      </div>
    </div>
  );
}

// ==================== HOME PAGE (ANIMATED) ====================
function HomePage() {
  const [aboutData, setAboutData] = useState({});
  const [socialData, setSocialData] = useState({});
  const [contactData, setContactData] = useState({});
  const [news, setNews] = useState([]);
  const [gallery, setGallery] = useState([]);

  useEffect(() => {
    // 1. Inisialisasi Animasi (AOS)
    AOS.init({
      duration: 1000, // Durasi animasi 1 detik
      once: true,     // Animasi hanya sekali saat scroll ke bawah (biar tidak pusing)
      offset: 100,    // Mulai animasi 100px sebelum elemen muncul
    });

    // 2. Load Data
    const loadData = async () => {
      try {
        const [about, social, contact, newsRes, galleryRes] = await Promise.all([
          api.school.getAboutData(),
          api.school.getSocialMediaData(),
          api.school.getContactData(),
          api.news.getAllNews(),
          api.gallery.getGallery()
        ]);
        setAboutData(about.data);
        setSocialData(social.data);
        setContactData(contact.data);
        setNews(newsRes.data);
        setGallery(galleryRes.data);
      } catch (err) { console.error("Gagal load data:", err); }
    };
    loadData();
  }, []);

  // --- HERO SECTION ---
  const Hero = () => (
    <section id="beranda" className="relative text-white text-center py-32 px-4 min-h-[600px] flex items-center justify-center" style={{ backgroundImage: 'linear-gradient(rgba(17, 24, 39, 0.7), rgba(37, 99, 235, 0.6)), url("/gedungsekolah.JPG")', backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed' }}>
      <div className="max-w-4xl mx-auto relative z-10" data-aos="fade-down">
        <img src="/PGRI logo.png" alt="Logo" className="h-28 w-28 mx-auto mb-6 drop-shadow-2xl animate-bounce-slow"/>
        <h1 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg tracking-tight">SMP PGRI 1 CIPUTAT</h1>
        <p className="text-xl md:text-2xl opacity-90 drop-shadow-md font-light">Membentuk Generasi Cerdas, Berkarakter, dan Berprestasi</p>
        <button onClick={() => document.getElementById('tentang')?.scrollIntoView({behavior: 'smooth'})} className="mt-8 px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-semibold transition transform hover:scale-105 shadow-lg">
          Jelajahi Sekolah
        </button>
      </div>
    </section>
  );

  // --- ABOUT SECTION ---
  const About = () => (
    <section id="tentang" className="py-24 px-4 bg-gray-50 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        
        {/* Profil Sekolah */}
        <div className="mb-20 max-w-4xl mx-auto text-center" data-aos="fade-up">
          
          {/* UPDATE 1: Hapus 'relative inline-block' dan hapus <span> di dalamnya agar garis hilang */}
          <h2 className="text-4xl font-bold mb-6 text-blue-900">
            Profil Sekolah
          </h2>

          <h3 className="text-xl font-semibold text-gray-500 mb-6 uppercase tracking-widest">SMP PGRI 1 CIPUTAT</h3>
          
          {/* UPDATE 2: Isi teks default dibuat panjang agar tidak terlihat 'terpotong' */}
          <div className="prose max-w-none text-gray-700 leading-relaxed text-lg whitespace-pre-wrap bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            {aboutData?.deskripsi || `SMP PGRI 1 Ciputat merupakan salah satu Sekolah Menengah Pertama swasta yang berada di wilayah Ciputat, Kota Tangerang Selatan. Sekolah ini berada di bawah naungan Yayasan Pembina Lembaga Pendidikan (YPLP) PGRI.

Sejak berdirinya, SMP PGRI 1 Ciputat berkomitmen untuk menyelenggarakan pendidikan yang berkualitas, memadukan kurikulum nasional dengan pengembangan karakter siswa. Kami berupaya mencetak generasi yang tidak hanya cerdas secara akademik, tetapi juga memiliki akhlak mulia, disiplin, dan berwawasan luas.

Dengan dukungan tenaga pengajar yang profesional dan fasilitas yang memadai, sekolah ini terus berinovasi dalam metode pembelajaran untuk menghadapi tantangan era digital.`}
          </div>
        </div>

        {/* Kartu Visi Misi (Tetap Sama) */}
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { icon: '📚', title: 'Visi', content: aboutData?.visi, color: 'text-blue-600' },
            { icon: '🎯', title: 'Misi', content: aboutData?.misi, color: 'text-red-600' },
            { icon: '🏆', title: 'Prestasi', content: aboutData?.prestasi, color: 'text-yellow-600' }
          ].map((card, i) => (
            <div 
              key={i} 
              className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition duration-300 border-t-4 border-blue-900 transform hover:-translate-y-2"
              data-aos="fade-up"
              data-aos-delay={i * 200}
            >
              <div className={`text-5xl mb-6 ${card.color} text-center`}>{card.icon}</div>
              <h3 className="text-2xl font-bold mb-4 text-blue-900 text-center">{card.title}</h3>
              <p className="text-gray-600 leading-relaxed text-center">{card.content || 'Memuat...'}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );

  // --- NEWS SECTION ---
  const News = () => (
    <section id="berita" className="py-24 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12" data-aos="fade-down">
          <h2 className="text-4xl font-bold text-blue-900">Berita & Kegiatan</h2>
          <p className="text-gray-500 mt-2">Update terbaru seputar kegiatan siswa dan sekolah</p>
        </div>

        {news.length === 0 ? <p className="text-center text-gray-500">Belum ada berita terbaru.</p> : (
          <div className="grid md:grid-cols-3 gap-8">
            {news.map((item, index) => (
              <Link 
                to={`/news/${item._id}`} 
                key={item._id} 
                className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition h-full flex flex-col group"
                data-aos="fade-up"
                data-aos-delay={index * 100} // Muncul satu-satu
              >
                {item.image && (
                  <div className="h-56 overflow-hidden relative">
                    <img 
                      src={item.image} 
                      alt={item.title} 
                      className="w-full h-full object-cover group-hover:scale-110 transition duration-700 ease-in-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition duration-300"></div>
                  </div>
                )}

                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="text-xl font-bold mb-3 text-gray-800 group-hover:text-blue-600 transition line-clamp-2 leading-snug">{item.title}</h3>
                  <p className="text-gray-600 mb-4 text-sm line-clamp-3 flex-1">{item.content}</p>
                  <div className="pt-4 border-t border-gray-100 flex items-center text-xs text-gray-400 font-medium">
                    <span>📅 {new Date(item.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );

  // --- SOCIAL SECTION ---
  const Social = () => {
    const getYouTubeId = (url) => url?.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\?\/]+)/)?.[1];
    const vidId = getYouTubeId(socialData?.youtubeUrl);

    return (
      <section id="sosial-media" className="py-24 px-4 bg-blue-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12" data-aos="fade-up">
            <h2 className="text-4xl font-bold text-blue-900">Galeri & Media</h2>
            <p className="text-blue-600 mt-2">Ikuti keseruan kami di media sosial</p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-start">
            
            {/* YOUTUBE (Fade Right) */}
            <div className="bg-white p-6 rounded-2xl shadow-xl transform transition hover:-translate-y-1" data-aos="fade-right">
              <div className="flex items-center space-x-3 mb-6 pb-4 border-b-2 border-gray-100">
                <Youtube className="text-red-600" size={32} />
                <h3 className="text-2xl font-bold text-gray-800">YouTube Channel</h3>
              </div>
              {vidId ? (
                <div className="relative shadow-lg rounded-lg overflow-hidden group">
                  <iframe src={`https://www.youtube.com/embed/${vidId}`} className="w-full aspect-video" allowFullScreen title="School Video"></iframe>
                </div>
              ) : (
                <div className="bg-gray-100 rounded-lg h-64 flex items-center justify-center text-gray-400 flex-col">
                  <Youtube size={48} className="mb-2"/> <span>Video belum tersedia</span>
                </div>
              )}
              <div className="mt-6 text-center">
                <a href={socialData?.youtubeUrl || '#'} target="_blank" className="inline-block px-6 py-2 bg-red-600 text-white rounded-full font-semibold hover:bg-red-700 transition shadow-md">
                  Subscribe Channel Kami
                </a>
              </div>
            </div>

            {/* INSTAGRAM (Fade Left) */}
            <div className="bg-white p-6 rounded-2xl shadow-xl transform transition hover:-translate-y-1" data-aos="fade-left">
              <div className="flex items-center justify-center gap-3 mb-6 pb-4 border-b-2 border-gray-100">
                 <Camera className="text-pink-600" size={32}/>
                 <h3 className="text-2xl font-bold text-gray-800">Galeri Sekolah</h3>
              </div>
              
              <div className="grid grid-cols-3 gap-3 mb-8">
                {gallery.length > 0 ? gallery.map((item, idx) => (
                  <a 
                    key={item._id} 
                    href={`https://instagram.com/${socialData?.instagramUsername}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="aspect-square overflow-hidden rounded-lg group relative bg-gray-200 block cursor-pointer shadow-sm"
                    data-aos="zoom-in"
                    data-aos-delay={idx * 100} // Efek muncul pop-up satu per satu
                  >
                    <img src={item.mediaUrl} alt="Galeri" className="w-full h-full object-cover transition duration-500 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition duration-300 flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100">
                       <Camera size={24} className="mb-1 drop-shadow-md" />
                       <p className="text-xs font-bold tracking-wide">LIHAT</p>
                    </div>
                  </a>
                )) : (
                  [1,2,3,4,5,6].map(i => <div key={i} className="aspect-square bg-gray-100 rounded-lg animate-pulse"></div>)
                )}
              </div>

              <div className="text-center">
                <p className="mb-4 text-gray-500 font-medium">@{socialData?.instagramUsername || 'sekolah'}</p>
                <a href={`https://instagram.com/${socialData?.instagramUsername}`} target="_blank" className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-2.5 rounded-full font-bold text-sm hover:shadow-lg transition transform hover:scale-105 inline-block">
                  Follow Instagram
                </a>
              </div>
            </div>

          </div>
        </div>
      </section>
    );
  };

  // --- CONTACT SECTION ---
  const ContactInfo = () => (
    <section id="kontak" className="py-24 px-4 bg-white">
      <div className="max-w-5xl mx-auto text-center" data-aos="zoom-in">
        <h2 className="text-4xl font-bold mb-12 text-blue-900">Hubungi Kami</h2>
        <div className="bg-white p-10 rounded-3xl shadow-2xl border border-gray-100 flex flex-col md:flex-row justify-around gap-8 text-left relative overflow-hidden">
          {/* Dekorasi background tipis */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100 rounded-bl-full opacity-50 -mr-4 -mt-4"></div>
          
          <div className="flex items-start gap-4 relative z-10">
            <div className="bg-blue-100 p-3 rounded-full text-blue-600"><MapPin size={24}/></div>
            <div><h4 className="font-bold text-lg text-gray-800">Alamat</h4><p className="text-gray-600">{contactData?.alamat}</p></div>
          </div>
          <div className="flex items-start gap-4 relative z-10">
            <div className="bg-green-100 p-3 rounded-full text-green-600"><Phone size={24}/></div>
            <div><h4 className="font-bold text-lg text-gray-800">Telepon</h4><p className="text-gray-600">{contactData?.telepon}</p></div>
          </div>
          <div className="flex items-start gap-4 relative z-10">
            <div className="bg-orange-100 p-3 rounded-full text-orange-600"><Mail size={24}/></div>
            <div><h4 className="font-bold text-lg text-gray-800">Email</h4><p className="text-gray-600">{contactData?.email}</p></div>
          </div>
        </div>
      </div>
    </section>
  );

  return (
    <div className="overflow-x-hidden"> {/* Mencegah scroll horizontal saat animasi masuk */}
      <Hero />
      <About />
      <News />
      <Social />
      <ContactInfo />
    </div>
  );
}

// ==================== MAIN APP ROUTING ====================
export default function App() {
  const ProtectedRoute = ({ children }) => {
    if (!api.auth.isLoggedIn()) return <Navigate to="/login" replace />;
    return children;
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/news/:id" element={<NewsDetail />} />
        </Route>

        <Route 
          path="/admin" 
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </BrowserRouter>
  );
}