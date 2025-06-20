# 🧠 Prompt Practice Lab

**AI-Powered Prompt Engineering Coach**

A personal training tool designed to help users improve their prompt engineering skills through structured practice, real-time feedback, and iterative learning. Built with React + Express and powered by multiple AI providers for comprehensive prompt evaluation.

## 🎯 Vision

Prompt engineering is rapidly becoming a key skill in leveraging AI effectively. Yet most users lack structured ways to practice and improve their prompting skills. Prompt Practice Lab changes that by providing:

- **Structured Practice Environment**: Safe space to experiment with different prompt styles
- **Real-time AI Feedback**: Immediate, actionable feedback on prompt quality
- **Iterative Learning**: Learn from AI-generated improvements and expert techniques
- **Progress Tracking**: Monitor your growth and identify areas for improvement

## 🚀 Features

### ✅ Phase 1: Prompt Input + Evaluation Feedback MVP (COMPLETED)

- **Multi-Provider Prompt Input**: Write prompts with support for different prompt types
- **AI-Powered Evaluation**: Get scored feedback across 4 key criteria:
  - **Clarity** (1-10): How clear and understandable is the prompt?
  - **Specificity** (1-10): How specific and detailed are the requirements?
  - **Task Alignment** (1-10): How well does the prompt align with its intended purpose?
  - **Completeness** (1-10): Does the prompt include all necessary context?
- **Improvement Suggestions**: Receive an AI-enhanced version of your prompt
- **Multiple AI Providers**: Choose from OpenAI GPT-4, Anthropic Claude, Google Gemini, Grok, or DeepSeek
- **🎯 Multi-LLM Evaluation with AI Judge**: Revolutionary feature that evaluates your prompt with 4 different LLMs (Anthropic, Google, Grok, DeepSeek), then uses OpenAI GPT-4 as an expert judge to select the best evaluation with detailed reasoning
- **Judge Analysis Display**: See step-by-step thinking from the AI judge explaining why one evaluation was chosen over others
- **Prompt History**: Track your evaluation history and progress over time
- **Example Prompts**: Learn from high-quality example prompts across different categories
- **Fully Responsive Design**: Optimized interface that works seamlessly across mobile, tablet, and desktop devices

### 🔄 Phase 2: Prompt Types & Style Modes (UPCOMING)

- **Prompt Style Selection**: Choose from specialized prompt types:
  - Instructional prompts
  - Creative writing prompts
  - System prompts
  - Few-shot learning examples
  - Summarization tasks
  - Analysis requests
- **Style-Specific Feedback**: Tailored evaluation criteria based on prompt type
- **Template Library**: Pre-built templates for different use cases

### 📡 Phase 3: RAG-Based Feedback Coach (UPCOMING)

- **Content Integration**: Upload YouTube transcripts, podcast summaries, or documents
- **Contextual Learning**: Personalized feedback based on your uploaded content
- **Expert Knowledge Base**: Learn from industry experts and best practices

### 🧪 Phase 4: Advanced Analytics & Progress Dashboard (UPCOMING)

- **Detailed Analytics**: Track improvement trends across all evaluation criteria
- **Skill Assessment**: Identify strengths and areas for growth
- **Achievement System**: Unlock badges and track learning streaks
- **Comparative Analysis**: See how your prompts stack up against best practices

### 🚀 Phase 5: Playground & Challenge Mode (UPCOMING)

- **Free-form Experimentation**: Practice mode with no limits
- **Structured Challenges**: Complete specific prompt-writing challenges
- **Community Features**: Share and learn from other users' successful prompts

## 🛠 Tech Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling with custom design system
- **Shadcn/ui** components for consistent UI
- **TanStack Query** for state management and API calls
- **Wouter** for lightweight routing
- **Lucide React** for icons

### Backend
- **Node.js** with Express server
- **TypeScript** for type safety
- **Zod** for schema validation
- **In-memory storage** with structured interfaces for rapid prototyping

### AI Integration
- **OpenAI GPT-4** - Primary judge for multi-LLM evaluation and standalone evaluation
- **Anthropic Claude** - Advanced reasoning with Claude Sonnet 4
- **Google Gemini** - Google's flagship LLM for diverse perspectives
- **Grok** - xAI's conversational AI for unique evaluation angles
- **DeepSeek** - High-performance cost-effective alternative

### Development Tools
- **Vite** for fast development and building
- **Drizzle ORM** for database schema management
- **ESBuild** for fast compilation

## 🚦 Getting Started

### Prerequisites
- Node.js 20+ installed
- At least one AI provider API key

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up your AI provider API keys in the Replit Secrets:
   - `OPENAI_API_KEY` - OpenAI API key (required for judge functionality)
   - `ANTHROPIC_API_KEY` - Anthropic API key
   - `GROQ_API_KEY` - Grok API key
   - `DEEPSEEK_API_KEY` - DeepSeek API key
   - `GOOGLE_API_KEY` - Google Gemini API key

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open your browser and navigate to the application

## 🎯 How to Use

The app offers two powerful evaluation modes:

### Single Provider Evaluation
1. Write your prompt in the input field
2. Select a specific AI provider (OpenAI, Anthropic, Google Gemini, DeepSeek, or Grok)
3. Click "Evaluate My Prompt" for immediate feedback

### Multi-LLM Evaluation with AI Judge
1. Write your prompt in the input field
2. Select "🏆 4 LLM Evaluation + OpenAI Judge"
3. Click "Evaluate My Prompt" - the system will:
   - Send your prompt to 4 different LLMs (Anthropic, Google, Grok, DeepSeek)
   - Collect all evaluations with scores and feedback
   - Use OpenAI GPT-4 as an expert judge to analyze all evaluations
   - Present the best evaluation with detailed reasoning
   - Show comparison scores from all providers

### Additional Features
- **View Judge Analysis**: See step-by-step reasoning from the AI judge
- **Copy Improved Prompts**: Instantly copy enhanced versions to your clipboard
- **Export Results**: Download evaluation data as JSON
- **Track History**: Access your complete evaluation history
- **Example Prompts**: Learn from high-quality examples across different categories

## 📊 Evaluation Criteria

Our AI evaluation system scores prompts across four key dimensions:

### 1. Clarity (1-10)
- **What it measures**: How clearly the prompt communicates its intent
- **Good examples**: Specific language, clear structure, unambiguous instructions
- **Common issues**: Vague language, confusing structure, unclear objectives

### 2. Specificity (1-10)
- **What it measures**: How detailed and precise the requirements are
- **Good examples**: Specific output formats, clear constraints, detailed context
- **Common issues**: Generic requests, missing details, vague requirements

### 3. Task Alignment (1-10)
- **What it measures**: How well the prompt aligns with its intended purpose
- **Good examples**: Appropriate tone, relevant context, suitable complexity
- **Common issues**: Mismatched tone, irrelevant information, inappropriate scope

### 4. Completeness (1-10)
- **What it measures**: Whether all necessary context and constraints are included
- **Good examples**: Complete context, all constraints specified, clear success criteria
- **Common issues**: Missing context, undefined constraints, unclear success metrics

## 🎓 Learning Approach

Prompt Practice Lab follows proven learning methodologies:

1. **Practice-Based Learning**: Learn by doing with immediate feedback
2. **Iterative Improvement**: See before/after comparisons with AI suggestions
3. **Multi-Modal Feedback**: Visual scores, written explanations, and improved examples
4. **Progressive Complexity**: Start simple, advance to sophisticated prompt engineering
5. **Personalized Learning**: Track your unique strengths and improvement areas

## 🤝 Contributing

We welcome contributions! Areas where you can help:

- **Feature Development**: Implement upcoming phases
- **AI Provider Integration**: Add support for new AI models
- **UI/UX Improvements**: Enhance the user experience
- **Documentation**: Improve guides and examples
- **Testing**: Add test coverage and quality assurance

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🔗 Links

- **Product Requirements Document**: See attached PRD for detailed feature specifications
- **Technical Specification**: See attached tech spec for implementation details
- **API Documentation**: In-code documentation for all endpoints and schemas

---

**Built with ❤️ for the prompt engineering community**