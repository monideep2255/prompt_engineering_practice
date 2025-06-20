import type { Handler, HandlerEvent, HandlerContext } from '@netlify/functions';
import express from 'express';
import { registerRoutes } from '../../server/routes';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS middleware for frontend
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  
  next();
});

// Register all routes
registerRoutes(app);

export const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  // Simple serverless adapter for Netlify
  const { path, httpMethod, headers, body, queryStringParameters } = event;
  
  return new Promise((resolve) => {
    const req = {
      method: httpMethod,
      url: path + (queryStringParameters ? '?' + new URLSearchParams(queryStringParameters).toString() : ''),
      headers,
      body: body ? JSON.parse(body) : undefined,
    } as any;
    
    const res = {
      statusCode: 200,
      headers: {},
      body: '',
      status: function(code: number) {
        this.statusCode = code;
        return this;
      },
      json: function(data: any) {
        this.headers['Content-Type'] = 'application/json';
        this.body = JSON.stringify(data);
        resolve({
          statusCode: this.statusCode,
          headers: this.headers,
          body: this.body,
        });
        return this;
      },
      header: function(key: string, value: string) {
        this.headers[key] = value;
        return this;
      },
      sendStatus: function(code: number) {
        this.statusCode = code;
        resolve({
          statusCode: this.statusCode,
          headers: this.headers,
          body: '',
        });
        return this;
      },
    } as any;
    
    // Find matching route and execute
    if (path.startsWith('/api/example-prompts') && httpMethod === 'GET') {
      import('../../server/storage.js').then(({ storage }) => {
        storage.getExamplePrompts().then((examples) => {
          res.json(examples);
        }).catch((error) => {
          console.error('Error fetching example prompts:', error);
          res.status(500).json({ message: 'Failed to fetch example prompts' });
        });
      });
    } else if (path.startsWith('/api/evaluate-prompt') && httpMethod === 'POST') {
      import('../../server/services/ai-providers.js').then(({ aiProviderService }) => {
        const { content, promptType, aiProvider } = req.body;
        
        if (!content || !promptType || !aiProvider) {
          return res.status(400).json({ error: "Missing required fields" });
        }

        let evaluationPromise;
        if (aiProvider.startsWith("all-")) {
          const judgeProvider = aiProvider.replace("all-", "");
          evaluationPromise = aiProviderService.evaluateWithAllProviders(content, promptType, judgeProvider);
        } else {
          evaluationPromise = aiProviderService.evaluatePrompt(content, promptType, aiProvider);
        }
        
        evaluationPromise.then((evaluation) => {
          res.json(evaluation);
        }).catch((error) => {
          console.error('Error evaluating prompt:', error);
          res.status(500).json({ message: error.message || 'Failed to evaluate prompt' });
        });
      });
    } else {
      res.status(404).json({ message: 'Not found' });
    }
  });
};