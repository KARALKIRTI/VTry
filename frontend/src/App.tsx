import React, { useState, useRef, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import Header from './components/Header';
import ImageUpload from './components/ImageUpload';  // ✅ Using `ImageUpload.tsx`
import ProcessingStatus from './components/ProcessingStatus';
import ResultDisplay from './components/ResultDisplay';

function App() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [userImage, setUserImage] = useState<File | null>(null);
  const [clothImage, setClothImage] = useState<File | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  // 🟢 Upload Images to Backend (Flask API)
  const uploadImages = async () => {
    if (!userImage || !clothImage) {
      alert("Please upload both user and cloth images");
      return;
    }

    const formData = new FormData();
    formData.append('user_image', userImage);
    formData.append('cloth_image', clothImage);

    try {
      const response = await fetch('http://127.0.0.1:5000/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        console.log("✅ Images uploaded successfully!");
      } else {
        console.error("❌ Error uploading images:", data.error);
        alert(`Upload failed: ${data.error}`);
      }
    } catch (error) {
      console.error("❌ Error uploading images:", error);
    }
  };

  // 🟢 Start Processing (Trigger Backend Script)
  const handleStartProcessing = async () => {
    if (userImage && clothImage) {
      setIsProcessing(true);
      setIsComplete(false);

      try {
        const response = await fetch('http://127.0.0.1:5000/process', {
          method: 'POST'
        });
        const data = await response.json();

        if (data.image_url) {
          setResultImage(data.image_url);
          setIsComplete(true);
        } else {
          alert("❌ Error processing image");
        }
      } catch (error) {
        console.error("❌ Error processing:", error);
      }

      setIsProcessing(false);
    }
  };

  useEffect(() => {
    if (isComplete && resultRef.current) {
      resultRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  }, [isComplete]);

  // ✅ Corrected File Handling
  const handleImageUpload = (type: 'user' | 'cloth', file: File) => {
    if (type === 'user') {
      setUserImage(file);
    } else {
      setClothImage(file);
    }
    setIsComplete(false);
  };

  const handleImageRemove = (type: 'user' | 'cloth') => {
    if (type === 'user') {
      setUserImage(null);
    } else {
      setClothImage(null);
    }
    setIsComplete(false);
    setIsProcessing(false);
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <ImageUpload 
        onStartProcessing={async () => {
          await uploadImages(); // 🟢 First, upload images
          handleStartProcessing(); // 🟢 Then start processing
        }}
        onImageUpload={handleImageUpload}
        onImageRemove={handleImageRemove}
        userImage={userImage}
        clothImage={clothImage}
      />
      <AnimatePresence>
        {isProcessing && <ProcessingStatus />}
      </AnimatePresence>
      <div ref={resultRef}>
        <AnimatePresence>
          {isComplete && resultImage && <ResultDisplay imageUrl={resultImage} />}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default App;
