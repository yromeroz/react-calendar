"use client";

import React from "react";
import { Button } from "@/components/ui/button";
// import { ChevronDown } from "lucide-react";
import { Menu } from "lucide-react";
import { useCallback, useState } from "react";
import FloatingSideBar from "../sidebar/FloatingSideBar";

export default function Create() {
  const [isPopmenuOpen, setisPopmenuOpen] = useState(false);

  const handleOpenPopmenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setisPopmenuOpen(true);
  }, []);

  const handleClosePopmenu = useCallback(() => {
    setisPopmenuOpen(false);
  }, []);


  return (
    <>
      <Button
        title="Menu lateral"
        variant="ghost"
        className="lg:hidden rounded-full px-2 py-5 shadow border-1 bg-gray-300"
        onClick={handleOpenPopmenu}
      >
        <Menu className="size-6" />
      </Button>
      {isPopmenuOpen && (
        <FloatingSideBar
          isOpen={isPopmenuOpen}
          onClose={handleClosePopmenu}
        />
      )}
    </>
  );
}