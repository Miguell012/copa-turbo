"use client";

import { useEffect, useState } from "react";

interface CountdownTimerProps {
  targetDate: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  expired: boolean;
}

function calculateTimeLeft(targetDate: string): TimeLeft {
  const difference = new Date(targetDate).getTime() - Date.now();

  if (difference <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };
  }

  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / (1000 * 60)) % 60),
    seconds: Math.floor((difference / 1000) % 60),
    expired: false,
  };
}

const UNITS = [
  { key: "days" as const, label: "Dias" },
  { key: "hours" as const, label: "Horas" },
  { key: "minutes" as const, label: "Min" },
  { key: "seconds" as const, label: "Seg" },
];

export default function CountdownTimer({
  targetDate,
  className = "",
  size = "md",
}: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(() =>
    calculateTimeLeft(targetDate)
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(targetDate));
    }, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  const boxSize =
    size === "lg"
      ? "min-w-[72px] px-4 py-4"
      : size === "sm"
        ? "min-w-[48px] px-2 py-2"
        : "min-w-[60px] px-3 py-3";

  const numberSize =
    size === "lg" ? "text-3xl" : size === "sm" ? "text-lg" : "text-2xl";

  if (timeLeft.expired) {
    return (
      <div className={`text-center ${className}`}>
        <p className="text-lg font-bold text-copa-yellow">O jogo começou! ⚽</p>
      </div>
    );
  }

  return (
    <div className={`flex flex-wrap justify-center gap-3 ${className}`}>
      {UNITS.map(({ key, label }) => (
        <div
          key={key}
          className={`rounded-xl bg-white/10 text-center backdrop-blur ${boxSize}`}
        >
          <span className={`block font-black text-white ${numberSize}`}>
            {String(timeLeft[key]).padStart(2, "0")}
          </span>
          <span className="text-xs font-medium uppercase tracking-wide text-white/70">
            {label}
          </span>
        </div>
      ))}
    </div>
  );
}
