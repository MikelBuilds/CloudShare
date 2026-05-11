import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import { LayoutGrid, List, Clock, FolderOpen } from 'lucide-react';
import api from '../api/api';
import FileCard from '../components/FileCard';
import UploadButton from '../components/UploadButton';

export default function Dashboard() {
  const [files, setFiles] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const [filesRes, logsRes] = await Promise.all([
        api.get('/api/files'),
        api.get('/api/logs/mine')
      ]);
      setFiles(filesRes.data);
      setLogs(logsRes.data);
    } catch {
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchData(true); // silent = true because loading is already true
    }, 0);
    return () => clearTimeout(timer);
  }, [fetchData]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this file?")) return;
    try {
      await api.delete(`/api/files/${id}`);
      setFiles(files.filter(f => f.id !== id));
      toast.success("File deleted successfully");
      // Refresh logs silently
      const logsRes = await api.get('/api/logs/mine');
      setLogs(logsRes.data);
    } catch {
      toast.error("Failed to delete file");
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Your Files</h2>
          <p className="text-slate-500 mt-1">Manage and share your documents securely.</p>
        </div>
        <UploadButton onUploadSuccess={fetchData} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2 text-slate-400">
              <FolderOpen size={18} />
              <span className="text-sm font-medium">All Files ({files.length})</span>
            </div>
            <div className="flex bg-slate-100 p-1 rounded-lg">
              <button className="p-1.5 bg-white shadow-sm rounded-md text-indigo-600"><List size={16} /></button>
              <button className="p-1.5 text-slate-400 hover:text-slate-600 transition-colors"><LayoutGrid size={16} /></button>
            </div>
          </div>

          <div className="grid gap-3">
            {loading ? (
              [...Array(5)].map((_, i) => (
                <div key={i} className="h-20 bg-slate-100 animate-pulse rounded-xl border border-slate-200"></div>
              ))
            ) : files.length === 0 ? (
              <div className="text-center py-20 bg-white border border-dashed border-slate-300 rounded-2xl">
                <div className="inline-flex p-4 bg-slate-50 rounded-full text-slate-400 mb-4">
                  <FolderOpen size={48} />
                </div>
                <h3 className="text-lg font-semibold text-slate-800">No files yet</h3>
                <p className="text-slate-500 mt-1 max-w-xs mx-auto">Upload your first file to get started with CloudShare.</p>
              </div>
            ) : (
              files.map(file => <FileCard key={file.id} file={file} onDelete={handleDelete} />)
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-2 mb-6">
              <Clock size={20} className="text-indigo-600" />
              <h3 className="font-bold text-slate-800">Recent Activity</h3>
            </div>
            <div className="space-y-4">
              {loading ? (
                [...Array(4)].map((_, i) => (
                  <div key={i} className="h-12 bg-slate-50 animate-pulse rounded-lg"></div>
                ))
              ) : logs.length === 0 ? (
                <p className="text-sm text-slate-400 text-center py-4">No recent activity.</p>
              ) : (
                logs.slice(0, 8).map((log, i) => (
                  <div key={i} className="flex gap-3 text-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-2 shrink-0"></div>
                    <div>
                      <p className="text-slate-700 leading-tight">{log.action}</p>
                      <p className="text-slate-400 text-xs mt-1">{new Date(log.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}