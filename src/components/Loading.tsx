
import { useEffect, useState } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

const Loading = () => {
  const [progress, setProgress] = useState(0);
  const isMobile = useIsMobile();
  
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
    <div className="fixed inset-0 bg-[#0D0D0D] flex flex-col items-center justify-center px-4 z-50">
      <h1 className={`text-[#00FEFE] ${isMobile ? 'text-2xl md:text-3xl' : 'text-4xl'} font-bold mb-8`}>BILAL FAROOQ</h1>
      <div className={`${isMobile ? 'w-full max-w-64' : 'w-80'} h-2 bg-gray-700 rounded-full overflow-hidden`}>
        <div 
          className="h-full bg-gradient-to-r from-[#00FEFE] to-[#FF00FF] transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className={`mt-4 text-[#FF00FF] ${isMobile ? 'text-sm' : 'text-base'}`}>
        Loading Experience... {Math.round(progress)}%
      </p>
    </div>
  );
};

export default Loading;
