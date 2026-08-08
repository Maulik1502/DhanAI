export function ProgressBar({ value, className = '' }: { value: number; className?: string }) {
  const safeValue = Math.max(0, Math.min(100, value));
  return (
    <div className={`h-2 overflow-hidden rounded-full bg-gray-100 ${className}`}>
      <div className='h-full rounded-full bg-dhan-gradient transition-all' style={{ width: `${safeValue}%` }} />
    </div>
  );
}


