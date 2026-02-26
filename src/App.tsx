import React, { useState, useRef, useEffect } from 'react';
import { VideoItem } from './types';
import { VideoCard } from './components/VideoCard';
import { UploadOverlay } from './components/UploadOverlay';
import { Plus, Home, Search, MessageSquare, User } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    if (!containerRef.current) return;
    const scrollPos = containerRef.current.scrollTop;
    const height = containerRef.current.clientHeight;
    const index = Math.round(scrollPos / height);
    if (index !== activeIndex) {
      setActiveIndex(index);
    }
  };

  const addVideos = (newVideos: VideoItem[]) => {
    setVideos(prev => [...prev, ...newVideos]);
  };

  const resetVideos = () => {
    setVideos([]);
    setActiveIndex(0);
  };

  // Preload logic: We only render the current, previous, and next video to save memory
  const visibleVideos = videos.slice(
    Math.max(0, activeIndex - 1),
    Math.min(videos.length, activeIndex + 2)
  );

  return (
    <div className="h-screen w-screen bg-black overflow-hidden flex flex-col font-sans text-white">
      <AnimatePresence>
        {videos.length === 0 && (
          <UploadOverlay onVideosSelected={addVideos} />
        )}
      </AnimatePresence>

      {/* Main Feed */}
      <div 
        ref={containerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-scroll snap-y snap-mandatory scrollbar-hide"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {videos.map((video, index) => {
          // Optimization: Only render if within range of activeIndex
          const isVisible = Math.abs(index - activeIndex) <= 1;
          
          return (
            <div key={video.id} className="h-full w-full snap-start">
              {isVisible ? (
                <VideoCard 
                  video={video} 
                  isActive={index === activeIndex} 
                />
              ) : (
                <div className="h-full w-full bg-black flex items-center justify-center">
                  <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Navigation Bar (TikTok Style) */}
      {videos.length > 0 && (
        <div className="h-16 bg-black border-t border-white/10 flex items-center justify-around px-2 pb-safe">
          <button className="flex flex-col items-center gap-1 opacity-100">
            <Home className="w-6 h-6" />
            <span className="text-[10px] font-medium">Home</span>
          </button>
          <button className="flex flex-col items-center gap-1 opacity-60 hover:opacity-100 transition-opacity">
            <Search className="w-6 h-6" />
            <span className="text-[10px] font-medium">Discover</span>
          </button>
          <button 
            onClick={resetVideos}
            className="relative flex items-center justify-center"
          >
            <div className="absolute w-11 h-7 bg-cyan-400 rounded-lg -left-1" />
            <div className="absolute w-11 h-7 bg-rose-500 rounded-lg -right-1" />
            <div className="relative w-11 h-7 bg-white rounded-lg flex items-center justify-center">
              <Plus className="w-6 h-6 text-black" />
            </div>
          </button>
          <button className="flex flex-col items-center gap-1 opacity-60 hover:opacity-100 transition-opacity">
            <MessageSquare className="w-6 h-6" />
            <span className="text-[10px] font-medium">Inbox</span>
          </button>
          <button className="flex flex-col items-center gap-1 opacity-60 hover:opacity-100 transition-opacity">
            <User className="w-6 h-6" />
            <span className="text-[10px] font-medium">Profile</span>
          </button>
        </div>
      )}
    </div>
  );
}
