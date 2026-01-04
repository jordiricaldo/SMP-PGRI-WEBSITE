import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LogOut, Trash, Plus, Save, Image as ImageIcon,
  BookOpen, Link as LinkIcon, Upload, LayoutDashboard,
  Users, Newspaper, MapPin, Phone, Building, Award, Star
} from 'lucide-react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement,
  LineElement, Title, Tooltip, Legend,
} from 'chart.js';
import api from './services/api';
// IMPORT KOMPONEN CROPPER
import ImageCropper from './components/ImageCropper';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true); // New state to track initial data fetch
  const [uploading, setUploading] = useState(false); // Indikator upload

  // --- STATE CROPPER ---
  const [cropperOpen, setCropperOpen] = useState(false);
  const [tempImageSrc, setTempImageSrc] = useState(null);
  const [uploadType, setUploadType] = useState(null); // 'kepsek', 'news', 'gallery', 'facility', 'eskul', 'achievement'

  // --- STATES DATA ---
  const [stats, setStats] = useState({ totalVisitors: 0, totalNews: 0, totalGallery: 0, monthlyVisits: [] });
  const [aboutData, setAboutData] = useState({
    deskripsi: '', visi: '', misi: '', prestasi: '',
    sambutan: { judul: '', konten: '', namaKepsek: '', fotoKepsek: '' }
  });
  const [kurikulumData, setKurikulumData] = useState({ eraporUrl: '', absensiUrl: '' });
  const [contactData, setContactData] = useState({ alamat: '', telepon: '', email: '' });
  const [socialData, setSocialData] = useState({ youtubeUrl: '', instagramUsername: '' });

  const [newsList, setNewsList] = useState([]);
  const [galleryList, setGalleryList] = useState([]);
  const [facilities, setFacilities] = useState([]);
  const [eskuls, setEskuls] = useState([]);
  const [achievements, setAchievements] = useState([]);

  // --- STATES FORM ---
  const [newsForm, setNewsForm] = useState({ title: '', content: '', image: '' });
  const [galleryForm, setGalleryForm] = useState({ mediaUrl: '', caption: '' });
  const [facilityForm, setFacilityForm] = useState({ name: '', image: '', description: '' });
  const [eskulForm, setEskulForm] = useState({ name: '', image: '', schedule: '' });
  const [achievementForm, setAchievementForm] = useState({ title: '', description: '', image: '' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setDataLoading(true);
    try {
      const schoolRes = await api.school.getSchoolData();
      setAboutData(schoolRes.data.about);
      setKurikulumData(schoolRes.data.kurikulum || { eraporUrl: '', absensiUrl: '' });

      const [socialRes, contactRes, newsRes, galleryRes, facRes, eskulRes, achievementsRes] = await Promise.all([
        api.school.getSocialMediaData(),
        api.school.getContactData(),
        api.news.getAllNews(),
        api.gallery.getGallery(),
        api.facility.getAll(),
        api.extracurricular.getAll(),
        api.achievements.getAll()
      ]);

      setSocialData(socialRes.data);
      setContactData(contactRes.data);
      setNewsList(newsRes.data);
      setGalleryList(galleryRes.data);
      setFacilities(facRes.data);
      setEskuls(eskulRes.data);
      setAchievements(achievementsRes.data);

      setStats({
        totalVisitors: 1540,
        totalNews: newsRes.data.length,
        totalGallery: galleryRes.data.length,
        monthlyVisits: [65, 59, 80, 81, 56, 100, 120]
      });

    } catch (error) {
      if (error.message && error.message.includes('401')) handleLogout();
    } finally {
      setDataLoading(false);
    }
  };

  const handleLogout = () => {
    api.auth.logout();
    navigate('/login');
  };

  // --- LOGIKA PILIH FILE ---
  const onFileSelect = (e, type) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        setTempImageSrc(reader.result);
        setUploadType(type); // Simpan tipe upload (misal: 'news')
        setCropperOpen(true);
      });
      reader.readAsDataURL(file);
      e.target.value = null;
    }
  };

  // --- LOGIKA SIMPAN SETELAH CROP (PERBAIKAN) ---
  const onCropFinished = async (croppedBlob) => {
    setLoading(true);
    setUploading(true);
    try {
      // 1. Upload File ke Backend
      const file = new File([croppedBlob], "cropped-image.jpg", { type: "image/jpeg" });
      const res = await api.upload.uploadImage(file);

      if (res.success && res.imageUrl) {
        // 2. Update State Sesuai Tipe (Cara Aman agar Gambar Langsung Muncul)
        const url = res.imageUrl;

        if (uploadType === 'kepsek') {
          setAboutData(prev => ({
            ...prev,
            sambutan: { ...prev.sambutan, fotoKepsek: url }
          }));
        }
        else if (uploadType === 'news') {
          setNewsForm(prev => ({ ...prev, image: url }));
        }
        else if (uploadType === 'gallery') {
          setGalleryForm(prev => ({ ...prev, mediaUrl: url }));
        }
        else if (uploadType === 'facility') {
          setFacilityForm(prev => ({ ...prev, image: url }));
        }
        else if (uploadType === 'eskul') {
        }
        else if (uploadType === 'eskul') {
          setEskulForm(prev => ({ ...prev, image: url }));
        }
        else if (uploadType === 'achievement') {
          setAchievementForm(prev => ({ ...prev, image: url }));
        }

        // 3. Reset & Tutup
        setCropperOpen(false);
        setTempImageSrc(null);
        alert('Foto berhasil disimpan!');
      } else {
        alert('Gagal mendapatkan URL gambar dari server.');
      }
    } catch (err) {
      alert('Error saat upload: ' + err.message);
      console.error(err);
    } finally {
      setLoading(false);
      setUploading(false);
    }
  };

  // --- HANDLERS UPDATE DATA ---
  const handleAboutUpdate = async (e) => { e.preventDefault(); setLoading(true); try { await api.school.updateAboutData({ ...aboutData, kurikulum: kurikulumData }); alert('Profil disimpan!'); fetchData(); } catch (err) { alert(err.message); } setLoading(false); };
  const handleContactUpdate = async (e) => { e.preventDefault(); setLoading(true); try { await api.school.updateContactData(contactData); alert('Kontak disimpan!'); } catch (err) { alert(err.message); } setLoading(false); };
  const handleSocialUpdate = async (e) => { e.preventDefault(); setLoading(true); try { await api.school.updateSocialMediaData(socialData); alert('Sosmed disimpan!'); } catch (err) { alert(err.message); } setLoading(false); };

  const handleAddNews = async (e) => { e.preventDefault(); setLoading(true); try { await api.news.createNews(newsForm); setNewsForm({ title: '', content: '', image: '' }); alert('Berita diposting!'); fetchData(); } catch (err) { alert(err.message); } setLoading(false); };
  const handleDeleteNews = async (id) => { if (confirm('Hapus?')) { await api.news.deleteNews(id); fetchData(); } };

  const handleAddMedia = async (e) => { e.preventDefault(); setLoading(true); try { await api.gallery.addPhoto({ mediaUrl: galleryForm.mediaUrl, caption: galleryForm.caption, type: 'image' }); setGalleryForm({ mediaUrl: '', caption: '' }); alert('Foto ditambahkan!'); fetchData(); } catch (err) { alert(err.message); } setLoading(false); };
  const handleDeleteMedia = async (id) => { if (confirm('Hapus?')) { await api.gallery.deletePhoto(id); fetchData(); } };

  const handleAddFacility = async (e) => { e.preventDefault(); setLoading(true); try { await api.facility.create(facilityForm); setFacilityForm({ name: '', image: '', description: '' }); alert('Fasilitas ditambahkan!'); fetchData(); } catch (err) { alert(err.message); } setLoading(false); };
  const handleDeleteFacility = async (id) => { if (confirm('Hapus?')) { await api.facility.delete(id); fetchData(); } };

  const handleAddEskul = async (e) => { e.preventDefault(); setLoading(true); try { await api.extracurricular.create(eskulForm); setEskulForm({ name: '', image: '', schedule: '' }); alert('Eskul ditambahkan!'); fetchData(); } catch (err) { alert(err.message); } setLoading(false); };
  const handleDeleteEskul = async (id) => { if (confirm('Hapus?')) { await api.extracurricular.delete(id); fetchData(); } };

  const handleAddAchievement = async (e) => { e.preventDefault(); setLoading(true); try { await api.achievements.create(achievementForm); setAchievementForm({ title: '', description: '', image: '' }); alert('Prestasi ditambahkan!'); fetchData(); } catch (err) { alert(err.message); } setLoading(false); };
  const handleDeleteAchievement = async (id) => { if (confirm('Hapus?')) { await api.achievements.delete(id); fetchData(); } };


  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* MODAL CROPPER */}
      {cropperOpen && (
        <ImageCropper
          imageSrc={tempImageSrc}
          onCancel={() => setCropperOpen(false)}
          onCropComplete={onCropFinished}
        />
      )}

      {/* SIDEBAR */}
      <aside className="w-64 bg-blue-900 text-white p-6 flex flex-col h-screen fixed left-0 top-0 overflow-y-auto z-20 shadow-xl">
        <div className="flex items-center gap-3 mb-8 px-2">
          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-blue-900 font-bold">A</div>
          <h2 className="text-xl font-bold">Admin Panel</h2>
        </div>
        <nav className="space-y-2 flex-1">
          <button onClick={() => setActiveTab('dashboard')} className={`w-full text-left p-3 rounded-lg flex items-center gap-3 transition ${activeTab === 'dashboard' ? 'bg-blue-700 font-bold' : 'hover:bg-blue-800'}`}><LayoutDashboard size={20} /> Dashboard</button>
          <button onClick={() => setActiveTab('about')} className={`w-full text-left p-3 rounded-lg flex items-center gap-3 transition ${activeTab === 'about' ? 'bg-blue-700 font-bold' : 'hover:bg-blue-800'}`}><BookOpen size={20} /> Profil & Kurikulum</button>
          <button onClick={() => setActiveTab('contact')} className={`w-full text-left p-3 rounded-lg flex items-center gap-3 transition ${activeTab === 'contact' ? 'bg-blue-700 font-bold' : 'hover:bg-blue-800'}`}><Phone size={20} /> Kontak & Sosmed</button>
          <button onClick={() => setActiveTab('facilities')} className={`w-full text-left p-3 rounded-lg flex items-center gap-3 transition ${activeTab === 'facilities' ? 'bg-blue-700 font-bold' : 'hover:bg-blue-800'}`}><Building size={20} /> Fasilitas</button>
          <button onClick={() => setActiveTab('eskul')} className={`w-full text-left p-3 rounded-lg flex items-center gap-3 transition ${activeTab === 'eskul' ? 'bg-blue-700 font-bold' : 'hover:bg-blue-800'}`}><Award size={20} /> Ekstrakurikuler</button>
          <button onClick={() => setActiveTab('achievements')} className={`w-full text-left p-3 rounded-lg flex items-center gap-3 transition ${activeTab === 'achievements' ? 'bg-blue-700 font-bold' : 'hover:bg-blue-800'}`}><Star size={20} /> Prestasi</button>
          <button onClick={() => setActiveTab('news')} className={`w-full text-left p-3 rounded-lg flex items-center gap-3 transition ${activeTab === 'news' ? 'bg-blue-700 font-bold' : 'hover:bg-blue-800'}`}><Newspaper size={20} /> Berita</button>
          <button onClick={() => setActiveTab('gallery')} className={`w-full text-left p-3 rounded-lg flex items-center gap-3 transition ${activeTab === 'gallery' ? 'bg-blue-700 font-bold' : 'hover:bg-blue-800'}`}><ImageIcon size={20} /> Galeri</button>
        </nav>
        <button onClick={handleLogout} className="w-full text-left p-3 rounded-lg bg-red-600 hover:bg-red-700 mt-auto flex items-center gap-3"><LogOut size={20} /> Logout</button>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-8 ml-64">

        {/* DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6 animate-fade-in">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Overview Statistik</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-blue-500">
                <h3 className="text-gray-500 text-sm font-bold uppercase">Total Pengunjung</h3>
                <p className="text-4xl font-bold text-blue-900 mt-2">{stats.totalVisitors}</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-green-500">
                <h3 className="text-gray-500 text-sm font-bold uppercase">Total Berita</h3>
                <p className="text-4xl font-bold text-green-900 mt-2">{stats.totalNews}</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-purple-500">
                <h3 className="text-gray-500 text-sm font-bold uppercase">Total Foto</h3>
                <p className="text-4xl font-bold text-purple-900 mt-2">{stats.totalGallery}</p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg h-80">
              <Line data={{ labels: ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'], datasets: [{ label: 'Pengunjung', data: stats.monthlyVisits, borderColor: 'rgb(59, 130, 246)', backgroundColor: 'rgba(59, 130, 246, 0.1)', tension: 0.4, fill: true }] }} options={{ responsive: true, maintainAspectRatio: false }} />
            </div>
          </div>
        )}

        {/* PROFIL (KEPSEK) */}
        {activeTab === 'about' && (
          <div className="space-y-8 max-w-4xl animate-fade-in">
            {dataLoading ? (
              <div className="bg-white p-12 rounded-xl shadow text-center">
                <div className="animate-spin w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-gray-500 font-bold">Mengambil data sekolah...</p>
              </div>
            ) : (
              <form onSubmit={handleAboutUpdate}>
                <div className="bg-white p-6 rounded-xl shadow mb-8">
                  <h3 className="text-xl font-bold mb-4 border-b pb-4 text-blue-800">🎓 Sambutan Kepala Sekolah</h3>
                  <div className="grid md:grid-cols-2 gap-6 mb-4">
                    <div>
                      <label className="block font-bold mb-2 text-sm">Foto Kepala Sekolah</label>
                      <div className="mb-3 h-48 bg-gray-100 border-2 border-dashed rounded flex items-center justify-center relative overflow-hidden">
                        {aboutData.sambutan?.fotoKepsek ? <img src={aboutData.sambutan.fotoKepsek} className="w-full h-full object-cover" /> : <span className="text-gray-400 text-xs">No Foto</span>}
                        {uploading && <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white text-xs">Uploading...</div>}
                      </div>
                      {/* UPDATE: Pakai type='kepsek' */}
                      <input type="file" accept="image/*" className="text-sm" onChange={(e) => onFileSelect(e, 'kepsek')} />
                    </div>
                    <div className="space-y-4">
                      <div><label className="block font-bold mb-1 text-sm">Nama Kepala Sekolah</label><input className="w-full border p-2 rounded" value={aboutData.sambutan?.namaKepsek || ''} onChange={e => setAboutData({ ...aboutData, sambutan: { ...aboutData.sambutan, namaKepsek: e.target.value } })} /></div>
                      <div><label className="block font-bold mb-1 text-sm">Judul Sambutan</label><input className="w-full border p-2 rounded" value={aboutData.sambutan?.judul || ''} onChange={e => setAboutData({ ...aboutData, sambutan: { ...aboutData.sambutan, judul: e.target.value } })} /></div>
                    </div>
                  </div>
                  <textarea className="w-full border p-2 rounded h-32" value={aboutData.sambutan?.konten || ''} onChange={e => setAboutData({ ...aboutData, sambutan: { ...aboutData.sambutan, konten: e.target.value } })} />
                </div>

                <div className="bg-white p-6 rounded-xl shadow mb-8">
                  <h3 className="text-xl font-bold mb-4 border-b pb-4 text-blue-800">Visi Misi</h3>
                  <div className="space-y-4">
                    <textarea className="w-full border p-3 rounded h-24" placeholder="Deskripsi Singkat" value={aboutData.deskripsi || ''} onChange={e => setAboutData({ ...aboutData, deskripsi: e.target.value })} />
                    <div className="grid md:grid-cols-2 gap-4">
                      <textarea className="w-full border p-2 rounded h-24" placeholder="Visi" value={aboutData.visi} onChange={e => setAboutData({ ...aboutData, visi: e.target.value })} />
                      <textarea className="w-full border p-2 rounded h-24" placeholder="Misi" value={aboutData.misi} onChange={e => setAboutData({ ...aboutData, misi: e.target.value })} />
                    </div>
                  </div>
                </div>
                <button disabled={loading} className="w-full bg-blue-600 text-white px-6 py-4 rounded-xl hover:bg-blue-700 shadow-xl font-bold">SIMPAN PERUBAHAN</button>
              </form>
            )}
          </div>
        )}

        {/* KONTAK */}
        {activeTab === 'contact' && (
          <div className="max-w-4xl space-y-8 animate-fade-in">
            <div className="bg-white p-6 rounded-xl shadow">
              <h3 className="text-xl font-bold mb-6 border-b pb-4 text-blue-800"><MapPin size={24} className="inline" /> Edit Data Kontak</h3>
              <form onSubmit={handleContactUpdate} className="space-y-4">
                <textarea className="w-full border p-3 rounded-lg" placeholder="Alamat Lengkap" value={contactData.alamat || ''} onChange={e => setContactData({ ...contactData, alamat: e.target.value })} />
                <div className="grid md:grid-cols-2 gap-4">
                  <input className="w-full border p-3 rounded-lg" placeholder="Telepon" value={contactData.telepon || ''} onChange={e => setContactData({ ...contactData, telepon: e.target.value })} />
                  <input className="w-full border p-3 rounded-lg" placeholder="Email" value={contactData.email || ''} onChange={e => setContactData({ ...contactData, email: e.target.value })} />
                </div>
                <button disabled={loading} className="bg-blue-600 text-white px-6 py-3 rounded-lg font-bold">Simpan Data Kontak</button>
              </form>
            </div>
            <div className="bg-white p-6 rounded-xl shadow">
              <h3 className="text-xl font-bold mb-6 border-b pb-4 text-pink-600"><LinkIcon size={24} className="inline" /> Edit Sosial Media</h3>
              <form onSubmit={handleSocialUpdate} className="space-y-4">
                <input className="w-full border p-3 rounded-lg" placeholder="Youtube URL" value={socialData.youtubeUrl || ''} onChange={e => setSocialData({ ...socialData, youtubeUrl: e.target.value })} />
                <div className="flex"><span className="bg-gray-200 p-3 rounded-l-lg border border-r-0">@</span><input className="w-full border p-3 rounded-r-lg" placeholder="Instagram Username" value={socialData.instagramUsername || ''} onChange={e => setSocialData({ ...socialData, instagramUsername: e.target.value })} /></div>
                <button disabled={loading} className="bg-pink-600 text-white px-6 py-3 rounded-lg font-bold">Simpan Sosmed</button>
              </form>
            </div>
          </div>
        )}

        {/* FASILITAS */}
        {activeTab === 'facilities' && (
          <div className="space-y-8 max-w-4xl animate-fade-in">
            <div className="bg-white p-6 rounded-xl shadow">
              <h3 className="text-xl font-bold mb-4 border-b pb-2">Tambah Fasilitas</h3>
              <form onSubmit={handleAddFacility} className="space-y-4">
                <input className="w-full border p-2 rounded" placeholder="Nama Fasilitas" value={facilityForm.name} onChange={e => setFacilityForm({ ...facilityForm, name: e.target.value })} required />
                <div>
                  <label className="block text-sm font-bold mb-1">Foto Fasilitas</label>
                  {/* UPDATE: Pakai type='facility' */}
                  <div className="mb-2">{facilityForm.image && <img src={facilityForm.image} className="h-32 object-cover rounded border" />}</div>
                  <input type="file" accept="image/*" onChange={(e) => onFileSelect(e, 'facility')} />
                </div>
                <textarea className="w-full border p-2 rounded" placeholder="Deskripsi Singkat" value={facilityForm.description} onChange={e => setFacilityForm({ ...facilityForm, description: e.target.value })} />
                <button disabled={loading || !facilityForm.image} className="bg-blue-600 text-white px-6 py-2 rounded font-bold">Tambah Fasilitas</button>
              </form>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {facilities.map(item => (
                <div key={item._id} className="bg-white border rounded-lg overflow-hidden shadow relative group">
                  <img src={item.image} className="w-full h-40 object-cover" />
                  <div className="p-3">
                    <h4 className="font-bold text-blue-900">{item.name}</h4>
                    <p className="text-xs text-gray-500 line-clamp-2">{item.description}</p>
                  </div>
                  <button onClick={() => handleDeleteFacility(item._id)} className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded shadow opacity-0 group-hover:opacity-100 transition"><Trash size={16} /></button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ESKUL */}
        {activeTab === 'eskul' && (
          <div className="space-y-8 max-w-4xl animate-fade-in">
            <div className="bg-white p-6 rounded-xl shadow">
              <h3 className="text-xl font-bold mb-4 border-b pb-2">Tambah Ekstrakurikuler</h3>
              <form onSubmit={handleAddEskul} className="space-y-4">
                <input className="w-full border p-2 rounded" placeholder="Nama Eskul" value={eskulForm.name} onChange={e => setEskulForm({ ...eskulForm, name: e.target.value })} required />
                <div>
                  <label className="block text-sm font-bold mb-1">Foto Kegiatan</label>
                  {/* UPDATE: Pakai type='eskul' */}
                  <div className="mb-2">{eskulForm.image && <img src={eskulForm.image} className="h-32 object-cover rounded border" />}</div>
                  <input type="file" accept="image/*" onChange={(e) => onFileSelect(e, 'eskul')} />
                </div>
                <input className="w-full border p-2 rounded" placeholder="Jadwal" value={eskulForm.schedule} onChange={e => setEskulForm({ ...eskulForm, schedule: e.target.value })} />
                <button disabled={loading || !eskulForm.image} className="bg-blue-600 text-white px-6 py-2 rounded font-bold">Tambah Eskul</button>
              </form>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {eskuls.map(item => (
                <div key={item._id} className="bg-white border rounded-lg p-4 text-center shadow relative group">
                  <img src={item.image} className="w-full h-32 object-cover rounded mb-2" />
                  <h4 className="font-bold text-gray-800">{item.name}</h4>
                  <p className="text-xs text-blue-600 font-bold">{item.schedule}</p>
                  <button onClick={() => handleDeleteEskul(item._id)} className="absolute top-2 right-2 text-red-500 opacity-0 group-hover:opacity-100 transition"><Trash size={16} /></button>
                </div>
              ))}
            </div>
          </div>
        )}


        {/* PRESTASI */}
        {activeTab === 'achievements' && (
          <div className="space-y-8 max-w-4xl animate-fade-in">
            <div className="bg-white p-6 rounded-xl shadow">
              <h3 className="text-xl font-bold mb-4 border-b pb-2">Tambah Prestasi</h3>
              <form onSubmit={handleAddAchievement} className="space-y-4">
                <input className="w-full border p-2 rounded" placeholder="Judul Prestasi" value={achievementForm.title} onChange={e => setAchievementForm({ ...achievementForm, title: e.target.value })} required />
                <div>
                  <label className="block text-sm font-bold mb-1">Foto Dokumentasi</label>
                  {/* UPDATE: Pakai type='achievement' */}
                  <div className="mb-2">{achievementForm.image && <img src={achievementForm.image} className="h-32 object-cover rounded border" />}</div>
                  <input type="file" accept="image/*" onChange={(e) => onFileSelect(e, 'achievement')} />
                </div>
                <textarea className="w-full border p-2 rounded h-32" placeholder="Deskripsi Prestasi..." value={achievementForm.description} onChange={e => setAchievementForm({ ...achievementForm, description: e.target.value })} required />
                <button disabled={loading} className="bg-blue-600 text-white px-6 py-2 rounded font-bold">Tambah Prestasi</button>
              </form>
            </div>
            <div className="space-y-4">
              {achievements.map(item => (
                <div key={item._id} className="bg-white border p-4 rounded-lg flex gap-4 justify-between items-center shadow-sm">
                  <div className="flex gap-4 items-center">
                    {item.image && <img src={item.image} className="w-16 h-16 object-cover rounded" />}
                    <div>
                      <h4 className="font-bold">{item.title}</h4>
                      <p className="text-xs text-gray-500 line-clamp-1">{item.description}</p>
                    </div>
                  </div>
                  <button onClick={() => handleDeleteAchievement(item._id)} className="text-red-500 hover:bg-red-50 p-2 rounded-full"><Trash size={20} /></button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* BERITA */}
        {activeTab === 'news' && (
          <div className="space-y-8 max-w-4xl animate-fade-in">
            <div className="bg-white p-6 rounded-xl shadow">
              <h3 className="text-xl font-bold mb-4 border-b pb-2">Tambah Berita</h3>
              <form onSubmit={handleAddNews} className="space-y-4">
                <input className="w-full border p-2 rounded" placeholder="Judul Berita" value={newsForm.title} onChange={e => setNewsForm({ ...newsForm, title: e.target.value })} required />
                {/* UPDATE: Pakai type='news' */}
                <div className="mb-2">{newsForm.image && <img src={newsForm.image} className="h-32 object-cover rounded border" />}</div>
                <input type="file" accept="image/*" onChange={(e) => onFileSelect(e, 'news')} />
                <textarea className="w-full border p-2 rounded h-32" placeholder="Isi Berita..." value={newsForm.content} onChange={e => setNewsForm({ ...newsForm, content: e.target.value })} required />
                <button disabled={loading} className="bg-green-600 text-white px-6 py-2 rounded font-bold"><Plus size={18} className="inline" /> Posting</button>
              </form>
            </div>
            <div className="space-y-4">
              {newsList.map(news => (
                <div key={news._id} className="bg-white border p-4 rounded-lg flex gap-4 justify-between items-center shadow-sm">
                  <div className="flex gap-4 items-center">
                    {news.image && <img src={news.image} className="w-16 h-16 object-cover rounded" />}
                    <h4 className="font-bold">{news.title}</h4>
                  </div>
                  <button onClick={() => handleDeleteNews(news._id)} className="text-red-500 hover:bg-red-50 p-2 rounded-full"><Trash size={20} /></button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* GALERI */}
        {activeTab === 'gallery' && (
          <div className="bg-white p-6 rounded-xl shadow max-w-4xl animate-fade-in">
            <h3 className="text-xl font-bold mb-6 border-b pb-4">Galeri Sekolah</h3>
            <form onSubmit={handleAddMedia} className="bg-purple-50 p-6 rounded-xl mb-8 space-y-4 border border-purple-100">
              {/* UPDATE: Pakai type='gallery' */}
              <div className="mb-2 text-center">{galleryForm.mediaUrl && <img src={galleryForm.mediaUrl} className="h-32 object-cover rounded border mx-auto" />}</div>
              <input type="file" accept="image/*" onChange={(e) => onFileSelect(e, 'gallery')} />
              <div className="flex gap-4">
                <input className="flex-1 border p-2 rounded" placeholder="Caption..." value={galleryForm.caption} onChange={e => setGalleryForm({ ...galleryForm, caption: e.target.value })} />
                <button disabled={loading || !galleryForm.mediaUrl} className="bg-purple-600 text-white px-6 py-2 rounded font-bold">Upload</button>
              </div>
            </form>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {galleryList.map(item => (
                <div key={item._id} className="relative group rounded-lg overflow-hidden border aspect-square">
                  <img src={item.mediaUrl} className="w-full h-full object-cover" />
                  <button onClick={() => handleDeleteMedia(item._id)} className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded shadow"><Trash size={16} /></button>
                </div>
              ))}
            </div>
          </div>
        )}

      </main >
    </div >
  );
}