import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { History } from "lucide-react";

export default function PromptHistory() {
  const { data: prompts = [], isLoading } = useQuery({
    queryKey: ["/api/prompts"],
  });

  const getScoreColor = (score: number) => {
    if (score >= 8) return "text-lab-success";
    if (score >= 6) return "text-lab-warning";
    return "text-lab-danger";
  };

  const formatTimeAgo = (date: string) => {
    const now = new Date();
    const created = new Date(date);
    const diffInHours = Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "Less than 1 hour ago";
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/4 mx-auto mb-4"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center text-lg font-semibold">
            <History className="w-5 h-5 text-lab-blue mr-2" />
            Recent Evaluations
          </CardTitle>
          <Button variant="ghost" size="sm" className="text-lab-blue hover:text-lab-blue-light">
            View All
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {prompts.length === 0 ? (
          <div className="text-center py-8">
            <History className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-lab-gray">No evaluations yet</p>
            <p className="text-sm text-lab-gray">Your prompt evaluation history will appear here.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {prompts.map((prompt: any) => (
              <div
                key={prompt.id}
                className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <p className="text-sm text-gray-700 line-clamp-2 pr-4">
                      {prompt.content}
                    </p>
                    <p className="text-xs text-lab-gray mt-1">
                      {prompt.promptType} • {prompt.aiProvider}
                    </p>
                  </div>
                  <div className="flex items-center space-x-3 flex-shrink-0">
                    <span className={`text-sm font-medium ${getScoreColor(prompt.overallScore)}`}>
                      {prompt.overallScore}/10
                    </span>
                    <span className="text-xs text-lab-gray">
                      {formatTimeAgo(prompt.createdAt)}
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-4 text-xs text-lab-gray">
                  <span>Clarity: {prompt.clarityScore}</span>
                  <span>Specificity: {prompt.specificityScore}</span>
                  <span>Task Alignment: {prompt.taskAlignmentScore}</span>
                  <span>Completeness: {prompt.completenessScore}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
