import type { Handler, HandlerEvent, HandlerContext, HandlerResponse } from '@netlify/functions';
import { storage } from '../../server/storage';
import { aiProviderService } from '../../server/services/ai-providers';

export const handler: Handler = async (event: HandlerEvent, context: HandlerContext): Promise<HandlerResponse> => {
  const { path, httpMethod, headers, body, queryStringParameters } = event;
  
  console.log('Netlify function called:', { path, httpMethod, queryStringParameters });
  
  // Extract the API path - Netlify passes the original path in headers
  const originalPath = headers['x-forwarded-path'] || path;
  let apiPath = '';
  
  if (originalPath.startsWith('/api/')) {
    apiPath = originalPath.substring(5); // Remove /api/ prefix
  } else {
    // Fallback: try to extract from path
    apiPath = path.replace('/.netlify/functions/api', '').replace(/^\//, '');
  }
  
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
    console.log('Processing API path:', apiPath);
    
    // GET /example-prompts
    if (apiPath === 'example-prompts' && httpMethod === 'GET') {
      const examples = await storage.getExamplePrompts();
      return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify(examples),
      };
    }
    
    // GET /task-scenario/:promptType
    if (apiPath?.startsWith('task-scenario/') && httpMethod === 'GET') {
      const promptType = apiPath.split('task-scenario/')[1];
      const scenario = await storage.getRandomTaskScenario(promptType);
      return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify(scenario),
      };
    }
    
    // POST /evaluate-prompt
    if (apiPath === 'evaluate-prompt' && httpMethod === 'POST') {
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