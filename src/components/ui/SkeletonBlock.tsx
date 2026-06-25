import { HTMLAttributes } from 'react';
import { cn } from '@/utils/cn';

interface SkeletonBlockProps extends HTMLAttributes<HTMLDivElement> {
  width?: string;
  height?: string;
  rounded?: string;
}

export function SkeletonBlock({
  width = 'w-full',
  height = 'h-4',
  rounded = 'rounded-lg',
  className,
  ...props
}: SkeletonBlockProps) {
  return (
    <div
      className={cn('skeleton', width, height, rounded, className)}
      aria-hidden="true"
      {...props}
    />
  );
}

export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div className={cn('glass p-5 space-y-3', className)} aria-hidden="true">
      <SkeletonBlock height="h-5" width="w-2/3" />
      <SkeletonBlock height="h-3" width="w-full" />
      <SkeletonBlock height="h-3" width="w-4/5" />
      <SkeletonBlock height="h-3" width="w-3/5" />
    </div>
  );
}

export function SkeletonNewsCard() {
  return (
    <div className="glass p-5 space-y-4" aria-hidden="true">
      <SkeletonBlock height="h-48" rounded="rounded-xl" />
      <SkeletonBlock height="h-5" width="w-3/4" />
      <SkeletonBlock height="h-3" width="w-full" />
      <SkeletonBlock height="h-3" width="w-2/3" />
    </div>
  );
}
