import { memo } from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
}

const sizeMap = {
  sm: 'h-4 w-4',
  md: 'h-8 w-8',
  lg: 'h-12 w-12'
};

const LoadingSpinner = memo(function LoadingSpinner({ 
  size = 'md', 
  color = 'border-blue-600' 
}: LoadingSpinnerProps) {
  return (
    <div className="flex items-center justify-center h-full">
      <div 
        className={`animate-spin rounded-full border-b-2 ${sizeMap[size]} ${color}`} 
        role="status"
        aria-label="Loading"
      />
    </div>
  );
});

LoadingSpinner.displayName = 'LoadingSpinner';

export default LoadingSpinner;