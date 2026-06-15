"use client";

import React from "react";

interface VideoPlayerProps {
  src?: string | null;
  url?: string | null;
  title?: string;
}

function getEmbedUrl(url: string): string | null {
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes("youtube.com") || parsed.hostname.includes("youtu.be")) {
      const videoId = parsed.hostname.includes("youtu.be")
        ? parsed.pathname.slice(1)
        : parsed.searchParams.get("v");
      if (videoId) return `https://www.youtube.com/embed/${videoId}`;
    }
    if (parsed.hostname.includes("vimeo.com")) {
      const videoId = parsed.pathname.split("/").filter(Boolean).pop();
      if (videoId) return `https://player.vimeo.com/video/${videoId}`;
    }
    return url;
  } catch {
    return null;
  }
}

export function VideoPlayer({ src, url, title }: VideoPlayerProps) {
  if (src) {
    return (
      <div className="card-base p-4 md:p-6">
        {title && (
          <h3 className="font-scheherazade text-xl text-karbala-gold mb-4">{title}</h3>
        )}
        <video
          controls
          className="w-full rounded-lg aspect-video bg-black"
          preload="metadata"
        >
          <source src={src} />
          متصفحك لا يدعم تشغيل الفيديو.
        </video>
      </div>
    );
  }

  if (url) {
    const embedUrl = getEmbedUrl(url);
    if (!embedUrl) return null;

    return (
      <div className="card-base p-4 md:p-6">
        {title && (
          <h3 className="font-scheherazade text-xl text-karbala-gold mb-4">{title}</h3>
        )}
        <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-black">
          <iframe
            src={embedUrl}
            title={title || "فيديو المحاضرة"}
            className="absolute inset-0 w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
    );
  }

  return null;
}
