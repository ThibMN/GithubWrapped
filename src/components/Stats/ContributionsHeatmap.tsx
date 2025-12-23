import React from 'react';
import { ContributionWeek } from '../../types/github';

interface ContributionsHeatmapProps {
  weeks: ContributionWeek[];
}

export const ContributionsHeatmap: React.FC<ContributionsHeatmapProps> = ({ weeks }) => {
  const getIntensity = (count: number): string => {
    if (count === 0) return 'bg-terminal-bg border-terminal-green/10';
    if (count < 5) return 'bg-terminal-green/20 border-terminal-green/30';
    if (count < 10) return 'bg-terminal-green/40 border-terminal-green/50';
    if (count < 20) return 'bg-terminal-green/60 border-terminal-green/70';
    return 'bg-terminal-green border-terminal-green';
  };

  return (
    <div className="w-full p-4 border border-terminal-green/20 bg-terminal-bg/30">
      <h3 className="text-terminal-green mb-4 text-lg font-bold">Carte de contributions</h3>
      <div className="flex gap-1 overflow-x-auto">
        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="flex flex-col gap-1">
            {week.contributionDays.map((day, dayIndex) => (
              <div
                key={dayIndex}
                className={`w-3 h-3 border ${getIntensity(day.contributionCount)}`}
                title={`${day.date}: ${day.contributionCount} contributions`}
              />
            ))}
          </div>
        ))}
      </div>
      <div className="flex items-center justify-end gap-2 mt-4 text-xs text-terminal-text/60">
        <span>Moins</span>
        <div className="flex gap-1">
          <div className="w-3 h-3 border border-terminal-green/10"></div>
          <div className="w-3 h-3 border border-terminal-green/30 bg-terminal-green/20"></div>
          <div className="w-3 h-3 border border-terminal-green/50 bg-terminal-green/40"></div>
          <div className="w-3 h-3 border border-terminal-green/70 bg-terminal-green/60"></div>
          <div className="w-3 h-3 border border-terminal-green bg-terminal-green"></div>
        </div>
        <span>Plus</span>
      </div>
    </div>
  );
};

