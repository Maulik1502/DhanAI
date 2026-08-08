'use client';

import { PieChart, Pie, ResponsiveContainer, Cell, Tooltip } from 'recharts';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B'];

export function AllocationDonut({ data }: { data: Array<{ name: string; value: number }> }) {
  return (
    <div className='h-72 rounded-2xl border bg-white p-4 shadow-sm dark:bg-gray-800'>
      <ResponsiveContainer width='100%' height='100%'>
        <PieChart>
          <Pie data={data} dataKey='value' nameKey='name' innerRadius={70} outerRadius={110} paddingAngle={3}>
            {data.map((entry, index) => <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />)}
          </Pie>
          <Tooltip formatter={(value) => `${value}%`} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
