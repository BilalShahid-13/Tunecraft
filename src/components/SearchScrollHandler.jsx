"use client";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function SearchScrollHandler() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const id = searchParams.get("scrollTo");
    if (id) {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [searchParams]);

  return null; // It doesn’t render anything
}
