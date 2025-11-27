"use client";

import { usePostMessageAuth } from "@/hooks/usePostMessageAuth";

export default function PostMessageAuthClient() {
  usePostMessageAuth();
  return null;
}