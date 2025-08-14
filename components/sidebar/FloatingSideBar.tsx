"use client";

import React, { 
    useEffect, 
    useRef, 
    // useState, 
    // useTransition 
} from "react";
import { Button } from "../ui/button";
import { HiOutlineMenuAlt4 } from "react-icons/hi";
import { IoCloseSharp } from "react-icons/io5";
import SideBarCalendar from "./side-bar-calendar";
import MyFilters from "./my-filters";

interface FloatingSideBarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function FloatingSideBar({
  isOpen,
  onClose,
}: FloatingSideBarProps) {
    const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);
  
  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClose();
  };
  
  const handleSidebarClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };  

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={handleClose}
    >
      <div
        ref={sidebarRef}
        className="space-y-4 w-92 max-w-md px-2 pb-4 rounded-2xl bg-white shadow-lg"
        onClick={handleSidebarClick}
      >
        <div className="flex items-center justify-between rounded-2xl bg-slate-100 py-1">
          <HiOutlineMenuAlt4 className="ml-1" />
          <Button
            variant="ghost"
            size="icon"
            type="button"
            onClick={handleClose}
          >
            <IoCloseSharp className="h-4 w-4" />
          </Button>
        </div>    
          <SideBarCalendar />
          <MyFilters />   
      </div>
    </div>
  );
}
