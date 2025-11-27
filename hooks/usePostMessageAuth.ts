"use client";

import { useEffect } from "react";

export function usePostMessageAuth() {
  useEffect(() => {
    function handler(event: MessageEvent) {
      if (!event.data?.token) return;

      console.log("Received token from parent:", event.data.token);

      // Save JWT
      localStorage.setItem("token", event.data.token);

      // Optional: trigger reload so AuthContext runs again
      window.location.reload();
    }

    window.addEventListener("message", handler);

    return () => window.removeEventListener("message", handler);
  }, []);
}