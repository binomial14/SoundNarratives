import React, { useState, useEffect } from 'react';

const LoadingDots = () => {
  const [dots, setDots] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setDots((prevDots) => (prevDots === 3 ? 0 : prevDots + 1));
    }, 500);

    // Clear the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []);

  const getLoadingText = () => {
    return '.'.repeat(dots);
  };

  return (
    <div className="string-item">
      {getLoadingText()}
    </div>
  );
};

export default LoadingDots;