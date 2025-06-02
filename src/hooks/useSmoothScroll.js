// /utils/useSmoothScroll.js
import { useEffect, useCallback } from "react";
import useAllUsers from "@/store/allUsers";
import useNotificationStore from "@/store/notification";

export function useSmoothScroll(cardRefs, isScroll) {
  // Pull these values *inside* the hook body:
  const { isFetched } = useAllUsers();
  const { isClicked, setClicked, notificationId } = useNotificationStore();

  // 1) Whenever `isFetched` flips (e.g. after data arrives), re‐fetch if needed
  useEffect(() => {
  }, [isFetched]);

  // 2) Build the scroll-into-view callback
  const scrollToCard = useCallback(() => {
    if (notificationId && cardRefs.current[notificationId]) {
      cardRefs.current[notificationId].scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      setClicked(false);
    }
  }, [notificationId, cardRefs, setClicked]);

  // 3) Whenever `isClicked` + `isScroll` are true, run scrollToCard (after 200ms)
  useEffect(() => {
    if (isClicked && isScroll) {
      const timer = setTimeout(scrollToCard, 200);
      return () => clearTimeout(timer);
    }
  }, [isClicked, isScroll, scrollToCard]);
}
