import { useState, useEffect, useRef } from 'react';

const useEfficientCountdown = (startTime, duration) => {
  const [timeLeft, setTimeLeft] = useState('');
  const requestRef = useRef();
  const previousTimeRef = useRef();

  useEffect(() => {
    const startDate = new Date(startTime);
    const durationInSeconds = parseInt(duration.split(' ')[0]);
    const endDate = new Date(startDate.getTime() + durationInSeconds * 1000);

    const animate = (time) => {
      if (previousTimeRef.current !== undefined) {
        const now = new Date();

        if (now >= endDate) {
          setTimeLeft('Challenge Ended');
          return;
        }

        const difference = endDate - now;
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / 1000 / 60) % 60);
        const seconds = Math.floor((difference / 1000) % 60);

        setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
      }
      previousTimeRef.current = time;
      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, [startTime, duration]);

  return timeLeft;
};

export default useEfficientCountdown;
