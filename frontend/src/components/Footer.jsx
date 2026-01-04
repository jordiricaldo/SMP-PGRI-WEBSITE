export default function Footer() {
    const ModernFooter = () => (
    <footer className="bg-gray-900 text-white pt-20 pb-10 rounded-t-[3rem] mt-12">
      <div className="max-w-7xl mx-auto px-8 grid md:grid-cols-4 gap-12 mb-16">
        <div className="col-span-2">
          <div className="flex items-center gap-3 mb-6">
            <img src="/PGRI logo.png" className="w-10 h-10 brightness-200 grayscale"/>
            <h3 className="text-2xl font-bold">SMP PGRI 1 CIPUTAT</h3>
          </div>
          <p className="text-gray-400 leading-relaxed max-w-sm mb-8">
            Membangun karakter siswa yang cerdas, berakhlak mulia, dan siap menghadapi tantangan masa depan.
          </p>
          <div className="flex gap-4">
            <a href={socialData?.youtubeUrl} target="_blank" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-red-600 transition"><Youtube size={18}/></a>
            <a href={`https://instagram.com/${socialData?.instagramUsername}`} target="_blank" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-pink-600 transition"><Camera size={18}/></a>
          </div>
        </div>

        <div>
          <h4 className="font-bold text-lg mb-6">Navigasi</h4>
          <ul className="space-y-4 text-gray-400 text-sm">
            <li><button onClick={() => document.getElementById('beranda')?.scrollIntoView({behavior: 'smooth'})} className="hover:text-white transition">Beranda</button></li>
            <li><button onClick={() => document.getElementById('tentang')?.scrollIntoView({behavior: 'smooth'})} className="hover:text-white transition">Profil Sekolah</button></li>
            <li><button onClick={() => document.getElementById('berita')?.scrollIntoView({behavior: 'smooth'})} className="hover:text-white transition">Berita Terkini</button></li>
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
  )
}