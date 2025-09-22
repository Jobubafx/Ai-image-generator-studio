
import React, { useState, useCallback } from 'react';
import { WorkflowStep, SourceImage, GeneratedImage, OutputPreset } from './types';
import { OUTPUT_PRESETS } from './constants';
import { generateImageModification, generateCreativeConcepts } from './services/geminiService';
import ImageUploader from './components/ImageUploader';
import Gallery from './components/Gallery';
import Loader from './components/Loader';
import { SparklesIcon, BackIcon } from './components/icons';

const App: React.FC = () => {
  const [workflowStep, setWorkflowStep] = useState<WorkflowStep>(WorkflowStep.UPLOAD);
  const [sourceImage, setSourceImage] = useState<SourceImage | null>(null);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [prompt, setPrompt] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [creativeSuggestions, setCreativeSuggestions] = useState<string[]>([]);

  const handleImageUpload = useCallback((image: SourceImage) => {
    setSourceImage(image);
    setWorkflowStep(WorkflowStep.EDIT);
    setError(null);
  }, []);

  const handlePresetSelect = (preset: OutputPreset) => {
    setPrompt(preset.prompt);
    setCreativeSuggestions([]);
  };
  
  const handleGetCreativeConcepts = async () => {
      if (!prompt) {
          setError("Please select a preset or write a base prompt first.");
          return;
      }
      setIsLoading(true);
      setLoadingMessage('Generating creative ideas...');
      setError(null);
      try {
          const concepts = await generateCreativeConcepts(prompt);
          setCreativeSuggestions(concepts);
      } catch (e: any) {
          setError(e.message || 'Failed to get suggestions.');
      } finally {
          setIsLoading(false);
      }
  };

  const handleGenerate = async () => {
    if (!sourceImage || !prompt) {
      setError("Source image and prompt are required.");
      return;
    }
    setIsLoading(true);
    setLoadingMessage('Generating your masterpiece...');
    setError(null);
    try {
      const generatedBase64 = await generateImageModification(sourceImage, prompt);
      const newImage: GeneratedImage = {
        id: new Date().toISOString(),
        src: `data:image/png;base64,${generatedBase64}`,
        prompt: prompt,
      };
      setGeneratedImages(prev => [newImage, ...prev]);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartOver = () => {
      setWorkflowStep(WorkflowStep.UPLOAD);
      setSourceImage(null);
      setPrompt('');
      setError(null);
      setCreativeSuggestions([]);
  };

  const renderHeader = () => (
    <div className="text-center mb-12">
      <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
        AI Image Generator Studio
      </h1>
      <p className="mt-4 text-lg text-gray-300">
        Transform your photos into professional works of art.
      </p>
    </div>
  );

  const renderEditor = () => {
    if (!sourceImage) return null;

    return (
        <div className="w-full max-w-7xl mx-auto">
             <button onClick={handleStartOver} className="flex items-center gap-2 text-purple-400 hover:text-purple-300 mb-6 transition-colors">
                <BackIcon className="w-5 h-5"/>
                Start Over
            </button>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="flex flex-col items-center">
                    <h3 className="text-2xl font-bold text-white mb-4">Your Image</h3>
                    <div className="rounded-lg overflow-hidden shadow-lg shadow-purple-900/30">
                        <img src={`data:${sourceImage.mimeType};base64,${sourceImage.base64}`} alt="Source" className="max-w-full max-h-[60vh] object-contain"/>
                    </div>
                </div>
                <div className="flex flex-col space-y-6">
                    <div>
                        <label className="block text-xl font-bold text-white mb-2">1. Choose a Style</label>
                        <div className="flex flex-wrap gap-2">
                            {OUTPUT_PRESETS.map(preset => (
                                <button key={preset.id} onClick={() => handlePresetSelect(preset)} className="px-4 py-2 text-sm bg-gray-700 text-white rounded-full hover:bg-purple-600 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500">
                                    {preset.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                         <label htmlFor="prompt" className="block text-xl font-bold text-white mb-2">2. Refine Your Prompt</label>
                        <textarea
                            id="prompt"
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder="Describe the image you want to create..."
                            className="w-full h-36 p-3 bg-gray-800 border border-gray-600 rounded-md text-white focus:ring-purple-500 focus:border-purple-500 transition"
                        />
                        <button onClick={handleGetCreativeConcepts} disabled={isLoading} className="mt-2 flex items-center justify-center gap-2 w-full sm:w-auto px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-500 transition-colors disabled:opacity-50">
                           <SparklesIcon className="w-5 h-5" />
                           Get Creative Ideas
                        </button>
                    </div>

                    {creativeSuggestions.length > 0 && (
                        <div>
                            <h4 className="text-lg font-semibold text-white mb-2">Suggestions:</h4>
                            <div className="space-y-2">
                                {creativeSuggestions.map((suggestion, index) => (
                                    <div key={index} onClick={() => setPrompt(suggestion)} className="p-3 bg-gray-800 border border-gray-700 rounded-md text-gray-300 hover:bg-gray-700 hover:border-purple-500 cursor-pointer transition-all">
                                        {suggestion}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="pt-4">
                        <button
                            onClick={handleGenerate}
                            disabled={isLoading}
                            className="w-full flex items-center justify-center gap-3 text-lg font-bold bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-6 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
                        >
                            <SparklesIcon className="w-6 h-6" />
                            Generate Image
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
  };
  
  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 sm:p-8 relative">
        <div className="container mx-auto">
            {isLoading && <Loader message={loadingMessage} />}
            {renderHeader()}
            {error && <div className="my-4 p-4 bg-red-800 border border-red-600 text-white rounded-md text-center">{error}</div>}
            
            {workflowStep === WorkflowStep.UPLOAD && <ImageUploader onImageUpload={handleImageUpload} />}
            {workflowStep === WorkflowStep.EDIT && renderEditor()}
            
            <Gallery images={generatedImages} />
        </div>
    </div>
  );
};

export default App;
