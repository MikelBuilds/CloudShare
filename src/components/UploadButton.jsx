import { useState, useRef } from 'react';
import { UploadCloud, X, File, CheckCircle2, AlertCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '../api/api';

export default function UploadButton({ onUploadSuccess }) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileSelect = (e) => {
    const files = e.target.files || e.dataTransfer.files;
    if (files.length > 0) {
      uploadFile(files[0]);
    }
  };

  const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    setUploading(true);
    setProgress(0);
    setShowModal(true);

    try {
      await api.post('/api/files/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setProgress(percentCompleted);
        }
      });
      toast.success(`${file.name} uploaded successfully!`);
      onUploadSuccess();
      setTimeout(() => setShowModal(false), 1500);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Upload failed');
      setUploading(false);
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const onDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => {
    setIsDragging(false);
  };

  const onDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e);
  };

  return (
    <>
      <div 
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
      >
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileSelect} 
          className="hidden" 
        />
        <button 
          onClick={() => fileInputRef.current.click()}
          className={`btn-primary flex items-center gap-2 px-6 py-2.5 shadow-lg shadow-indigo-100 ring-2 ring-transparent hover:ring-indigo-100 transition-all ${isDragging ? 'scale-105 ring-indigo-400 bg-indigo-700' : ''}`}
        >
          <UploadCloud size={20} />
          <span className="font-semibold">Upload File</span>
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-100 scale-in-center">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-slate-800">Uploading File</h3>
                {!uploading && (
                  <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                    <X size={20} />
                  </button>
                )}
              </div>

              <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl mb-6">
                <div className="p-2 bg-white rounded-lg border border-slate-200 text-indigo-600">
                  <File size={24} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-700 truncate">
                    {fileInputRef.current?.files[0]?.name || 'Preparing file...'}
                  </p>
                  <p className="text-xs text-slate-400">
                    {progress === 100 ? 'Processing...' : `${progress}% uploaded`}
                  </p>
                </div>
                {progress === 100 && !uploading && (
                  <CheckCircle2 className="text-emerald-500" size={20} />
                )}
              </div>

              <div className="relative h-2 bg-slate-100 rounded-full overflow-hidden mb-2">
                <div 
                  className="absolute top-0 left-0 h-full bg-indigo-600 transition-all duration-300 ease-out"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              
              <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-slate-400">
                <span>0%</span>
                <span>100%</span>
              </div>
            </div>

            <div className="px-6 py-4 bg-slate-50 border-t flex justify-end">
              <button 
                disabled={uploading}
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-800 disabled:opacity-50"
              >
                {progress === 100 ? 'Close' : 'Cancel'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
