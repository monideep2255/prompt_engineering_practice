import { useState, useRef } from "react";
import { Link } from "wouter";
import PromptInput, { PromptInputRef } from "@/components/prompt-input";
import EvaluationResults from "@/components/evaluation-results";
import TemplateLibrary from "@/components/template-library";

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

  const handleUseTemplate = (template: string, promptType: string) => {
    if (promptInputRef.current) {
      promptInputRef.current.setPromptContent(template);
      promptInputRef.current.setPromptType(promptType);
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
            
            <div className="flex items-center space-x-4">
              <Link href="/learn">
                <a className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors px-3 py-2 rounded-md">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  <span className="hidden sm:inline">Learn</span>
                </a>
              </Link>
            </div>

          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8">
          {/* Left Panel - Prompt Input */}
          <div className="w-full space-y-6">
            <PromptInput 
              onEvaluationComplete={handleEvaluationComplete}
              onEvaluationStart={handleEvaluationStart}
              currentProvider={currentProvider}
              setCurrentProvider={setCurrentProvider}
              ref={promptInputRef}
            />
            
            {/* Template Library */}
            <TemplateLibrary onUseTemplate={handleUseTemplate} />
          </div>

          {/* Right Panel - Evaluation Results */}
          <div className="w-full">
            <EvaluationResults 
              evaluationData={evaluationData}
              isEvaluating={isEvaluating}
              onUseImprovedPrompt={handleUseImprovedPrompt}
              promptType={promptInputRef.current?.getPromptType?.() || "analysis"}
            />
          </div>
        </div>


      </div>
    </div>
  );
}
