// frontend/src/layouts/PublicLayout.jsx
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function PublicLayout({ kurikulumData }) {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar isAdmin={false} kurikulumData={kurikulumData} />
      
      <main className="flex-grow">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}