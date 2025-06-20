import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import TaskScenario from "./task-scenario";
import { Edit, Lightbulb, Trash2, Wand2 } from "lucide-react";

const PROMPT_TYPES = [
  { label: "Creative Writing", value: "creative-writing" },
  { label: "Instructional", value: "instructional" }, 
  { label: "Summarization", value: "summarization" },
  { label: "Code Generation", value: "code-generation" },
  { label: "Data Analysis", value: "data-analysis" },
  { label: "Analysis", value: "analysis" },
];

const AI_PROVIDERS = [
  { value: "all-openai", label: "🏆 2 LLM Evaluation + OpenAI Judge" },
  { value: "all-anthropic", label: "🧠 2 LLM Evaluation + Anthropic Judge" },
  { value: "all-deepseek", label: "⚡ 2 LLM Evaluation + DeepSeek Judge" },
  // Commented out for future use:
  // { value: "all-google", label: "🌟 2 LLM Evaluation + Google Judge" },
  // { value: "all-grok", label: "🚀 2 LLM Evaluation + Grok Judge" },
];

interface PromptInputProps {
  onEvaluationComplete: (data: any) => void;
  onEvaluationStart: () => void;
  currentProvider: string;
  setCurrentProvider: (provider: string) => void;
}

export default function PromptInput({ 
  onEvaluationComplete, 
  onEvaluationStart,
  currentProvider,
  setCurrentProvider 
}: PromptInputProps) {
  const [promptContent, setPromptContent] = useState("");
  const [promptType, setPromptType] = useState("creative-writing");
  const [selectedProvider, setSelectedProvider] = useState("all-openai");
  const [evaluationProgress, setEvaluationProgress] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();



  // Evaluate prompt mutation
  const evaluateMutation = useMutation({
    mutationFn: async (data: { content: string; promptType: string; aiProvider: string }) => {
      // Reset progress tracking
      setEvaluationProgress([]);
      setCurrentStep("");
      
      // Show progress steps for multi-LLM evaluation
      if (data.aiProvider.startsWith("all-")) {
        const judgeProvider = data.aiProvider.replace("all-", "");
        const steps = [
          "🧠 Anthropic analyzing prompt - focusing on structure and clarity patterns...",
          "🤖 DeepSeek evaluating prompt - emphasizing technical precision and completeness...",
          `🏆 ${judgeProvider.charAt(0).toUpperCase() + judgeProvider.slice(1)} judge comparing both evaluations and selecting the most comprehensive analysis for your ${data.promptType} task...`
        ];
        
        // Simulate progress steps with varied timing
        const delays = [1200, 1400, 1800]; // Realistic timing for 2 LLM + judge
        for (let i = 0; i < steps.length; i++) {
          setCurrentStep(steps[i]);
          setEvaluationProgress(prev => [...prev, steps[i]]);
          await new Promise(resolve => setTimeout(resolve, delays[i]));
        }
      }
      
      const response = await apiRequest("POST", "/api/evaluate-prompt", data);
      return response.json();
    },
    onSuccess: (data) => {
      setCurrentStep("✅ Evaluation complete! Analysis ready with detailed feedback and suggestions.");
      onEvaluationComplete(data);
      // Invalidate history to refresh it
      queryClient.invalidateQueries({ queryKey: ["/api/prompts"] });
      toast({
        title: "Evaluation Complete",
        description: `Your prompt scored ${data.overallScore}/10 overall.`,
      });
      // Clear progress after success
      setTimeout(() => {
        setEvaluationProgress([]);
        setCurrentStep("");
      }, 2500);
    },
    onError: (error: Error) => {
      setCurrentStep("");
      setEvaluationProgress([]);
      toast({
        title: "Evaluation Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleEvaluate = () => {
    if (!promptContent.trim()) {
      toast({
        title: "Empty Prompt",
        description: "Please enter a prompt to evaluate.",
        variant: "destructive",
      });
      return;
    }

    onEvaluationStart();
    evaluateMutation.mutate({
      content: promptContent,
      promptType,
      aiProvider: selectedProvider,
    });
  };

  const handleClearPrompt = () => {
    setPromptContent("");
  };



  const handleProviderChange = (value: string) => {
    setSelectedProvider(value);
    const provider = AI_PROVIDERS.find(p => p.value === value);
    if (provider) {
      setCurrentProvider(provider.label);
    }
  };

  return (
    <div className="space-y-6">
      {/* Prompt Input Section */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center text-lg font-semibold">
              <Edit className="w-5 h-5 text-lab-blue mr-2" />
              Write Your Prompt
            </CardTitle>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <Label className="text-sm text-lab-gray">Provider:</Label>
              <Select value={selectedProvider} onValueChange={handleProviderChange}>
                <SelectTrigger className="w-full sm:w-[200px] h-8 text-xs sm:text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {AI_PROVIDERS.map((provider) => (
                    <SelectItem key={provider.value} value={provider.value}>
                      {provider.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-sm font-medium text-gray-700 mb-2 block">
              Prompt Type
            </Label>
            <Select value={promptType} onValueChange={setPromptType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PROMPT_TYPES.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Task Scenario Component */}
          <TaskScenario promptType={promptType} />

          <div>
            <Label className="text-sm font-medium text-gray-700 mb-2 block">
              Your Prompt
            </Label>
            <Textarea
              value={promptContent}
              onChange={(e) => setPromptContent(e.target.value)}
              className="h-48 resize-none"
              placeholder="Enter your prompt here... For example: 'Write a summary of the key points from this meeting transcript in bullet format.'"
            />
            <div className="flex justify-between items-center mt-2">
              <span className="text-sm text-lab-gray">
                {promptContent.length} characters
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearPrompt}
                className="text-lab-blue hover:text-lab-blue-light h-auto p-1"
              >
                <Trash2 className="w-3 h-3 mr-1" />
                Clear
              </Button>
            </div>
          </div>

          {/* Progress Display */}
          {evaluateMutation.isPending && evaluationProgress.length > 0 && (
            <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">Evaluation Progress</h4>
              <div className="space-y-2">
                {evaluationProgress.map((step, index) => (
                  <div key={index} className="flex items-center text-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    <span className="text-blue-800">{step}</span>
                  </div>
                ))}
                {currentStep && (
                  <div className="flex items-center text-sm">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse"></div>
                    <span className="text-blue-900 font-medium">{currentStep}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          <Button
            onClick={handleEvaluate}
            disabled={evaluateMutation.isPending || !promptContent.trim()}
            className="w-full bg-lab-blue hover:bg-lab-blue-light py-3"
          >
            <Wand2 className="w-4 h-4 mr-2" />
            {evaluateMutation.isPending ? 
              (selectedProvider.startsWith("all-") ? "Evaluating with 2 LLMs + AI Judge..." : "Evaluating...") : 
              "Evaluate My Prompt"}
          </Button>
        </CardContent>
      </Card>


    </div>
  );
}
