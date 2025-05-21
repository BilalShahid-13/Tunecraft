import { useState, useEffect } from "react";

export function useCountdown(startTime, durationHours = 3) {
  const [timeLeft, setTimeLeft] = useState(null);

  useEffect(() => {
    if (!startTime) {
      setTimeLeft(null);
      return;
    }

    const durationMs = durationHours * 60 * 60 * 1000;
    const endTime = new Date(startTime).getTime() + durationMs;

    const updateCountdown = () => {
      const now = Date.now();
      const diff = endTime - now;

      if (diff <= 0) {
        setTimeLeft("0:00:00");
        return false; // stop interval
      }

      const hrs = Math.floor(diff / (1000 * 60 * 60));
      const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const secs = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft(
        `${hrs}hr : ${mins.toString().padStart(2, "0")}min : ${secs
          .toString()
          .padStart(2, "0")}sec`
      );
      return true;
    };

    updateCountdown(); // update immediately

    const intervalId = setInterval(() => {
      const shouldContinue = updateCountdown();
      if (!shouldContinue) clearInterval(intervalId);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [startTime, durationHours]);

  return timeLeft;
}
