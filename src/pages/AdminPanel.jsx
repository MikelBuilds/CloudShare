import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { Users, FileStack, Database, Activity, ShieldCheck, User } from 'lucide-react';
import api from '../api/api';

export default function AdminPanel() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminData = async () => {
      setLoading(true);
      try {
        const [statsRes, usersRes] = await Promise.all([
          api.get('/api/admin/stats'),
          api.get('/api/admin/users')
        ]);
        setStats(statsRes.data);
        setUsers(usersRes.data);
      } catch (error) {
        toast.error("Failed to load admin data");
      } finally {
        setLoading(false);
      }
    };
    fetchAdminData();
  }, []);

  const changeRole = async (userId, currentRole) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    try {
      await api.patch(`/api/admin/users/${userId}/role`, { role: newRole });
      setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
      toast.success(`Role updated to ${newRole}`);
    } catch (error) {
      toast.error("Failed to update role");
    }
  };

  if (loading) return (
    <div className="space-y-8 animate-pulse">
      <div className="h-10 w-48 bg-slate-200 rounded-lg"></div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => <div key={i} className="h-32 bg-slate-100 rounded-2xl border"></div>)}
      </div>
      <div className="h-96 bg-slate-100 rounded-2xl border"></div>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h2 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
          <ShieldCheck className="text-indigo-600" size={32} />
          Admin Dashboard
        </h2>
        <p className="text-slate-500 mt-1">Platform-wide statistics and user management.</p>
      </div>
      
      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={<Users className="text-blue-600" />} label="Total Users" value={stats.total_users} />
          <StatCard icon={<FileStack className="text-emerald-600" />} label="Total Files" value={stats.total_files} />
          <StatCard 
            icon={<Database className="text-amber-600" />} 
            label="Storage Used" 
            value={`${(stats.total_storage_bytes / (1024*1024)).toFixed(2)} MB`} 
          />
          <StatCard icon={<Activity className="text-rose-600" />} label="Total Actions" value={stats.total_actions} />
        </div>
      )}

      {/* Users Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <h3 className="font-bold text-slate-800">User Management</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">User</th>
                <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Email</th>
                <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Role</th>
                <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map(user => (
                <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
                        <User size={16} />
                      </div>
                      <span className="font-semibold text-slate-700">{user.name}</span>
                    </div>
                  </td>
                  <td className="p-4 text-slate-500">{user.email}</td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      user.role === 'admin' 
                        ? 'bg-indigo-100 text-indigo-700' 
                        : 'bg-slate-100 text-slate-600'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button 
                      onClick={() => changeRole(user.id, user.role)}
                      className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 hover:underline"
                    >
                      Toggle Role
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value }) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-slate-50 rounded-lg">{icon}</div>
        <span className="text-slate-500 text-sm font-medium">{label}</span>
      </div>
      <p className="text-3xl font-bold text-slate-900">{value}</p>
    </div>
  );
}