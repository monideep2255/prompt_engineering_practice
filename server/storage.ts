import { prompts, examplePrompts, type Prompt, type InsertPrompt, type ExamplePrompt, type InsertExamplePrompt } from "@shared/schema";

export interface IStorage {
  // Example prompt operations only
  createExamplePrompt(examplePrompt: InsertExamplePrompt): Promise<ExamplePrompt>;
  getExamplePrompts(): Promise<ExamplePrompt[]>;
  // Task scenarios for prompt practice
  getRandomTaskScenario(promptType: string): Promise<{ task: string; context: string }>;
}

export class MemStorage implements IStorage {
  private examplePrompts: Map<number, ExamplePrompt>;
  private currentExampleId: number;
  private taskScenarios: Map<string, Array<{ task: string; context: string }>>;

  constructor() {
    this.examplePrompts = new Map();
    this.currentExampleId = 1;
    this.taskScenarios = new Map();
    
    // Seed example prompts and task scenarios
    this.seedExamplePrompts();
    this.seedTaskScenarios();
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

  private seedTaskScenarios() {
    const scenarios = {
      "creative-writing": [
        {
          task: "Write a compelling opening chapter for a mystery novel",
          context: "You're working with a publisher who wants a detective story set in 1920s Chicago. The protagonist is a former speakeasy owner turned private investigator. The first case involves a missing jazz singer."
        },
        {
          task: "Create a short story for a literary magazine",
          context: "The theme is 'unexpected connections' and the story should be under 2000 words. The editor prefers character-driven narratives with subtle emotional depth."
        },
        {
          task: "Write dialogue for a romantic comedy screenplay",
          context: "Two rival food truck owners are forced to work together at a music festival. The scene takes place during a sudden rainstorm when they're sharing shelter."
        }
      ],
      "summarization": [
        {
          task: "Summarize a technical research paper on AI ethics",
          context: "You're preparing a brief for executives who need to understand the key findings and implications for product development. The paper is 25 pages long and contains complex philosophical arguments."
        },
        {
          task: "Create an executive summary of quarterly sales data",
          context: "The CFO needs a 2-minute presentation summary covering revenue trends, regional performance, and competitor analysis from a 40-page report."
        },
        {
          task: "Condense customer feedback from multiple sources",
          context: "You have survey responses, support tickets, and social media mentions about a new product launch. Marketing needs key insights for the next campaign strategy."
        }
      ],
      "data-analysis": [
        {
          task: "Analyze user behavior patterns from an e-commerce platform",
          context: "The marketing team wants to understand why cart abandonment increased 15% last month. You have clickstream data, user demographics, and purchase history."
        },
        {
          task: "Examine trends in employee satisfaction surveys",
          context: "HR conducted quarterly surveys across 5 departments. They need insights on retention risk factors and recommendations for management action."
        },
        {
          task: "Review financial performance metrics for a SaaS startup",
          context: "The board meeting is next week. They need analysis of customer acquisition cost, lifetime value, and churn rates compared to industry benchmarks."
        }
      ],
      "code-generation": [
        {
          task: "Build a REST API endpoint for user authentication",
          context: "You're working on a React Native app for a fitness startup. The backend uses Node.js and MongoDB. The endpoint needs JWT token handling and password hashing."
        },
        {
          task: "Create a data visualization component",
          context: "The product team wants an interactive dashboard showing real-time server metrics. Using React and D3.js, it should handle live data updates and be mobile-responsive."
        },
        {
          task: "Write a Python script for automated testing",
          context: "The QA team needs to validate API responses across multiple environments. The script should handle authentication, test various endpoints, and generate detailed reports."
        }
      ],
      "instructional": [
        {
          task: "Create a step-by-step guide for new remote employees",
          context: "Your company just went fully remote. HR needs a comprehensive onboarding process covering tools setup, communication protocols, and company culture for 50+ new hires monthly."
        },
        {
          task: "Write training materials for customer service representatives",
          context: "A software company is launching a new product tier. Support agents need clear procedures for handling billing questions, feature explanations, and escalation protocols."
        },
        {
          task: "Develop troubleshooting documentation for a mobile app",
          context: "Users report various issues with your meditation app. The support team needs a decision tree to quickly identify and resolve login problems, audio issues, and sync failures."
        }
      ],
      "analysis": [
        {
          task: "Evaluate the competitive landscape for a food delivery startup",
          context: "Your startup is entering the college town market. Investors want analysis of existing players, pricing strategies, and potential market opportunities in 3 target cities."
        },
        {
          task: "Assess the environmental impact of a manufacturing process",
          context: "A textile company wants to reduce their carbon footprint. They need evaluation of current practices, alternative materials, and cost-benefit analysis of sustainable options."
        },
        {
          task: "Review the effectiveness of a marketing campaign",
          context: "A 6-month social media campaign for a beauty brand just ended. The CMO needs analysis of engagement rates, conversion metrics, and ROI across different platforms and demographics."
        }
      ]
    };

    this.taskScenarios.set("creative-writing", scenarios["creative-writing"]);
    this.taskScenarios.set("summarization", scenarios["summarization"]);
    this.taskScenarios.set("data-analysis", scenarios["data-analysis"]);
    this.taskScenarios.set("code-generation", scenarios["code-generation"]);
    this.taskScenarios.set("instructional", scenarios["instructional"]);
    this.taskScenarios.set("analysis", scenarios["analysis"]);
  }

  async getRandomTaskScenario(promptType: string): Promise<{ task: string; context: string }> {
    const scenarios = this.taskScenarios.get(promptType) || this.taskScenarios.get("creative-writing") || [];
    
    if (scenarios.length === 0) {
      return {
        task: "Write a clear and specific prompt for this task type",
        context: "Consider what specific outcome you want to achieve and provide relevant details to guide the AI response."
      };
    }

    const randomIndex = Math.floor(Math.random() * scenarios.length);
    return scenarios[randomIndex];
  }
}

export const storage = new MemStorage();
