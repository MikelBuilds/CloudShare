import { Link, useNavigate } from 'react-router-dom';
import { LogOut, Shield, HardDrive, User } from 'lucide-react';

export default function Navbar({ user }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav className="bg-white border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link to="/dashboard" className="flex items-center gap-2">
              <div className="bg-indigo-600 p-1.5 rounded-lg text-white">
                <HardDrive size={22} />
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">
                CloudShare
              </span>
            </Link>
            <div className="hidden md:flex items-center space-x-4">
              <Link to="/dashboard" className="text-slate-600 hover:text-indigo-600 font-medium transition-colors">
                Dashboard
              </Link>
              {user?.role === 'admin' && (
                <Link to="/admin" className="text-slate-600 hover:text-indigo-600 font-medium flex items-center gap-1.5 transition-colors">
                  <Shield size={16} /> Admin Panel
                </Link>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-6">
            <div className="hidden sm:flex items-center gap-2 text-slate-600">
              <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 border border-slate-200">
                <User size={16} />
              </div>
              <span className="text-sm font-medium">{user?.name}</span>
            </div>
            <button 
              onClick={handleLogout} 
              className="flex items-center gap-2 text-slate-500 hover:text-red-600 text-sm font-medium transition-colors"
            >
              <LogOut size={16} /> 
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}