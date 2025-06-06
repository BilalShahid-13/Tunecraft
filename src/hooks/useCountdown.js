"use client";
import { useState, useEffect } from "react";

// Custom hook to calculate the remaining time
function useCountdown(dueDate) {
  const [timeRemaining, setTimeRemaining] = useState("loading...");

  useEffect(() => {
    // If no dueDate is provided, return early
    if (!dueDate) {
      setTimeRemaining("0:00:00");
      return;
    }

    // Convert dueDate to a Date object if it's not already one
    const endDate = new Date(dueDate).getTime();

    // Declare intervalId outside of the updateTime function so it's accessible in the cleanup function
    let intervalId;

    // Function to update the remaining time
    const updateTime = () => {
      const now = Date.now();
      const remainingTime = endDate - now;

      // If time is over, set to "0:00:00" and clear the interval
      if (remainingTime <= 0) {
        setTimeRemaining("0:00:00");
        clearInterval(intervalId); // Clear the interval once countdown is over
        return;
      }

      // Calculate hours, minutes, and seconds remaining
      const hours = Math.floor(remainingTime / (1000 * 60 * 60));
      const minutes = Math.floor(
        (remainingTime % (1000 * 60 * 60)) / (1000 * 60)
      );
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
  }, [dueDate]);

  return timeRemaining;
}

export default useCountdown;
