import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Shuffle, Lightbulb, Edit3, Check, X } from "lucide-react";

interface TaskScenarioProps {
  promptType: string;
}

interface TaskScenarioData {
  task: string;
  context: string;
}

export default function TaskScenario({ promptType }: TaskScenarioProps) {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [customTask, setCustomTask] = useState("");
  const [customContext, setCustomContext] = useState("");

  const { data: scenario, isLoading, error } = useQuery<TaskScenarioData>({
    queryKey: [`/api/task-scenario/${promptType}`, refreshTrigger],
    enabled: !!promptType && !isCustomMode,
  });

  const handleNewScenario = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const handleCustomModeToggle = () => {
    setIsCustomMode(!isCustomMode);
    if (isCustomMode) {
      setCustomTask("");
      setCustomContext("");
    }
  };

  const handleSaveCustom = () => {
    // Custom scenario is now active, no need to do anything else
  };

  // Get current scenario data (either from API or custom input)
  const currentScenario = isCustomMode 
    ? { task: customTask, context: customContext }
    : scenario;

  // Always show the component when promptType is provided
  if (!promptType) {
    return null;
  }

  if (isLoading && !isCustomMode) {
    return (
      <Card className="mb-4">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5" />
            Practice Scenario
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-full mb-1"></div>
            <div className="h-3 bg-gray-200 rounded w-5/6"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error && !isCustomMode) {
    return null;
  }

  if (!currentScenario && !isCustomMode) {
    return null;
  }

  return (
    <Card className="mb-4 border-blue-200 bg-blue-50/50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-blue-900">
            <Lightbulb className="h-5 w-5" />
            Practice Scenario
          </CardTitle>
          <div className="flex gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleCustomModeToggle}
              className="text-blue-700 hover:text-blue-900"
            >
              <Edit3 className="h-4 w-4 mr-1" />
              {isCustomMode ? 'Use Random' : 'Custom'}
            </Button>
            {!isCustomMode && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleNewScenario}
                className="text-blue-700 hover:text-blue-900"
              >
                <Shuffle className="h-4 w-4 mr-1" />
                New Scenario
              </Button>
            )}
          </div>
        </div>
        <CardDescription className="text-blue-800">
          {isCustomMode ? 'Enter your own task and context' : 'Try writing a prompt for this real-world scenario'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isCustomMode ? (
          <div className="space-y-4">
            <div>
              <Label htmlFor="custom-task" className="text-blue-900 font-semibold">Task:</Label>
              <Textarea
                id="custom-task"
                placeholder="Enter the task you want to practice with..."
                value={customTask}
                onChange={(e) => setCustomTask(e.target.value)}
                className="mt-1 border-blue-200 focus:border-blue-400"
                rows={2}
              />
            </div>
            <div>
              <Label htmlFor="custom-context" className="text-blue-900 font-semibold">Context:</Label>
              <Textarea
                id="custom-context"
                placeholder="Provide additional context, constraints, or background information..."
                value={customContext}
                onChange={(e) => setCustomContext(e.target.value)}
                className="mt-1 border-blue-200 focus:border-blue-400"
                rows={3}
              />
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div>
              <h4 className="font-semibold text-blue-900 mb-1">Task:</h4>
              <p className="text-blue-800">{currentScenario?.task}</p>
            </div>
            <div>
              <h4 className="font-semibold text-blue-900 mb-1">Context:</h4>
              <p className="text-blue-700 text-sm leading-relaxed">{currentScenario?.context}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}