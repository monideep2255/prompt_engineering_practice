import { useState, useRef } from "react";
import PromptInput, { PromptInputRef } from "@/components/prompt-input";
import EvaluationResults from "@/components/evaluation-results";

export default function Home() {
  const [currentProvider, setCurrentProvider] = useState("OpenAI GPT-4");
  const [evaluationData, setEvaluationData] = useState(null);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const promptInputRef = useRef<PromptInputRef>(null);

  const handleEvaluationComplete = (data: any) => {
    setEvaluationData(data);
    setIsEvaluating(false);
  };

  const handleEvaluationStart = () => {
    setIsEvaluating(true);
    setEvaluationData(null);
  };

  const handleUseImprovedPrompt = (prompt: string) => {
    if (promptInputRef.current) {
      promptInputRef.current.setPromptContent(prompt);
    }
  };

  const handleLogoClick = () => {
    setEvaluationData(null);
    setIsEvaluating(false);
    if (promptInputRef.current) {
      promptInputRef.current.clearForm();
    }
  };

  return (
    <div className="min-h-screen bg-lab-bg">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16">
            <div 
              className="flex items-center space-x-2 sm:space-x-3 cursor-pointer"
              onClick={handleLogoClick}
            >
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-lab-blue rounded-lg flex items-center justify-center">
                <div className="w-3 h-3 sm:w-4 sm:h-4 text-white">
                  <svg viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5 3a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V5a2 2 0 00-2-2H5zm0 2h10v7h-2l-1-2H8l-1 2H5V5z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-gray-900">Prompt Practice Lab</h1>
                <p className="text-xs sm:text-sm text-lab-gray hidden sm:block">AI-Powered Prompt Engineering Coach</p>
              </div>
            </div>

          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8">
          {/* Left Panel - Prompt Input */}
          <div className="w-full">
            <PromptInput 
              onEvaluationComplete={handleEvaluationComplete}
              onEvaluationStart={handleEvaluationStart}
              currentProvider={currentProvider}
              setCurrentProvider={setCurrentProvider}
              ref={promptInputRef}
            />
          </div>

          {/* Right Panel - Evaluation Results */}
          <div className="w-full">
            <EvaluationResults 
              evaluationData={evaluationData}
              isEvaluating={isEvaluating}
              onUseImprovedPrompt={handleUseImprovedPrompt}
            />
          </div>
        </div>


      </div>
    </div>
  );
}
