import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const Car360Viewer = ({ images = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRotating, setIsRotating] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);
  
  const containerRef = useRef(null);
  const startXRef = useRef(0);
  const startIndexRef = useRef(0);

  // Preload images for smooth rotation
  useEffect(() => {
    if (images.length === 0) return;
    
    let loadedCount = 0;
    images.forEach((src) => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        loadedCount++;
        setLoadProgress(Math.round((loadedCount / images.length) * 100));
        if (loadedCount === images.length) {
          setIsLoaded(true);
        }
      };
    });
  }, [images]);

  const handleStart = (clientX) => {
    if (!isLoaded) return;
    setIsRotating(true);
    startXRef.current = clientX;
    startIndexRef.current = currentIndex;
  };

  const handleMove = (clientX) => {
    if (!isRotating) return;
    
    const deltaX = clientX - startXRef.current;
    const sensitivity = 5; // Pixels per frame change
    const frameChange = Math.floor(deltaX / sensitivity);
    
    let nextIndex = (startIndexRef.current - frameChange) % images.length;
    if (nextIndex < 0) nextIndex += images.length;
    
    setCurrentIndex(nextIndex);
  };

  const handleEnd = () => {
    setIsRotating(false);
  };

  return (
    <div 
      ref={containerRef}
      className="relative w-full aspect-video md:aspect-[16/9] bg-[#0a0a0a] rounded-2xl overflow-hidden cursor-grab active:cursor-grabbing border border-white/5 group"
      onMouseDown={(e) => handleStart(e.clientX)}
      onMouseMove={(e) => handleMove(e.clientX)}
      onMouseUp={handleEnd}
      onMouseLeave={handleEnd}
      onTouchStart={(e) => handleStart(e.touches[0].clientX)}
      onTouchMove={(e) => handleMove(e.touches[0].clientX)}
      onTouchEnd={handleEnd}
    >
      {!isLoaded && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-[#0a0a0a] z-10">
          <div className="w-48 h-1 bg-white/10 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-primary" 
              initial={{ width: 0 }}
              animate={{ width: `${loadProgress}%` }}
            />
          </div>
          <p className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-black animate-pulse">Initializing 360° Vision ({loadProgress}%)</p>
        </div>
      )}

      {isLoaded && images.length > 0 && (
        <div className="w-full h-full relative">
          <img 
            src={images[currentIndex]} 
            alt={`Car view ${currentIndex}`}
            className="w-full h-full object-contain pointer-events-none select-none transition-opacity duration-300"
          />
          
          {/* UI Overlays */}
          <div className="absolute inset-x-0 bottom-6 flex justify-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="bg-black/60 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 flex items-center gap-3">
               <div className="w-1.5 h-1.5 rounded-full bg-primary animate-ping" />
               <span className="text-[10px] font-bold text-white uppercase tracking-widest whitespace-nowrap">Drag horizontally to rotate</span>
            </div>
          </div>

          <div className="absolute top-6 right-6 flex flex-col items-end gap-1 opacity-40">
             <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Frame</span>
             <span className="text-xl font-bold text-white">{currentIndex + 1}<span className="text-gray-600 text-xs ml-0.5">/{images.length}</span></span>
          </div>
        </div>
      )}

      {images.length === 0 && (
        <div className="w-full h-full flex items-center justify-center text-gray-500 text-xs uppercase tracking-widest">
           No 360° Data Available for this vehicle
        </div>
      )}
    </div>
  );
};

export default Car360Viewer;
