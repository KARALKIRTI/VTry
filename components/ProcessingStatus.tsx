import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Scissors, Wand2, Palette } from 'lucide-react';

const ProcessingStatus = () => {
  const [currentStep, setCurrentStep] = React.useState(0);
  const steps = [
    {
      icon: Scissors,
      text: "Stitching Pixels",
      color: "from-purple-500 to-indigo-500"
    },
    {
      icon: Wand2,
      text: "Blending Magic",
      color: "from-indigo-500 to-blue-500"
    },
    {
      icon: Palette,
      text: "Crafting Your Look",
      color: "from-blue-500 to-purple-500"
    }
  ];

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % steps.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const DotsAnimation = () => {
    const [dots, setDots] = React.useState('');
    
    React.useEffect(() => {
      const dotsInterval = setInterval(() => {
        setDots(prev => prev.length >= 3 ? '' : prev + '.');
      }, 500);
      return () => clearInterval(dotsInterval);
    }, []);

    return <span className="inline-block w-6">{dots}</span>;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 flex items-center justify-center z-50"
    >
      {/* Overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
      />

      {/* Content */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="relative bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-8 shadow-xl overflow-hidden max-w-sm mx-4"
      >
        {/* Animated background particles */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full"
              initial={{ 
                x: Math.random() * 100 + '%',
                y: '100%',
                opacity: Math.random() * 0.5 + 0.3
              }}
              animate={{ 
                y: '-100%',
                opacity: [0.3, 0.8, 0.3]
              }}
              transition={{
                duration: Math.random() * 2 + 2,
                repeat: Infinity,
                ease: "linear",
                delay: Math.random() * -2
              }}
            />
          ))}
        </div>

        <div className="relative">
          <motion.div 
            className="flex flex-col items-center justify-center"
            animate={{ opacity: 1 }}
            initial={{ opacity: 0 }}
          >
            {/* Main animation container */}
            <motion.div
              className="relative w-16 h-16 mb-4"
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-blue-500 to-purple-500 rounded-full opacity-20 blur-xl" />
              
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ 
                    scale: 1, 
                    opacity: 1,
                    rotate: [0, 10, -10, 0]
                  }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className={`
                    w-full h-full rounded-full 
                    bg-gradient-to-br ${steps[currentStep].color}
                    flex items-center justify-center
                    shadow-lg
                  `}
                >
                  {React.createElement(steps[currentStep].icon, {
                    className: "w-8 h-8 text-white",
                    strokeWidth: 1.5
                  })}
                </motion.div>
              </AnimatePresence>
            </motion.div>

            {/* Text animation */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-center"
              >
                <motion.p 
                  className="text-lg font-medium bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent"
                  animate={{ 
                    scale: [1, 1.02, 1],
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  {steps[currentStep].text}
                  <DotsAnimation />
                </motion.p>
              </motion.div>
            </AnimatePresence>

            {/* Circular progress */}
            <svg className="absolute inset-0 w-full h-full -rotate-90">
              <motion.circle
                cx="50%"
                cy="50%"
                r="45%"
                stroke="currentColor"
                strokeWidth="1"
                fill="none"
                className="text-purple-200"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 3, repeat: Infinity }}
              />
            </svg>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ProcessingStatus;