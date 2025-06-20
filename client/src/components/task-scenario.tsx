import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shuffle, Lightbulb } from "lucide-react";

interface TaskScenarioProps {
  promptType: string;
}

interface TaskScenarioData {
  task: string;
  context: string;
}

export default function TaskScenario({ promptType }: TaskScenarioProps) {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const { data: scenario, isLoading, error } = useQuery<TaskScenarioData>({
    queryKey: [`/api/task-scenario/${promptType}`, refreshTrigger],
    enabled: !!promptType,
  });

  const handleNewScenario = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  // Always show the component when promptType is provided
  if (!promptType) {
    return null;
  }

  if (isLoading) {
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

  if (error) {
    return null;
  }

  if (!scenario) {
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
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleNewScenario}
            className="text-blue-700 hover:text-blue-900"
          >
            <Shuffle className="h-4 w-4 mr-1" />
            New Scenario
          </Button>
        </div>
        <CardDescription className="text-blue-800">
          Try writing a prompt for this real-world scenario
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div>
            <h4 className="font-semibold text-blue-900 mb-1">Task:</h4>
            <p className="text-blue-800">{scenario?.task}</p>
          </div>
          <div>
            <h4 className="font-semibold text-blue-900 mb-1">Context:</h4>
            <p className="text-blue-700 text-sm leading-relaxed">{scenario?.context}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}