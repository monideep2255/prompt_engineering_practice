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
import { Edit, Lightbulb, Trash2, Wand2 } from "lucide-react";

const PROMPT_TYPES = [
  "Instructional",
  "Creative Writing", 
  "System Prompt",
  "Few-shot Learning",
  "Summarization",
  "Analysis",
];

const AI_PROVIDERS = [
  { value: "all-openai", label: "🏆 4 LLM Evaluation + OpenAI Judge" },
  { value: "all-anthropic", label: "🧠 4 LLM Evaluation + Anthropic Judge" },
  { value: "all-google", label: "🌟 4 LLM Evaluation + Google Judge" },
  { value: "all-deepseek", label: "⚡ 4 LLM Evaluation + DeepSeek Judge" },
  { value: "all-grok", label: "🚀 4 LLM Evaluation + Grok Judge" },
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
  const [promptType, setPromptType] = useState("Instructional");
  const [selectedProvider, setSelectedProvider] = useState("all-openai");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch example prompts
  const { data: examplePrompts = [] } = useQuery<any[]>({
    queryKey: ["/api/example-prompts"],
  });

  // Evaluate prompt mutation
  const evaluateMutation = useMutation({
    mutationFn: async (data: { content: string; promptType: string; aiProvider: string }) => {
      const response = await apiRequest("POST", "/api/evaluate-prompt", data);
      return response.json();
    },
    onSuccess: (data) => {
      onEvaluationComplete(data);
      // Invalidate history to refresh it
      queryClient.invalidateQueries({ queryKey: ["/api/prompts"] });
      toast({
        title: "Evaluation Complete",
        description: `Your prompt scored ${data.overallScore}/10 overall.`,
      });
    },
    onError: (error: Error) => {
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

  const handleLoadExample = (exampleContent: string) => {
    setPromptContent(exampleContent);
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
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

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

          <Button
            onClick={handleEvaluate}
            disabled={evaluateMutation.isPending || !promptContent.trim()}
            className="w-full bg-lab-blue hover:bg-lab-blue-light py-3"
          >
            <Wand2 className="w-4 h-4 mr-2" />
            {evaluateMutation.isPending ? 
              (selectedProvider.startsWith("all-") ? "Evaluating with 4 LLMs + AI Judge..." : "Evaluating...") : 
              "Evaluate My Prompt"}
          </Button>
        </CardContent>
      </Card>

      {/* Example Prompts Section */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center text-lg font-semibold">
            <Lightbulb className="w-5 h-5 text-lab-warning mr-2" />
            Example Prompts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {examplePrompts.map((example: any) => (
              <div
                key={example.id}
                className="bg-gray-50 rounded-lg p-4 cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => handleLoadExample(example.content)}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="text-sm font-medium text-lab-blue">
                    {example.promptType}
                  </span>
                  <span className="text-xs text-lab-gray">
                    Score: {example.score}/10
                  </span>
                </div>
                <p className="text-sm text-gray-700 line-clamp-3">
                  {example.content}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
