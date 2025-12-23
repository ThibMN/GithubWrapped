import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { MonthlyStats } from '../../types/github';
import { getMonthName } from '../../utils/dateUtils';

interface CodeLinesChartProps {
  monthlyStats: MonthlyStats[];
}

// Composant personnalisé pour la légende
const CustomLegend = ({ payload }: any) => {
  if (!payload) return null;

  return (
    <div className="flex flex-wrap justify-center gap-6 mt-4">
      {payload.map((entry: any, index: number) => (
        <div key={`legend-${index}`} className="flex items-center gap-2">
          <div 
            className="w-4 h-0.5 flex-shrink-0"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-sm text-wrapped-text font-medium whitespace-nowrap">
            {entry.value}
          </span>
        </div>
      ))}
    </div>
  );
};

export const CodeLinesChart: React.FC<CodeLinesChartProps> = ({ monthlyStats }) => {
  const data = monthlyStats.map(stat => ({
    month: getMonthName(stat.month),
    additions: stat.additions,
    deletions: stat.deletions,
    net: stat.additions - stat.deletions,
  }));

  return (
    <div className="w-full p-6 bg-white rounded-2xl shadow-sm">
      <h3 className="text-wrapped-text mb-4 text-xl font-bold">Lignes de code par mois</h3>
      <div className="flex flex-col items-center">
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e0" />
            <XAxis 
              dataKey="month" 
              stroke="#6b6b6b"
              tick={{ fill: '#6b6b6b', fontSize: 12 }}
            />
            <YAxis 
              stroke="#6b6b6b"
              tick={{ fill: '#6b6b6b', fontSize: 12 }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #e5e5e0',
                color: '#1a1a1a',
                borderRadius: '8px',
              }}
            />
            <Legend content={<CustomLegend />} />
            <Line
              type="monotone"
              dataKey="additions"
              stroke="#1db954"
              strokeWidth={3}
              dot={{ fill: '#1db954', r: 4 }}
              activeDot={{ r: 6 }}
              name="Ajoutées"
            />
            <Line
              type="monotone"
              dataKey="deletions"
              stroke="#ff6b6b"
              strokeWidth={3}
              dot={{ fill: '#ff6b6b', r: 4 }}
              activeDot={{ r: 6 }}
              name="Supprimées"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

