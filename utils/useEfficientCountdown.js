import { useState, useEffect } from 'react';

const useRobustCountdown = (startTimeISO, durationString) => {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const startTime = new Date(startTimeISO);
      const durationInSeconds = parseInt(durationString.split(' ')[0]);
      const endTime = new Date(startTime.getTime() + durationInSeconds * 1000);

      if (now >= endTime) {
        return 'Challenge Ended';
      }

      const difference = endTime.getTime() - now.getTime();
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      return `${days}d ${hours}h ${minutes}m ${seconds}s`;
    };

    const updateCountdown = () => {
      setTimeLeft(calculateTimeLeft());
    };

    updateCountdown();

    const timerId = setInterval(updateCountdown, 1000);

    return () => clearInterval(timerId);
  }, [startTimeISO, durationString]);

  return timeLeft;
};

export default useRobustCountdown;
