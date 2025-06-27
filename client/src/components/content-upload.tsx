import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, FileText, Link2, CheckCircle, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ContentUploadProps {
  onUploadComplete?: () => void;
}

export default function ContentUpload({ onUploadComplete }: ContentUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [textContent, setTextContent] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [title, setTitle] = useState("");
  const [expertName, setExpertName] = useState("custom");
  const [sourceType, setSourceType] = useState("document");
  const [originalUrl, setOriginalUrl] = useState("");
  
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const fileUploadMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const response = await fetch("/api/content/upload", {
        method: "POST",
        body: data,
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Upload failed');
      }
      return await response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Content uploaded successfully",
        description: `Processed ${data.totalChunks} content chunks`,
      });
      queryClient.invalidateQueries({ queryKey: ['/api/content/sources'] });
      resetForm();
      onUploadComplete?.();
    },
    onError: (error) => {
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const textUploadMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch("/api/content/text", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Processing failed');
      }
      return await response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Content processed successfully",
        description: `Created ${data.totalChunks} content chunks`,
      });
      queryClient.invalidateQueries({ queryKey: ['/api/content/sources'] });
      resetForm();
      onUploadComplete?.();
    },
    onError: (error) => {
      toast({
        title: "Processing failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setSelectedFile(null);
    setTextContent("");
    setTitle("");
    setExpertName("custom");
    setSourceType("document");
    setOriginalUrl("");
  };

  const handleFileUpload = () => {
    if (!selectedFile || !title || !sourceType) {
      toast({
        title: "Missing information",
        description: "Please select a file, enter a title, and choose a source type",
        variant: "destructive",
      });
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('title', title);
    formData.append('expertName', expertName);
    formData.append('sourceType', sourceType);
    if (originalUrl) formData.append('originalUrl', originalUrl);

    fileUploadMutation.mutate(formData);
  };

  const handleTextUpload = () => {
    if (!textContent || !title || !sourceType) {
      toast({
        title: "Missing information",
        description: "Please enter content, title, and choose a source type",
        variant: "destructive",
      });
      return;
    }

    if (textContent.length < 100) {
      toast({
        title: "Content too short",
        description: "Content must be at least 100 characters long",
        variant: "destructive",
      });
      return;
    }

    textUploadMutation.mutate({
      title,
      content: textContent,
      expertName,
      sourceType,
      originalUrl: originalUrl || undefined,
    });
  };

  const isUploading = fileUploadMutation.isPending || textUploadMutation.isPending;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Upload className="h-5 w-5" />
          <span>Upload Expert Content</span>
        </CardTitle>
        <CardDescription>
          Add content from experts like Lenny Rachitsky, Colin Bryar, or your own sources to enhance prompt evaluation
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="file" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="file" className="flex items-center space-x-2">
              <FileText className="h-4 w-4" />
              <span>Upload File</span>
            </TabsTrigger>
            <TabsTrigger value="text" className="flex items-center space-x-2">
              <Link2 className="h-4 w-4" />
              <span>Paste Text</span>
            </TabsTrigger>
          </TabsList>

          <div className="mt-6 space-y-4">
            {/* Common Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Content Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g., Lenny's Newsletter on Product Strategy"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="expert">Expert/Source</Label>
                <Select value={expertName} onValueChange={setExpertName}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lenny">Lenny Rachitsky</SelectItem>
                    <SelectItem value="colin">Colin Bryar</SelectItem>
                    <SelectItem value="custom">Custom Expert</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sourceType">Content Type *</Label>
                <Select value={sourceType} onValueChange={setSourceType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="youtube">YouTube Transcript</SelectItem>
                    <SelectItem value="podcast">Podcast Summary</SelectItem>
                    <SelectItem value="document">Document/Article</SelectItem>
                    <SelectItem value="article">Blog Post</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="url">Original URL (Optional)</Label>
                <Input
                  id="url"
                  placeholder="https://..."
                  value={originalUrl}
                  onChange={(e) => setOriginalUrl(e.target.value)}
                />
              </div>
            </div>
          </div>

          <TabsContent value="file" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="file">Select File</Label>
              <Input
                id="file"
                type="file"
                accept=".txt,.md,.pdf"
                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
              />
              <p className="text-sm text-gray-500">
                Supported formats: .txt, .md, .pdf (max 10MB)
              </p>
            </div>
            {selectedFile && (
              <div className="p-3 bg-gray-50 rounded-lg flex items-center space-x-2">
                <FileText className="h-4 w-4 text-blue-500" />
                <span className="text-sm">{selectedFile.name}</span>
                <span className="text-xs text-gray-500">
                  ({(selectedFile.size / 1024).toFixed(1)} KB)
                </span>
              </div>
            )}
            <Button 
              onClick={handleFileUpload} 
              disabled={isUploading || !selectedFile}
              className="w-full"
            >
              {isUploading ? (
                "Processing..."
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload and Process File
                </>
              )}
            </Button>
          </TabsContent>

          <TabsContent value="text" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="content">Content Text</Label>
              <Textarea
                id="content"
                placeholder="Paste your content here (YouTube transcript, article text, etc.)..."
                value={textContent}
                onChange={(e) => setTextContent(e.target.value)}
                rows={10}
              />
              <p className="text-sm text-gray-500">
                Minimum 100 characters. The content will be automatically processed and categorized.
              </p>
            </div>
            <Button 
              onClick={handleTextUpload} 
              disabled={isUploading || textContent.length < 100}
              className="w-full"
            >
              {isUploading ? (
                "Processing..."
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Process Text Content
                </>
              )}
            </Button>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}