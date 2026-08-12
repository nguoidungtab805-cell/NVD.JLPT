// FILE: components/shared/Timer.tsx
"use client";

import React, { useEffect, useState } from "react";
import { Clock } from "lucide-react";
import { cn, formatTime } from "../../lib/utils";

interface TimerProps {
  initialSeconds: number;
  onTimeUp: () => void;
  onWarning: (minutesLeft: number) => void;
}

export default function Timer({ initialSeconds, onTimeUp, onWarning }: TimerProps) {
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);
  const [hasWarned10, setHasWarned10] = useState(false);
  const [hasWarned5, setHasWarned5] = useState(false);

  useEffect(() => {
    if (secondsLeft <= 0) {
      onTimeUp();
      return;
    }

    // Trigger cảnh báo
    if (secondsLeft === 600 && !hasWarned10) {
      onWarning(10);
      setHasWarned10(true);
    } else if (secondsLeft === 300 && !hasWarned5) {
      onWarning(5);
      setHasWarned5(true);
    }

    const intervalId = setInterval(() => {
      setSecondsLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [secondsLeft, onTimeUp, onWarning, hasWarned10, hasWarned5]);

  // Đổi màu dựa trên thời gian còn lại
  const isDanger = secondsLeft <= 300; // Dưới 5 phút (Đỏ)
  const isWarning = secondsLeft <= 600 && secondsLeft > 300; // Dưới 10 phút (Cam)

  return (
    <div className={cn(
      "flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-lg shadow-sm border transition-colors duration-300",
      isDanger ? "bg-red-50 text-red-600 border-red-200 animate-pulse" : 
      isWarning ? "bg-orange-50 text-orange-600 border-orange-200" : 
      "bg-white text-jp-navy border-gray-200"
    )}>
      <Clock size={20} className={cn(isDanger && "text-red-600", isWarning && "text-orange-600")} />
      <span>{formatTime(secondsLeft)}</span>
    </div>
  );
}
