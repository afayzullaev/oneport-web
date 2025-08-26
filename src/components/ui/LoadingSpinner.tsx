// src/components/ui/LoadingSpinner.tsx
import React from "react";
import { Loader2 } from "lucide-react";

interface LoadingSpinnerProps {
  message?: string;
  size?: number;
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  message = "Загрузка...",
  size = 24,
  className = "",
}) => {
  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-white/50 backdrop-blur-sm ${className}`}
    >
      <div className="flex flex-col items-center justify-center space-y-3">
        <div className="animate-spin">
          <Loader2
size={size}
className="text-blue-600"
strokeWidth={2.5} />
        </div>
        {message && (
          <p className="text-sm text-gray-600 font-medium">{message}</p>
        )}
      </div>
    </div>
  );
};
