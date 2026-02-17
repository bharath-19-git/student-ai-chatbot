import { Loader2 } from "lucide-react";

interface LoadingSpinnerProps {
  message?: string;
}

const LoadingSpinner = ({ message = "Thinking..." }: LoadingSpinnerProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 animate-fade-in">
      <div className="relative">
        <div className="absolute inset-0 rounded-full gradient-primary opacity-20 blur-xl animate-pulse-soft" />
        <div className="relative flex h-16 w-16 items-center justify-center rounded-full gradient-primary shadow-glow">
          <Loader2 className="h-8 w-8 animate-spin text-primary-foreground" />
        </div>
      </div>
      <p className="mt-4 text-muted-foreground font-medium">{message}</p>
    </div>
  );
};

export default LoadingSpinner;
