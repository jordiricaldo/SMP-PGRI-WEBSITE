import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Trash, Plus, Save, Image as ImageIcon, BookOpen, Link as LinkIcon, Upload } from 'lucide-react';
import api from './services/api';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('about');
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false); // State khusus upload
  
  // Data States
  const [aboutData, setAboutData] = useState({ 
    deskripsi: '', visi: '', misi: '', prestasi: '',
    sambutan: { judul: '', konten: '', namaKepsek: '', fotoKepsek: '' }
  });
  const [kurikulumData, setKurikulumData] = useState({ eraporUrl: '', absensiUrl: '' });
  const [socialData, setSocialData] = useState({});
  const [newsList, setNewsList] = useState([]);
  const [galleryList, setGalleryList] = useState([]);
  
  // Form States
  const [newsForm, setNewsForm] = useState({ title: '', content: '', image: '' });
  const [galleryForm, setGalleryForm] = useState({ mediaUrl: '', caption: '' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const schoolRes = await api.school.getSchoolData();
      setAboutData(schoolRes.data.about);
      setKurikulumData(schoolRes.data.kurikulum || { eraporUrl: '', absensiUrl: '' });
      
      const [socialRes, newsRes, galleryRes] = await Promise.all([
        api.school.getSocialMediaData(),
        api.news.getAllNews(),
        api.gallery.getGallery()
      ]);
      setSocialData(socialRes.data);
      setNewsList(newsRes.data);
      setGalleryList(galleryRes.data);
    } catch (error) {
      if (error.message && error.message.includes('401')) handleLogout();
    }
  };

  const handleLogout = () => {
    api.auth.logout();
    navigate('/login');
  };

  // --- FUNGSI UPLOAD FILE ---
  const handleFileUpload = async (e, targetStateSetter, fieldName, currentData = null) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const res = await api.upload.uploadImage(file);
      if (res.success) {
        // Jika targetnya state object (seperti newsForm), update field spesifik
        if (currentData) {
          targetStateSetter({ ...currentData, [fieldName]: res.imageUrl });
        } else {
          // Jika targetnya nested object (seperti aboutData.sambutan)
           // Ini perlu handle manual di pemanggilannya
        }
        alert('Gambar berhasil diupload!');
      }
    } catch (err) {
      alert('Gagal upload gambar: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  // --- HANDLERS ---
  const handleAboutUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.school.updateAboutData({ ...aboutData, kurikulum: kurikulumData });
      alert('Data Sekolah berhasil disimpan!');
      fetchData(); 
    } catch (err) { alert(err.message); }
    setLoading(false);
  };

  // Handler khusus Upload Foto Kepsek
  const uploadFotoKepsek = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const res = await api.upload.uploadImage(file);
      setAboutData({
        ...aboutData,
        sambutan: { ...aboutData.sambutan, fotoKepsek: res.imageUrl }
      });
    } catch (err) { alert('Gagal upload: ' + err.message); }
    setUploading(false);
  };

  const handleSocialUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.school.updateSocialMediaData(socialData);
      alert('Sosial Media berhasil disimpan!');
    } catch (err) { alert(err.message); }
    setLoading(false);
  };

  const handleAddNews = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.news.createNews(newsForm);
      setNewsForm({ title: '', content: '', image: '' });
      fetchData();
      alert('Berita berhasil diposting!');
    } catch (err) { alert(err.message); }
    setLoading(false);
  };

  const handleDeleteNews = async (id) => {
    if(!confirm('Hapus berita?')) return;
    await api.news.deleteNews(id);
    fetchData();
  };

  const handleAddMedia = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.gallery.addPhoto({
        mediaUrl: galleryForm.mediaUrl,
        caption: galleryForm.caption,
        type: 'image'
      });
      setGalleryForm({ mediaUrl: '', caption: '' }); 
      fetchData();
      alert('Foto berhasil ditambahkan ke Galeri!');
    } catch (err) { alert(err.message); }
    setLoading(false);
  };

  const handleDeleteMedia = async (id) => {
    if(!confirm('Hapus foto ini?')) return;
    await api.gallery.deletePhoto(id);
    fetchData();
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <aside className="w-64 bg-blue-900 text-white p-6 flex flex-col h-screen fixed left-0 top-0 overflow-y-auto z-10">
        <h2 className="text-2xl font-bold mb-8">Admin Panel</h2>
        <nav className="space-y-2 flex-1">
          <button onClick={() => setActiveTab('about')} className={`w-full text-left p-3 rounded transition ${activeTab === 'about' ? 'bg-blue-700 font-bold' : 'hover:bg-blue-800'}`}>Profil & Kurikulum</button>
          <button onClick={() => setActiveTab('social')} className={`w-full text-left p-3 rounded transition ${activeTab === 'social' ? 'bg-blue-700 font-bold' : 'hover:bg-blue-800'}`}>Sosial Media</button>
          <button onClick={() => setActiveTab('news')} className={`w-full text-left p-3 rounded transition ${activeTab === 'news' ? 'bg-blue-700 font-bold' : 'hover:bg-blue-800'}`}>Berita</button>
          <button onClick={() => setActiveTab('gallery')} className={`w-full text-left p-3 rounded transition ${activeTab === 'gallery' ? 'bg-blue-700 font-bold' : 'hover:bg-blue-800'}`}>Galeri</button>
        </nav>
        <button onClick={handleLogout} className="w-full text-left p-3 rounded bg-red-600 hover:bg-red-700 mt-auto flex items-center gap-2"><LogOut size={18} /> Logout</button>
      </aside>

      <main className="flex-1 p-8 ml-64">
        
        {/* TAB 1: PROFIL */}
        {activeTab === 'about' && (
          <div className="space-y-8 max-w-4xl">
            <form onSubmit={handleAboutUpdate}>
              
              <div className="bg-white p-6 rounded-xl shadow mb-8">
                <h3 className="text-xl font-bold mb-4 border-b pb-4 flex items-center gap-2 text-blue-800">🎓 Sambutan Kepala Sekolah</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                        <label className="block font-bold mb-2 text-sm">Foto Kepala Sekolah</label>
                        
                        {/* PREVIEW FOTO KEPSEK */}
                        <div className="mb-3 h-40 w-32 bg-gray-100 border rounded overflow-hidden relative">
                            {aboutData.sambutan?.fotoKepsek ? (
                                <img src={aboutData.sambutan.fotoKepsek} className="w-full h-full object-cover" alt="Kepsek" />
                            ) : (
                                <div className="flex items-center justify-center h-full text-gray-400 text-xs">No Foto</div>
                            )}
                            {uploading && <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white text-xs">Uploading...</div>}
                        </div>
                        
                        {/* TOMBOL UPLOAD */}
                        <input 
                            type="file" 
                            accept="image/*"
                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                            onChange={uploadFotoKepsek}
                        />
                    </div>
                    
                    <div className="space-y-4">
                        <div><label className="block font-bold mb-1 text-sm">Nama Kepala Sekolah</label><input className="w-full border p-2 rounded" value={aboutData.sambutan?.namaKepsek || ''} onChange={e => setAboutData({...aboutData, sambutan: {...aboutData.sambutan, namaKepsek: e.target.value}})} /></div>
                        <div><label className="block font-bold mb-1 text-sm">Judul Sambutan</label><input className="w-full border p-2 rounded" value={aboutData.sambutan?.judul || ''} onChange={e => setAboutData({...aboutData, sambutan: {...aboutData.sambutan, judul: e.target.value}})} /></div>
                    </div>
                  </div>
                  <div><label className="block font-bold mb-1 text-sm">Isi Sambutan</label><textarea className="w-full border p-2 rounded h-32" value={aboutData.sambutan?.konten || ''} onChange={e => setAboutData({...aboutData, sambutan: {...aboutData.sambutan, konten: e.target.value}})} /></div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow mb-8">
                <h3 className="text-xl font-bold mb-4 border-b pb-4 flex items-center gap-2 text-blue-800"><LinkIcon/> Link Kurikulum</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="block font-bold mb-1 text-sm">Link E-Rapor</label><input className="w-full border p-2 rounded" value={kurikulumData.eraporUrl} onChange={e => setKurikulumData({...kurikulumData, eraporUrl: e.target.value})} /></div>
                  <div><label className="block font-bold mb-1 text-sm">Link Absensi</label><input className="w-full border p-2 rounded" value={kurikulumData.absensiUrl} onChange={e => setKurikulumData({...kurikulumData, absensiUrl: e.target.value})} /></div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow mb-8">
                <h3 className="text-xl font-bold mb-4 border-b pb-4 flex items-center gap-2 text-blue-800"><BookOpen/> Profil Sekolah</h3>
                <div className="space-y-4">
                  <div><label className="block font-bold mb-2 text-gray-700">Deskripsi Profil</label><textarea className="w-full border p-3 rounded h-32" value={aboutData.deskripsi || ''} onChange={e => setAboutData({...aboutData, deskripsi: e.target.value})} /></div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><label className="block font-bold mb-1 text-sm">Visi</label><textarea className="w-full border p-2 rounded h-24" value={aboutData.visi} onChange={e => setAboutData({...aboutData, visi: e.target.value})} /></div>
                    <div><label className="block font-bold mb-1 text-sm">Misi</label><textarea className="w-full border p-2 rounded h-24" value={aboutData.misi} onChange={e => setAboutData({...aboutData, misi: e.target.value})} /></div>
                  </div>
                </div>
              </div>
              <div className="sticky bottom-4"><button disabled={loading} className="w-full bg-blue-600 text-white px-6 py-4 rounded-xl hover:bg-blue-700 flex items-center justify-center gap-2 shadow-xl font-bold text-lg"><Save size={24} /> SIMPAN SEMUA PERUBAHAN</button></div>
            </form>
          </div>
        )}

        {/* TAB SOCIAL */}
        {activeTab === 'social' && (
          <div className="bg-white p-6 rounded-xl shadow max-w-2xl">
            <h3 className="text-xl font-bold mb-6 border-b pb-4">Edit Kontak & Sosmed</h3>
            <form onSubmit={handleSocialUpdate} className="space-y-4">
              <input className="w-full border p-2 rounded" placeholder="Youtube URL" value={socialData.youtubeUrl || ''} onChange={e => setSocialData({...socialData, youtubeUrl: e.target.value})} />
              <input className="w-full border p-2 rounded" placeholder="Instagram Username" value={socialData.instagramUsername || ''} onChange={e => setSocialData({...socialData, instagramUsername: e.target.value})} />
              <button disabled={loading} className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 flex items-center gap-2"><Save size={18} /> Simpan</button>
            </form>
          </div>
        )}

        {/* TAB BERITA */}
        {activeTab === 'news' && (
          <div className="space-y-8 max-w-4xl">
            <div className="bg-white p-6 rounded-xl shadow">
              <h3 className="text-xl font-bold mb-4 border-b pb-2">Tambah Berita</h3>
              <form onSubmit={handleAddNews} className="space-y-4">
                <input className="w-full border p-2 rounded" placeholder="Judul" value={newsForm.title} onChange={e => setNewsForm({...newsForm, title: e.target.value})} required />
                
                {/* UPLOAD FOTO BERITA */}
                <div>
                    <label className="block font-bold mb-2 text-sm text-gray-700">Foto Berita</label>
                    {newsForm.image && <img src={newsForm.image} className="h-32 rounded mb-2 border" />}
                    <input 
                        type="file" 
                        accept="image/*"
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                        onChange={(e) => handleFileUpload(e, setNewsForm, 'image', newsForm)}
                    />
                </div>

                <textarea className="w-full border p-2 rounded h-32" placeholder="Isi Berita" value={newsForm.content} onChange={e => setNewsForm({...newsForm, content: e.target.value})} required />
                <button disabled={loading} className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 flex items-center gap-2"><Plus size={18} /> Posting</button>
              </form>
            </div>
            <div className="bg-white p-6 rounded-xl shadow space-y-4">
              {newsList.map(news => (
                <div key={news._id} className="border p-4 rounded flex gap-4 items-center justify-between">
                  <div className="flex gap-4 items-center">
                      {news.image && <img src={news.image} className="w-16 h-16 object-cover rounded" />}
                      <div><h4 className="font-bold">{news.title}</h4><span className="text-xs text-gray-400">{new Date(news.createdAt).toLocaleDateString()}</span></div>
                  </div>
                  <button onClick={() => handleDeleteNews(news._id)} className="text-red-500"><Trash size={20} /></button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB GALLERY */}
        {activeTab === 'gallery' && (
          <div className="bg-white p-6 rounded-xl shadow max-w-4xl">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2 border-b pb-4"><ImageIcon/> Galeri Sekolah</h3>
            
            <form onSubmit={handleAddMedia} className="bg-purple-50 p-4 rounded-lg mb-8 space-y-4">
              
              {/* UPLOAD FOTO GALERI */}
              <div className="text-center border-2 border-dashed border-purple-300 p-6 rounded-xl bg-white">
                <Upload className="mx-auto text-purple-400 mb-2" size={32} />
                <p className="text-sm font-bold text-gray-600 mb-2">Pilih Foto dari Komputer</p>
                <input 
                    type="file" 
                    accept="image/*"
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-100 file:text-purple-700 hover:file:bg-purple-200 mx-auto max-w-xs"
                    onChange={(e) => handleFileUpload(e, setGalleryForm, 'mediaUrl', galleryForm)}
                />
                {galleryForm.mediaUrl && <p className="text-green-600 text-xs mt-2">✅ Foto berhasil dipilih!</p>}
              </div>

              <div className="flex gap-4 pt-2">
                <input className="flex-1 border p-2 rounded" placeholder="Caption singkat..." value={galleryForm.caption} onChange={e => setGalleryForm({...galleryForm, caption: e.target.value})} />
                <button disabled={loading || !galleryForm.mediaUrl} className="bg-purple-600 text-white px-8 rounded hover:bg-purple-700 font-bold disabled:opacity-50">Simpan ke Galeri</button>
              </div>
            </form>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {galleryList.map(item => (
                <div key={item._id} className="relative group rounded-lg overflow-hidden border bg-gray-100 aspect-square">
                  <img src={item.mediaUrl} className="w-full h-full object-cover" alt="Gallery" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center flex-col gap-2">
                    <button onClick={() => handleDeleteMedia(item._id)} className="bg-red-600 text-white p-2 rounded-full"><Trash size={16} /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>
    </div>
  );
}