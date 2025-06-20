import type { Handler, HandlerEvent, HandlerContext, HandlerResponse } from '@netlify/functions';
import { storage } from '../../server/storage';
import { aiProviderService } from '../../server/services/ai-providers';

export const handler: Handler = async (event: HandlerEvent, context: HandlerContext): Promise<HandlerResponse> => {
  const { path, httpMethod, headers, body } = event;
  
  // CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Content-Type': 'application/json',
  };

  // Handle CORS preflight
  if (httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: '',
    };
  }

  try {
    // GET /api/example-prompts
    if (path === '/api/example-prompts' && httpMethod === 'GET') {
      const examples = await storage.getExamplePrompts();
      return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify(examples),
      };
    }
    
    // POST /api/evaluate-prompt
    if (path === '/api/evaluate-prompt' && httpMethod === 'POST') {
      if (!body) {
        return {
          statusCode: 400,
          headers: corsHeaders,
          body: JSON.stringify({ error: 'Request body is required' }),
        };
      }

      const { content, promptType, aiProvider } = JSON.parse(body);
      
      if (!content || !promptType || !aiProvider) {
        return {
          statusCode: 400,
          headers: corsHeaders,
          body: JSON.stringify({ error: 'Missing required fields: content, promptType, aiProvider' }),
        };
      }

      let evaluation;
      if (aiProvider.startsWith("all-")) {
        const judgeProvider = aiProvider.replace("all-", "");
        evaluation = await aiProviderService.evaluateWithAllProviders(content, promptType, judgeProvider);
      } else {
        evaluation = await aiProviderService.evaluatePrompt(content, promptType, aiProvider);
      }
      
      return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify(evaluation),
      };
    }

    // Route not found
    return {
      statusCode: 404,
      headers: corsHeaders,
      body: JSON.stringify({ message: 'Not found' }),
    };

  } catch (error) {
    console.error('Serverless function error:', error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ 
        message: error instanceof Error ? error.message : 'Internal server error' 
      }),
    };
  }
};