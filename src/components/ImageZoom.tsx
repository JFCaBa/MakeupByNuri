'use client';

import React, { useState, useRef, useEffect } from 'react';

interface ImageZoomProps {
  src: string;
  alt: string;
  className?: string;
}

const ImageZoom: React.FC<ImageZoomProps> = ({ src, alt, className }) => {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isZoomed, setIsZoomed] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault(); // Prevent scrolling the page when hovering over the image
    const zoomIntensity = 0.1;
    const newZoomLevel = e.deltaY < 0 ? zoomLevel + zoomIntensity : zoomLevel - zoomIntensity;

    // Limit zoom range between 1x and 5x
    const limitedZoom = Math.min(Math.max(newZoomLevel, 1), 5);
    
    setZoomLevel(limitedZoom);
    if (limitedZoom > 1) {
      setIsZoomed(true);
    } else {
      setIsZoomed(false);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current || zoomLevel <= 1) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setPosition({ x, y });
  };

  const resetZoom = () => {
    setZoomLevel(1);
    setIsZoomed(false);
    setPosition({ x: 0, y: 0 });
  };

  const handleDoubleClick = () => {
    if (isZoomed) {
      resetZoom();
    } else {
      setZoomLevel(2);
      setIsZoomed(true);
    }
  };

  // Reset zoom when src changes
  useEffect(() => {
    resetZoom();
  }, [src]);

  return (
    <div 
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
      onWheel={handleWheel}
      onMouseMove={handleMouseMove}
      onDoubleClick={handleDoubleClick}
      style={{ cursor: zoomLevel > 1 ? 'zoom-out' : 'zoom-in' }}
    >
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-contain transition-transform duration-150 ease-out"
        style={{
          transform: `scale(${zoomLevel})`,
          transformOrigin: `${position.x}% ${position.y}%`,
        }}
      />
      
      {isZoomed && (
        <div 
          className="absolute top-2 right-2 bg-black/50 text-white rounded-full w-8 h-8 flex items-center justify-center cursor-pointer z-10"
          onClick={resetZoom}
          style={{ fontSize: '12px' }}
        >
          ×
        </div>
      )}
      
      {zoomLevel > 1 && (
        <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded z-10">
          {Math.round(zoomLevel * 100)}%
        </div>
      )}
    </div>
  );
};

export default ImageZoom;