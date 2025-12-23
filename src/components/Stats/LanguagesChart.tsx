import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { getLanguageColor, getLanguageIcon } from '../../utils/languageColors';

interface LanguageData {
  name: string;
  value?: number;
  count?: number;
  percentage: number;
}

interface LanguagesChartProps {
  languages: LanguageData[];
}

// Composant personnalisé pour la légende avec icônes
const CustomLegend = ({ payload }: any) => {
  if (!payload) return null;

  return (
    <div className="flex flex-wrap justify-center gap-2 sm:gap-3 md:gap-4 mt-4 px-2">
      {payload.map((entry: any, index: number) => {
        const language = entry.payload.name;
        const iconUrl = getLanguageIcon(language);
        
        return (
          <div key={`legend-${index}`} className="flex items-center gap-1.5 sm:gap-2">
            {iconUrl && (
              <img 
                src={iconUrl} 
                alt={language} 
                className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            )}
            <span className="text-xs sm:text-sm text-wrapped-text font-medium whitespace-nowrap">
              {language} ({entry.payload.percentage.toFixed(1)}%)
            </span>
          </div>
        );
      })}
    </div>
  );
};

export const LanguagesChart: React.FC<LanguagesChartProps> = ({ languages }) => {
  const data = languages.map(lang => ({
    name: lang.name,
    value: lang.count || lang.value || 0,
    percentage: lang.percentage,
    color: getLanguageColor(lang.name),
  }));

  const [outerRadius, setOuterRadius] = React.useState(100);
  
  React.useEffect(() => {
    const updateRadius = () => {
      if (window.innerWidth < 640) {
        setOuterRadius(70);
      } else {
        setOuterRadius(100);
      }
    };
    updateRadius();
    window.addEventListener('resize', updateRadius);
    return () => window.removeEventListener('resize', updateRadius);
  }, []);

  return (
    <div className="w-full p-4 sm:p-6 bg-white rounded-2xl shadow-sm">
      <h3 className="text-wrapped-text mb-3 sm:mb-4 text-lg sm:text-xl font-bold text-center">Langages utilisés</h3>
      <div className="flex flex-col items-center">
        <div className="mb-6 sm:mb-4 w-full">
          <ResponsiveContainer width="100%" height={outerRadius === 70 ? 220 : 300}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ percentage }) => percentage > 5 ? `${percentage.toFixed(1)}%` : ''}
                outerRadius={outerRadius}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e5e0',
                  color: '#1a1a1a',
                  borderRadius: '8px',
                  fontSize: '12px',
                }}
                formatter={(value: number, _name: string, props: any) => [
                  `${value} repos (${props.payload.percentage.toFixed(1)}%)`,
                  props.payload.name
                ]}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <CustomLegend payload={data.map((entry) => ({
          value: entry.name,
          type: 'circle',
          id: entry.name,
          color: entry.color,
          payload: entry
        }))} />
      </div>
    </div>
  );
};
