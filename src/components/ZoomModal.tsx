'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

interface ZoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  src: string;
  alt: string;
}

const ZoomModal: React.FC<ZoomModalProps> = ({ isOpen, onClose, src, alt }) => {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const imgRef = useRef<HTMLImageElement>(null);

  const resetZoom = useCallback(() => {
    setZoomLevel(1);
    setPosition({ x: 0, y: 0 });
  }, []);

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.2, 5));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.2, 0.5));
  };

  const handleRotateReset = () => {
    resetZoom();
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoomLevel <= 1) return;
    
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || zoomLevel <= 1) return;
    
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (zoomLevel <= 1 || e.touches.length !== 1) return;
    
    setIsDragging(true);
    setDragStart({
      x: e.touches[0].clientX - position.x,
      y: e.touches[0].clientY - position.y
    });
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!isDragging || zoomLevel <= 1 || e.touches.length !== 1) return;
    
    setPosition({
      x: e.touches[0].clientX - dragStart.x,
      y: e.touches[0].clientY - dragStart.y
    });
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleTouchMove as any, { passive: false });
      window.addEventListener('touchend', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove as any);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [isDragging, dragStart]);

  // Handle wheel zoom
  const handleWheel = (e: WheelEvent) => {
    if (!isOpen) return;
    
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.2 : 0.2;
    setZoomLevel(prev => Math.min(Math.max(prev + delta, 0.5), 5));
  };

  useEffect(() => {
    if (isOpen) {
      window.addEventListener('wheel', handleWheel, { passive: false });
    }

    return () => {
      window.removeEventListener('wheel', handleWheel);
    };
  }, [isOpen]);

  // Reset when modal closes
  useEffect(() => {
    if (!isOpen) {
      resetZoom();
      setIsDragging(false);
    }
  }, [isOpen, resetZoom]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="max-w-[95vw] max-h-[95vh] w-full h-full p-0 border-0 bg-black/90 flex items-center justify-center overflow-hidden"
        style={{ borderRadius: '0' }}
      >
        <div className="absolute top-4 right-4 z-20 flex gap-2">
          <Button
            variant="secondary"
            size="icon"
            className="rounded-full bg-black/50 hover:bg-black/70 text-white"
            onClick={handleZoomIn}
            aria-label="Acercar"
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
          
          <Button
            variant="secondary"
            size="icon"
            className="rounded-full bg-black/50 hover:bg-black/70 text-white"
            onClick={handleZoomOut}
            aria-label="Alejar"
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          
          <Button
            variant="secondary"
            size="icon"
            className="rounded-full bg-black/50 hover:bg-black/70 text-white"
            onClick={handleRotateReset}
            aria-label="Restablecer zoom"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
          
          <Button
            variant="secondary"
            size="icon"
            className="rounded-full bg-black/50 hover:bg-black/70 text-white"
            onClick={onClose}
            aria-label="Cerrar"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="relative w-full h-full flex items-center justify-center">
          <div 
            className="w-full h-full flex items-center justify-center overflow-hidden"
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
            style={{ cursor: zoomLevel > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default' }}
          >
            <img
              ref={imgRef}
              src={src}
              alt={alt}
              className="max-w-none transition-transform duration-150 ease-out"
              style={{
                transform: `scale(${zoomLevel}) translate(${position.x}px, ${position.y}px)`,
              }}
              draggable={false}
            />
          </div>
          
          {zoomLevel > 1 && (
            <div className="absolute bottom-4 left-4 bg-black/50 text-white text-sm px-2 py-1 rounded z-20">
              {Math.round(zoomLevel * 100)}%
            </div>
          )}
        </div>
        
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-sm bg-black/50 px-3 py-1 rounded-full z-20">
          Arrastra para mover la imagen | Rueda del mouse para hacer zoom
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ZoomModal;