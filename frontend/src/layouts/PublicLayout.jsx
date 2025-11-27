import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Navbar selalu ada di atas */}
      <Navbar isAdmin={false} />
      
      {/* Outlet adalah tempat konten halaman (Beranda, Login, dll) berubah-ubah */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Footer selalu ada di bawah */}
      <Footer />
    </div>
  );
}