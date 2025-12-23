import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface HourlyDistributionChartProps {
  data: Array<{ hour: number; count: number }>;
}

export const HourlyDistributionChart: React.FC<HourlyDistributionChartProps> = ({ data }) => {
  const chartData = data.map(item => ({
    hour: `${item.hour}h`,
    count: item.count,
  }));

  return (
    <div className="w-full p-4 sm:p-6 bg-white rounded-2xl shadow-sm">
      <h3 className="text-wrapped-text mb-4 text-lg sm:text-xl font-bold text-center">Répartition horaire</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e0" />
          <XAxis 
            dataKey="hour" 
            stroke="#888"
            tick={{ fontSize: 12 }}
            angle={-45}
            textAnchor="end"
            height={60}
          />
          <YAxis stroke="#888" tick={{ fontSize: 12 }} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #e5e5e0',
              color: '#1a1a1a',
              borderRadius: '8px',
              fontSize: '12px',
            }}
          />
          <Bar dataKey="count" fill="#1a1a1a" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

