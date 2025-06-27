import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Trash2, Upload, FileText, ExternalLink, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ContentUpload from "./content-upload";

interface ContentSource {
  id: number;
  title: string;
  description: string;
  sourceType: string;
  expertName: string;
  originalUrl?: string;
  uploadedAt: string;
  processedAt?: string;
  isActive: boolean;
}

export default function ContentManager() {
  const [showUpload, setShowUpload] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: sources = [], isLoading } = useQuery({
    queryKey: ['/api/content/sources'],
    queryFn: async () => {
      const response = await fetch('/api/content/sources');
      if (!response.ok) throw new Error('Failed to fetch sources');
      return response.json();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/content/sources/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete source');
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Content removed",
        description: "Expert content has been removed from the system",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/content/sources'] });
    },
    onError: (error) => {
      toast({
        title: "Deletion failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const getExpertColor = (expertName: string) => {
    switch (expertName) {
      case 'lenny': return 'bg-blue-100 text-blue-800';
      case 'colin': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSourceTypeIcon = (sourceType: string) => {
    switch (sourceType) {
      case 'youtube': return '🎥';
      case 'podcast': return '🎧';
      case 'document': return '📄';
      case 'article': return '📝';
      default: return '📄';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Expert Content Library</h2>
          <p className="text-gray-600 mt-1">
            Manage content from experts to enhance prompt evaluation
          </p>
        </div>
        <Dialog open={showUpload} onOpenChange={setShowUpload}>
          <DialogTrigger asChild>
            <Button>
              <Upload className="h-4 w-4 mr-2" />
              Add Content
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Upload Expert Content</DialogTitle>
            </DialogHeader>
            <ContentUpload onUploadComplete={() => setShowUpload(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="animate-pulse">
              <div className="h-48 bg-gray-200 rounded-lg"></div>
            </div>
          ))}
        </div>
      ) : sources.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Users className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Expert Content</h3>
            <p className="text-gray-600 text-center mb-4">
              Upload content from experts like Lenny Rachitsky or Colin Bryar to enhance your prompt evaluations with expert insights.
            </p>
            <Button onClick={() => setShowUpload(true)}>
              <Upload className="h-4 w-4 mr-2" />
              Upload First Content
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sources.map((source: ContentSource) => (
            <Card key={source.id} className="border-l-4 border-l-blue-500">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg leading-tight">{source.title}</CardTitle>
                    <CardDescription className="mt-1">{source.description}</CardDescription>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteMutation.mutate(source.id)}
                    disabled={deleteMutation.isPending}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex items-center space-x-2 mt-2">
                  <Badge className={getExpertColor(source.expertName)}>
                    {source.expertName === 'lenny' ? 'Lenny Rachitsky' : 
                     source.expertName === 'colin' ? 'Colin Bryar' : 
                     'Custom Expert'}
                  </Badge>
                  <span className="text-sm text-gray-500">
                    {getSourceTypeIcon(source.sourceType)} {source.sourceType}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center space-x-2">
                    <FileText className="h-3 w-3" />
                    <span>Uploaded {formatDate(source.uploadedAt)}</span>
                  </div>
                  {source.processedAt && (
                    <div className="flex items-center space-x-2">
                      <span className="h-2 w-2 bg-green-500 rounded-full"></span>
                      <span>Processed and ready</span>
                    </div>
                  )}
                  {source.originalUrl && (
                    <div className="flex items-center space-x-2">
                      <ExternalLink className="h-3 w-3" />
                      <a 
                        href={source.originalUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline truncate"
                      >
                        View Original
                      </a>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {sources.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <div className="text-blue-600">
              <Users className="h-5 w-5 mt-0.5" />
            </div>
            <div>
              <h4 className="font-medium text-blue-900">Expert Content Active</h4>
              <p className="text-blue-700 text-sm mt-1">
                Your prompt evaluations will now include insights from {sources.length} expert source{sources.length !== 1 ? 's' : ''}. 
                The AI will reference relevant expert knowledge when evaluating your prompts.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}