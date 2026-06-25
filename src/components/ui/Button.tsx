'use client';

import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/utils/cn';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline' | 'teal';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'btn-gradient text-white font-semibold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none',
  secondary:
    'bg-white/8 hover:bg-white/14 text-white border border-white/15 hover:border-white/25 transition-all duration-200',
  ghost:
    'bg-transparent hover:bg-white/8 text-white/75 hover:text-white transition-all duration-200',
  danger:
    'bg-red-500/15 hover:bg-red-500/25 text-red-400 hover:text-red-300 border border-red-500/25 hover:border-red-500/40 transition-all duration-200',
  outline:
    'bg-transparent border border-indigo-500/40 hover:border-indigo-400/70 text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/8 transition-all duration-200 hover:shadow-[0_0_16px_rgba(99,102,241,0.2)]',
  teal:
    'bg-teal-500/15 hover:bg-teal-500/25 text-teal-400 hover:text-teal-300 border border-teal-500/25 hover:border-teal-500/40 transition-all duration-200',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-xs rounded-lg',
  md: 'px-5 py-2.5 text-sm rounded-xl',
  lg: 'px-7 py-3.5 text-base rounded-xl',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', isLoading, className, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          'inline-flex items-center justify-center gap-2 font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#08080e]',
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        {...props}
      >
        {isLoading && (
          <span
            className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"
            aria-hidden="true"
          />
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
