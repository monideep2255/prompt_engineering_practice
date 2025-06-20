import OpenAI from "openai";
import Anthropic from '@anthropic-ai/sdk';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { EvaluationResponse } from "@shared/schema";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.VITE_OPENAI_API_KEY || ""
});

// the newest Anthropic model is "claude-sonnet-4-20250514" which was released May 14, 2025. Use this by default unless user has already selected claude-3-7-sonnet-20250219
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || process.env.VITE_ANTHROPIC_API_KEY || "",
});

const grokAI = new OpenAI({ 
  baseURL: "https://api.x.ai/v1", 
  apiKey: process.env.GROQ_API_KEY || process.env.VITE_GROQ_API_KEY || ""
});

const deepseekAI = new OpenAI({
  baseURL: "https://api.deepseek.com",
  apiKey: process.env.DEEPSEEK_API_KEY || process.env.VITE_DEEPSEEK_API_KEY || ""
});

const geminiAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "");

const SYSTEM_PROMPT = `You are a Prompt Evaluation Agent specialized in analyzing and improving user prompts for AI interactions. Your task is to evaluate prompts across four key criteria and provide actionable improvement suggestions.

Evaluation Criteria:
1. Clarity (1-10): How clear and understandable is the prompt?
2. Specificity (1-10): How specific and detailed are the requirements?
3. Task Alignment (1-10): How well does the prompt align with its intended purpose?
4. Completeness (1-10): Does the prompt include all necessary context and constraints?

For each prompt evaluation, provide:
- Individual scores for each criterion (1-10)
- Brief explanations for each score (2-3 sentences)
- An improved version of the prompt
- A list of specific improvements made

Respond in JSON format with this exact structure:
{
  "clarityScore": number,
  "specificityScore": number,
  "taskAlignmentScore": number,
  "completenessScore": number,
  "feedback": {
    "clarity": "explanation string",
    "specificity": "explanation string", 
    "taskAlignment": "explanation string",
    "completeness": "explanation string"
  },
  "improvedPrompt": "improved version string",
  "improvements": ["improvement 1", "improvement 2", ...]
}`;

export class AIProviderService {
  async evaluatePrompt(prompt: string, promptType: string, provider: string): Promise<EvaluationResponse> {
    const userPrompt = `Evaluate this ${promptType.toLowerCase()} prompt:

"${prompt}"

Consider the prompt type context when scoring. Provide a thorough evaluation and an improved version.`;

    let response: any;

    try {
      switch (provider.toLowerCase()) {
        case 'openai':
          response = await this.evaluateWithOpenAI(userPrompt);
          break;
        case 'anthropic':
          response = await this.evaluateWithAnthropic(userPrompt);
          break;
        case 'grok':
          response = await this.evaluateWithGrok(userPrompt);
          break;
        case 'deepseek':
          response = await this.evaluateWithDeepSeek(userPrompt);
          break;
        case 'google':
          response = await this.evaluateWithGemini(userPrompt);
          break;
        default:
          throw new Error(`Unsupported AI provider: ${provider}`);
      }

      // Calculate overall score as average of individual scores
      const overallScore = Math.round(
        (response.clarityScore + response.specificityScore + 
         response.taskAlignmentScore + response.completenessScore) / 4
      );

      return {
        ...response,
        overallScore,
      };
    } catch (error) {
      console.error(`Error evaluating prompt with ${provider}:`, error);
      throw new Error(`Failed to evaluate prompt: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private async evaluateWithOpenAI(userPrompt: string): Promise<Omit<EvaluationResponse, 'overallScore'>> {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userPrompt }
      ],
      response_format: { type: "json_object" },
      temperature: 0.3,
    });

    const content = response.choices[0].message.content;
    if (!content) throw new Error("No response from OpenAI");
    
    return JSON.parse(content);
  }

  private async evaluateWithAnthropic(userPrompt: string): Promise<Omit<EvaluationResponse, 'overallScore'>> {
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2000,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: userPrompt }],
      temperature: 0.3,
    });

    const content = response.content[0];
    if (content.type !== 'text') throw new Error("Unexpected response type from Anthropic");
    
    return JSON.parse(content.text);
  }

  private async evaluateWithGrok(userPrompt: string): Promise<Omit<EvaluationResponse, 'overallScore'>> {
    const response = await grokAI.chat.completions.create({
      model: "grok-2-1212",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userPrompt }
      ],
      response_format: { type: "json_object" },
      temperature: 0.3,
    });

    const content = response.choices[0].message.content;
    if (!content) throw new Error("No response from Grok");
    
    return JSON.parse(content);
  }

  private async evaluateWithDeepSeek(userPrompt: string): Promise<Omit<EvaluationResponse, 'overallScore'>> {
    const response = await deepseekAI.chat.completions.create({
      model: "deepseek-chat",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.3,
    });

    const content = response.choices[0].message.content;
    if (!content) throw new Error("No response from DeepSeek");
    
    // DeepSeek might not support structured JSON, so we'll try to parse or extract JSON
    try {
      return JSON.parse(content);
    } catch {
      // Fallback: try to extract JSON from the response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      throw new Error("Could not parse JSON response from DeepSeek");
    }
  }

  private async evaluateWithGemini(userPrompt: string): Promise<Omit<EvaluationResponse, 'overallScore'>> {
    const model = geminiAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    const prompt = `${SYSTEM_PROMPT}\n\n${userPrompt}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const content = response.text();

    if (!content) throw new Error("No response from Google Gemini");

    try {
      return JSON.parse(content);
    } catch {
      // Fallback: try to extract JSON from the response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      throw new Error("Could not parse JSON response from Google Gemini");
    }
  }
}

export const aiProviderService = new AIProviderService();
