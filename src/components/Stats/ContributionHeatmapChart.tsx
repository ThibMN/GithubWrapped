import React from 'react';
import { ContributionHeatmapDay } from '../../types/github';

interface ContributionHeatmapChartProps {
  heatmap: ContributionHeatmapDay[];
  year: number;
}

const getIntensityColor = (level: number): string => {
  switch (level) {
    case 0:
      return 'bg-wrapped-bg border-wrapped-muted/10';
    case 1:
      return 'bg-green-200 border-green-300';
    case 2:
      return 'bg-green-400 border-green-500';
    case 3:
      return 'bg-green-600 border-green-700';
    case 4:
      return 'bg-green-800 border-green-900';
    default:
      return 'bg-wrapped-bg border-wrapped-muted/10';
  }
};

const DAYS_OF_WEEK = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
const MONTHS = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];

export const ContributionHeatmapChart: React.FC<ContributionHeatmapChartProps> = ({ heatmap, year }) => {
  // Organiser les données par semaine
  const weeks: ContributionHeatmapDay[][] = [];
  let currentWeek: ContributionHeatmapDay[] = [];
  
  heatmap.forEach((day, index) => {
    const date = new Date(day.date);
    const dayOfWeek = date.getDay();
    
    // Si c'est dimanche et qu'on a déjà des jours, commencer une nouvelle semaine
    if (dayOfWeek === 0 && currentWeek.length > 0) {
      weeks.push([...currentWeek]);
      currentWeek = [];
    }
    
    currentWeek.push(day);
    
    // Si c'est le dernier jour, ajouter la semaine
    if (index === heatmap.length - 1) {
      weeks.push(currentWeek);
    }
  });


  return (
    <div className="w-full p-4 sm:p-6 bg-white rounded-2xl shadow-sm overflow-x-auto">
      <h3 className="text-wrapped-text mb-4 text-lg sm:text-xl font-bold text-center">Carte de contributions {year}</h3>
      <div className="flex gap-1 items-start">
        {/* Légende des jours de la semaine */}
        <div className="flex flex-col gap-1 pt-6 pr-2">
          {DAYS_OF_WEEK.map((day, index) => (
            <div
              key={index}
              className={`h-3 text-xs text-wrapped-muted ${index % 2 === 0 ? 'visible' : 'invisible'}`}
            >
              {day}
            </div>
          ))}
        </div>
        
        {/* Semaines */}
        <div className="flex gap-1">
          {weeks.map((week, weekIndex) => {
            const weekStart = week[0] ? new Date(week[0].date) : null;
            const isFirstOfMonth = weekStart && weekStart.getDate() <= 7;
            
            return (
              <div key={weekIndex} className="flex flex-col gap-1 relative">
                {/* Label du mois */}
                {isFirstOfMonth && weekStart && (
                  <div className="absolute -top-5 left-0 text-xs text-wrapped-muted whitespace-nowrap">
                    {MONTHS[weekStart.getMonth()]}
                  </div>
                )}
                
                {/* Jours de la semaine */}
                {Array.from({ length: 7 }, (_, dayIndex) => {
                  const day = week[dayIndex];
                  if (!day) {
                    return <div key={dayIndex} className="w-3 h-3" />;
                  }
                  
                  return (
                    <div
                      key={dayIndex}
                      className={`w-3 h-3 border rounded-sm ${getIntensityColor(day.level)}`}
                      title={`${day.date}: ${day.count} contribution${day.count !== 1 ? 's' : ''}`}
                    />
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Légende */}
      <div className="flex items-center justify-end gap-2 mt-4 text-xs text-wrapped-muted">
        <span>Moins</span>
        <div className="flex gap-1">
          {[0, 1, 2, 3, 4].map((level) => (
            <div
              key={level}
              className={`w-3 h-3 border rounded-sm ${getIntensityColor(level)}`}
            />
          ))}
        </div>
        <span>Plus</span>
      </div>
    </div>
  );
};

