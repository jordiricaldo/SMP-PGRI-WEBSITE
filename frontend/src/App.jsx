import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom';
import {
  Camera, Youtube, MapPin, Phone, Mail, ArrowRight,
  ChevronDown, Star, Award, Users, BookOpen, PlayCircle, Target, X
} from 'lucide-react';
import api from './services/api';
import AOS from 'aos';
import 'aos/dist/aos.css';

import PublicLayout from './layouts/PublicLayout';
import AdminDashboard from './AdminDashboard';
import NewsDetail from './pages/NewsDetail';

// === COMPONENTS ===
const AchievementsModal = ({ isOpen, onClose, achievements }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in" onClick={onClose}>
      <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[80vh] overflow-hidden flex flex-col shadow-2xl relative" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition z-10">
          <X size={20} />
        </button>

        <div className="p-8 bg-gradient-to-r from-yellow-400 to-orange-500 text-white shrink-0">
          <h3 className="text-3xl font-bold flex items-center gap-3"><Award size={32} /> Prestasi Sekolah</h3>
          <p className="opacity-90 mt-2">Daftar pencapaian membanggakan siswa dan sekolah.</p>
        </div>

        <div className="flex-1 overflow-y-auto p-8 bg-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {achievements.length > 0 ? achievements.map((item) => (
              <div key={item._id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition border border-gray-100 flex flex-col">
                <div className="h-48 bg-gray-200 relative overflow-hidden">
                  {item.image ? (
                    <img src={item.image} className="w-full h-full object-cover transition duration-700 hover:scale-110" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400"><Award size={40} /></div>
                  )}
                  <div className="absolute top-2 right-2 bg-white/90 px-2 py-1 rounded text-xs font-bold text-orange-600 shadow-sm">
                    {new Date(item.date).toLocaleDateString('id-ID', { year: 'numeric', month: 'long' })}
                  </div>
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <h4 className="font-bold text-lg text-gray-800 mb-2">{item.title}</h4>
                  <p className="text-gray-600 text-sm leading-relaxed">{item.description}</p>
                </div>
              </div>
            )) : (
              <div className="col-span-full text-center py-20 text-gray-500">Belum ada data prestasi.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};


// 1. HERO SECTION (Extracted to prevent re-renders)
const Hero = ({ aboutData }) => {
  const [isCardActive, setIsCardActive] = useState(false);

  return (
    <section className="relative min-h-screen flex items-center bg-slate-900 overflow-hidden pt-20">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 right-0 w-2/3 h-full bg-gradient-to-l from-blue-900/40 to-slate-900 z-10"></div>
        <img src="/gedungsekolah.JPG" className="w-full h-full object-cover opacity-40" alt="Background" />
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 relative z-20 w-full grid lg:grid-cols-2 gap-12 items-center">
        <div data-aos="fade-right">

          <h1 className="text-5xl lg:text-7xl font-extrabold text-white leading-tight mb-6">
            Mewujudkan <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Generasi Emas</span> <br />
            Berkarakter.
          </h1>
          <p className="text-lg text-slate-300 mb-8 max-w-lg leading-relaxed">
            SMP PGRI 1 Ciputat berkomitmen mencetak lulusan yang cerdas secara intelektual, stabil secara emosional, dan kuat secara spiritual.
          </p>
          <div className="flex flex-wrap gap-4">
            <button onClick={() => document.getElementById('tentang')?.scrollIntoView({ behavior: 'smooth' })} className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition transform hover:-translate-y-1 shadow-lg shadow-blue-600/30 flex items-center gap-2">
              Profil Sekolah <ArrowRight size={20} />
            </button>

          </div>


        </div>

        {/* Floating Cards Illustration */}
        <div
          className="relative h-[600px] cursor-pointer group perspective-1000 scale-[0.6] sm:scale-[0.75] md:scale-[0.9] lg:scale-100 origin-top lg:origin-center -mt-20 lg:mt-0"
          data-aos="fade-left"
          onMouseEnter={() => setIsCardActive(true)}
          onMouseLeave={() => setIsCardActive(false)}
          onClick={() => setIsCardActive(!isCardActive)}
        >
          {/* HEADMASTER CARD */}
          <div className={`absolute top-10 right-10 w-80 h-[450px] bg-gray-800 rounded-[2rem] overflow-hidden border-8 border-white/5 shadow-2xl transition-all duration-700 ease-out ${isCardActive ? 'z-30 scale-105 shadow-blue-500/20' : 'z-10 rotate-3 grayscale-[0.5]'}`}>
            {aboutData.sambutan?.fotoKepsek ? <img src={aboutData.sambutan.fotoKepsek} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-gray-700"></div>}
            <div className="absolute bottom-0 inset-x-0 p-6 bg-gradient-to-t from-black/90 to-transparent">
              <p className="text-white font-bold text-lg">{aboutData.sambutan?.namaKepsek}</p>
              <p className="text-blue-400 text-sm">Kepala Sekolah</p>
            </div>
          </div>

          {/* SAMBUTAN CARD */}
          <div className={`absolute bottom-20 left-10 w-80 h-[400px] bg-white rounded-3xl p-8 shadow-xl transition-all duration-700 ease-out ${isCardActive ? 'z-20 scale-95 blur-[0.5px] opacity-90' : 'z-20 scale-100 -rotate-3'}`}>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-2xl">❝</div>
              <div>
                <p className="font-bold text-gray-800">{aboutData.sambutan?.judul || 'Kata Sambutan'}</p>
                <p className="text-xs text-gray-500">Kepala Sekolah</p>
              </div>
            </div>
            <p className="text-gray-600 font-medium text-sm mt-6 leading-relaxed overflow-y-auto h-[260px] pr-2 scrollbar-thin scrollbar-thumb-gray-200">
              "{aboutData.sambutan?.konten}"
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

// === LOGIN PAGE (Modern Glass Style) ===
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
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-gray-900">
      {/* Abstract Background Blobs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-32 left-20 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

      <div className="bg-white/10 backdrop-blur-lg border border-white/20 p-8 rounded-3xl shadow-2xl w-full max-w-md relative z-10" data-aos="zoom-in">
        <div className="text-center mb-8">
          <div className="inline-block p-4 rounded-full bg-gradient-to-tr from-blue-600 to-purple-600 mb-4 shadow-lg">
            <img src="/PGRI logo.png" alt="Logo" className="w-12 h-12 brightness-200 invert-0" />
          </div>
          <h2 className="text-3xl font-bold text-white tracking-tight">Admin Portal</h2>
          <p className="text-blue-200 text-sm mt-2">SMP PGRI 1 CIPUTAT</p>
        </div>

        {error && <div className="bg-red-500/20 border border-red-500/50 text-red-200 p-3 rounded-lg mb-6 text-sm text-center backdrop-blur-sm">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="group">
            <input className="w-full bg-black/20 border border-white/10 p-4 rounded-xl text-white placeholder-white/40 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} />
          </div>
          <div>
            <input className="w-full bg-black/20 border border-white/10 p-4 rounded-xl text-white placeholder-white/40 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all" type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
          </div>
          <button disabled={loading} className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl font-bold hover:shadow-lg hover:shadow-blue-500/30 transition transform hover:-translate-y-1 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed">
            {loading ? 'Authenticating...' : 'MASUK DASHBOARD'}
          </button>
        </form>
        <div className="mt-8 text-center border-t border-white/10 pt-6">
          <Link to="/" className="text-sm text-blue-300 hover:text-white font-medium transition flex items-center justify-center gap-2">
            <ArrowRight size={16} className="rotate-180" /> Kembali ke Website
          </Link>
        </div>
      </div>
    </div>
  );
}

// === HOME PAGE (COMPLEX UI) ===
function HomePage() {
  const [aboutData, setAboutData] = useState({});
  const [socialData, setSocialData] = useState({});
  const [contactData, setContactData] = useState({});
  const [news, setNews] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [facilities, setFacilities] = useState([]);

  const [eskuls, setEskuls] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [isAchievementModalOpen, setIsAchievementModalOpen] = useState(false);


  useEffect(() => {
    const loadData = async () => {
      try {
        const [schoolRes, socialRes, newsRes, galleryRes, contactRes, facRes, eskulRes, achievementsRes] = await Promise.all([
          api.school.getSchoolData(),
          api.school.getSocialMediaData(),
          api.news.getAllNews(),
          api.gallery.getGallery(),
          api.school.getContactData(),
          api.facility.getAll(),
          api.extracurricular.getAll(),
          api.achievements.getAll()
        ]);
        setAboutData(schoolRes.data.about);
        setSocialData(socialRes.data);
        setContactData(contactRes.data);
        setNews(newsRes.data);
        setGallery(galleryRes.data);
        setFacilities(facRes.data);
        setEskuls(eskulRes.data);
        setAchievements(achievementsRes.data);
      } catch (err) { console.error("Gagal load data:", err); }
    };
    loadData();
  }, []);

  // 1. HERO SECTION


  // 2. BENTO GRID ABOUT SECTION
  const About = () => (
    <section id="tentang" className="py-24 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16" data-aos="fade-up">
          <span className="text-blue-600 font-bold tracking-wider uppercase text-sm">Tentang Kami</span>
          <h2 className="text-4xl font-bold text-gray-900 mt-2">Membangun Masa Depan</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 auto-rows-[220px]">

          <div className="md:col-span-2 lg:col-span-2 row-span-2 bg-white rounded-2xl p-8 shadow-sm border border-gray-100 flex flex-col justify-center hover:shadow-xl transition duration-500 group" data-aos="fade-up">
            <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 mb-6 group-hover:scale-110 transition">
              <BookOpen size={28} />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Filosofi Pendidikan</h3>
            <p className="text-gray-600 leading-relaxed text-lg">{aboutData?.deskripsi}</p>
          </div>

          <div className="md:col-span-1 lg:col-span-2 bg-blue-600 rounded-3xl p-8 shadow-lg text-white flex flex-col justify-center relative overflow-hidden group" data-aos="fade-up" data-aos-delay="100">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 group-hover:scale-150 transition duration-700"></div>
            <h3 className="text-2xl font-bold mb-2 relative z-10 flex items-center gap-2"><Star className="fill-current" /> Visi</h3>
            <p className="text-blue-100 relative z-10">{aboutData?.visi}</p>
          </div>

          <div className="md:col-span-1 lg:col-span-1 row-span-2 bg-gray-900 rounded-3xl p-8 shadow-lg text-white flex flex-col group relative overflow-hidden" data-aos="fade-up" data-aos-delay="200">
            {/* Background Image for Misi */}
            <div className="absolute inset-0 z-0">
              <img src="/gedungsekolah.JPG" className="w-full h-full object-cover opacity-50 group-hover:scale-110 transition duration-700" />
              <div className="absolute inset-0 bg-blue-900/80 mix-blend-multiply"></div>
            </div>

            <div className="relative z-10 h-full flex flex-col">
              <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center mb-auto group-hover:rotate-12 transition border border-white/20">
                <Target className="text-blue-300" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Misi Utama</h3>
                <p className="text-blue-100 text-sm leading-relaxed">{aboutData?.misi}</p>
              </div>
            </div>
          </div>

          <div onClick={() => setIsAchievementModalOpen(true)} className="md:col-span-2 lg:col-span-1 row-span-1 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-3xl p-8 shadow-lg text-white flex flex-col justify-center relative overflow-hidden group cursor-pointer hover:shadow-2xl transition duration-500" data-aos="fade-up" data-aos-delay="300">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition group-hover:scale-110 duration-500">
              <Award size={100} />
            </div>
            <h3 className="text-xl font-bold mb-2 relative z-10 flex items-center gap-2">🏆 Prestasi</h3>
            <p className="text-white/90 font-medium relative z-10 line-clamp-3">Klik untuk melihat daftar prestasi sekolah &raquo;</p>
          </div>

        </div>
      </div>
    </section>
  );

  // 3. FEATURED ESKUL & FASILITAS
  const FasilitasEskul = () => (
    <section className="py-24 px-4 bg-white relative">
      <div className="max-w-7xl mx-auto space-y-32">

        {/* FACILITIES SLIDER */}
        <div data-aos="fade-left">
          <div className="flex justify-between items-end mb-10">
            <div>
              <span className="text-blue-600 font-bold uppercase text-sm">Fasilitas</span>
              <h2 className="text-3xl font-bold text-gray-900">Lingkungan Belajar</h2>
            </div>
            <div className="flex gap-2">
              <button className="p-3 rounded-full border border-gray-200 hover:bg-gray-100 transition"><ArrowRight size={20} className="rotate-180" /></button>
              <button className="p-3 rounded-full bg-gray-900 text-white hover:bg-gray-800 transition"><ArrowRight size={20} /></button>
            </div>
          </div>

          <div className="flex gap-6 overflow-x-auto pb-8 snap-x hide-scrollbar">
            {facilities.map((item, idx) => (
              <div key={idx} className="snap-center shrink-0 w-[300px] md:w-[350px] h-[400px] relative rounded-3xl overflow-hidden group cursor-pointer">
                <img src={item.image} className="w-full h-full object-cover transition duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-8 flex flex-col justify-end">
                  <h3 className="text-white text-xl font-bold mb-2 translate-y-4 group-hover:translate-y-0 transition duration-300">{item.name}</h3>
                  <p className="text-gray-300 text-sm opacity-0 group-hover:opacity-100 transition duration-300 delay-100">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ESKUL GRID */}
        <div data-aos="fade-up">
          <div className="text-center mb-12">
            <span className="bg-orange-100 text-orange-600 px-4 py-1 rounded-full text-sm font-bold">Ekstrakurikuler</span>
            <h2 className="text-4xl font-bold text-gray-900 mt-4">Kembangkan Bakatmu</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {eskuls.map((item, idx) => (
              <div key={idx} className={`relative rounded-2xl overflow-hidden group shadow-lg ${idx === 0 || idx === 3 ? 'lg:col-span-2 lg:row-span-2 h-[400px]' : 'h-[190px]'}`}>
                <img src={item.image} className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition duration-500" />
                <div className="absolute inset-0 bg-blue-900/80 opacity-60 group-hover:opacity-20 transition duration-500"></div>
                <div className="absolute bottom-0 left-0 p-6">
                  <h3 className="text-white font-bold text-xl md:text-2xl mb-1">{item.name}</h3>
                  <p className="text-blue-200 text-sm font-medium bg-blue-900/50 inline-block px-2 py-1 rounded">{item.schedule}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );

  // 4. NEWS & GALLERY
  const NewsGallery = () => (
    <section id="berita" className="py-24 px-4 bg-slate-50">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-12">

        {/* Left Col: News List */}
        <div className="lg:col-span-2 space-y-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 border-l-4 border-blue-600 pl-4">Berita Terbaru</h2>
          {news.map((item, index) => (
            <Link to={`/news/${item._id}`} key={item._id} className="flex flex-col md:flex-row gap-6 bg-white p-4 rounded-2xl shadow-sm hover:shadow-md transition group" data-aos="fade-up">
              <div className="w-full md:w-48 h-32 rounded-xl overflow-hidden shrink-0">
                {item.image ? (
                  <img src={item.image} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
                ) : <div className="w-full h-full bg-gray-200"></div>}
              </div>
              <div className="flex-1">
                <span className="text-xs font-bold text-blue-600 uppercase tracking-wide">
                  {new Date(item.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                </span>
                <h3 className="text-xl font-bold text-gray-800 mt-2 mb-2 group-hover:text-blue-600 transition line-clamp-2">{item.title}</h3>
                <p className="text-gray-500 text-sm line-clamp-2">{item.content}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* Right Col: Gallery Grid & Social */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-3xl shadow-lg border border-gray-100 sticky top-24">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-xl text-gray-900 flex items-center gap-2"><Camera size={20} /> Galeri</h3>
              <a href={`https://instagram.com/${socialData?.instagramUsername}`} target="_blank" className="text-xs font-bold text-blue-600 hover:underline">Lihat Semua</a>
            </div>

            <div className="grid grid-cols-2 gap-2 mb-8">
              {gallery.slice(0, 4).map((item, i) => (
                <div key={i} className="aspect-square rounded-xl overflow-hidden relative group">
                  <img src={item.mediaUrl} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition"></div>
                </div>
              ))}
            </div>

            <div className="space-y-4">
              <a href={socialData?.youtubeUrl} target="_blank" className="flex items-center gap-4 p-4 rounded-xl bg-red-50 hover:bg-red-100 transition text-red-700">
                <div className="bg-white p-2 rounded-full shadow-sm"><Youtube size={20} /></div>
                <div className="font-bold text-sm">Subscribe Youtube</div>
              </a>
              <a href={`https://instagram.com/${socialData?.instagramUsername}`} target="_blank" className="flex items-center gap-4 p-4 rounded-xl bg-purple-50 hover:bg-purple-100 transition text-purple-700">
                <div className="bg-white p-2 rounded-full shadow-sm"><Camera size={20} /></div>
                <div className="font-bold text-sm">Follow Instagram</div>
              </a>
            </div>
          </div>
        </div>

      </div>
    </section>
  );

  // 5. CONTACT INFO (DENGAN GOOGLE MAPS)
  const ContactInfo = () => (
    <section id="kontak" className="py-24 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12" data-aos="fade-down">
          <h2 className="text-4xl font-bold text-blue-900">Lokasi & Kontak</h2>
          <p className="text-gray-500 mt-2">Kunjungi sekolah kami atau hubungi untuk informasi lebih lanjut</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 items-stretch">

          {/* KOLOM KIRI: INFO KONTAK */}
          <div className="bg-gradient-to-br from-blue-900 to-blue-800 p-10 rounded-3xl shadow-2xl text-white relative overflow-hidden" data-aos="fade-right">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-16 -mt-16 blur-3xl"></div>

            <h3 className="text-2xl font-bold mb-8 relative z-10">Informasi Sekolah</h3>
            <div className="space-y-8 relative z-10">
              <div className="flex items-start gap-4">
                <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
                  <MapPin size={24} className="text-blue-200" />
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-1">Alamat</h4>
                  <p className="text-blue-100 leading-relaxed">{contactData?.alamat || 'Jl. Pendidikan No. 30, Ciputat'}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
                  <Phone size={24} className="text-green-200" />
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-1">Telepon</h4>
                  <p className="text-blue-100">{contactData?.telepon || '(021) 7409827'}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
                  <Mail size={24} className="text-orange-200" />
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-1">Email</h4>
                  <p className="text-blue-100">{contactData?.email || 'smppgri1cpt@gmail.com'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* KOLOM KANAN: GOOGLE MAPS */}
          <div className="bg-gray-100 rounded-3xl overflow-hidden shadow-xl border-4 border-white h-[400px] lg:h-auto" data-aos="fade-left">
            <iframe
              title="Lokasi SMP PGRI 1 Ciputat"
              src="https://maps.google.com/maps?q=-6.3085,106.7463&hl=id&z=16&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-full grayscale hover:grayscale-0 transition duration-700"
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  );

  // 6. FOOTER (FINAL)
  const ModernFooter = () => (
    <footer className="bg-gray-900 text-white pt-20 pb-10 rounded-t-[3rem] mt-12">
      <div className="max-w-7xl mx-auto px-8 grid md:grid-cols-4 gap-12 mb-16">
        <div className="col-span-2">
          <div className="flex items-center gap-3 mb-6">
            <img src="/PGRI logo.png" className="w-10 h-10 brightness-200 grayscale" />
            <h3 className="text-2xl font-bold">SMP PGRI 1 CIPUTAT</h3>
          </div>
          <p className="text-gray-400 leading-relaxed max-w-sm mb-8">
            Membangun karakter siswa yang cerdas, berakhlak mulia, dan siap menghadapi tantangan masa depan.
          </p>
          <div className="flex gap-4">
            <a href={socialData?.youtubeUrl} target="_blank" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-red-600 transition"><Youtube size={18} /></a>
            <a href={`https://instagram.com/${socialData?.instagramUsername}`} target="_blank" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-pink-600 transition"><Camera size={18} /></a>
          </div>
        </div>

        <div>
          <h4 className="font-bold text-lg mb-6">Navigasi</h4>
          <ul className="space-y-4 text-gray-400 text-sm">
            <li><button onClick={() => document.getElementById('beranda')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-white transition">Beranda</button></li>
            <li><button onClick={() => document.getElementById('tentang')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-white transition">Profil Sekolah</button></li>
            <li><button onClick={() => document.getElementById('berita')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-white transition">Berita Terkini</button></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-lg mb-6">Jam Operasional</h4>
          <ul className="space-y-4 text-gray-400 text-sm">
            <li className="flex justify-between"><span>Senin - Jumat</span> <span>07:00 - 15:00</span></li>
            <li className="flex justify-between"><span>Sabtu</span> <span>07:00 - 12:00</span></li>
            <li className="flex justify-between text-red-400"><span>Minggu</span> <span>Tutup</span></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 text-center pt-8 text-gray-500 text-sm">
        © 2025 SMP PGRI 1 CIPUTAT. All Rights Reserved.
      </div>
    </footer>
  );

  return (
    <div className="overflow-x-hidden font-sans bg-gray-50">
      <Hero aboutData={aboutData} />
      <div className="relative z-30 mt-0 lg:-mt-20">
        <About />
      </div>
      <FasilitasEskul />
      <NewsGallery />
      <ContactInfo />
      <ModernFooter />
      <AchievementsModal isOpen={isAchievementModalOpen} onClose={() => setIsAchievementModalOpen(false)} achievements={achievements} />
    </div>
  );
}

// ==================== MAIN CONFIG ====================
export default function App() {
  const [kurikulumData, setKurikulumData] = useState({});

  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: 'ease-out-cubic',
      once: true,
      offset: 50
    });

    api.school.getSchoolData().then(res => {
      if (res.success) setKurikulumData(res.data.kurikulum);
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