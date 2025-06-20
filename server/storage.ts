import { prompts, examplePrompts, type Prompt, type InsertPrompt, type ExamplePrompt, type InsertExamplePrompt } from "@shared/schema";

export interface IStorage {
  // Example prompt operations only
  createExamplePrompt(examplePrompt: InsertExamplePrompt): Promise<ExamplePrompt>;
  getExamplePrompts(): Promise<ExamplePrompt[]>;
}

export class MemStorage implements IStorage {
  private examplePrompts: Map<number, ExamplePrompt>;
  private currentExampleId: number;

  constructor() {
    this.examplePrompts = new Map();
    this.currentExampleId = 1;
    
    // Seed example prompts
    this.seedExamplePrompts();
  }

  private seedExamplePrompts() {
    const examples = [
      {
        content: "Write a 500-word short story about a time traveler who accidentally changes history. Use first-person perspective, include dialogue, and end with a twist that reveals the true consequence of their actions.",
        promptType: "Creative Writing",
        score: 9,
      },
      {
        content: "Analyze the attached sales data for Q3 2024. Identify the top 3 trends, calculate month-over-month growth rates, and provide actionable recommendations for Q4 strategy. Present findings in a structured format with charts.",
        promptType: "Data Analysis",
        score: 8,
      },
      {
        content: "Explain quantum computing to a 12-year-old using analogies they can understand. Include what makes it different from regular computers and why it's important for the future.",
        promptType: "Instructional",
        score: 7,
      },
    ];

    examples.forEach(example => {
      const id = this.currentExampleId++;
      const examplePrompt: ExamplePrompt = {
        ...example,
        id,
        createdAt: new Date(),
      };
      this.examplePrompts.set(id, examplePrompt);
    });
  }

  async createPrompt(insertPrompt: InsertPrompt): Promise<Prompt> {
    const id = this.currentPromptId++;
    const prompt: Prompt = {
      ...insertPrompt,
      id,
      createdAt: new Date(),
    };
    this.prompts.set(id, prompt);
    return prompt;
  }

  async getPromptsByDate(limit: number = 10): Promise<Prompt[]> {
    return Array.from(this.prompts.values())
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, limit);
  }

  async getPromptById(id: number): Promise<Prompt | undefined> {
    return this.prompts.get(id);
  }

  async createExamplePrompt(insertExamplePrompt: InsertExamplePrompt): Promise<ExamplePrompt> {
    const id = this.currentExampleId++;
    const examplePrompt: ExamplePrompt = {
      ...insertExamplePrompt,
      id,
      createdAt: new Date(),
    };
    this.examplePrompts.set(id, examplePrompt);
    return examplePrompt;
  }

  async getExamplePrompts(): Promise<ExamplePrompt[]> {
    return Array.from(this.examplePrompts.values());
  }
}

export const storage = new MemStorage();
