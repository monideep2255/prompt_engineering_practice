import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { aiProviderService } from "./services/ai-providers";
import { contentProcessor } from "./services/content-processor";
import { youtubeProcessor } from "./services/youtube-processor";
import { evaluationResponseSchema, insertContentSourceSchema } from "@shared/schema";
import { z } from "zod";
import multer from "multer";

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['text/plain', 'application/pdf', 'text/markdown'];
    if (allowedTypes.includes(file.mimetype) || file.originalname.endsWith('.txt') || file.originalname.endsWith('.md')) {
      cb(null, true);
    } else {
      cb(new Error('Only text files (.txt, .md) and PDFs are allowed'));
    }
  }
});

const evaluatePromptSchema = z.object({
  content: z.string().min(1, "Prompt content is required"),
  promptType: z.string().min(1, "Prompt type is required"),
  aiProvider: z.string().min(1, "AI provider is required"),
});

export function registerRoutes(app: Express): void {
  // YouTube URL processing route
  app.post("/api/content/youtube", async (req, res) => {
    try {
      const { url, expertName, sourceType } = req.body;
      
      if (!url || !sourceType) {
        return res.status(400).json({ message: 'YouTube URL and source type are required' });
      }

      if (!youtubeProcessor.isYouTubeUrl(url)) {
        return res.status(400).json({ message: 'Invalid YouTube URL format' });
      }

      // Extract transcript from YouTube URL
      const { title, content } = await youtubeProcessor.extractTranscriptFromUrl(url);

      // Process the extracted content
      const result = await contentProcessor.processTextContent(
        title,
        content,
        sourceType,
        expertName || 'YouTube Creator',
        url
      );

      res.json({
        message: 'YouTube content processed successfully',
        source: result.source,
        totalChunks: result.totalChunks
      });
    } catch (error) {
      console.error('Error processing YouTube content:', error);
      res.status(500).json({ 
        message: error instanceof Error ? error.message : 'Failed to process YouTube content'
      });
    }
  });

  // Get example prompts
  app.get("/api/example-prompts", async (req, res) => {
    try {
      const examples = await storage.getExamplePrompts();
      res.json(examples);
    } catch (error) {
      console.error("Error fetching example prompts:", error);
      res.status(500).json({ message: "Failed to fetch example prompts" });
    }
  });

  // Evaluate a prompt
  app.post("/api/evaluate-prompt", async (req, res) => {
    try {
      const { content, promptType, aiProvider } = evaluatePromptSchema.parse(req.body);
      
      let evaluation;
      if (aiProvider.startsWith("all-")) {
        const judgeProvider = aiProvider.replace("all-", "");
        evaluation = await aiProviderService.evaluateWithAllProviders(content, promptType, judgeProvider);
      } else {
        evaluation = await aiProviderService.evaluatePrompt(content, promptType, aiProvider);
      }
      
      // Validate the evaluation response
      const validatedEvaluation = evaluationResponseSchema.parse(evaluation);
      
      // Return evaluation results directly - no history storage needed
      res.json(validatedEvaluation);
    } catch (error) {
      console.error("Error evaluating prompt:", error);
      
      if (error instanceof z.ZodError) {
        res.status(400).json({ 
          message: "Invalid request data",
          errors: error.errors 
        });
      } else if (error instanceof Error) {
        res.status(500).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Failed to evaluate prompt" });
      }
    }
  });

  // Get random task scenario for prompt practice
  app.get("/api/task-scenario/:promptType", async (req, res) => {
    try {
      const { promptType } = req.params;
      const scenario = await storage.getRandomTaskScenario(promptType);
      res.json(scenario);
    } catch (error) {
      console.error('Error fetching task scenario:', error);
      res.status(500).json({ message: 'Failed to fetch task scenario' });
    }
  });

  // RAG Content Management Routes
  
  // Upload and process content
  app.post("/api/content/upload", upload.single('file'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }

      const { title, expertName, sourceType, originalUrl } = req.body;
      
      if (!title || !sourceType) {
        return res.status(400).json({ message: 'Title and source type are required' });
      }

      // Convert buffer to text with proper encoding handling
      let content: string;
      try {
        content = req.file.buffer.toString('utf-8');
        // Clean content to remove problematic characters
        content = content
          .replace(/\0/g, '') // Remove null bytes
          .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, ' ') // Replace control characters with spaces
          .replace(/\s+/g, ' ') // Normalize whitespace
          .trim();
      } catch (error) {
        return res.status(400).json({ message: 'File encoding not supported. Please use UTF-8 encoded text files.' });
      }
      
      if (content.length < 100) {
        return res.status(400).json({ message: 'File content too short (minimum 100 characters)' });
      }

      const result = await contentProcessor.processTextContent(
        title,
        content,
        sourceType,
        expertName,
        originalUrl
      );

      res.json({
        message: 'Content processed successfully',
        source: result.source,
        totalChunks: result.totalChunks
      });
    } catch (error) {
      console.error('Error uploading content:', error);
      res.status(500).json({ 
        message: error instanceof Error ? error.message : 'Failed to process content'
      });
    }
  });

  // Upload text content directly
  app.post("/api/content/text", async (req, res) => {
    try {
      const { title, content, expertName, sourceType, originalUrl } = req.body;
      
      if (!title || !content || !sourceType) {
        return res.status(400).json({ message: 'Title, content, and source type are required' });
      }

      // Clean content to remove problematic characters
      const cleanContent = content
        .replace(/\0/g, '') // Remove null bytes
        .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, ' ') // Replace control characters with spaces
        .replace(/\s+/g, ' ') // Normalize whitespace
        .trim();

      if (cleanContent.length < 100) {
        return res.status(400).json({ message: 'Content too short (minimum 100 characters)' });
      }

      const result = await contentProcessor.processTextContent(
        title,
        cleanContent,
        sourceType,
        expertName,
        originalUrl
      );

      res.json({
        message: 'Content processed successfully',
        source: result.source,
        totalChunks: result.totalChunks
      });
    } catch (error) {
      console.error('Error processing text content:', error);
      res.status(500).json({ message: 'Failed to process content' });
    }
  });

  // Get all content sources
  app.get("/api/content/sources", async (req, res) => {
    try {
      const sources = await storage.getContentSources();
      res.json(sources);
    } catch (error) {
      console.error('Error fetching content sources:', error);
      res.status(500).json({ message: 'Failed to fetch content sources' });
    }
  });

  // Delete content source
  app.delete("/api/content/sources/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: 'Invalid source ID' });
      }

      await storage.deleteContentSource(id);
      res.json({ message: 'Content source deleted successfully' });
    } catch (error) {
      console.error('Error deleting content source:', error);
      res.status(500).json({ message: 'Failed to delete content source' });
    }
  });

  // Enhanced evaluation with RAG
  app.post("/api/evaluate-prompt-rag", async (req, res) => {
    try {
      const result = evaluatePromptSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ message: "Invalid request", errors: result.error.errors });
      }

      const { content, promptType, aiProvider } = result.data;

      // Search for relevant content to enhance evaluation
      const relevantChunks = await contentProcessor.searchRelevantContent(content, promptType);
      
      let evaluation;
      if (relevantChunks.length > 0) {
        // Enhanced evaluation with expert context
        evaluation = await aiProviderService.evaluatePromptWithRAG(
          content, 
          promptType, 
          aiProvider,
          relevantChunks
        );
      } else {
        // Fallback to standard evaluation
        evaluation = await aiProviderService.evaluatePrompt(content, promptType, aiProvider);
      }

      res.json(evaluation);
    } catch (error) {
      console.error('Error in RAG evaluation:', error);
      res.status(500).json({ message: 'Failed to evaluate prompt with expert context' });
    }
  });

}
