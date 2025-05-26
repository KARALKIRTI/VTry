import React from 'react';
import { motion } from 'framer-motion';
import { Download, Share2, Star } from 'lucide-react';

interface ResultDisplayProps {
  imageUrl: string;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ imageUrl }) => {
  const handleDownload = async () => {
    try {
      const response = await fetch(imageUrl, { mode: 'cors' });
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'VirtualWardrobe_Result.jpg';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("❌ Error downloading image:", error);
      alert("Failed to download image. Please try again.");
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: 'Virtual Wardrobe Try-On',
          text: 'Check out my virtual outfit!',
          url: imageUrl,
        })
        .then(() => console.log('✅ Shared successfully'))
        .catch((err) => console.error('❌ Sharing failed', err));
    } else {
      const whatsappURL = `https://wa.me/?text=Check out my virtual outfit! 👗🧥\n${encodeURIComponent(imageUrl)}`;
      window.open(whatsappURL, '_blank');
    }
  };

  return (
    <section className="py-16 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center"
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 rounded-full px-6 py-2 mb-8"
          >
            <Star className="w-5 h-5" />
            <span className="font-medium">Magic Complete!</span>
          </motion.div>

          <motion.h2 
            className="text-4xl font-bold mb-12 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent"
          >
            🎉 Voila! Your Stylish Avatar Awaits!
          </motion.h2>
          
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="bg-white rounded-2xl shadow-xl p-8 mb-8 transform-gpu"
          >
            <div className="relative overflow-hidden rounded-xl mb-6">
              <img
                src={imageUrl}
                alt="Result Preview"
                className="w-full h-auto max-h-[600px] object-contain"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>
            
            <div className="flex justify-center gap-4">
              <motion.button
                onClick={handleDownload}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all duration-300"
              >
                <Download className="w-5 h-5" />
                Download Result
              </motion.button>

              <motion.button
                onClick={handleShare}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-gray-200 text-gray-700 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-all duration-300"
              >
                <Share2 className="w-5 h-5" />
                Share
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default ResultDisplay;
