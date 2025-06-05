"use client";
import { useState, useEffect } from "react";

// Custom hook to calculate the remaining time
function useTimer(assignedAtTime, defaultTime) {
  const [timeRemaining, setTimeRemaining] = useState("Loading...");

  useEffect(() => {
    // If no assignedAtTime or defaultTime is provided, return early
    if (!assignedAtTime || !defaultTime) {
      setTimeRemaining("Invalid time parameters");
      return;
    }

    // Convert assignedAtTime and defaultTime to Date objects
    const startTime = new Date(assignedAtTime).getTime();
    const endTime = startTime + defaultTime; // Add defaultTime to assignedAtTime

    let intervalId;

    // Function to update the remaining time
    const updateTime = () => {
      const now = Date.now();
      const remainingTime = endTime - now;

      // If time is over, set to "0:00:00" and clear the interval
      if (remainingTime <= 0) {
        setTimeRemaining("0:00:00");
        clearInterval(intervalId); // Clear the interval once countdown is over
        return;
      }

      // Calculate hours, minutes, and seconds remaining
      const hours = Math.floor(remainingTime / (1000 * 60 * 60));
      const minutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);

      // Set the timeRemaining as a string in the desired format
      setTimeRemaining(
        `${hours}hr : ${minutes.toString().padStart(2, "0")}min : ${seconds
          .toString()
          .padStart(2, "0")}sec`
      );
    };

    // Update immediately
    updateTime();

    // Update every second
    intervalId = setInterval(updateTime, 1000);

    // Cleanup interval when the component is unmounted or when the countdown reaches zero
    return () => clearInterval(intervalId);
  }, [assignedAtTime, defaultTime]);

  return timeRemaining;
}

export default useTimer;
