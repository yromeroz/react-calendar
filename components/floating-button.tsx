// FloatingButton.tsx
import React from 'react';
import { Button } from "@/components/ui/button";
import { LuPlus } from "react-icons/lu";

const FloatingButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <Button
      title="Crear nueva reservación"
      variant="ghost"  
      onClick={onClick}
      className="lg:hidden fixed bottom-14 right-12 bg-gray-300 hover:bg-blue-300 rounded-full border-1 shadow px-3 py-6 hover:px-3 hover:py-6.5 transition-all duration-300 z-50"
    >
      <LuPlus  size={26} className="text-gray-800" />
    </Button>
  );
};

export default FloatingButton;