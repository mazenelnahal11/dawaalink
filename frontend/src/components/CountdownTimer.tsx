import React, { useEffect, useState } from 'react';

type Props = {
  expiresAt: string; // ISO string 
};

export const CountdownTimer: React.FC<Props> = ({ expiresAt }) => {
  const [timeLeft, setTimeLeft] = useState(() => calculateTimeLeft(expiresAt));

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(expiresAt));
    }, 1000);
    return () => clearInterval(timer);
  }, [expiresAt]);

  function calculateTimeLeft(target: string) {
    const diff = new Date(target).getTime() - new Date().getTime();
    if (diff <= 0) return null;
    
    const h = Math.floor(diff / (1000 * 60 * 60));
    const m = Math.floor((diff / 1000 / 60) % 60);
    const s = Math.floor((diff / 1000) % 60);
    return { h, m, s, totalHours: diff / (1000 * 60 * 60) };
  }

  if (!timeLeft) {
    return <span className="text-error font-bold text-xs uppercase tracking-widest font-label">EXPIRED</span>;
  }

  const { h, m, s, totalHours } = timeLeft;
  const isUrgent = totalHours < 24;
  const isCritical = totalHours < 1;

  const display = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;

  return (
    <span className={`text-xs font-mono tracking-widest ${isUrgent ? 'text-error font-bold' : 'text-on-primary/90'} ${isCritical ? 'animate-pulse' : ''}`}>
      {display}
    </span>
  );
};
