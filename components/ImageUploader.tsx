import React, { useCallback, useState, useRef, useEffect } from 'react';
import { Upload, Image as ImageIcon, X, Camera, RefreshCw } from 'lucide-react';

interface ImageUploaderProps {
  onImageSelect: (file: File) => void;
  isLoading: boolean;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageSelect, isLoading }) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Cleanup camera on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const handleFile = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      onImageSelect(file);
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      streamRef.current = stream;
      setIsCameraOpen(true);
      // Small delay to ensure video element is rendered
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
      }, 100);
    } catch (err) {
      console.error("Error accessing camera:", err);
      alert("Unable to access camera. Please check if your browser allows camera access.");
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCameraOpen(false);
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0);
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], "camera-capture.jpg", { type: "image/jpeg" });
            handleFile(file);
            stopCamera();
          }
        }, 'image/jpeg', 0.95);
      }
    }
  };

  const onDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, [onImageSelect]);

  const onDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const clearImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreview(null);
    stopCamera();
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        onDrop={isCameraOpen ? undefined : onDrop}
        onDragOver={isCameraOpen ? undefined : onDragOver}
        onDragLeave={isCameraOpen ? undefined : onDragLeave}
        className={`
          relative group
          border-3 border-dashed rounded-3xl transition-all duration-300 ease-in-out
          flex flex-col items-center justify-center
          min-h-[350px] overflow-hidden
          ${isDragging 
            ? 'border-yellow-500 bg-yellow-900/10 scale-[1.02]' 
            : 'border-zinc-800 bg-zinc-900/50'
          }
          ${(preview || isCameraOpen) ? 'border-none p-0 bg-black' : 'hover:border-yellow-500/50 hover:bg-zinc-900 p-8 cursor-pointer'}
        `}
      >
        {!isCameraOpen && !preview && (
          <input
            type="file"
            accept="image/*"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            onChange={handleInputChange}
            disabled={isLoading}
          />
        )}

        {/* Camera View */}
        {isCameraOpen && (
          <div className="relative w-full h-full min-h-[350px] bg-black flex flex-col items-center justify-center z-30">
            <video 
              ref={videoRef} 
              className="w-full h-full object-cover" 
              playsInline 
              muted 
            />
            <div className="absolute bottom-6 flex gap-4 z-40">
               <button
                onClick={(e) => { e.stopPropagation(); stopCamera(); }}
                className="bg-black/50 backdrop-blur-md hover:bg-black/70 text-white p-3 rounded-full transition-all border border-white/10"
                title="Cancel"
              >
                <X className="w-6 h-6" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); capturePhoto(); }}
                className="bg-transparent border-4 border-yellow-500 w-16 h-16 rounded-full flex items-center justify-center hover:scale-105 active:scale-95 transition-transform"
                title="Capture Photo"
              >
                <div className="w-12 h-12 bg-yellow-400 rounded-full border-2 border-black"></div>
              </button>
            </div>
          </div>
        )}

        {/* Image Preview View */}
        {preview && !isCameraOpen && (
          <div className="relative w-full h-full flex items-center justify-center bg-black rounded-3xl overflow-hidden min-h-[350px]">
            <img 
              src={preview} 
              alt="Preview" 
              className="max-h-[500px] w-auto object-contain"
            />
            {!isLoading && (
              <div className="absolute top-4 right-4 z-20 flex gap-2">
                <button
                    onClick={(e) => { e.stopPropagation(); setPreview(null); startCamera(); }}
                    className="bg-black/50 hover:bg-black/70 backdrop-blur-md text-white p-2 rounded-full transition-colors border border-white/10"
                    title="Retake Photo"
                  >
                    <RefreshCw className="w-5 h-5" />
                  </button>
                <button
                  onClick={clearImage}
                  className="bg-black/50 hover:bg-black/70 backdrop-blur-md text-white p-2 rounded-full transition-colors border border-white/10"
                  title="Clear"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            )}
            {isLoading && (
              <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/80 backdrop-blur-sm">
                 <div className="flex flex-col items-center gap-4">
                   <div className="w-12 h-12 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
                   <p className="text-yellow-400 font-medium animate-pulse">Analyzing Food Quality...</p>
                 </div>
              </div>
            )}
          </div>
        )}

        {/* Default Upload View */}
        {!preview && !isCameraOpen && (
          <div className="text-center space-y-6 pointer-events-none relative z-0">
            <div className="flex justify-center gap-4">
                <div className={`
                w-20 h-20 rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(234,179,8,0.1)]
                ${isDragging ? 'bg-yellow-500 text-black' : 'bg-zinc-800 text-yellow-500 border border-zinc-700'}
                transition-transform duration-300 ${isDragging ? 'scale-110' : ''}
                `}>
                {isDragging ? <Upload className="w-10 h-10" /> : <ImageIcon className="w-10 h-10" />}
                </div>
            </div>
            
            <div>
              <p className="text-xl font-bold text-zinc-200">
                {isDragging ? 'Drop to Analyze' : 'Upload Food Image'}
              </p>
              <p className="text-sm text-zinc-500 mt-2 max-w-xs mx-auto">
                Drag & drop a photo, browse your files, or use the camera
              </p>
            </div>

            <div className="flex gap-3 justify-center pointer-events-auto">
                 <span className="px-4 py-2 bg-zinc-800 border border-zinc-700 hover:bg-zinc-700 hover:text-white rounded-lg text-sm font-medium text-zinc-300 shadow-sm transition-colors">
                    Browse Files
                 </span>
                 <button 
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        startCamera();
                    }}
                    disabled={isLoading}
                    className="relative z-20 px-4 py-2 bg-yellow-500 text-black rounded-lg text-sm font-bold shadow-[0_0_15px_rgba(234,179,8,0.3)] hover:bg-yellow-400 hover:shadow-[0_0_20px_rgba(234,179,8,0.5)] transition-all flex items-center gap-2"
                 >
                    <Camera className="w-4 h-4" />
                    Take Photo
                 </button>
            </div>
            
            <div className="flex gap-2 justify-center pt-2 opacity-40">
              <span className="px-2 py-1 bg-zinc-800 rounded text-[10px] text-zinc-400 font-medium uppercase tracking-wider">JPG</span>
              <span className="px-2 py-1 bg-zinc-800 rounded text-[10px] text-zinc-400 font-medium uppercase tracking-wider">PNG</span>
              <span className="px-2 py-1 bg-zinc-800 rounded text-[10px] text-zinc-400 font-medium uppercase tracking-wider">WEBP</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUploader;