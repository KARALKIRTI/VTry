import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, Wand2, Sparkles } from 'lucide-react';

interface UploadBoxProps {
  title: string;
  onFileSelect: (file: File) => void;
  preview: string | null;
  onRemove: () => void;
}

const UploadBox: React.FC<UploadBoxProps> = ({ title, onFileSelect, preview, onRemove }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) onFileSelect(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative w-full"
    >
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative overflow-hidden rounded-xl
          ${isDragging ? 'border-purple-500 bg-purple-50' : 'border-gray-300 bg-white'}
          ${preview ? 'border-2' : 'border-2 border-dashed'}
          transition-all duration-300 hover:border-purple-500 hover:shadow-lg
        `}
      >
        <AnimatePresence mode="wait">
          {preview ? (
            <motion.div
              key="preview"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="relative"
            >
              <img src={preview} alt="Preview" className="w-full h-auto max-h-64 object-contain" />
              <motion.button
                onClick={onRemove}
                className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <X className="w-4 h-4" />
              </motion.button>
            </motion.div>
          ) : (
            <motion.div
              key="upload"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center h-64 p-6"
            >
              <motion.div
                animate={{ y: isDragging ? -10 : 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <Upload className="w-12 h-12 text-purple-400 mb-4" />
              </motion.div>
              <h3 className="text-lg font-medium mb-2">{title}</h3>
              <p className="text-sm text-gray-500 text-center">
                Drag & drop your image here or click to browse
              </p>
              <label htmlFor={`fileUpload-${title}`} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer">
                <input
                  id={`fileUpload-${title}`}
                  type="file"
                  onChange={(e) => e.target.files?.[0] && onFileSelect(e.target.files[0])}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  accept="image/*"
                  title="Upload an image file"
                />
              </label>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

interface ImageUploadProps {
  onStartProcessing: () => void;
  onImageUpload: (type: 'user' | 'cloth', image: File) => void;
  onImageRemove: (type: 'user' | 'cloth') => void;
  userImage: File | null;
  clothImage: File | null;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  onStartProcessing,
  onImageUpload,
  onImageRemove,
  userImage,
  clothImage
}) => {
  const [userPreview, setUserPreview] = useState<string | null>(null);
  const [clothPreview, setClothPreview] = useState<string | null>(null);

  const handleFileSelect = (file: File, type: 'user' | 'cloth') => {
    onImageUpload(type, file);

    // ✅ Generate preview
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (type === 'user') setUserPreview(result);
      else setClothPreview(result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <section id="upload-section" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">Upload Your Images</h2>
            <p className="text-gray-600">Let's transform your style with AI magic</p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <UploadBox
              title="Upload Your Photo"
              onFileSelect={(file) => handleFileSelect(file, 'user')}
              preview={userPreview}
              onRemove={() => {
                setUserPreview(null);
                onImageRemove('user');
              }}
            />
            <UploadBox
              title="Upload Clothing Item"
              onFileSelect={(file) => handleFileSelect(file, 'cloth')}
              preview={clothPreview}
              onRemove={() => {
                setClothPreview(null);
                onImageRemove('cloth');
              }}
            />
          </div>

          <AnimatePresence>
            {userImage && clothImage && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex flex-col items-center gap-6"
              >
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="bg-purple-100 text-purple-700 rounded-full px-6 py-2"
                >
                  <span className="font-medium">Both images uploaded successfully! ✨</span>
                </motion.div>

                <motion.button
                  onClick={onStartProcessing}
                  className="group relative overflow-hidden bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 text-white px-12 py-6 rounded-2xl font-bold text-xl shadow-xl hover:shadow-2xl transition-shadow"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="relative flex items-center gap-3">
                    <Wand2 className="w-6 h-6" />
                    Start Magic!
                    <Sparkles className="w-6 h-6" />
                  </span>
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default ImageUpload;
