'use client';

import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';

interface MasteryHistoryPoint {
  date: string;
  overall: number;
  regularization: number;
  precisionRecall: number;
  optimization: number;
}

const DEFAULT_HISTORY: MasteryHistoryPoint[] = [
  { date: 'Sep 28', overall: 35, regularization: 25, precisionRecall: 40, optimization: 45 },
  { date: 'Sep 30', overall: 42, regularization: 32, precisionRecall: 48, optimization: 58 },
  { date: 'Oct 01', overall: 51, regularization: 38, precisionRecall: 52, optimization: 68 },
  { date: 'Oct 02', overall: 58, regularization: 40, precisionRecall: 55, optimization: 74 },
  { date: 'Today', overall: 64, regularization: 42, precisionRecall: 58, optimization: 78 },
];

export function MasteryChart({ data = DEFAULT_HISTORY }: { data?: MasteryHistoryPoint[] }) {
  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
          <XAxis dataKey="date" tick={{ fontSize: 11 }} />
          <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} tickFormatter={(v) => `${v}%`} />
          <Tooltip
            formatter={(value) => [`${value}%`, '']}
            contentStyle={{
              borderRadius: '12px',
              fontSize: '12px',
              backgroundColor: '#18181b',
              border: '1px solid #27272a',
              color: '#f4f4f5',
            }}
          />
          <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
          <Line
            type="monotone"
            dataKey="overall"
            name="Overall Mastery"
            stroke="#6366f1"
            strokeWidth={3}
            dot={{ r: 4 }}
          />
          <Line
            type="monotone"
            dataKey="regularization"
            name="Regularization"
            stroke="#f43f5e"
            strokeWidth={2}
            strokeDasharray="4 4"
          />
          <Line
            type="monotone"
            dataKey="precisionRecall"
            name="Precision vs Recall"
            stroke="#f59e0b"
            strokeWidth={2}
            strokeDasharray="4 4"
          />
          <Line
            type="monotone"
            dataKey="optimization"
            name="Optimization & GD"
            stroke="#10b981"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
