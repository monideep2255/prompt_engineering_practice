import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { aiProviderService } from "./services/ai-providers";
import { insertPromptSchema, evaluationResponseSchema } from "@shared/schema";
import { z } from "zod";

const evaluatePromptSchema = z.object({
  content: z.string().min(1, "Prompt content is required"),
  promptType: z.string().min(1, "Prompt type is required"),
  aiProvider: z.string().min(1, "AI provider is required"),
});

export async function registerRoutes(app: Express): Promise<Server> {
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
      
      // Evaluate the prompt using the specified AI provider
      const evaluation = await aiProviderService.evaluatePrompt(content, promptType, aiProvider);
      
      // Validate the evaluation response
      const validatedEvaluation = evaluationResponseSchema.parse(evaluation);
      
      // Store the prompt and evaluation results
      const promptData = insertPromptSchema.parse({
        content,
        promptType,
        aiProvider,
        overallScore: validatedEvaluation.overallScore,
        clarityScore: validatedEvaluation.clarityScore,
        specificityScore: validatedEvaluation.specificityScore,
        taskAlignmentScore: validatedEvaluation.taskAlignmentScore,
        completenessScore: validatedEvaluation.completenessScore,
        feedback: validatedEvaluation.feedback,
        improvedPrompt: validatedEvaluation.improvedPrompt,
        improvements: validatedEvaluation.improvements,
      });
      
      const savedPrompt = await storage.createPrompt(promptData);
      
      res.json({
        ...validatedEvaluation,
        id: savedPrompt.id,
      });
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

  // Get prompt history
  app.get("/api/prompts", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const prompts = await storage.getPromptsByDate(limit);
      res.json(prompts);
    } catch (error) {
      console.error("Error fetching prompts:", error);
      res.status(500).json({ message: "Failed to fetch prompt history" });
    }
  });

  // Get a specific prompt by ID
  app.get("/api/prompts/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid prompt ID" });
      }
      
      const prompt = await storage.getPromptById(id);
      if (!prompt) {
        return res.status(404).json({ message: "Prompt not found" });
      }
      
      res.json(prompt);
    } catch (error) {
      console.error("Error fetching prompt:", error);
      res.status(500).json({ message: "Failed to fetch prompt" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
