import React from 'react';

interface FairnessProgressProps {
  percentage: number;
}

const FairnessProgress: React.FC<FairnessProgressProps> = ({ percentage }) => {
  // Define color logic based on the user's guide
  const getColor = (val: number) => {
    if (val < 40) return 'bg-red-500';    // Low
    if (val < 70) return 'bg-yellow-500'; // Medium
    return 'bg-green-500';                // High
  };

  const getTextColor = (val: number) => {
    if (val < 40) return 'text-red-500';
    if (val < 70) return 'text-yellow-500';
    return 'text-green-500';
  };

  return (
    <div className="w-full mt-6 pt-5 border-t border-slate-100">
      <div className="flex justify-between text-xs font-semibold text-slate-500 mb-2">
        <span>Overall Fairness Progress</span>
        <span className={`${getTextColor(percentage)} font-bold`}>{percentage}%</span>
      </div>
      <div className="w-full bg-slate-100 rounded-full h-2">
        <div 
          className={`h-2 rounded-full transition-all duration-500 ${getColor(percentage)}`} 
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};

export default FairnessProgress;
