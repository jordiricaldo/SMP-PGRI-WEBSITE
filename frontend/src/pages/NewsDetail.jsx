// frontend/src/pages/NewsDetail.jsx
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, User } from 'lucide-react';
import api from '../services/api';

export default function NewsDetail() {
  const { id } = useParams(); // Mengambil ID dari URL
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.news.getNewsById(id)
      .then(res => {
        setNews(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Memuat berita...</div>;
  if (!news) return <div className="min-h-screen flex items-center justify-center">Berita tidak ditemukan</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* Tombol Kembali */}
      <Link to="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6 transition">
        <ArrowLeft size={20} className="mr-2" /> Kembali ke Beranda
      </Link>

      <article className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        {/* Gambar Full */}
        {news.image && (
          <img 
            src={news.image} 
            alt={news.title} 
            className="w-full h-[400px] object-cover"
          />
        )}

        <div className="p-8 md:p-12">
          {/* Judul */}
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
            {news.title}
          </h1>

          {/* Info Meta (Tanggal) */}
          <div className="flex items-center gap-6 text-gray-500 text-sm mb-8 border-b pb-8">
            <div className="flex items-center gap-2">
              <Calendar size={16} />
              {new Date(news.createdAt).toLocaleDateString('id-ID', {
                day: 'numeric', month: 'long', year: 'numeric'
              })}
            </div>
          </div>

          {/* Isi Berita (Content) */}
          <div className="prose max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap text-lg">
            {news.content}
          </div>
        </div>
      </article>
    </div>
  );
}