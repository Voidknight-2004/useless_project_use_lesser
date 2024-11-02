import React, { useState } from 'react';
import { usePoints } from './PointsProvider';

const DailyGoalTracker = () => {
  const {setPoints}=usePoints();
  const [goals] = useState([
    { id: 1, name: 'Instagram', target: 3, unit: 'hours', current: 0 },
    { id: 2, name: 'Sleep', target: 10, unit: 'hours', current: 0 },
    {id:3,name:'Gym',target:2,unit:'hours',current:0}
  ]);

  const [progress, setProgress] = useState(
    goals.reduce((acc, goal) => ({ ...acc, [goal.id]: 0 }), {})
  );

  const handleIncrement = (goalId) => {
    if(goalId!=3)
    {
    if(!(goals.find(g => g.id === goalId).target===goals.find(g => g.id === goalId).current))
    {setPoints((prev)=>prev+50)
    setProgress(prev => ({
      ...prev,
      [goalId]: Math.min(prev[goalId] + 0.5, goals.find(g => g.id === goalId).target)
    }));
  }
  }
  else
  {
    if(!(goals.find(g => g.id === goalId).target===goals.find(g => g.id === goalId).current))
     {setPoints((prev)=>prev-50)
    setProgress(prev => ({
      ...prev,
      [goalId]: Math.min(prev[goalId] + 0.5, goals.find(g => g.id === goalId).target)
    }));
  }
  }
  };

  const handleDecrement = (goalId) => {
    if(goalId!=3)
    {  
    setPoints((prev)=>prev-50)
    setProgress(prev => ({
      ...prev,
      [goalId]: Math.max(prev[goalId] - 0.5, 0)
    }));
  }
  else{
    setPoints((prev)=>prev+50)
    setProgress(prev => ({
      ...prev,
      [goalId]: Math.max(prev[goalId] - 0.5, 0)
    }));
  }
  };
  
  const calculatePercentage = (current, target) => {
    return (current / target) * 100;
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-pink-300 rounded-lg shadow-lg mt-4   ">
      <h1 className="text-2xl font-bold mb-6 text-pink-700">Daily Goal Tracker</h1>
      
      {goals.map(goal => (
        <div key={goal.id} className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="font-medium text-pink-700">{goal.name}</span>
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => handleDecrement(goal.id)}
                className="px-2 py-1 bg-pink-200 text-pink-600 rounded hover:bg-pink-300"
              >
                -
              </button>
              <span className="w-20 text-center">
                {progress[goal.id]} / {goal.target} {goal.unit}
              </span>
              <button 
                onClick={() => handleIncrement(goal.id)}
                className="px-2 py-1 bg-pink-600 text-pink-200 rounded hover:bg-pink-700"
              >
                +
              </button>
            </div>
          </div>
          
          <div className="w-full bg-pink-200 rounded-full h-2.5">
            <div 
              className="bg-pink-600 h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${calculatePercentage(progress[goal.id], goal.target)}%` }}
            ></div>
          </div>
          
          <div className="text-right text-sm text-gray-500 mt-1">
            {calculatePercentage(progress[goal.id], goal.target).toFixed(1)}%
          </div>
        </div>
      ))}
    </div>
  );
};

export default DailyGoalTracker;