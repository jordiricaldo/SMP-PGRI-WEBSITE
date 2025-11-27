import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Trash, Plus, Save, Image as ImageIcon, BookOpen } from 'lucide-react';
import api from './services/api';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('about'); // Default ke About
  const [loading, setLoading] = useState(false);
  
  // Data States
  const [aboutData, setAboutData] = useState({ deskripsi: '', visi: '', misi: '', prestasi: '' });
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
      const [aboutRes, socialRes, newsRes, galleryRes] = await Promise.all([
        api.school.getAboutData(),
        api.school.getSocialMediaData(),
        api.news.getAllNews(),
        api.gallery.getGallery()
      ]);
      setAboutData(aboutRes.data);
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

  const convertDriveLink = (url) => {
    if (!url) return '';
    if (url.includes('drive.google.com') && url.includes('/d/')) {
      const id = url.split('/d/')[1].split('/')[0];
      return `https://drive.google.com/uc?export=view&id=${id}`;
    }
    return url;
  };

  // HANDLERS
  const handleAboutUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.school.updateAboutData(aboutData);
      alert('Profil Sekolah berhasil diupdate!');
    } catch (err) { alert(err.message); }
    setLoading(false);
  };

  const handleSocialUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.school.updateSocialMediaData(socialData);
      alert('Sosial Media berhasil diupdate!');
    } catch (err) { alert(err.message); }
    setLoading(false);
  };

  const handleAddNews = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const finalData = { ...newsForm, image: convertDriveLink(newsForm.image) };
      await api.news.createNews(finalData);
      setNewsForm({ title: '', content: '', image: '' });
      fetchData();
      alert('Berita sukses!');
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
      const finalUrl = convertDriveLink(galleryForm.mediaUrl);
      await api.gallery.addPhoto({
        mediaUrl: finalUrl,
        caption: galleryForm.caption,
        type: 'image',
        igLink: ''
      });
      setGalleryForm({ mediaUrl: '', caption: '' }); 
      fetchData();
      alert('Foto berhasil ditambahkan!');
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
          <button onClick={() => setActiveTab('about')} className={`w-full text-left p-3 rounded transition ${activeTab === 'about' ? 'bg-blue-700 font-bold' : 'hover:bg-blue-800'}`}>Profil Sekolah</button>
          <button onClick={() => setActiveTab('social')} className={`w-full text-left p-3 rounded transition ${activeTab === 'social' ? 'bg-blue-700 font-bold' : 'hover:bg-blue-800'}`}>Sosial Media</button>
          <button onClick={() => setActiveTab('news')} className={`w-full text-left p-3 rounded transition ${activeTab === 'news' ? 'bg-blue-700 font-bold' : 'hover:bg-blue-800'}`}>Berita</button>
          <button onClick={() => setActiveTab('gallery')} className={`w-full text-left p-3 rounded transition ${activeTab === 'gallery' ? 'bg-blue-700 font-bold' : 'hover:bg-blue-800'}`}>Galeri</button>
        </nav>
        <button onClick={handleLogout} className="w-full text-left p-3 rounded bg-red-600 hover:bg-red-700 mt-auto flex items-center gap-2"><LogOut size={18} /> Logout</button>
      </aside>

      <main className="flex-1 p-8 ml-64">
        
        {/* TAB 1: PROFIL SEKOLAH (BARU) */}
        {activeTab === 'about' && (
          <div className="bg-white p-6 rounded-xl shadow max-w-3xl">
            <h3 className="text-xl font-bold mb-6 border-b pb-4 flex items-center gap-2"><BookOpen/> Edit Profil Sekolah</h3>
            <form onSubmit={handleAboutUpdate} className="space-y-6">
              <div>
                <label className="block font-bold mb-2 text-gray-700">Deskripsi Profil Sekolah (Paragraf)</label>
                <textarea 
                  className="w-full border p-3 rounded h-48 focus:ring-2 focus:ring-blue-500 outline-none" 
                  placeholder="Tulis profil lengkap sekolah di sini..."
                  value={aboutData.deskripsi || ''}
                  onChange={e => setAboutData({...aboutData, deskripsi: e.target.value})}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold mb-2 text-gray-700">Visi</label>
                  <textarea className="w-full border p-2 rounded h-24" value={aboutData.visi} onChange={e => setAboutData({...aboutData, visi: e.target.value})} />
                </div>
                <div>
                  <label className="block font-bold mb-2 text-gray-700">Misi</label>
                  <textarea className="w-full border p-2 rounded h-24" value={aboutData.misi} onChange={e => setAboutData({...aboutData, misi: e.target.value})} />
                </div>
              </div>

              <button disabled={loading} className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 flex items-center gap-2"><Save size={18} /> Simpan Perubahan</button>
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
                <input className="w-full border p-2 rounded" placeholder="URL Gambar (Bisa Google Drive)" value={newsForm.image || ''} onChange={e => setNewsForm({...newsForm, image: e.target.value})} />
                <textarea className="w-full border p-2 rounded h-32" placeholder="Isi Berita" value={newsForm.content} onChange={e => setNewsForm({...newsForm, content: e.target.value})} required />
                <button disabled={loading} className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 flex items-center gap-2"><Plus size={18} /> Posting</button>
              </form>
            </div>
            <div className="bg-white p-6 rounded-xl shadow space-y-4">
              {newsList.map(news => (
                <div key={news._id} className="border p-4 rounded flex gap-4 items-center justify-between">
                  <div><h4 className="font-bold">{news.title}</h4><span className="text-xs text-gray-400">{new Date(news.createdAt).toLocaleDateString()}</span></div>
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
              <div>
                <label className="block text-xs font-bold text-purple-800 mb-1 uppercase">Link Foto</label>
                <input className="w-full border p-2 rounded" placeholder="Paste Link Google Drive / Imgur..." value={galleryForm.mediaUrl} onChange={e => setGalleryForm({...galleryForm, mediaUrl: e.target.value})} required />
              </div>
              <div className="flex gap-4 pt-2">
                <input className="flex-1 border p-2 rounded" placeholder="Caption singkat..." value={galleryForm.caption} onChange={e => setGalleryForm({...galleryForm, caption: e.target.value})} />
                <button disabled={loading} className="bg-purple-600 text-white px-8 rounded hover:bg-purple-700 font-bold">Upload</button>
              </div>
            </form>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {galleryList.map(item => (
                <div key={item._id} className="relative group rounded-lg overflow-hidden border bg-gray-100 aspect-square">
                  <img src={item.mediaUrl} className="w-full h-full object-cover" alt="Gallery" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center flex-col gap-2">
                    <button onClick={() => handleDeleteMedia(item._id)} className="bg-red-600 text-white p-2 rounded-full"><Trash size={16} /></button>
                  </div>
                  {item.caption && <div className="absolute bottom-0 w-full bg-black/70 text-white text-xs p-1 text-center truncate">{item.caption}</div>}
                </div>
              ))}
            </div>
          </div>
        )}

      </main>
    </div>
  );
}