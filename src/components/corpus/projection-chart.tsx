'use client';

import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';

export function ProjectionChart({ data }: { data: Array<{ year: number; value: number }> }) {
  return (
    <div className='h-72 rounded-2xl border bg-white p-4 shadow-sm dark:bg-gray-800'>
      <ResponsiveContainer width='100%' height='100%'>
        <AreaChart data={data}>
          <XAxis dataKey='year' tickLine={false} axisLine={false} />
          <YAxis tickLine={false} axisLine={false} />
          <Tooltip formatter={(value) => `Rs. ${Number(value).toLocaleString('en-IN')}`} />
          <Area type='monotone' dataKey='value' stroke='#3B82F6' fill='#93C5FD' fillOpacity={0.35} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
