import React, { useState, useEffect } from 'react';

interface TimerProps {
  expiresAt: string;
  onExpired?: () => void;
  onAlmostExpired?: () => void;
}

export default function Timer({ expiresAt, onExpired, onAlmostExpired }: TimerProps) {
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isExpired, setIsExpired] = useState<boolean>(false);
  const [almostExpiredFired, setAlmostExpiredFired] = useState<boolean>(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const expirationTime = new Date(expiresAt).getTime();
      const difference = expirationTime - now;

      if (difference <= 0) {
        setTimeLeft(0);
        setIsExpired(true);
        if (onExpired) {
          onExpired();
        }
        return;
      }

      if (onAlmostExpired && difference <= 60000 && !almostExpiredFired) {
        setAlmostExpiredFired(true);
        onAlmostExpired();
      }

      setTimeLeft(difference);
    };

    // Calculate immediately
    calculateTimeLeft();

    // Update every second
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [expiresAt, onExpired, onAlmostExpired]);

  const formatTime = (milliseconds: number) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const getTimeColor = () => {
    if (timeLeft <= 120000) { // 2 minutes or less - RED (urgent)
      return 'text-red-500';
    } else if (timeLeft <= 300000) { // 5 minutes or less - YELLOW (warning)
      return 'text-yellow-500';
    } else if (timeLeft <= 600000) { // 10 minutes or less - ORANGE (caution)
      return 'text-orange-500';
    }
    return 'text-[#3f411a]'; // Default color for more than 10 minutes (shouldn't happen now)
  };

  if (isExpired) {
    return (
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 bg-red-100 flex items-center justify-center rounded-full">
          <svg xmlns="http://www.w3.org/2000/svg" width="1.2em" height="1.2em" viewBox="0 0 24 24" className="text-red-500">
            <g fill="none" stroke="currentColor" stroke-width="1.5">
              <path stroke-linecap="round" d="M2 12c0-4.714 0-7.071 1.464-8.536C4.93 2 7.286 2 12 2s7.071 0 8.536 1.464C22 4.93 22 7.286 22 12s0 7.071-1.464 8.536C19.072 22 16.714 22 12 22s-7.071 0-8.536-1.464C2 19.072 2 16.714 2 12" />
              <path stroke-linecap="round" d="M12 6v6l4 2" />
            </g>
          </svg>
        </div>
        <span className="text-red-500 font-lexend font-medium">Expired</span>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-2">
      <div className="w-8 h-8 bg-[#f6f5c6] flex items-center justify-center rounded-full">
        <svg xmlns="http://www.w3.org/2000/svg" width="1.2em" height="1.2em" viewBox="0 0 24 24" className="text-[#3f411a]">
          <g fill="none" stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" d="M2 12c0-4.714 0-7.071 1.464-8.536C4.93 2 7.286 2 12 2s7.071 0 8.536 1.464C22 4.93 22 7.286 22 12s0 7.071-1.464 8.536C19.072 22 16.714 22 12 22s-7.071 0-8.536-1.464C2 19.072 2 16.714 2 12" />
            <path stroke-linecap="round" d="M12 6v6l4 2" />
          </g>
        </svg>
      </div>
      <span className={`font-lexend font-medium ${getTimeColor()}`}>
        {formatTime(timeLeft)}
      </span>
    </div>
  );
} 