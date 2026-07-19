import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const images = [
  "/test.img/1.webp",
  "/test.img/2.webp",
  "/test.img/3.webp",
  "/test.img/5.webp",
  "/test.img/6.webp"
];

// automatically fills the div if no height for div it is not visible, images change every 2 seconds if mouse hover image change stops support swipe i.e image is fully swipable 

const variants = {
  enter: (direction) => ({
    x: direction > 0 ? 150 : -150, 
    opacity: 0
  }),
  center: {
    x: 0,
    opacity: 1
  },
  exit: (direction) => ({
    x: direction > 0 ? -150 : 150,
    opacity: 0
  })
};

const Carousel = () => {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const timerRef = useRef(null);

  const nextSlide = useCallback(() => {
    setDirection(1);
    setIndex((prev) => (prev + 1) % images.length);
  }, []);

  const prevSlide = useCallback(() => {
    setDirection(-1);
    setIndex((prev) => (prev - 1 + images.length) % images.length);
  }, []);

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(nextSlide, 2000);
  }, [nextSlide]);

  useEffect(() => {
    resetTimer();
    return () => clearInterval(timerRef.current);
  }, [resetTimer]);

  const handleDragEnd = (event, info) => {
    if (info.offset.x > 50) prevSlide();
    else if (info.offset.x < -50) nextSlide();
    resetTimer();
  };

  const handleDotClick = (i) => {
    setDirection(i > index ? 1 : -1);
    setIndex(i);
    resetTimer();
  };

  const arrowStyle = {
    position: 'absolute', 
    top: '50%', 
    zIndex: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '44px',
    height: '44px',
    borderRadius: '50%',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    backdropFilter: 'blur(4px)',
    color: '#ffffff',
    border: 'none',
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
  };

  return (
    <div 
      // Changed width and height to 100% so it fills its parent div
      style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden', margin: 'auto', borderRadius: '12px', boxShadow: '0 8px 24px rgba(0,0,0,0.12)' }}
      onMouseEnter={() => clearInterval(timerRef.current)} 
      onMouseLeave={resetTimer} 
    >
      <AnimatePresence initial={false} custom={direction} mode='popLayout'>
        <motion.img
          key={index}
          src={images[index]}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ type: 'tween', ease: 'easeInOut', duration: 0.5 }}
          style={{ 
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%', 
            height: '100%', 
            objectFit: 'cover',
            cursor: 'grab'
          }}
          whileTap={{ cursor: 'grabbing' }}
          drag="x" 
          dragConstraints={{ left: 0, right: 0 }}
          onDragEnd={handleDragEnd}
          alt={`Slide ${index + 1}`}
        />
      </AnimatePresence>

      <motion.button 
        onClick={() => { prevSlide(); resetTimer(); }} 
        style={{ ...arrowStyle, left: '16px', y: '-50%' }}
        whileHover={{ scale: 1.1, backgroundColor: 'rgba(0, 0, 0, 0.65)' }}
        whileTap={{ scale: 0.95 }}
        aria-label="Previous Slide"
      >
        <ChevronLeft size={22} strokeWidth={2.5} />
      </motion.button>

      <motion.button 
        onClick={() => { nextSlide(); resetTimer(); }} 
        style={{ ...arrowStyle, right: '16px', y: '-50%' }}
        whileHover={{ scale: 1.1, backgroundColor: 'rgba(0, 0, 0, 0.65)' }}
        whileTap={{ scale: 0.95 }}
        aria-label="Next Slide"
      >
        <ChevronRight size={22} strokeWidth={2.5} />
      </motion.button>

      <div style={{ position: 'absolute', bottom: '16px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '8px', zIndex: 10 }}>
        {images.map((_, i) => (
          <motion.button
            key={i}
            onClick={() => handleDotClick(i)}
            style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              backgroundColor: i === index ? '#ffffff' : 'rgba(255, 255, 255, 0.4)',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 1px 4px rgba(0,0,0,0.2)'
            }}
            animate={{ scale: i === index ? 1.2 : 1 }}
            transition={{ duration: 0.2 }}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default Carousel;