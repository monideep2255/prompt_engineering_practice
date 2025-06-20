# Netlify Deployment Guide

## Quick Deploy Steps

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Deploy Prompt Practice Lab"
   git push origin main
   ```

2. **Create Netlify Site**
   - Go to [netlify.com](https://netlify.com)
   - Click "New site from Git"
   - Select your GitHub repository
   - Use these build settings:
     - Build command: `npm run build`
     - Publish directory: `dist`
     - Node version: 20

3. **Add Environment Variables**
   In Netlify dashboard → Site settings → Environment variables, add:
   ```
   OPENAI_API_KEY=your_openai_key_here
   ANTHROPIC_API_KEY=your_anthropic_key_here
   DEEPSEEK_API_KEY=your_deepseek_key_here
   ```

4. **Deploy**
   - Click "Deploy site"
   - Netlify will automatically build and deploy your app

## API Key Setup

### OpenAI API Key
1. Go to [platform.openai.com](https://platform.openai.com)
2. Sign up/Login
3. Navigate to API Keys section
4. Create new secret key
5. Copy the key (starts with `sk-`)

### Anthropic API Key
1. Go to [console.anthropic.com](https://console.anthropic.com)
2. Sign up/Login
3. Navigate to API Keys
4. Create new key
5. Copy the key (starts with `sk-ant-`)

### DeepSeek API Key
1. Go to [platform.deepseek.com](https://platform.deepseek.com)
2. Sign up/Login
3. Navigate to API Keys
4. Create new key
5. Copy the key

## Troubleshooting

### 404 Page Not Found
- Ensure `_redirects` file is in `client/public/`
- Check netlify.toml has proper redirect configuration
- Verify build command produces `dist` directory

### API Errors
- Verify all environment variables are set correctly in Netlify
- Check API key formats and validity
- Ensure sufficient API credits/usage limits

### Build Failures
- Check Node.js version is set to 20
- Verify all dependencies are properly installed
- Review build logs for specific error messages

## Configuration Files

The project includes these deployment configuration files:
- `netlify.toml` - Main Netlify configuration
- `client/public/_redirects` - SPA routing configuration
- `netlify/functions/api.ts` - Serverless function handler

## Custom Domain (Optional)

To use a custom domain:
1. In Netlify dashboard → Domain settings
2. Add custom domain
3. Follow DNS configuration instructions
4. SSL certificate will be automatically provisioned