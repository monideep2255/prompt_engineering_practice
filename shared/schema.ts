import { pgTable, text, serial, integer, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const prompts = pgTable("prompts", {
  id: serial("id").primaryKey(),
  content: text("content").notNull(),
  promptType: text("prompt_type").notNull(),
  aiProvider: text("ai_provider").notNull(),
  overallScore: integer("overall_score").notNull(),
  clarityScore: integer("clarity_score").notNull(),
  specificityScore: integer("specificity_score").notNull(),
  taskAlignmentScore: integer("task_alignment_score").notNull(),
  completenessScore: integer("completeness_score").notNull(),
  feedback: jsonb("feedback").notNull(),
  improvedPrompt: text("improved_prompt").notNull(),
  improvements: jsonb("improvements").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const examplePrompts = pgTable("example_prompts", {
  id: serial("id").primaryKey(),
  content: text("content").notNull(),
  promptType: text("prompt_type").notNull(),
  score: integer("score").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertPromptSchema = createInsertSchema(prompts).omit({
  id: true,
  createdAt: true,
});

export const insertExamplePromptSchema = createInsertSchema(examplePrompts).omit({
  id: true,
  createdAt: true,
});

export type InsertPrompt = z.infer<typeof insertPromptSchema>;
export type Prompt = typeof prompts.$inferSelect;
export type InsertExamplePrompt = z.infer<typeof insertExamplePromptSchema>;
export type ExamplePrompt = typeof examplePrompts.$inferSelect;

// Evaluation response schema
export const evaluationResponseSchema = z.object({
  overallScore: z.number().min(1).max(10),
  clarityScore: z.number().min(1).max(10),
  specificityScore: z.number().min(1).max(10),
  taskAlignmentScore: z.number().min(1).max(10),
  completenessScore: z.number().min(1).max(10),
  feedback: z.object({
    clarity: z.string(),
    specificity: z.string(),
    taskAlignment: z.string(),
    completeness: z.string(),
  }),
  improvedPrompt: z.string(),
  improvements: z.array(z.string()),
});

export type EvaluationResponse = z.infer<typeof evaluationResponseSchema>;
