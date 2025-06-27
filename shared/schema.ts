import { pgTable, text, serial, integer, timestamp, jsonb, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { relations } from "drizzle-orm";
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

// RAG Content Management
export const contentSources = pgTable("content_sources", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  sourceType: text("source_type").notNull(), // 'youtube', 'podcast', 'document', 'article'
  expertName: text("expert_name"), // 'lenny', 'colin', 'custom'
  filePath: text("file_path"),
  originalUrl: text("original_url"),
  uploadedAt: timestamp("uploaded_at").defaultNow().notNull(),
  processedAt: timestamp("processed_at"),
  isActive: boolean("is_active").default(true).notNull(),
});

export const contentChunks = pgTable("content_chunks", {
  id: serial("id").primaryKey(),
  sourceId: integer("source_id").references(() => contentSources.id).notNull(),
  content: text("content").notNull(),
  chunkIndex: integer("chunk_index").notNull(),
  promptTypes: text("prompt_types").array(), // relevant prompt types for this chunk
  keyTopics: text("key_topics").array(), // extracted topics/keywords
  embedding: text("embedding"), // vector embedding as JSON string
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type InsertPrompt = z.infer<typeof insertPromptSchema>;
export type Prompt = typeof prompts.$inferSelect;
export type InsertExamplePrompt = z.infer<typeof insertExamplePromptSchema>;
export type ExamplePrompt = typeof examplePrompts.$inferSelect;

export const insertContentSourceSchema = createInsertSchema(contentSources).omit({
  id: true,
  uploadedAt: true,
  processedAt: true,
});

export const insertContentChunkSchema = createInsertSchema(contentChunks).omit({
  id: true,
  createdAt: true,
});

export type ContentSource = typeof contentSources.$inferSelect;
export type InsertContentSource = z.infer<typeof insertContentSourceSchema>;
export type ContentChunk = typeof contentChunks.$inferSelect;
export type InsertContentChunk = z.infer<typeof insertContentChunkSchema>;

// Relations
export const contentSourcesRelations = relations(contentSources, ({ many }) => ({
  chunks: many(contentChunks),
}));

export const contentChunksRelations = relations(contentChunks, ({ one }) => ({
  source: one(contentSources, {
    fields: [contentChunks.sourceId],
    references: [contentSources.id],
  }),
}));

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

// Evaluation request schema
export const evaluatePromptSchema = z.object({
  content: z.string().min(1, "Prompt content is required"),
  promptType: z.string().min(1, "Prompt type is required"),
  aiProvider: z.enum(["all-openai", "all-anthropic", "all-google", "all-deepseek", "all-grok"]),
});
