import { useState, useEffect } from 'react';
import { Camera, Youtube, MapPin, Phone, Mail, Menu, X, Lock, LogOut, Edit } from 'lucide-react';

// ==================== NAVBAR COMPONENT ====================
function Navbar({ isAdmin, onLogout }) {
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


          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <button onClick={() => scrollToSection('beranda')} className="hover:text-blue-200 transition">
              Beranda
            </button>
            <button onClick={() => scrollToSection('tentang')} className="hover:text-blue-200 transition">
              Tentang
            </button>
            <button onClick={() => scrollToSection('sosial-media')} className="hover:text-blue-200 transition">
              Sosial Media
            </button>
            <button onClick={() => scrollToSection('kontak')} className="hover:text-blue-200 transition">
              Kontak
            </button>
            {isAdmin && (
              <button 
                onClick={onLogout}
                className="flex items-center space-x-2 bg-red-500 px-4 py-2 rounded-lg hover:bg-red-600 transition"
              >
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button onClick={() => setIsOpen(!isOpen)} className="md:hidden">
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <button onClick={() => scrollToSection('beranda')} className="block w-full text-left py-2 hover:text-blue-200">
              Beranda
            </button>
            <button onClick={() => scrollToSection('tentang')} className="block w-full text-left py-2 hover:text-blue-200">
              Tentang
            </button>
            <button onClick={() => scrollToSection('sosial-media')} className="block w-full text-left py-2 hover:text-blue-200">
              Sosial Media
            </button>
            <button onClick={() => scrollToSection('kontak')} className="block w-full text-left py-2 hover:text-blue-200">
              Kontak
            </button>
            {isAdmin && (
              <button onClick={onLogout} className="flex items-center space-x-2 text-red-300 py-2">
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            )}
          </div>
        )}
      </nav>
    </header>
  );
}

// ==================== LOGIN COMPONENT ====================
function LoginPage({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Simulasi login (ganti dengan API call ke backend)
    setTimeout(() => {
      if (username === 'admin' && password === 'admin123') {
        onLogin({ username, role: 'admin' });
      } else {
        setError('Username atau password salah!');
      }
      setLoading(false);
    }, 1000);
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
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition"
              placeholder="Masukkan username"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Password
            </label>
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
          <p className="text-sm text-gray-600">Demo Credentials:</p>
          <p className="text-xs text-gray-500 mt-1">Username: admin | Password: admin123</p>
        </div>

        <div className="mt-6 text-center">
          <button 
            onClick={() => window.location.reload()}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            ← Kembali ke Website
          </button>
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
        {/* Logo di Hero */}
        <img 
          src="/PGRI logo.png" 
          alt="Logo SMP PGRI 1 CIPUTAT" 
          className="h-24 w-24 mx-auto mb-6 drop-shadow-2xl"
        />
        
        <h1 className="text-4xl md:text-6xl font-bold mb-4 animate-fade-in drop-shadow-lg">
          SMP PGRI 1 CIPUTAT
        </h1>
        <p className="text-xl md:text-2xl opacity-90 drop-shadow-md">
          Membentuk Generasi Cerdas, Berkarakter, dan Berprestasi
        </p>
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

// ==================== SOCIAL MEDIA COMPONENT ====================
function SocialMedia({ socialData, onUpdate, isAdmin }) {
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [instagramUsername, setInstagramUsername] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (socialData) {
      setYoutubeUrl(socialData.youtubeUrl || '');
      setInstagramUsername(socialData.instagramUsername || '');
    }
  }, [socialData]);

  const getYouTubeVideoId = (url) => {
    if (url.length === 11 && !url.includes('/') && !url.includes('=')) {
      return url;
    }
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\?\/]+)/,
      /youtube\.com\/embed\/([^&\?\/]+)/
    ];
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }
    return null;
  };

  const handleUpdate = () => {
    const videoId = getYouTubeVideoId(youtubeUrl);
    if (youtubeUrl && !videoId) {
      alert('URL YouTube tidak valid!');
      return;
    }
    onUpdate({ youtubeUrl, instagramUsername });
    setIsEditing(false);
  };

  const videoId = getYouTubeVideoId(socialData?.youtubeUrl || '');

  return (
    <section id="sosial-media" className="py-20 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-12 text-blue-900">Sosial Media Kami</h2>

        {/* Admin Panel - Only visible for admin */}
        {isAdmin === true && (
          <div className="bg-blue-50 p-6 rounded-xl mb-12 border-2 border-blue-200">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center space-x-2">
                <Edit size={24} className="text-blue-600" />
                <h3 className="text-xl font-bold text-blue-900">Panel Admin</h3>
              </div>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                {isEditing ? 'Batal' : 'Edit'}
              </button>
            </div>

            {isEditing && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">
                    YouTube Video URL atau ID:
                  </label>
                  <input
                    type="text"
                    value={youtubeUrl}
                    onChange={(e) => setYoutubeUrl(e.target.value)}
                    placeholder="https://www.youtube.com/watch?v=xxxxx"
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">
                    Instagram Username:
                  </label>
                  <input
                    type="text"
                    value={instagramUsername}
                    onChange={(e) => setInstagramUsername(e.target.value)}
                    placeholder="smppgri1ciputat"
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <button
                  onClick={handleUpdate}
                  className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition font-semibold"
                >
                  Simpan Perubahan
                </button>
              </div>
            )}
          </div>
        )}

        {/* Social Media Display - Visible for everyone */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* YouTube */}
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="flex items-center space-x-3 mb-6 pb-4 border-b-2">
              <Youtube className="text-red-600" size={32} />
              <div>
                <h3 className="text-xl font-bold">YouTube Channel</h3>
                <p className="text-gray-600">Video Kegiatan Sekolah</p>
              </div>
            </div>
            {videoId ? (
              <div className="relative pb-[56.25%] h-0 overflow-hidden rounded-lg">
                <iframe
                  src={`https://www.youtube.com/embed/${videoId}`}
                  className="absolute top-0 left-0 w-full h-full"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            ) : (
              <div className="bg-gray-200 rounded-lg h-64 flex items-center justify-center">
                <Youtube size={64} className="text-gray-400" />
              </div>
            )}
            <a
              href={videoId ? `https://www.youtube.com/watch?v=${videoId}` : '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-4 px-6 py-3 bg-red-600 text-white rounded-full hover:bg-red-700 transition"
            >
              Kunjungi Channel
            </a>
          </div>

          {/* Instagram */}
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="flex items-center space-x-3 mb-6 pb-4 border-b-2">
              <Camera className="text-pink-600" size={32} />
              <div>
                <h3 className="text-xl font-bold">Instagram</h3>
                <p className="text-gray-600">Foto Kegiatan Sekolah</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 mb-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="aspect-square bg-gradient-to-br from-purple-400 to-pink-400 rounded-lg flex items-center justify-center">
                  <Camera className="text-white opacity-50" size={32} />
                </div>
              ))}
            </div>
            <a
              href={socialData?.instagramUsername ? `https://www.instagram.com/${socialData.instagramUsername}` : '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full hover:from-purple-700 hover:to-pink-700 transition"
            >
              Ikuti Instagram
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

// ==================== CONTACT COMPONENT ====================
function Contact({ data }) {
  return (
    <section id="kontak" className="py-20 px-4 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-12 text-blue-900">Hubungi Kami</h2>
        <div className="bg-white p-8 rounded-xl shadow-lg">
          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <MapPin className="text-blue-600 mt-1" size={24} />
              <div>
                <h3 className="font-bold text-lg mb-2">Alamat</h3>
                <p className="text-gray-700">{data?.alamat || 'Jl. Pendidikan No. 123, Ciputat, Tangerang Selatan'}</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <Phone className="text-blue-600 mt-1" size={24} />
              <div>
                <h3 className="font-bold text-lg mb-2">Telepon</h3>
                <p className="text-gray-700">{data?.telepon || '(021) 1234-5678'}</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <Mail className="text-blue-600 mt-1" size={24} />
              <div>
                <h3 className="font-bold text-lg mb-2">Email</h3>
                <p className="text-gray-700">{data?.email || 'info@smppgri1ciputat.sch.id'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ==================== FOOTER COMPONENT ====================
function Footer({ onAdminClick }) {
  return (
    <footer className="bg-blue-900 text-white py-8">
      <div className="text-center">
        <p className="mb-4">&copy; 2024 SMP PGRI 1 CIPUTAT. All Rights Reserved.</p>
        <button
          onClick={onAdminClick}
          className="inline-flex items-center space-x-2 text-blue-300 hover:text-white transition text-sm"
        >
          <Lock size={16} />
          <span>Admin Login</span>
        </button>
      </div>
    </footer>
  );
}

// ==================== MAIN APP COMPONENT ====================
export default function App() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [user, setUser] = useState(null);

  const [aboutData, setAboutData] = useState({
    visi: 'Menjadi lembaga pendidikan yang unggul dalam prestasi, berakhlak mulia, dan berbudaya lingkungan.',
    misi: 'Menyelenggarakan pendidikan berkualitas yang mengembangkan potensi siswa secara optimal dalam akademik dan non-akademik.',
    prestasi: 'Meraih berbagai prestasi di tingkat kota dan provinsi dalam bidang akademik, olahraga, dan seni.'
  });

  const [socialData, setSocialData] = useState({
    youtubeUrl: 'dQw4w9WgXcQ',
    instagramUsername: 'smppgri1ciputat'
  });

  const [contactData, setContactData] = useState({
    alamat: 'Jl. Pendidikan No. 123, Ciputat, Tangerang Selatan',
    telepon: '(021) 1234-5678',
    email: 'info@smppgri1ciputat.sch.id'
  });

  const handleLogin = (userData) => {
    setUser(userData);
    setIsAdmin(true);
    setShowLogin(false);
    alert(`Selamat datang, ${userData.username}!`);
  };

  const handleLogout = () => {
    setUser(null);
    setIsAdmin(false);
    alert('Anda telah logout');
  };

  const handleSocialMediaUpdate = (newData) => {
    setSocialData(newData);
    // TODO: Kirim ke backend API
    alert('Data berhasil diperbarui!');
  };

  // Show login page if showLogin is true
  if (showLogin && !isAdmin) {
    return <LoginPage onLogin={handleLogin} />;
  }

  // Show main website
  return (
    <div className="min-h-screen bg-white">
      <Navbar isAdmin={isAdmin} onLogout={handleLogout} />
      <Hero />
      <About data={aboutData} />
      <SocialMedia 
        socialData={socialData} 
        onUpdate={handleSocialMediaUpdate}
        isAdmin={isAdmin}
      />
      <Contact data={contactData} />
      <Footer onAdminClick={() => setShowLogin(true)} />
    </div>
  );
}