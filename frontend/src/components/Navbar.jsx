import { useState } from 'react';
import { Menu, X, Lock } from 'lucide-react';

export default function Navbar() {
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
            <img src="/PGRI logo.png" alt="Logo" className="h-10 w-10 object-contain"/>
            <span className="font-bold text-lg">SMP PGRI 1 CIPUTAT</span>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <button onClick={() => scrollToSection('beranda')} className="hover:text-blue-200 transition">Beranda</button>
            <button onClick={() => scrollToSection('tentang')} className="hover:text-blue-200 transition">Tentang</button>
            <button onClick={() => scrollToSection('berita')} className="hover:text-blue-200 transition">Berita</button>
            <button onClick={() => scrollToSection('sosial-media')} className="hover:text-blue-200 transition">Sosial Media</button>
            <button onClick={() => scrollToSection('kontak')} className="hover:text-blue-200 transition">Kontak</button>
           
          </div>

          <button onClick={() => setIsOpen(!isOpen)} className="md:hidden">
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {isOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <button onClick={() => scrollToSection('beranda')} className="block w-full text-left py-2 hover:text-blue-200">Beranda</button>
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