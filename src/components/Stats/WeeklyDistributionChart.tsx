import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface WeeklyDistributionChartProps {
  data: Array<{ dayOfWeek: number; count: number }>;
}

const DAY_NAMES = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
const DAY_SHORT = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];

export const WeeklyDistributionChart: React.FC<WeeklyDistributionChartProps> = ({ data }) => {
  const chartData = data.map(item => ({
    day: DAY_SHORT[item.dayOfWeek],
    fullDay: DAY_NAMES[item.dayOfWeek],
    count: item.count,
  }));

  return (
    <div className="w-full p-4 sm:p-6 bg-white rounded-2xl shadow-sm">
      <h3 className="text-wrapped-text mb-4 text-lg sm:text-xl font-bold text-center">Répartition hebdomadaire</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e0" />
          <XAxis 
            dataKey="day" 
            stroke="#888"
            tick={{ fontSize: 12 }}
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
            formatter={(value: number, _name: string, props: any) => [
              `${value} commits`,
              props.payload.fullDay
            ]}
          />
          <Bar dataKey="count" fill="#1a1a1a" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

