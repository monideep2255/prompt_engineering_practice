# Deployment Guide - Prompt Practice Lab

## Quick Deployment Options

### Option 1: Replit Deployment (Recommended - Easiest)

1. **Deploy on Replit**:
   - Click the "Deploy" button in your Replit interface
   - Add environment variables in the Secrets tab:
     ```
     OPENAI_API_KEY=your_openai_key_here
     ANTHROPIC_API_KEY=your_anthropic_key_here
     GOOGLE_API_KEY=your_google_key_here
     DEEPSEEK_API_KEY=your_deepseek_key_here
     XAI_API_KEY=your_groq_key_here
     ```
   - Your app will be available at `https://your-repl-name.your-username.repl.co`

### Option 2: Vercel Deployment

1. **Connect to Vercel**:
   - Push your code to GitHub
   - Connect your GitHub repo to Vercel
   - Add environment variables in Vercel dashboard
   - Deploy automatically

### Option 3: Railway Deployment

1. **Deploy to Railway**:
   - Connect your GitHub repository
   - Add environment variables
   - Railway will auto-detect and deploy your Node.js app

## Environment Variables Required

For any deployment platform, you need these API keys:

```bash
OPENAI_API_KEY=sk-...          # Required for OpenAI evaluations
ANTHROPIC_API_KEY=sk-ant-...   # Required for Anthropic evaluations  
GOOGLE_API_KEY=AI...           # Required for Google/Gemini evaluations
DEEPSEEK_API_KEY=sk-...        # Required for DeepSeek evaluations
XAI_API_KEY=xai-...            # Required for Groq evaluations
```

## Getting API Keys

### OpenAI
- Visit: https://platform.openai.com/api-keys
- Create a new API key
- Add billing method for usage

### Anthropic
- Visit: https://console.anthropic.com/
- Create API key in Account Settings

### Google (Gemini)
- Visit: https://aistudio.google.com/app/apikey
- Create API key
- Note: Free tier has quota limits

### DeepSeek
- Visit: https://platform.deepseek.com/api_keys
- Create API key

### Groq (xAI)
- Visit: https://console.x.ai/
- Create API key
- Note: May require waitlist approval

## Build Commands

- **Build**: `npm run build`
- **Start**: `npm start` (production)
- **Dev**: `npm run dev` (development)

## Troubleshooting

### API Quota Issues
- Google Gemini: Free tier has strict limits, consider upgrading
- All providers: Monitor usage and add billing as needed

### Deployment Issues
- Ensure all environment variables are set
- Check build logs for missing dependencies
- Verify API keys are valid and have sufficient credits

### CORS Issues
- The app includes proper CORS headers
- If issues persist, check your deployment platform's proxy settings

## Current Status
- ✅ Task scenario randomizer working
- ✅ Multi-LLM evaluation with progress tracking
- ✅ Export functionality (JSON/YAML)
- ⚠️ Some API keys may need updating (check logs)
- ⚠️ Netlify deployment needs configuration fixes

## Recommended Next Steps
1. Deploy on Replit first (simplest option)
2. Test all evaluation features
3. Add valid API keys for all providers
4. Consider upgrading Google Gemini quota if needed