
import React from "react";

export function Logo({ size = 'regular' }: { size?: 'small' | 'regular' | 'large' }) {
  const sizeClasses = {
    small: "text-xl md:text-2xl",
    regular: "text-2xl md:text-3xl",
    large: "text-4xl md:text-5xl"
  };
  
  return (
    <div className="font-bold flex items-center">
      <span className={`${sizeClasses[size]} bg-clip-text text-transparent gradient-shine animate-background-shine`}>
        Cura
      </span>
    </div>
  );
}
