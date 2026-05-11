import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

export default function Layout() {
  // Get user from localStorage
  const user = JSON.parse(localStorage.getItem('user'));

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar user={user} />
      <main className="flex-1 container mx-auto px-4 py-8 max-w-7xl">
        <Outlet />
      </main>
      <footer className="py-6 text-center text-slate-500 text-sm border-t bg-white">
        © {new Date().getFullYear()} AzureCloudShare. All rights reserved.
      </footer>
    </div>
  );
}
