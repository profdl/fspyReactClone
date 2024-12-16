import React from 'react';
import { ImageUploader } from './components/ImageUploader';
import { PerspectiveEditor } from './components/PerspectiveEditor';
import { ThreeScene } from './components/ThreeScene';
import { useStore } from './store/useStore';
import { Download } from 'lucide-react';

function App() {
  const imageUrl = useStore((state) => state.imageUrl);

  const handleExport = () => {
    // TODO: Implement scene export functionality
    console.log('Exporting scene...');
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Online Perspective Camera Calibrator
          </h1>
          <p className="text-gray-600">
            Upload an image, mark perspective points, and generate a 3D scene
          </p>
        </header>

        {!imageUrl ? (
          <ImageUploader />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-gray-800">
                Perspective Editor
              </h2>
              <PerspectiveEditor />
            </div>
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-gray-800">3D Preview</h2>
              <ThreeScene />
              <button
                onClick={handleExport}
                className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
              >
                <Download size={20} />
                Export Scene
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;