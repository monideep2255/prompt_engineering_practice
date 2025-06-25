import OpenAI from "openai";
import Anthropic from '@anthropic-ai/sdk';
// import { GoogleGenerativeAI } from '@google/generative-ai'; // Commented out for future use
import { EvaluationResponse } from "@shared/schema";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.VITE_OPENAI_API_KEY || ""
});

// the newest Anthropic model is "claude-sonnet-4-20250514" which was released May 14, 2025. Use this by default unless user has already selected claude-3-7-sonnet-20250219
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || process.env.VITE_ANTHROPIC_API_KEY || "",
});

const deepseekAI = new OpenAI({
  baseURL: "https://api.deepseek.com",
  apiKey: process.env.DEEPSEEK_API_KEY || process.env.VITE_DEEPSEEK_API_KEY || ""
});

// Commented out for future use:
// const grokAI = new OpenAI({ 
//   baseURL: "https://api.x.ai/v1", 
//   apiKey: process.env.GROQ_API_KEY || process.env.VITE_GROQ_API_KEY || ""
// });

// const geminiAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "");

// Style-specific evaluation criteria for different prompt types
const EVALUATION_CRITERIA = {
  "creative-writing": {
    criteria: ["Creativity", "Narrative Structure", "Character Development", "Emotional Resonance"],
    descriptions: [
      "How original and imaginative is the prompt? Does it inspire unique creative output?",
      "Does the prompt guide toward well-structured storytelling with clear narrative flow?", 
      "Are characters well-defined with clear motivations and development potential?",
      "Will the prompt generate emotionally engaging content that resonates with readers?"
    ]
  },
  "instructional": {
    criteria: ["Clarity", "Step-by-Step Flow", "Actionability", "Completeness"],
    descriptions: [
      "How clear and understandable are the instructions?",
      "Does the prompt encourage logical, sequential instruction delivery?",
      "Are the instructions practical and immediately actionable?",
      "Does the prompt cover all necessary details and context?"
    ]
  },
  "system": {
    criteria: ["Role Definition", "Constraint Specification", "Output Format", "Behavioral Guidance"],
    descriptions: [
      "How clearly is the AI's role and expertise defined?",
      "Are limitations, boundaries, and constraints explicitly specified?",
      "Is the expected output format and structure clearly defined?",
      "Does the prompt provide clear behavioral guidelines and interaction style?"
    ]
  },
  "few-shot": {
    criteria: ["Example Quality", "Pattern Clarity", "Consistency", "Learning Effectiveness"],
    descriptions: [
      "Are the provided examples high-quality and representative?",
      "Do examples clearly demonstrate the desired pattern or approach?",
      "Are examples consistent in format, style, and quality?",
      "Will the examples effectively teach the AI the desired behavior?"
    ]
  },
  "summarization": {
    criteria: ["Compression Efficiency", "Key Point Extraction", "Audience Targeting", "Structure Clarity"],
    descriptions: [
      "Does the prompt guide effective information condensation without losing key insights?",
      "Will the prompt help identify and prioritize the most important information?",
      "Is the target audience and their information needs clearly specified?",
      "Does the prompt specify clear organizational structure for the summary?"
    ]
  },
  "analysis": {
    criteria: ["Analytical Depth", "Framework Application", "Evidence Integration", "Insight Generation"],
    descriptions: [
      "Does the prompt encourage thorough, multi-layered analysis?",
      "Are specific analytical frameworks or methodologies suggested?",
      "Does the prompt guide effective use of evidence and data?",
      "Will the prompt generate meaningful insights and actionable conclusions?"
    ]
  }
};

function getSystemPrompt(promptType: string): string {
  const criteria = EVALUATION_CRITERIA[promptType] || EVALUATION_CRITERIA["analysis"];
  
  return `You are a Prompt Evaluation Agent specialized in analyzing and improving user prompts for AI interactions. You are evaluating a ${promptType.replace('-', ' ')} prompt.

For ${promptType.replace('-', ' ')} prompts, evaluate based on these specialized criteria:
1. ${criteria.criteria[0]} (1-10): ${criteria.descriptions[0]}
2. ${criteria.criteria[1]} (1-10): ${criteria.descriptions[1]}
3. ${criteria.criteria[2]} (1-10): ${criteria.descriptions[2]}
4. ${criteria.criteria[3]} (1-10): ${criteria.descriptions[3]}

For each prompt evaluation, provide:
- Individual scores for each criterion (1-10)
- Brief explanations for each score (2-3 sentences)
- An improved version of the prompt optimized for ${promptType.replace('-', ' ')} tasks
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
    if (provider === 'all') {
      return await this.evaluateWithAllProviders(prompt, promptType);
    }

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
        case 'deepseek':
          response = await this.evaluateWithDeepSeek(userPrompt);
          break;
        // Commented out for future use:
        // case 'grok':
        //   response = await this.evaluateWithGrok(userPrompt);
        //   break;
        // case 'google':
        //   response = await this.evaluateWithGemini(userPrompt);
        //   break;
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

  async evaluateWithAllProviders(prompt: string, promptType: string, judgeProvider: string = 'openai'): Promise<EvaluationResponse & { judgeThinking?: string; allEvaluations?: any[] }> {
    const userPrompt = `Evaluate this ${promptType.toLowerCase()} prompt:

"${prompt}"

Consider the prompt type context when scoring. Provide a thorough evaluation and an improved version.`;

    // Using 2 LLM providers for evaluation (commented out others for future use)
    const providers = ['anthropic', 'deepseek'];
    // const providers = ['anthropic', 'grok', 'deepseek', 'google']; // Full set for future
    const evaluations = [];
    const errors = [];

    // Get evaluations from available providers (excluding OpenAI which will be the judge)
    for (const provider of providers) {
      try {
        let response: any;
        let thinking: string = '';
        
        switch (provider) {
          case 'anthropic':
            response = await this.evaluateWithAnthropic(userPrompt, promptType);
            thinking = response.reasoning || `Analyzed prompt structure, clarity, and contextual appropriateness for ${promptType}`;
            break;
          case 'deepseek':
            response = await this.evaluateWithDeepSeek(userPrompt, promptType);
            thinking = `Evaluated technical precision, completeness, and logical flow for ${promptType} task`;
            break;
          // Commented out for future use:
          // case 'grok':
          //   response = await this.evaluateWithGrok(userPrompt);
          //   thinking = response.reasoning || `${provider.toUpperCase()} reviewed the prompt with creative insight`;
          //   break;
          // case 'google':
          //   response = await this.evaluateWithGemini(userPrompt);
          //   thinking = response.reasoning || `${provider.toUpperCase()} assessed the prompt comprehensively`;
          //   break;
        }
        
        const overallScore = Math.round(
          (response.clarityScore + response.specificityScore + 
           response.taskAlignmentScore + response.completenessScore) / 4
        );

        evaluations.push({
          provider,
          thinking: thinking.substring(0, 120) + (thinking.length > 120 ? '...' : ''), // Limit to ~1 line
          evaluation: { ...response, overallScore },
        });
        
        console.log(`${provider.toUpperCase()} evaluation complete - Score: ${overallScore}/10, Thinking: ${thinking.substring(0, 50)}...`);
      } catch (error) {
        console.error(`Error with ${provider}:`, error);
        errors.push(`${provider}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    if (evaluations.length === 0) {
      throw new Error(`All providers failed: ${errors.join(', ')}`);
    }

    // Use specified provider as judge to select the best evaluation
    const judgeResult = await this.judgeEvaluations(prompt, promptType, evaluations, judgeProvider);
    
    return {
      ...judgeResult.bestEvaluation,
      judgeThinking: judgeResult.thinking,
      allEvaluations: evaluations,
    };
  }

  private async judgeEvaluations(prompt: string, promptType: string, evaluations: any[], judgeProvider: string = 'openai'): Promise<{ bestEvaluation: any; thinking: string }> {
    const judgePrompt = `You are an expert AI evaluation judge. Your task is to analyze multiple AI evaluations of the same prompt and select the best one.

Original Prompt (${promptType}): "${prompt}"

Here are the evaluations from different AI providers:

${evaluations.map((evalItem, index) => `
=== Evaluation ${index + 1} (${evalItem.provider.toUpperCase()}) ===
Overall Score: ${evalItem.evaluation.overallScore}/10
Clarity: ${evalItem.evaluation.clarityScore}/10 - ${evalItem.evaluation.feedback.clarity}
Specificity: ${evalItem.evaluation.specificityScore}/10 - ${evalItem.evaluation.feedback.specificity}
Task Alignment: ${evalItem.evaluation.taskAlignmentScore}/10 - ${evalItem.evaluation.feedback.taskAlignment}
Completeness: ${evalItem.evaluation.completenessScore}/10 - ${evalItem.evaluation.feedback.completeness}
Improved Prompt: ${evalItem.evaluation.improvedPrompt}
Improvements: ${evalItem.evaluation.improvements.join(', ')}
`).join('\n')}

Please:
1. Analyze each evaluation's quality, accuracy, and helpfulness
2. Consider which provides the most actionable feedback
3. Select the best evaluation and explain your reasoning
4. Respond in JSON format:

{
  "thinking": "Step-by-step analysis of each evaluation and reasoning for selection",
  "bestEvaluationIndex": number,
  "reasoning": "Why this evaluation is the best"
}`;

    try {
      let response;
      
      switch (judgeProvider) {
        case 'openai':
          response = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [{ role: "user", content: judgePrompt }],
            response_format: { type: "json_object" },
            temperature: 0.3,
          });
          break;
          
        case 'anthropic':
          const anthropicResponse = await anthropic.messages.create({
            model: 'claude-sonnet-4-20250514',
            max_tokens: 1024,
            temperature: 0.3,
            system: 'You are an expert AI evaluation judge. Respond only in valid JSON format.',
            messages: [{ role: 'user', content: judgePrompt }],
          });
          const anthropicContent = anthropicResponse.content[0].type === 'text' ? anthropicResponse.content[0].text : '';
          response = { choices: [{ message: { content: anthropicContent } }] };
          break;
          
        case 'deepseek':
          const deepseekResponse = await deepseekAI.chat.completions.create({
            model: "deepseek-chat",
            messages: [{ role: "user", content: judgePrompt }],
            response_format: { type: "json_object" },
            temperature: 0.3,
          });
          response = deepseekResponse;
          break;
          
        // Commented out for future use:
        // case 'google':
        //   const model = geminiAI.getGenerativeModel({ model: "gemini-1.5-pro" });
        //   const googleResponse = await model.generateContent(judgePrompt);
        //   response = { choices: [{ message: { content: googleResponse.response.text() } }] };
        //   break;
        //   
        // case 'grok':
        //   const grokResponse = await grokAI.chat.completions.create({
        //     model: "grok-2-1212",
        //     messages: [{ role: "user", content: judgePrompt }],
        //     response_format: { type: "json_object" },
        //     temperature: 0.3,
        //   });
        //   response = grokResponse;
        //   break;
          
        default:
          throw new Error(`Unknown judge provider: ${judgeProvider}`);
      }

      const content = response.choices[0].message.content;
      if (!content) throw new Error("No response from judge");
      
      const judgeResult = JSON.parse(content);
      const bestEvaluation = evaluations[judgeResult.bestEvaluationIndex]?.evaluation;
      
      if (!bestEvaluation) {
        throw new Error("Invalid evaluation index from judge");
      }

      return {
        bestEvaluation,
        thinking: judgeResult.thinking,
      };
    } catch (error) {
      console.error("Judge evaluation failed, falling back to highest scored evaluation:", error);
      // Fallback: return the evaluation with highest overall score
      const best = evaluations.reduce((prev, current) => 
        (current.evaluation.overallScore > prev.evaluation.overallScore) ? current : prev
      );
      
      return {
        bestEvaluation: best.evaluation,
        thinking: "Judge evaluation failed. Selected the evaluation with the highest overall score as fallback.",
      };
    }
  }

  private async evaluateWithOpenAI(userPrompt: string, promptType: string = 'analysis'): Promise<Omit<EvaluationResponse, 'overallScore'>> {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: getSystemPrompt(promptType) },
        { role: "user", content: userPrompt }
      ],
      response_format: { type: "json_object" },
      temperature: 0.3,
    });

    const content = response.choices[0].message.content;
    if (!content) throw new Error("No response from OpenAI");
    
    return JSON.parse(content);
  }

  private async evaluateWithAnthropic(userPrompt: string, promptType: string = 'analysis'): Promise<Omit<EvaluationResponse, 'overallScore'>> {
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2000,
      system: getSystemPrompt(promptType),
      messages: [{ role: 'user', content: userPrompt }],
      temperature: 0.3,
    });

    const content = response.content[0];
    if (content.type !== 'text') throw new Error("Unexpected response type from Anthropic");
    
    // Clean up the response to extract JSON
    let cleanedText = content.text.trim();
    
    // Remove markdown code blocks if present
    if (cleanedText.includes('```json')) {
      const match = cleanedText.match(/```json\s*([\s\S]*?)\s*```/);
      if (match) {
        cleanedText = match[1].trim();
      }
    } else if (cleanedText.includes('```')) {
      const match = cleanedText.match(/```\s*([\s\S]*?)\s*```/);
      if (match) {
        cleanedText = match[1].trim();
      }
    }
    
    // Try to extract JSON if still not clean
    if (!cleanedText.startsWith('{')) {
      const jsonMatch = cleanedText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        cleanedText = jsonMatch[0];
      }
    }
    
    return JSON.parse(cleanedText);
  }

  // Commented out for future use:
  // private async evaluateWithGrok(userPrompt: string): Promise<Omit<EvaluationResponse, 'overallScore'>> {
  //   const response = await grokAI.chat.completions.create({
  //     model: "grok-2-1212",
  //     messages: [
  //       { role: "system", content: SYSTEM_PROMPT },
  //       { role: "user", content: userPrompt }
  //     ],
  //     response_format: { type: "json_object" },
  //     temperature: 0.3,
  //   });

  //   const content = response.choices[0].message.content;
  //   if (!content) throw new Error("No response from Grok");
    
  //   return JSON.parse(content);
  // }

  private async evaluateWithDeepSeek(userPrompt: string, promptType: string = 'analysis'): Promise<Omit<EvaluationResponse, 'overallScore'>> {
    const response = await deepseekAI.chat.completions.create({
      model: "deepseek-chat",
      messages: [
        { role: "system", content: getSystemPrompt(promptType) },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.3,
    });

    const content = response.choices[0].message.content;
    if (!content) throw new Error("No response from DeepSeek");
    
    // Clean up the response to extract JSON
    let cleanedText = content.trim();
    
    // Remove markdown code blocks if present
    if (cleanedText.includes('```json')) {
      const match = cleanedText.match(/```json\s*([\s\S]*?)\s*```/);
      if (match) {
        cleanedText = match[1].trim();
      }
    } else if (cleanedText.includes('```')) {
      const match = cleanedText.match(/```\s*([\s\S]*?)\s*```/);
      if (match) {
        cleanedText = match[1].trim();
      }
    }
    
    // Try to extract JSON if still not clean
    if (!cleanedText.startsWith('{')) {
      const jsonMatch = cleanedText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        cleanedText = jsonMatch[0];
      }
    }
    
    try {
      return JSON.parse(cleanedText);
    } catch (error) {
      console.error("DeepSeek JSON parsing error:", cleanedText.substring(0, 200));
      throw new Error("Could not parse JSON response from DeepSeek");
    }
  }

  // Commented out for future use:
  // private async evaluateWithGemini(userPrompt: string): Promise<Omit<EvaluationResponse, 'overallScore'>> {
  //   const model = geminiAI.getGenerativeModel({ model: "gemini-1.5-pro" });

  //   const prompt = `${SYSTEM_PROMPT}\n\n${userPrompt}`;

  //   const result = await model.generateContent(prompt);
  //   const response = await result.response;
  //   const content = response.text();

  //   if (!content) throw new Error("No response from Google Gemini");

  //   try {
  //     return JSON.parse(content);
  //   } catch {
  //     // Fallback: try to extract JSON from the response
  //     const jsonMatch = content.match(/\{[\s\S]*\}/);
  //     if (jsonMatch) {
  //       return JSON.parse(jsonMatch[0]);
  //     }
  //     throw new Error("Could not parse JSON response from Google Gemini");
  //   }
  // }
}

export const aiProviderService = new AIProviderService();
