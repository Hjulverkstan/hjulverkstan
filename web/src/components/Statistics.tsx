import React from 'react';
import { cn } from '@utils';

type StatItem = {
  value: number | string;
  label: string;
};

type StatisticsProps = {
  stats: StatItem[];
  className?: string;
};

const Statistics: React.FC<StatisticsProps> = ({ stats, className }) => {
  if (!stats || stats.length === 0) {
    return null;
  }

  return (
    <div
      className={cn(
        'flex flex-wrap items-baseline justify-center',
        'gap-x-8 gap-y-6 md:gap-x-12 lg:gap-x-16',
        'py-10 md:py-16',
        className,
      )}
    >
      {stats.map((stat, index) => (
        <div
          key={index}
          className="flex min-w-[100px] flex-col items-center text-center
            md:min-w-[120px]"
        >
          <span
            className="mb-1 text-4xl font-bold text-pink-600 sm:text-5xl md:mb-2
              lg:text-6xl"
          >
            {stat.value}
          </span>
          <span className="text-sm text-gray-700 md:text-base">
            {stat.label}
          </span>
        </div>
      ))}
    </div>
  );
};

export default Statistics;
