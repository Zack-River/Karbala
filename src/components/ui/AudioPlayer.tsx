"use client";

import React, { useState, useRef, useEffect } from "react";

interface AudioPlayerProps {
  src: string;
  title: string;
}

export function AudioPlayer({ src, title }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const setAudioData = () => {
      setDuration(audio.duration);
    };

    const setAudioTime = () => {
      setCurrentTime(audio.currentTime);
    };

    audio.addEventListener("loadedmetadata", setAudioData);
    audio.addEventListener("timeupdate", setAudioTime);

    return () => {
      audio.removeEventListener("loadedmetadata", setAudioData);
      audio.removeEventListener("timeupdate", setAudioTime);
    };
  }, []);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return "00:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressRef.current || !audioRef.current) return;
    const rect = progressRef.current.getBoundingClientRect();
    
    // Check if RTL
    const isRtl = window.getComputedStyle(progressRef.current).direction === "rtl";
    
    const x = e.clientX - rect.left;
    let percentage = x / rect.width;

    if (isRtl) {
       // In RTL, 0 is on the right, so we invert the percentage
       percentage = 1 - percentage;
    }

    audioRef.current.currentTime = percentage * duration;
  };

  return (
    <div className="card-base p-6 flex flex-col md:flex-row items-center gap-6">
      <audio ref={audioRef} src={src} preload="metadata" />

      {/* Play/Pause Button */}
      <button
        onClick={togglePlay}
        className="w-14 h-14 rounded-full border border-karbala-gold flex items-center justify-center text-karbala-gold hover:bg-[rgba(212,185,138,0.1)] hover:scale-105 transition-all shrink-0"
        aria-label={isPlaying ? "إيقاف" : "تشغيل"}
      >
        {isPlaying ? (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <rect x="6" y="4" width="4" height="16" />
            <rect x="14" y="4" width="4" height="16" />
          </svg>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="ml-1 rtl:mr-1 rtl:ml-0">
            <polygon points="5 3 19 12 5 21 5 3" />
          </svg>
        )}
      </button>

      {/* Info & Progress */}
      <div className="flex-1 w-full">
        <div className="flex justify-between items-center mb-2">
          <h4 className="font-kufi text-karbala-gold-light text-sm md:text-base">
            {title}
          </h4>
          <span className="font-kufi text-karbala-gray text-xs">
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>
        </div>

        {/* Progress Bar */}
        <div
          ref={progressRef}
          onClick={handleProgressClick}
          className="h-2 w-full bg-[rgba(212,185,138,0.1)] rounded-full cursor-pointer overflow-hidden flex rtl:flex-row-reverse relative"
        >
          <div
            className="h-full bg-gradient-to-r from-karbala-gold-dark to-karbala-gold transition-all duration-100 absolute ltr:left-0 rtl:right-0"
            style={{ width: `${(currentTime / duration) * 100 || 0}%` }}
          />
        </div>
      </div>
    </div>
  );
}
