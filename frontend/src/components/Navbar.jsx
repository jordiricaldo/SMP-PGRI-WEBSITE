import { useState } from 'react';
import { Menu, X, ChevronDown } from 'lucide-react';

export default function Navbar({ kurikulumData }) {
  const [isOpen, setIsOpen] = useState(false); // Untuk Mobile Menu
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // Untuk Dropdown Kurikulum

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

          {/* DESKTOP MENU */}
          <div className="hidden md:flex items-center space-x-8">
            <button onClick={() => scrollToSection('beranda')} className="hover:text-blue-200 transition">Beranda</button>
            
            {/* DROPDOWN KURIKULUM (SISTEM KLIK) */}
            <div className="relative">
              <button 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="hover:text-blue-200 transition flex items-center gap-1 py-4 focus:outline-none"
              >
                Kurikulum 
                <ChevronDown size={16} className={`transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}/>
              </button>
              
              {isDropdownOpen && (
                <>
                  {/* Layar transparan untuk menutup menu jika klik di luar */}
                  <div className="fixed inset-0 z-10" onClick={() => setIsDropdownOpen(false)}></div>
                  
                  {/* Isi Menu */}
                  <div className="absolute left-0 mt-0 w-48 bg-white rounded-md shadow-xl py-2 text-gray-800 border-t-4 border-blue-600 z-20 animate-fade-in">
                    <a 
                      href={kurikulumData?.eraporUrl || '#'} 
                      target="_blank" rel="noreferrer"
                      className="block px-4 py-2 hover:bg-blue-50 hover:text-blue-700 transition"
                      onClick={() => setIsDropdownOpen(false)} // Tutup saat diklik
                    >
                      E-Rapor
                    </a>
                    <a 
                      href={kurikulumData?.absensiUrl || '#'} 
                      target="_blank" rel="noreferrer"
                      className="block px-4 py-2 hover:bg-blue-50 hover:text-blue-700 transition"
                      onClick={() => setIsDropdownOpen(false)} // Tutup saat diklik
                    >
                      Absensi
                    </a>
                  </div>
                </>
              )}
            </div>

            <button onClick={() => scrollToSection('tentang')} className="hover:text-blue-200 transition">Tentang</button>
            <button onClick={() => scrollToSection('berita')} className="hover:text-blue-200 transition">Berita</button>
            <button onClick={() => scrollToSection('sosial-media')} className="hover:text-blue-200 transition">Sosial Media</button>
            <button onClick={() => scrollToSection('kontak')} className="hover:text-blue-200 transition">Kontak</button>
          </div>

          {/* Tombol Menu Mobile */}
          <button onClick={() => setIsOpen(!isOpen)} className="md:hidden">
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* MOBILE MENU */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-2 bg-blue-800 p-4 rounded-b-lg">
            <button onClick={() => scrollToSection('beranda')} className="block w-full text-left py-2 hover:text-blue-200">Beranda</button>
            
            {/* Kurikulum Mobile */}
            <div className="border-l-2 border-blue-600 ml-2 pl-2 my-2">
              <p className="text-blue-300 text-sm mb-1 uppercase font-bold">Kurikulum</p>
              <a href={kurikulumData?.eraporUrl || '#'} target="_blank" rel="noreferrer" className="block w-full text-left py-1 hover:text-blue-200">E-Rapor</a>
              <a href={kurikulumData?.absensiUrl || '#'} target="_blank" rel="noreferrer" className="block w-full text-left py-1 hover:text-blue-200">Absensi</a>
            </div>

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