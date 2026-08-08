import Link from 'next/link';

export function EmptyState({ title, description, href, action }: { title: string; description: string; href?: string; action?: string }) {
  return (
    <div className='rounded-2xl border border-dashed bg-white p-8 text-center shadow-sm dark:bg-gray-800'>
      <div className='mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-xl'>âœ¨</div>
      <h3 className='font-semibold text-gray-900 dark:text-white'>{title}</h3>
      <p className='mx-auto mt-2 max-w-md text-sm text-gray-500'>{description}</p>
      {href && action ? (
        <Link href={href} className='mt-4 inline-flex rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700'>
          {action}
        </Link>
      ) : null}
    </div>
  );
}


