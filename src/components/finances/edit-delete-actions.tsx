'use client';

import { useState } from 'react';
import { Trash2, Edit3, Loader2 } from 'lucide-react';

type EditDeleteActionsProps = {
  id: string;
  kind: 'income' | 'expense';
  item: any;
  onSuccess: () => void;
};

export function EditDeleteActions({ id, kind, onSuccess }: EditDeleteActionsProps) {
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const res = await fetch('/api/finances', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ kind, id }),
      });

      if (!res.ok) {
        throw new Error('Failed to delete item');
      }

      onSuccess();
    } catch (err) {
      console.error(err);
    } finally {
      setDeleting(false);
      setConfirmDelete(false);
    }
  };

  return (
    <div className='flex items-center gap-1 opacity-90 group-hover:opacity-100 transition-opacity'>
      {confirmDelete ? (
        <div className='flex items-center gap-1.5 bg-rose-50 dark:bg-rose-950/80 p-1 rounded-lg border border-rose-200 dark:border-rose-900 animate-in fade-in duration-150'>
          <span className='text-[10px] font-bold text-rose-700 dark:text-rose-300 px-1'>Delete?</span>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className='px-2 py-0.5 rounded-md bg-rose-600 text-white text-[10px] font-bold hover:bg-rose-500 disabled:opacity-50'
          >
            {deleting ? <Loader2 className='h-3 w-3 animate-spin' /> : 'Yes'}
          </button>
          <button
            onClick={() => setConfirmDelete(false)}
            className='px-2 py-0.5 rounded-md bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-[10px] font-medium hover:bg-gray-300'
          >
            No
          </button>
        </div>
      ) : (
        <button
          onClick={() => setConfirmDelete(true)}
          className='p-1.5 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-all'
          title={`Delete ${kind}`}
        >
          <Trash2 className='h-3.5 w-3.5' />
        </button>
      )}
    </div>
  );
}
