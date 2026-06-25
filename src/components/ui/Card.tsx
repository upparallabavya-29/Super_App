import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '@/utils/cn';

type CardVariant = 'default' | 'glass' | 'glass-medium' | 'glass-indigo' | 'glass-violet' | 'glass-teal' | 'solid';
type CardGlow = 'none' | 'indigo' | 'violet' | 'teal' | 'amber';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hoverable?: boolean;
  glow?: CardGlow;
  interactive?: boolean;
}

const variantClasses: Record<CardVariant, string> = {
  default: 'glass',
  glass: 'glass',
  'glass-medium': 'glass-medium',
  'glass-indigo': 'glass-indigo',
  'glass-violet': 'glass-violet',
  'glass-teal': 'glass-teal',
  solid: 'bg-[#13131f] border border-white/[0.07] rounded-[20px]',
};

const glowClasses: Record<CardGlow, string> = {
  none: '',
  indigo: 'card-glow-indigo',
  violet: 'card-glow-violet',
  teal: 'card-glow-teal',
  amber: 'card-glow-amber',
};

const paddingClasses = {
  none: '',
  sm: 'p-4',
  md: 'p-5',
  lg: 'p-6',
};

export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      variant = 'default',
      padding = 'md',
      hoverable = false,
      glow = 'none',
      interactive = false,
      className,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          variantClasses[variant],
          paddingClasses[padding],
          glowClasses[glow],
          (hoverable || interactive) &&
            'transition-all duration-300 hover:translate-y-[-3px] cursor-pointer',
          interactive && 'hover:shadow-xl hover:shadow-indigo-500/10',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';
