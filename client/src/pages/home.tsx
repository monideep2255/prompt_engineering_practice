import { useState } from "react";
import PromptInput from "@/components/prompt-input";
import EvaluationResults from "@/components/evaluation-results";
import PromptHistory from "@/components/prompt-history";
import { Button } from "@/components/ui/button";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { History } from "lucide-react";

export default function Home() {
  const [currentProvider, setCurrentProvider] = useState("OpenAI GPT-4");
  const [showHistory, setShowHistory] = useState(false);
  const [evaluationData, setEvaluationData] = useState(null);
  const [isEvaluating, setIsEvaluating] = useState(false);

  const handleEvaluationComplete = (data: any) => {
    setEvaluationData(data);
    setIsEvaluating(false);
  };

  const handleEvaluationStart = () => {
    setIsEvaluating(true);
    setEvaluationData(null);
  };

  return (
    <div className="min-h-screen bg-lab-bg">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-lab-blue rounded-lg flex items-center justify-center">
                <div className="w-4 h-4 text-white">
                  <svg viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5 3a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V5a2 2 0 00-2-2H5zm0 2h10v7h-2l-1-2H8l-1 2H5V5z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Prompt Practice Lab</h1>
                <p className="text-sm text-lab-gray">AI-Powered Prompt Engineering Coach</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant="default"
                size="sm"
                onClick={() => setShowHistory(!showHistory)}
                className="bg-lab-blue hover:bg-lab-blue-light"
              >
                <History className="w-4 h-4 mr-2" />
                History
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Panel - Prompt Input */}
          <PromptInput 
            onEvaluationComplete={handleEvaluationComplete}
            onEvaluationStart={handleEvaluationStart}
            currentProvider={currentProvider}
            setCurrentProvider={setCurrentProvider}
          />

          {/* Right Panel - Evaluation Results */}
          <EvaluationResults 
            evaluationData={evaluationData}
            isEvaluating={isEvaluating}
          />
        </div>

        {/* History Section */}
        {showHistory && (
          <div className="mt-12">
            <PromptHistory />
          </div>
        )}
      </div>
    </div>
  );
}
