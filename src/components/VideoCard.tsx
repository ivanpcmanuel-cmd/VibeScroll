import React, { useRef, useEffect, useState } from 'react';
import { Heart, MessageCircle, Share2, Music2, Play, Pause } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/src/lib/utils';
import { VideoItem } from '@/src/types';

interface VideoCardProps {
  video: VideoItem;
  isActive: boolean;
}

export const VideoCard: React.FC<VideoCardProps> = ({ video, isActive }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showHeart, setShowHeart] = useState(false);
  const [heartPos, setHeartPos] = useState({ x: 0, y: 0 });
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    if (isActive) {
      videoRef.current?.play().catch(() => {
        // Autoplay might be blocked by browser until user interaction
        setIsPlaying(false);
      });
      setIsPlaying(true);
    } else {
      videoRef.current?.pause();
      if (videoRef.current) videoRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  }, [isActive]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setHeartPos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
    setShowHeart(true);
    setIsLiked(true);
    setTimeout(() => setShowHeart(false), 800);
  };

  return (
    <div 
      className="relative h-full w-full bg-black snap-start overflow-hidden flex items-center justify-center"
      onDoubleClick={handleDoubleClick}
    >
      <video
        ref={videoRef}
        src={video.url}
        className="h-full w-full object-contain"
        loop
        playsInline
        onClick={togglePlay}
      />

      {/* Play/Pause Overlay Indicator */}
      <AnimatePresence>
        {!isPlaying && (
          <motion.div 
            initial={{ opacity: 0, scale: 1.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.5 }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
          >
            <div className="bg-black/20 p-6 rounded-full backdrop-blur-sm">
              <Play className="w-12 h-12 text-white fill-white" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Double Tap Heart Animation */}
      <AnimatePresence>
        {showHeart && (
          <motion.div
            initial={{ scale: 0, opacity: 0, rotate: -20 }}
            animate={{ scale: 1.5, opacity: 1, rotate: 0 }}
            exit={{ scale: 2, opacity: 0 }}
            style={{ left: heartPos.x - 50, top: heartPos.y - 50 }}
            className="absolute pointer-events-none z-50"
          >
            <Heart className="w-24 h-24 text-red-500 fill-red-500 drop-shadow-lg" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Right Sidebar Actions */}
      <div className="absolute right-4 bottom-24 flex flex-col items-center gap-6 z-10">
        <div className="flex flex-col items-center gap-1">
          <div className="w-12 h-12 rounded-full border-2 border-white overflow-hidden bg-zinc-800 mb-2">
            <img 
              src={`https://picsum.photos/seed/${video.id}/100/100`} 
              alt="avatar" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <button 
            onClick={(e) => { e.stopPropagation(); setIsLiked(!isLiked); }}
            className="group"
          >
            <Heart className={cn("w-8 h-8 transition-colors", isLiked ? "text-red-500 fill-red-500" : "text-white")} />
          </button>
          <span className="text-white text-xs font-semibold">{video.likes + (isLiked ? 1 : 0)}</span>
        </div>

        <div className="flex flex-col items-center gap-1">
          <MessageCircle className="w-8 h-8 text-white fill-none" />
          <span className="text-white text-xs font-semibold">{video.comments}</span>
        </div>

        <div className="flex flex-col items-center gap-1">
          <Share2 className="w-8 h-8 text-white fill-none" />
          <span className="text-white text-xs font-semibold">{video.shares}</span>
        </div>

        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          className="w-10 h-10 rounded-full bg-zinc-800 border-4 border-zinc-700 flex items-center justify-center mt-4"
        >
          <Music2 className="w-5 h-5 text-white" />
        </motion.div>
      </div>

      {/* Bottom Info */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent pt-20">
        <h3 className="text-white font-bold text-lg mb-1">@{video.author}</h3>
        <p className="text-white text-sm mb-3 line-clamp-2">{video.title}</p>
        <div className="flex items-center gap-2">
          <Music2 className="w-4 h-4 text-white" />
          <marquee className="text-white text-sm w-40">Original Sound - {video.author}</marquee>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 h-0.5 bg-white/30 w-full">
        <motion.div 
          className="h-full bg-white"
          initial={{ width: "0%" }}
          animate={isActive ? { width: "100%" } : { width: "0%" }}
          transition={isActive ? { duration: videoRef.current?.duration || 10, ease: "linear" } : { duration: 0 }}
        />
      </div>
    </div>
  );
};
