'use client';

import { useState } from 'react';
import { Step } from '@/lib/types';

interface StepViewerProps {
  steps: Step[];
  origamiName: string;
}

export default function StepViewer({ steps, origamiName }: StepViewerProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const goToNextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const step = steps[currentStep];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="card">
        {/* Progress indicator */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-bold text-gray-600">
              Step {currentStep + 1} of {steps.length}
            </span>
            <span className="text-sm font-bold text-origami-purple">
              {Math.round(((currentStep + 1) / steps.length) * 100)}% Complete
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-origami-purple to-origami-pink h-3 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Step image */}
        <div className="aspect-square bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl mb-6 flex items-center justify-center overflow-hidden">
          {step.imageUrl ? (
            <img
              src={step.imageUrl}
              alt={`Step ${step.stepNumber}`}
              className="w-full h-full object-contain"
            />
          ) : (
            <div className="text-center p-8">
              <div className="text-8xl mb-4">📄</div>
              <p className="text-gray-500">No image available for this step</p>
            </div>
          )}
        </div>

        {/* Step instruction */}
        <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl p-6 mb-6">
          <h3 className="text-2xl font-bold text-gray-800 mb-3">
            Step {step.stepNumber}
          </h3>
          <p className="text-lg text-gray-700 leading-relaxed">
            {step.instruction}
          </p>
        </div>

        {/* Navigation buttons */}
        <div className="flex gap-4">
          <button
            onClick={goToPreviousStep}
            disabled={currentStep === 0}
            className="flex-1 bg-gradient-to-r from-origami-blue to-origami-green text-white font-bold py-4 px-6 rounded-full shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transform transition hover:scale-105 active:scale-95 text-lg"
          >
            ⬅️ Previous
          </button>

          <button
            onClick={goToNextStep}
            disabled={currentStep === steps.length - 1}
            className="flex-1 bg-gradient-to-r from-origami-purple to-origami-pink text-white font-bold py-4 px-6 rounded-full shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transform transition hover:scale-105 active:scale-95 text-lg"
          >
            {currentStep === steps.length - 1 ? '🎉 Done!' : 'Next ➡️'}
          </button>
        </div>

        {/* Step dots */}
        <div className="flex justify-center gap-2 mt-6">
          {steps.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentStep(index)}
              className={`w-3 h-3 rounded-full transition ${
                index === currentStep
                  ? 'bg-origami-purple scale-125'
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
              aria-label={`Go to step ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
