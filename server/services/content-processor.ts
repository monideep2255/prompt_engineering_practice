import OpenAI from 'openai';
import { storage } from '../storage';
import { InsertContentSource, InsertContentChunk } from '@shared/schema';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export class ContentProcessorService {
  
  // Process uploaded text content and create chunks
  async processTextContent(
    title: string,
    content: string,
    sourceType: string,
    expertName?: string,
    originalUrl?: string
  ) {
    // Create content source record
    const source = await storage.createContentSource({
      title,
      description: `${sourceType} content from ${expertName || 'custom source'}`,
      sourceType,
      expertName: expertName || 'custom',
      originalUrl,
      isActive: true,
    });

    // Split content into chunks (roughly 1000 chars each)
    const chunks = this.splitIntoChunks(content, 1000);
    
    // Process each chunk
    const processedChunks = [];
    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      
      // Extract topics and categorize prompt types
      const analysis = await this.analyzeChunk(chunk);
      
      const chunkRecord = await storage.createContentChunk({
        sourceId: source.id,
        content: chunk,
        chunkIndex: i,
        promptTypes: analysis.promptTypes,
        keyTopics: analysis.topics,
        embedding: null, // We'll implement embeddings later
      });
      
      processedChunks.push(chunkRecord);
    }

    // Mark source as processed
    const processedSource = { ...source, processedAt: new Date() };
    
    return {
      source: processedSource,
      chunks: processedChunks,
      totalChunks: chunks.length,
    };
  }

  // Split text into manageable chunks
  private splitIntoChunks(text: string, maxChars: number): string[] {
    const chunks: string[] = [];
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    
    let currentChunk = '';
    
    for (const sentence of sentences) {
      const trimmedSentence = sentence.trim();
      if (trimmedSentence.length === 0) continue;
      
      // If adding this sentence would exceed max chars, start new chunk
      if (currentChunk.length + trimmedSentence.length > maxChars && currentChunk.length > 0) {
        chunks.push(currentChunk.trim());
        currentChunk = trimmedSentence + '.';
      } else {
        currentChunk += (currentChunk.length > 0 ? ' ' : '') + trimmedSentence + '.';
      }
    }
    
    // Add final chunk if it has content
    if (currentChunk.trim().length > 0) {
      chunks.push(currentChunk.trim());
    }
    
    return chunks.length > 0 ? chunks : [text]; // Fallback to original text if splitting fails
  }

  // Analyze chunk content to extract topics and relevant prompt types
  private async analyzeChunk(content: string): Promise<{ topics: string[], promptTypes: string[] }> {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: `Analyze this text chunk and return JSON with:
1. "topics": Array of 3-5 key topics/concepts (single words or short phrases)
2. "promptTypes": Array of relevant prompt types from: ["creative-writing", "instructional", "system", "few-shot", "summarization", "analysis"]

Focus on what prompt engineering techniques this content would be most useful for.`
          },
          {
            role: "user",
            content: content
          }
        ],
        response_format: { type: "json_object" },
        max_tokens: 500,
      });

      const analysis = JSON.parse(response.choices[0].message.content || '{}');
      
      return {
        topics: Array.isArray(analysis.topics) ? analysis.topics.slice(0, 5) : [],
        promptTypes: Array.isArray(analysis.promptTypes) ? analysis.promptTypes : [],
      };
    } catch (error) {
      console.error('Error analyzing chunk:', error);
      return {
        topics: ['general'],
        promptTypes: ['analysis'], // Default fallback
      };
    }
  }

  // Search for relevant content chunks based on prompt and type
  async searchRelevantContent(prompt: string, promptType: string, limit = 3) {
    // Extract key terms from the prompt for search
    const searchTerms = this.extractKeyTerms(prompt);
    
    // Search for relevant chunks
    const chunks = await storage.searchContentChunks(searchTerms, promptType);
    
    return chunks.slice(0, limit);
  }

  // Extract key terms from prompt for search
  private extractKeyTerms(prompt: string): string {
    // Simple extraction - could be enhanced with NLP
    const words = prompt.toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(word => word.length > 3 && !['that', 'this', 'with', 'from', 'they', 'have', 'will', 'been', 'were', 'said', 'each', 'which', 'their', 'time', 'will', 'about', 'would', 'there', 'could', 'other'].includes(word));
    
    return words.slice(0, 5).join(' ');
  }
}

export const contentProcessor = new ContentProcessorService();