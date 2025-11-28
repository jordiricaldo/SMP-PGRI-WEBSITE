// frontend/src/App.jsx (GANTI SEMUA ISI FILE INI)
import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom';
import { Camera, Youtube, MapPin, Phone, Mail } from 'lucide-react';
import api from './services/api';
import AOS from 'aos';
import 'aos/dist/aos.css';

import PublicLayout from './layouts/PublicLayout';
import AdminDashboard from './AdminDashboard';
import NewsDetail from './pages/NewsDetail';

// === LOGIN PAGE ===
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
    } catch (err) { setError(err.message || 'Login gagal'); } 
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4" data-aos="zoom-in">
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
        <div className="mt-6 text-center border-t pt-4">
          <Link to="/" className="text-sm text-gray-500 hover:text-blue-900 hover:underline transition">← Kembali ke Website Utama</Link>
        </div>
      </div>
    </div>
  );
}

// === HOME PAGE ===
function HomePage() {
  const [aboutData, setAboutData] = useState({});
  const [socialData, setSocialData] = useState({});
  const [contactData, setContactData] = useState({});
  const [news, setNews] = useState([]);
  const [gallery, setGallery] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [schoolRes, socialRes, newsRes, galleryRes] = await Promise.all([
          api.school.getSchoolData(),
          api.school.getSocialMediaData(),
          api.news.getAllNews(),
          api.gallery.getGallery()
        ]);
        setAboutData(schoolRes.data.about);
        setSocialData(socialRes.data);
        // Contact data ada di schoolRes.data.contact jika pakai endpoint getSchoolData, atau panggil getContactData
        // Biar aman pakai api.school.getContactData() terpisah atau ambil dari schoolRes
        // Di sini saya pakai fetch ulang biar konsisten dengan kode lama, tapi bisa dioptimalkan.
        // Untuk sekarang ikuti pola lama:
        const contactRes = await api.school.getContactData();
        setContactData(contactRes.data);

        setNews(newsRes.data);
        setGallery(galleryRes.data);
      } catch (err) { console.error("Gagal load data:", err); }
    };
    loadData();
  }, []);

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

  // --- WELCOME SECTION (SAMBUTAN) ---
  const WelcomeSection = () => (
    <section className="py-20 px-4 bg-white border-b border-gray-100">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12">
        {/* FOTO */}
        <div className="w-full md:w-1/3 flex justify-center" data-aos="fade-right">
          <div className="relative w-64 h-80 rounded-2xl overflow-hidden shadow-2xl border-4 border-white transform rotate-2 hover:rotate-0 transition duration-500">
            {aboutData.sambutan?.fotoKepsek ? (
              <img src={aboutData.sambutan.fotoKepsek} alt="Kepala Sekolah" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400 flex-col">
                <span className="text-4xl mb-2">🎓</span>
                <span className="text-sm">Foto Belum Ada</span>
              </div>
            )}
            <div className="absolute bottom-0 w-full bg-gradient-to-t from-blue-900 to-transparent pt-12 pb-4 text-white text-center">
              <p className="font-bold text-lg">{aboutData.sambutan?.namaKepsek || 'Kepala Sekolah'}</p>
              <p className="text-xs opacity-90 tracking-widest uppercase">Kepala Sekolah</p>
            </div>
          </div>
        </div>

        {/* TEKS */}
        <div className="w-full md:w-2/3 text-center md:text-left" data-aos="fade-left">
          <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-6 relative inline-block">
            {aboutData.sambutan?.judul || 'Sambutan Kepala Sekolah'}
            <span className="absolute -bottom-2 left-0 w-1/3 h-1 bg-yellow-400 rounded-full md:mx-0 mx-auto right-0 md:right-auto"></span>
          </h2>
          <div className="prose max-w-none text-gray-600 text-lg leading-relaxed whitespace-pre-wrap">
            {aboutData.sambutan?.konten || 'Selamat datang di website resmi sekolah kami. Kami berkomitmen untuk memberikan layanan pendidikan terbaik...'}
          </div>
        </div>
      </div>
    </section>
  );

  const About = () => (
    <section id="tentang" className="py-24 px-4 bg-gray-50 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="mb-20 max-w-4xl mx-auto text-center" data-aos="fade-up">
          <h2 className="text-4xl font-bold mb-6 text-blue-900">Profil Sekolah</h2>
          <h3 className="text-xl font-semibold text-gray-500 mb-6 uppercase tracking-widest">SMP PGRI 1 CIPUTAT</h3>
          <div className="prose max-w-none text-gray-700 leading-relaxed text-lg whitespace-pre-wrap bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            {aboutData?.deskripsi || `SMP PGRI 1 Ciputat...`}
          </div>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { icon: '📚', title: 'Visi', content: aboutData?.visi, color: 'text-blue-600' },
            { icon: '🎯', title: 'Misi', content: aboutData?.misi, color: 'text-red-600' },
            { icon: '🏆', title: 'Prestasi', content: aboutData?.prestasi, color: 'text-yellow-600' }
          ].map((card, i) => (
            <div key={i} className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition duration-300 border-t-4 border-blue-900 transform hover:-translate-y-2" data-aos="fade-up" data-aos-delay={i * 200}>
              <div className={`text-5xl mb-6 ${card.color} text-center`}>{card.icon}</div>
              <h3 className="text-2xl font-bold mb-4 text-blue-900 text-center">{card.title}</h3>
              <p className="text-gray-600 leading-relaxed text-center">{card.content || 'Memuat...'}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );

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
              <Link to={`/news/${item._id}`} key={item._id} className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition h-full flex flex-col group" data-aos="fade-up" data-aos-delay={index * 100}>
                {item.image && (
                  <div className="h-56 overflow-hidden relative">
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition duration-700 ease-in-out"/>
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
            <div className="bg-white p-6 rounded-2xl shadow-xl transform transition hover:-translate-y-1" data-aos="fade-right">
              <div className="flex items-center space-x-3 mb-6 pb-4 border-b-2 border-gray-100">
                <Youtube className="text-red-600" size={32} />
                <h3 className="text-2xl font-bold text-gray-800">YouTube Channel</h3>
              </div>
              {vidId ? <div className="relative shadow-lg rounded-lg overflow-hidden group"><iframe src={`https://www.youtube.com/embed/${vidId}`} className="w-full aspect-video" allowFullScreen title="School Video"></iframe></div> : <div className="bg-gray-100 rounded-lg h-64 flex items-center justify-center text-gray-400 flex-col"><Youtube size={48} className="mb-2"/> <span>Video belum tersedia</span></div>}
              <div className="mt-6 text-center"><a href={socialData?.youtubeUrl || '#'} target="_blank" className="inline-block px-6 py-2 bg-red-600 text-white rounded-full font-semibold hover:bg-red-700 transition shadow-md">Subscribe Channel Kami</a></div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-xl transform transition hover:-translate-y-1" data-aos="fade-left">
              <div className="flex items-center justify-center gap-3 mb-6 pb-4 border-b-2 border-gray-100"><Camera className="text-pink-600" size={32}/><h3 className="text-2xl font-bold text-gray-800">Galeri Sekolah</h3></div>
              <div className="grid grid-cols-3 gap-3 mb-8">
                {gallery.length > 0 ? gallery.map((item, idx) => (
                  <a key={item._id} href={`https://instagram.com/${socialData?.instagramUsername}`} target="_blank" rel="noopener noreferrer" className="aspect-square overflow-hidden rounded-lg group relative bg-gray-200 block cursor-pointer shadow-sm" data-aos="zoom-in" data-aos-delay={idx * 100}>
                    <img src={item.mediaUrl} alt="Galeri" className="w-full h-full object-cover transition duration-500 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition duration-300 flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100"><Camera size={24} className="mb-1 drop-shadow-md" /><p className="text-xs font-bold tracking-wide">LIHAT</p></div>
                  </a>
                )) : ([1,2,3,4,5,6].map(i => <div key={i} className="aspect-square bg-gray-100 rounded-lg animate-pulse"></div>))}
              </div>
              <div className="text-center"><p className="mb-4 text-gray-500 font-medium">@{socialData?.instagramUsername || 'sekolah'}</p><a href={`https://instagram.com/${socialData?.instagramUsername}`} target="_blank" className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-2.5 rounded-full font-bold text-sm hover:shadow-lg transition transform hover:scale-105 inline-block">Follow Instagram</a></div>
            </div>
          </div>
        </div>
      </section>
    );
  };

  const ContactInfo = () => (
    <section id="kontak" className="py-24 px-4 bg-white">
      <div className="max-w-5xl mx-auto text-center" data-aos="zoom-in">
        <h2 className="text-4xl font-bold mb-12 text-blue-900">Hubungi Kami</h2>
        <div className="bg-white p-10 rounded-3xl shadow-2xl border border-gray-100 flex flex-col md:flex-row justify-around gap-8 text-left relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100 rounded-bl-full opacity-50 -mr-4 -mt-4"></div>
          <div className="flex items-start gap-4 relative z-10"><div className="bg-blue-100 p-3 rounded-full text-blue-600"><MapPin size={24}/></div><div><h4 className="font-bold text-lg text-gray-800">Alamat</h4><p className="text-gray-600">{contactData?.alamat}</p></div></div>
          <div className="flex items-start gap-4 relative z-10"><div className="bg-green-100 p-3 rounded-full text-green-600"><Phone size={24}/></div><div><h4 className="font-bold text-lg text-gray-800">Telepon</h4><p className="text-gray-600">{contactData?.telepon}</p></div></div>
          <div className="flex items-start gap-4 relative z-10"><div className="bg-orange-100 p-3 rounded-full text-orange-600"><Mail size={24}/></div><div><h4 className="font-bold text-lg text-gray-800">Email</h4><p className="text-gray-600">{contactData?.email}</p></div></div>
        </div>
      </div>
    </section>
  );

  return (
    <div className="overflow-x-hidden">
      <Hero />
      <WelcomeSection /> {/* TAMPILKAN SAMBUTAN DI SINI */}
      <About />
      <News />
      <Social />
      <ContactInfo />
    </div>
  );
}

// ==================== MAIN APP ====================
export default function App() {
  const [kurikulumData, setKurikulumData] = useState({});

  useEffect(() => {
    // Init AOS
    AOS.init({ duration: 1000, once: true, offset: 100 });
    
    // Fetch Kurikulum Data di level atas agar bisa masuk Navbar
    api.school.getSchoolData().then(res => {
      if(res.success) setKurikulumData(res.data.kurikulum);
    });
  }, []);

  const ProtectedRoute = ({ children }) => {
    if (!api.auth.isLoggedIn()) return <Navigate to="/login" replace />;
    return children;
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicLayout kurikulumData={kurikulumData} />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/news/:id" element={<NewsDetail />} />
        </Route>

        <Route path="/login" element={<LoginPage />} />

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