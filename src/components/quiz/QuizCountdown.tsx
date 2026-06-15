"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface QuizCountdownProps {
  opensAt: string;
}

function getTimeRemaining(opensAt: string) {
  const diff = new Date(opensAt).getTime() - Date.now();
  if (diff <= 0) return null;

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  return { days, hours, minutes, seconds };
}

export function QuizCountdown({ opensAt }: QuizCountdownProps) {
  const [remaining, setRemaining] = useState(getTimeRemaining(opensAt));
  const router = useRouter();

  useEffect(() => {
    const interval = setInterval(() => {
      const timeLeft = getTimeRemaining(opensAt);
      if (!timeLeft) {
        clearInterval(interval);
        router.refresh();
      }
      setRemaining(timeLeft);
    }, 1000);
    return () => clearInterval(interval);
  }, [opensAt, router]);

  if (!remaining) return null;

  const parts = [
    { value: remaining.days, label: "يوم" },
    { value: remaining.hours, label: "ساعة" },
    { value: remaining.minutes, label: "دقيقة" },
    { value: remaining.seconds, label: "ثانية" },
  ];

  return (
    <div className="text-center">
      <p className="font-kufi text-karbala-secondary mb-6">
        سيفتح الاختبار في الموعد المحدد
      </p>
      <div className="flex justify-center gap-4 flex-wrap">
        {parts.map((part) => (
          <div
            key={part.label}
            className="card-base w-20 h-20 flex flex-col items-center justify-center"
          >
            <span className="font-cinzel text-2xl text-karbala-gold">
              {part.value.toString().padStart(2, "0")}
            </span>
            <span className="font-kufi text-xs text-karbala-gray mt-1">
              {part.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
