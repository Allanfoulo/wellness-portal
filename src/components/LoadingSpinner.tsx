
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  className, 
  size = 'md' 
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-luxury-gradient">
      <div className="luxury-glass p-8 rounded-2xl">
        <div
          className={cn(
            'animate-spin rounded-full border-4 border-lavender-200 border-t-lavender-600',
            sizeClasses[size],
            className
          )}
        />
        <p className="mt-4 text-charcoal-600 font-medium">Loading...</p>
      </div>
    </div>
  );
};
