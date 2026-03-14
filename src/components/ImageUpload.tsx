import React from 'react';
import { motion } from 'motion/react';
import { RefreshCcw, Camera, X, ChevronRight } from 'lucide-react';

interface ImageUploadProps {
  inspectionMode: 'laptop' | 'siteprint';
  selectedModel: string;
  setStep: (step: number) => void;
  getRootProps: any;
  getInputProps: any;
  isDragActive: boolean;
  images: any[];
  removeImage: (index: number) => void;
  handleAnalyze: () => void;
}

export function ImageUpload({
  inspectionMode,
  selectedModel,
  setStep,
  getRootProps,
  getInputProps,
  isDragActive,
  images,
  removeImage,
  handleAnalyze
}: ImageUploadProps) {
  const cn = (...classes: any[]) => classes.filter(Boolean).join(' ');

  return (
    <motion.div
      key="step2"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="max-w-4xl mx-auto px-6 sm:px-8 py-12 space-y-8"
    >
      <div className="flex items-center justify-between">
        <button onClick={() => setStep(1)} className="flex items-center gap-2 text-slate-500 hover:text-hp-dark">
          <RefreshCcw className="w-4 h-4" /> Change Model
        </button>
        <div className="px-3 py-1 bg-hp-blue/10 text-hp-blue rounded-full text-sm font-bold">
          {inspectionMode === 'laptop' ? selectedModel : 'HP SitePrint Inkjet'}
        </div>
      </div>

      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-hp-dark">
          {inspectionMode === 'laptop' ? 'Capture or Upload Photos' : 'Inspect SitePrint Inkjet'}
        </h2>
        <p className="text-slate-500">
          {inspectionMode === 'laptop' 
            ? 'Take clear photos of the shell, screen, and keyboard.' 
            : 'Take close-up photos of the external inkjet part.'}
        </p>
      </div>

      <div {...getRootProps()} className={cn(
        "border-2 border-dashed rounded-3xl p-12 text-center transition-all cursor-pointer",
        isDragActive ? "border-hp-blue bg-hp-blue/5" : "border-slate-200 bg-white hover:border-hp-blue/30"
      )}>
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 bg-hp-blue/10 rounded-full flex items-center justify-center">
            <Camera className="w-8 h-8 text-hp-blue" />
          </div>
          <div>
            <p className="text-lg font-semibold">Drop images here or click to upload</p>
            <p className="text-sm text-slate-400">Supports JPG, PNG (Max 10MB)</p>
          </div>
        </div>
      </div>

      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {images.map((img, idx) => (
            <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden border border-slate-200 group">
              <img src={img.preview} alt="Preview" className="w-full h-full object-cover" />
              <button onClick={() => removeImage(idx)} className="absolute top-2 right-2 p-1 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex justify-center">
        <button
          disabled={images.length === 0}
          onClick={handleAnalyze}
          className="px-10 py-4 bg-hp-blue text-white rounded-full font-bold text-lg shadow-xl shadow-hp-blue/30 hover:bg-hp-blue/90 disabled:opacity-50 transition-all flex items-center gap-2"
        >
          Start AI Analysis
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </motion.div>
  );
}
