import React, { useState, useEffect } from 'react';
import imageCache from '../utils/imageCache';

const PerformanceStats = ({ isVisible = false }) => {
  const [stats, setStats] = useState({
    cacheSize: 0,
    cacheUsage: '0%',
    preloadedImages: 0,
    totalImages: 0
  });

  useEffect(() => {
    if (!isVisible) return;

    const updateStats = () => {
      const cacheStats = imageCache.getStats();
      setStats({
        cacheSize: cacheStats.size,
        cacheUsage: cacheStats.usage,
        preloadedImages: cacheStats.size,
        totalImages: cacheStats.size
      });
    };

    updateStats();
    const interval = setInterval(updateStats, 2000);

    return () => clearInterval(interval);
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-black bg-opacity-80 text-white p-3 rounded-lg text-xs z-50">
      <div className="font-semibold mb-2">📊 Performance</div>
      <div className="space-y-1">
        <div>Cache: {stats.cacheSize} images</div>
        <div>Usage: {stats.cacheUsage}</div>
        <div>Preloaded: {stats.preloadedImages}</div>
      </div>
    </div>
  );
};

export default PerformanceStats;


