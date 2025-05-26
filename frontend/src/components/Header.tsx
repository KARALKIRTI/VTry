import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Wand2 } from 'lucide-react';

const Header = () => {
  const scrollToUpload = () => {
    const uploadSection = document.getElementById('upload-section');
    uploadSection?.scrollIntoView({ behavior: 'smooth' });
  };

  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.2,
        duration: 0.8,
        ease: "easeOut"
      }
    })
  };

  return (
    <header className="relative overflow-hidden bg-gradient-to-r from-purple-900 via-indigo-900 to-blue-900 text-white py-24">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1441986300917-64674bd600d8')] opacity-10 bg-cover bg-center" />
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.2 }}
        transition={{ duration: 1.5 }}
        className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-900/20 to-indigo-900/30"
      />
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="flex items-center justify-center gap-2 bg-white/10 rounded-full px-6 py-2 mb-8 mx-auto w-fit backdrop-blur-sm"
        >
          <Wand2 className="w-5 h-5" />
          <span className="text-sm font-medium">AI-Powered Style Magic</span>
        </motion.div>

        <div className="max-w-4xl mx-auto text-center">
          <motion.h1 
            custom={1}
            variants={textVariants}
            initial="hidden"
            animate="visible"
            className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-200 via-purple-200 to-teal-200"
          >
            Virtual Wardrobe
            <br />
            Instant Try-On Magic!
          </motion.h1>

          <motion.p 
            custom={2}
            variants={textVariants}
            initial="hidden"
            animate="visible"
            className="text-xl md:text-2xl text-gray-300 mb-12 max-w-2xl mx-auto"
          >
            Upload images and instantly see yourself in new styles powered by AI.
          </motion.p>

          <motion.button
            onClick={scrollToUpload}
            className="group relative bg-gradient-to-r from-blue-500 via-purple-500 to-teal-500 text-white px-8 py-4 rounded-full text-lg font-semibold overflow-hidden"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.span
              className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            />
            <span className="relative flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              Try It Now
            </span>
          </motion.button>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.1 }}
        transition={{ duration: 2 }}
        className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent"
      />
    </header>
  );
};

export default Header;