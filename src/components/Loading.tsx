
import { useEffect, useState } from 'react';

const Loading = () => {
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + Math.random() * 10;
        return newProgress >= 100 ? 100 : newProgress;
      });
    }, 200);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="fixed inset-0 bg-[#0D0D0D] flex flex-col items-center justify-center">
      <h1 className="text-[#00FEFE] text-4xl font-bold mb-8">BILAL FAROOQ</h1>
      <div className="w-80 h-2 bg-gray-700 rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-[#00FEFE] to-[#FF00FF] transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="mt-4 text-[#FF00FF]">Loading Experience... {Math.round(progress)}%</p>
    </div>
  );
};

export default Loading;
