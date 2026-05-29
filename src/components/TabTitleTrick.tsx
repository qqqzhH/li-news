"use client";
import { useEffect } from "react";

export default function TabTitleTrick() {
  useEffect(() => {
    const orig = document.title;
    let timeout: ReturnType<typeof setTimeout>;

    const handle = () => {
      clearTimeout(timeout);
      if (document.hidden) {
        document.title = "(°A^)页面崩溃啦";
      } else {
        document.title = "(A>ω<*a)噫又好了~";
        timeout = setTimeout(() => {
          document.title = orig;
        }, 3000);
      }
    };

    document.addEventListener("visibilitychange", handle);
    return () => {
      document.removeEventListener("visibilitychange", handle);
      clearTimeout(timeout);
    };
  }, []);
  return null;
}
