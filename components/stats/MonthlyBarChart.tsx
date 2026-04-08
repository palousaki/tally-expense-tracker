'use client'

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { formatCurrency } from '@/lib/utils'

interface MonthlyData {
  month: string
  total: number
  isCurrent: boolean
}

interface MonthlyBarChartProps {
  data: MonthlyData[]
}

export function MonthlyBarChart({ data }: MonthlyBarChartProps) {
  if (data.every((d) => d.total === 0)) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <p className="text-4xl mb-3">📈</p>
        <p className="text-gray-500 text-sm">Not enough data yet</p>
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={data} barCategoryGap="30%">
        <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
        <YAxis
          tick={{ fontSize: 12, fill: '#9ca3af' }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => `€${v}`}
          width={50}
        />
        <Tooltip
          formatter={(value: number) => [formatCurrency(value), 'Spent']}
          contentStyle={{ borderRadius: '12px', border: '1px solid #f0f0f0', fontSize: '13px' }}
          cursor={{ fill: '#f9fafb' }}
        />
        <Bar dataKey="total" radius={[6, 6, 0, 0]}>
          {data.map((entry, index) => (
            <Cell key={index} fill={entry.isCurrent ? '#111827' : '#d1d5db'} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
