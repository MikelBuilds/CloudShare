import { Download, Trash2, Share2, FileText, Image as ImageIcon, Video, Music, File as FileIcon } from 'lucide-react';
import { toast } from 'react-hot-toast';
import api, { API_BASE_URL } from '../api/api';

const getFileIcon = (filename) => {
  const ext = filename.split('.').pop().toLowerCase();
  if (['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'].includes(ext)) return <ImageIcon className="text-pink-500" />;
  if (['mp4', 'mov', 'avi', 'mkv'].includes(ext)) return <Video className="text-purple-500" />;
  if (['mp3', 'wav', 'ogg'].includes(ext)) return <Music className="text-amber-500" />;
  if (['pdf', 'doc', 'docx', 'txt', 'md'].includes(ext)) return <FileText className="text-blue-500" />;
  return <FileIcon className="text-slate-400" />;
};

export default function FileCard({ file, onDelete }) {
  const formatSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const handleDownload = async () => {
    try {
      window.open(`${API_BASE_URL}/api/files/download/${file.id}`, '_blank');
      toast.success('Starting download...');
    } catch {
      toast.error("Download failed");
    }
  };

  const handleShare = async () => {
    try {
      const res = await api.post(`/api/files/share/${file.id}`);
      await navigator.clipboard.writeText(res.data.shareLink);
      toast.success('Share link copied to clipboard!');
    } catch {
      toast.error("Failed to generate share link");
    }
  };

  return (
    <div className="group bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <div className="p-3 bg-slate-50 rounded-lg group-hover:bg-indigo-50 transition-colors">
          {getFileIcon(file.original_name)}
        </div>
        <div>
          <p className="font-semibold text-slate-800 truncate max-w-[200px] md:max-w-xs" title={file.original_name}>
            {file.original_name}
          </p>
          <p className="text-xs text-slate-500 mt-1 flex items-center gap-2">
            <span>{formatSize(file.file_size)}</span>
            <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
            <span>{new Date(file.uploaded_at).toLocaleDateString()}</span>
          </p>
        </div>
      </div>
      
      <div className="flex items-center space-x-1">
        <button 
          onClick={handleShare} 
          className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
          title="Share Link"
        >
          <Share2 size={18} />
        </button>
        <button 
          onClick={handleDownload} 
          className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
          title="Download"
        >
          <Download size={18} />
        </button>
        <button 
          onClick={() => onDelete(file.id)} 
          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          title="Delete"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
}