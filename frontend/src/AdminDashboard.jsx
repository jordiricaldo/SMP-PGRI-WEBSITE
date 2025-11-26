// frontend/src/AdminDashboard.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Trash, Plus, Save } from 'lucide-react';
import api from './services/api';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('social'); // 'social' | 'news'
  
  // Data States
  const [socialData, setSocialData] = useState({});
  const [newsList, setNewsList] = useState([]);
  
  // Form States
  const [newsForm, setNewsForm] = useState({ title: '', content: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const socialRes = await api.school.getSocialMediaData();
      setSocialData(socialRes.data);
      const newsRes = await api.news.getAllNews();
      setNewsList(newsRes.data);
    } catch (error) {
      if (error.message.includes('401')) handleLogout();
    }
  };

  const handleLogout = () => {
    api.auth.logout();
    navigate('/login');
  };

  // --- Logic Social Media ---
  const handleSocialUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.school.updateSocialMediaData(socialData);
      alert('Sosial Media berhasil diupdate!');
    } catch (err) {
      alert('Gagal update: ' + err.message);
    }
    setLoading(false);
  };

  // --- Logic Berita ---
  const handleAddNews = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.news.createNews(newsForm);
      setNewsForm({ title: '', content: '' }); // Reset form
      fetchData(); // Refresh list
      alert('Berita berhasil ditambahkan!');
    } catch (err) {
      alert('Gagal tambah berita: ' + err.message);
    }
    setLoading(false);
  };

  const handleDeleteNews = async (id) => {
    if(!confirm('Yakin hapus berita ini?')) return;
    try {
      await api.news.deleteNews(id);
      fetchData();
    } catch (err) {
      alert('Gagal hapus: ' + err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-blue-900 text-white p-6">
        <h2 className="text-2xl font-bold mb-8">Admin Panel</h2>
        <nav className="space-y-4">
          <button 
            onClick={() => setActiveTab('social')}
            className={`w-full text-left p-3 rounded ${activeTab === 'social' ? 'bg-blue-700' : 'hover:bg-blue-800'}`}
          >
            Sosial Media & Info
          </button>
          <button 
            onClick={() => setActiveTab('news')}
            className={`w-full text-left p-3 rounded ${activeTab === 'news' ? 'bg-blue-700' : 'hover:bg-blue-800'}`}
          >
            Kelola Berita
          </button>
          <button 
            onClick={handleLogout}
            className="w-full text-left p-3 rounded bg-red-600 hover:bg-red-700 mt-8 flex items-center gap-2"
          >
            <LogOut size={18} /> Logout
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        {activeTab === 'social' && (
          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="text-xl font-bold mb-4">Edit Data Sekolah & Sosmed</h3>
            <form onSubmit={handleSocialUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-bold mb-1">Youtube URL</label>
                <input 
                  className="w-full border p-2 rounded" 
                  value={socialData.youtubeUrl || ''}
                  onChange={e => setSocialData({...socialData, youtubeUrl: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-1">Instagram Username</label>
                <input 
                  className="w-full border p-2 rounded" 
                  value={socialData.instagramUsername || ''}
                  onChange={e => setSocialData({...socialData, instagramUsername: e.target.value})}
                />
              </div>
              <button disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-2">
                <Save size={18} /> {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
              </button>
            </form>
          </div>
        )}

        {activeTab === 'news' && (
          <div className="space-y-8">
            {/* Form Tambah Berita */}
            <div className="bg-white p-6 rounded-xl shadow">
              <h3 className="text-xl font-bold mb-4">Tambah Berita Baru</h3>
              <form onSubmit={handleAddNews} className="space-y-4">
                <input 
                  className="w-full border p-2 rounded" 
                  placeholder="Judul Berita"
                  value={newsForm.title}
                  onChange={e => setNewsForm({...newsForm, title: e.target.value})}
                  required
                />
                <textarea 
                  className="w-full border p-2 rounded h-32" 
                  placeholder="Isi Berita..."
                  value={newsForm.content}
                  onChange={e => setNewsForm({...newsForm, content: e.target.value})}
                  required
                />
                <button disabled={loading} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 flex items-center gap-2">
                  <Plus size={18} /> {loading ? 'Menyimpan...' : 'Posting Berita'}
                </button>
              </form>
            </div>

            {/* List Berita */}
            <div className="bg-white p-6 rounded-xl shadow">
              <h3 className="text-xl font-bold mb-4">Daftar Berita ({newsList.length})</h3>
              <div className="space-y-4">
                {newsList.map(news => (
                  <div key={news._id} className="border-b pb-4 flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-lg">{news.title}</h4>
                      <p className="text-gray-600 text-sm truncate max-w-xl">{news.content}</p>
                      <span className="text-xs text-gray-400">{new Date(news.createdAt).toLocaleDateString()}</span>
                    </div>
                    <button 
                      onClick={() => handleDeleteNews(news._id)}
                      className="text-red-500 hover:text-red-700 p-2"
                    >
                      <Trash size={18} />
                    </button>
                  </div>
                ))}
                {newsList.length === 0 && <p className="text-gray-500">Belum ada berita.</p>}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}