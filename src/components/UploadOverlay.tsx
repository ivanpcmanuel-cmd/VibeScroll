import React, { useState, useCallback } from 'react';
import { Upload, Video, X } from 'lucide-react';
import { motion } from 'motion/react';
import { VideoItem } from '@/src/types';

interface UploadOverlayProps {
  onVideosSelected: (videos: VideoItem[]) => void;
}

export const UploadOverlay: React.FC<UploadOverlayProps> = ({ onVideosSelected }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleFiles = useCallback((files: FileList | null) => {
    if (!files) return;

    const newVideos: VideoItem[] = Array.from(files)
      .filter(file => file.type.startsWith('video/'))
      .map(file => ({
        id: Math.random().toString(36).substr(2, 9),
        url: URL.createObjectURL(file),
        file: file,
        title: file.name.split('.')[0],
        author: 'LocalUser',
        likes: Math.floor(Math.random() * 10000),
        comments: Math.floor(Math.random() * 500),
        shares: Math.floor(Math.random() * 200),
      }));

    onVideosSelected(newVideos);
  }, [onVideosSelected]);

  return (
    <div className="fixed inset-0 z-50 bg-zinc-950 flex flex-items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full text-center"
      >
        <div className="mb-8">
          <div className="w-20 h-20 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl shadow-indigo-500/20">
            <Video className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">VibeScroll</h1>
          <p className="text-zinc-400">Transform your gallery into a viral feed.</p>
        </div>

        <label 
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => { e.preventDefault(); setIsDragging(false); handleFiles(e.dataTransfer.files); }}
          className={`
            relative group cursor-pointer block p-12 border-2 border-dashed rounded-3xl transition-all duration-300
            ${isDragging ? 'border-indigo-500 bg-indigo-500/10 scale-105' : 'border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900/50'}
          `}
        >
          <input 
            type="file" 
            multiple 
            accept="video/*" 
            className="hidden" 
            onChange={(e) => handleFiles(e.target.files)}
          />
          <Upload className={`w-12 h-12 mx-auto mb-4 transition-colors ${isDragging ? 'text-indigo-400' : 'text-zinc-500 group-hover:text-zinc-400'}`} />
          <p className="text-white font-medium mb-1">Select or Drop Videos</p>
          <p className="text-zinc-500 text-sm">MP4, WebM or MOV</p>
        </label>

        <div className="mt-12 grid grid-cols-2 gap-4 text-left">
          <div className="p-4 rounded-2xl bg-zinc-900/50 border border-zinc-800">
            <h4 className="text-zinc-300 text-xs font-bold uppercase tracking-wider mb-1">Performance</h4>
            <p className="text-zinc-500 text-xs">Virtualized rendering for smooth scrolling.</p>
          </div>
          <div className="p-4 rounded-2xl bg-zinc-900/50 border border-zinc-800">
            <h4 className="text-zinc-300 text-xs font-bold uppercase tracking-wider mb-1">Privacy</h4>
            <p className="text-zinc-500 text-xs">Videos stay on your device. No cloud upload.</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
