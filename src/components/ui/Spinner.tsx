import { HTMLAttributes } from 'react';
import { cn } from '@/utils/cn';

interface SpinnerProps extends HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg';
  label?: string;
}

const sizeMap = { sm: 'w-4 h-4', md: 'w-8 h-8', lg: 'w-12 h-12' };
const borderMap = { sm: 'border-2', md: 'border-2', lg: 'border-3' };

export function Spinner({ size = 'md', label = 'Loading…', className, ...props }: SpinnerProps) {
  return (
    <div
      role="status"
      aria-label={label}
      className={cn('flex items-center justify-center', className)}
      {...props}
    >
      <div
        className={cn(
          sizeMap[size],
          borderMap[size],
          'border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin'
        )}
        aria-hidden="true"
      />
      <span className="sr-only">{label}</span>
    </div>
  );
}
