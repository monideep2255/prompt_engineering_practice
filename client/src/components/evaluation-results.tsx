import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  TrendingUp, 
  Microscope, 
  Wand2, 
  Lightbulb,
  Eye,
  Target,
  Crosshair,
  CheckCircle,
  Copy,
  Download,
  RotateCcw
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import EvaluationCriteriaDisplay from "./evaluation-criteria-display";

interface EvaluationResultsProps {
  evaluationData: any;
  isEvaluating: boolean;
  onUseImprovedPrompt?: (prompt: string) => void;
  promptType?: string;
}

export default function EvaluationResults({ evaluationData, isEvaluating, onUseImprovedPrompt, promptType = "analysis" }: EvaluationResultsProps) {
  const { toast } = useToast();
  const [exportFormat, setExportFormat] = useState("json");

  // Check if expert advice was included in the evaluation
  const hasExpertAdvice = evaluationData?.expertSources && evaluationData.expertSources.length > 0;

  const handleCopyImprovedPrompt = () => {
    if (evaluationData?.improvedPrompt) {
      navigator.clipboard.writeText(evaluationData.improvedPrompt);
      toast({
        title: "Copied!",
        description: "Improved prompt copied to clipboard.",
      });
    }
  };

  const generateYAMLExport = (data: any) => {
    const yamlContent = `researcher:
  role: >
    Senior Prompt Engineering Researcher for ${data.promptType || 'General'} prompts
  goal: >
    Analyze and improve prompt quality with ${data.overallScore}/10 overall effectiveness
  backstory: >
    You're a seasoned prompt engineering specialist with a talent for evaluating
    prompt clarity (${data.clarityScore}/10), specificity (${data.specificityScore}/10),
    task alignment (${data.taskAlignmentScore}/10), and completeness (${data.completenessScore}/10).
    Known for your ability to identify the most critical improvements
    and present them in a clear and actionable manner.
  
  original_prompt: |
    ${data.content || evaluationData.originalPrompt || 'N/A'}
  
  improved_prompt: |
    ${data.improvedPrompt}
  
  feedback:
    clarity: |
      ${data.feedback?.clarity || 'No clarity feedback available'}
    specificity: |
      ${data.feedback?.specificity || 'No specificity feedback available'}
    task_alignment: |
      ${data.feedback?.taskAlignment || 'No task alignment feedback available'}
    completeness: |
      ${data.feedback?.completeness || 'No completeness feedback available'}
  
  key_improvements:${data.improvements?.map((imp: string) => `
    - ${imp}`).join('') || '\n    - No improvements listed'}`;
    
    return yamlContent;
  };

  const generateJSONExport = (data: any) => {
    return {
      originalPrompt: data.content || evaluationData.originalPrompt,
      evaluation: {
        overallScore: data.overallScore,
        clarityScore: data.clarityScore,
        specificityScore: data.specificityScore,
        taskAlignmentScore: data.taskAlignmentScore,
        completenessScore: data.completenessScore,
        feedback: data.feedback,
      },
      improvedPrompt: data.improvedPrompt,
      improvements: data.improvements,
      judgeAnalysis: data.judgeThinking,
      allEvaluations: data.allEvaluations,
    };
  };

  const handleExportResults = () => {
    if (evaluationData) {
      let content: string;
      let mimeType: string;
      let filename: string;

      if (exportFormat === "yaml") {
        content = generateYAMLExport(evaluationData);
        mimeType = 'text/yaml';
        filename = 'prompt-evaluation.yaml';
      } else {
        content = JSON.stringify(generateJSONExport(evaluationData), null, 2);
        mimeType = 'application/json';
        filename = 'prompt-evaluation.json';
      }
      
      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
      
      toast({
        title: "Exported!",
        description: `Evaluation results exported as ${exportFormat.toUpperCase()}.`,
      });
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return "text-lab-success";
    if (score >= 6) return "text-lab-warning";
    return "text-lab-danger";
  };

  const getProgressColor = (score: number) => {
    if (score >= 8) return "bg-lab-success";
    if (score >= 6) return "bg-lab-warning";
    return "bg-lab-danger";
  };

  // Loading State
  if (isEvaluating) {
    return (
      <Card className="p-8 text-center">
        <CardContent>
          <div className="animate-spin w-8 h-8 border-4 border-lab-blue border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-lab-gray">Evaluating your prompt...</p>
        </CardContent>
      </Card>
    );
  }

  // Results State
  if (evaluationData) {
    return (
      <div className="space-y-6">
        {/* Expert Advice Banner */}
        {hasExpertAdvice && (
          <Card className="border-green-200 bg-green-50">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-green-800">
                    Expert Advice Included
                  </h3>
                  <p className="text-sm text-green-700">
                    This evaluation includes insights from: {evaluationData.expertSources.join(", ")}
                  </p>
                  <p className="text-xs text-green-600 mt-1">
                    Your prompt was enhanced with expert knowledge from your uploaded content
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Evaluation Progress */}
        {evaluationData.allEvaluations && (
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center text-lg font-semibold">
                <Microscope className="w-5 h-5 text-lab-blue mr-2" />
                Evaluation Process
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* LLM Evaluations */}
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-gray-700">LLM Evaluations:</h4>
                  {evaluationData.allEvaluations.map((evalItem: any, index: number) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-sm uppercase text-lab-blue">
                          {evalItem.provider}
                        </span>
                        <span className="text-sm font-semibold">
                          {evalItem.evaluation.overallScore}/10
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 italic">
                        {evalItem.thinking || `${evalItem.provider.toUpperCase()} completed evaluation`}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Expert Advice Indicator */}
                {hasExpertAdvice && (
                  <div className="border-t pt-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Expert Context Used:</h4>
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                      <div className="flex items-center space-x-2">
                        <Lightbulb className="w-4 h-4 text-green-600" />
                        <p className="text-xs text-green-800">
                          Enhanced with insights from {evaluationData.expertSources.length} expert source(s): {evaluationData.expertSources.map((s: any) => s.expertName).join(', ')}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Judge Decision */}
                {evaluationData.judgeThinking && (
                  <div className="border-t pt-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">AI Judge Decision:</h4>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <p className="text-xs text-blue-800">
                        {evaluationData.judgeThinking.substring(0, 200)}
                        {evaluationData.judgeThinking.length > 200 ? '...' : ''}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Overall Score */}
        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center text-lg font-semibold">
                <TrendingUp className="w-5 h-5 text-lab-success mr-2" />
                Final Results
              </CardTitle>
              <div className="flex items-center space-x-2">
                <span className={`text-2xl font-bold ${getScoreColor(evaluationData.overallScore)}`}>
                  {evaluationData.overallScore}
                </span>
                <span className="text-sm text-lab-gray">/10</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Overall Quality</span>
                <span className="text-sm text-lab-gray">
                  {evaluationData.overallScore >= 8 ? "Excellent" : 
                   evaluationData.overallScore >= 6 ? "Good" : "Needs Improvement"}
                </span>
              </div>
              <Progress 
                value={evaluationData.overallScore * 10} 
                className="h-2"
              />
            </div>
          </CardContent>
        </Card>

        {/* Detailed Scores */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center text-lg font-semibold">
              <Microscope className="w-5 h-5 text-lab-blue mr-2" />
              Detailed Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <EvaluationCriteriaDisplay 
              evaluationData={evaluationData} 
              promptType={promptType} 
            />
          </CardContent>
        </Card>

        {/* AI Judge Thinking (if available) */}
        {evaluationData.judgeThinking && (
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center text-lg font-semibold">
                <TrendingUp className="w-5 h-5 text-lab-blue mr-2" />
                AI Judge Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {evaluationData.judgeThinking}
                </p>
              </div>
              {evaluationData.allEvaluations && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    Compared {evaluationData.allEvaluations.length} LLM evaluations
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {evaluationData.allEvaluations.map((evalItem: any, index: number) => (
                      <span 
                        key={index}
                        className="px-2 py-1 bg-gray-100 rounded text-xs text-gray-600"
                      >
                        {evalItem.provider.toUpperCase()}: {evalItem.evaluation.overallScore}/10
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Improved Prompt */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center text-lg font-semibold">
              <Wand2 className="w-5 h-5 text-lab-success mr-2" />
              Improved Version
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-lab-success bg-opacity-5 border border-lab-success border-opacity-20 rounded-lg p-4 mb-4">
              <p className="text-sm text-gray-700 leading-relaxed">
                {evaluationData.improvedPrompt}
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex items-center space-x-2 sm:space-x-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCopyImprovedPrompt}
                  className="text-lab-blue hover:text-lab-blue-light text-xs sm:text-sm"
                >
                  <Copy className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  Copy
                </Button>
                <div className="flex items-center space-x-2">
                  <Select value={exportFormat} onValueChange={setExportFormat}>
                    <SelectTrigger className="w-20 h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="json">JSON</SelectItem>
                      <SelectItem value="yaml">YAML</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleExportResults}
                    className="text-lab-blue hover:text-lab-blue-light text-xs sm:text-sm"
                  >
                    <Download className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                    Export
                  </Button>
                </div>
              </div>
              <Button 
                size="sm"
                className="bg-lab-blue hover:bg-lab-blue-light text-xs sm:text-sm"
                onClick={() => {
                  if (onUseImprovedPrompt && evaluationData?.improvedPrompt) {
                    onUseImprovedPrompt(evaluationData.improvedPrompt);
                    toast({
                      title: "Prompt Updated",
                      description: "The improved prompt has been loaded into the input field.",
                    });
                  }
                }}
              >
                <RotateCcw className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                Use This Version
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Key Improvements */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center text-lg font-semibold">
              <Lightbulb className="w-5 h-5 text-lab-warning mr-2" />
              Key Improvements Made
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {evaluationData.improvements.map((improvement: string, index: number) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-lab-success rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-sm text-gray-700">{improvement}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Placeholder State
  return (
    <Card className="p-8 text-center">
      <CardContent>
        <div className="w-16 h-16 bg-lab-blue bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Wand2 className="w-8 h-8 text-lab-blue" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Ready to Evaluate</h3>
        <p className="text-lab-gray mb-4">
          Enter a prompt to get detailed AI-powered feedback and improvement suggestions.
        </p>
        <div className="flex items-center justify-center space-x-4 text-sm text-lab-gray">
          <div className="flex items-center space-x-1">
            <Eye className="w-4 h-4" />
            <span>Clarity</span>
          </div>
          <div className="flex items-center space-x-1">
            <Crosshair className="w-4 h-4" />
            <span>Specificity</span>
          </div>
          <div className="flex items-center space-x-1">
            <Target className="w-4 h-4" />
            <span>Task Alignment</span>
          </div>
          <div className="flex items-center space-x-1">
            <CheckCircle className="w-4 h-4" />
            <span>Completeness</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
