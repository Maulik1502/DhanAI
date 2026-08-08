export function LoadingSkeleton({ className = 'h-24 w-full' }: { className?: string }) {
  return <div className={`animate-pulse rounded-xl bg-gray-200/70 dark:bg-gray-700/70 ${className}`} />;
}
