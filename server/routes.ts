import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { aiProviderService } from "./services/ai-providers";
import { evaluationResponseSchema } from "@shared/schema";
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



  const httpServer = createServer(app);
  return httpServer;
}
