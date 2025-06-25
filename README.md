*Last Updated: June 24, 2025*

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

### ✅ Phase 1: Prompt Input + Evaluation Feedback MVP (COMPLETED - June 20, 2025)

- **Multi-Provider Prompt Input**: Write prompts with support for different prompt types (Creative Writing, Instructional, Summarization, Code Generation, Data Analysis, Analysis)
- **AI-Powered Evaluation**: Get scored feedback across 4 key criteria:
  - **Clarity** (1-10): How clear and understandable is the prompt?
  - **Specificity** (1-10): How specific and detailed are the requirements?
  - **Task Alignment** (1-10): How well does the prompt align with its intended purpose?
  - **Completeness** (1-10): Does the prompt include all necessary context?
- **Improvement Suggestions**: Receive an AI-enhanced version of your prompt with detailed feedback
- **🎯 Streamlined 2-LLM Evaluation System**: Efficient dual-provider evaluation using Anthropic Claude and DeepSeek for comprehensive prompt analysis:
  - **2-Provider Analysis**: Anthropic focuses on structure and clarity, DeepSeek emphasizes technical precision
  - **AI Judge Selection**: Choose from OpenAI, Anthropic, or DeepSeek as your evaluation judge
  - **Enhanced Progress Tracking**: Real-time display showing what each LLM thinks during evaluation
  - **Judge Decision Process**: Detailed view of how the AI judge compares evaluations and selects the best analysis
  - **LLM Thinking Summaries**: See 1-line insights from each LLM during the evaluation process
- **Export Functionality**: Export evaluations in JSON format or YAML format structured for CrewAI agents
- **🎯 Randomizer Task Scenarios**: Dynamic context generator providing real-world scenarios for prompt practice:
  - **Contextual Practice**: Get specific scenarios like "Build a REST API for a fitness tracking app with user authentication"
  - **Dynamic Task Generation**: Fresh scenarios for each prompt type with varied complexity levels
  - **Real-world Context**: Practice with authentic business scenarios instead of generic prompts
  - **One-click Refresh**: Generate new scenarios instantly to keep practice sessions engaging
- **Interactive Workflow Features**: 
  - **"Use This Version" Button**: Copy improved prompts directly back to input field for iterative refinement
  - **Logo Home Reset**: Click logo to reset to clean state and start fresh
  - **Progress Visualization**: Live feedback showing evaluation steps and AI decision-making process
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
- **OpenAI GPT-4** - Advanced reasoning and analysis capabilities
- **Anthropic Claude** - Expert evaluation with Claude Sonnet 4
- **DeepSeek** - High-performance cost-effective evaluation

**Multi-Judge System**: Each of these 3 AI models can serve as both evaluator and judge, providing you with diverse analytical perspectives on your prompts.

### Development Tools
- **Vite** for fast development and building
- **Drizzle ORM** for database schema management
- **ESBuild** for fast compilation

## 🚦 Getting Started

### Prerequisites
- Node.js 18+ installed
- At least one AI provider API key

### Local Development

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file with your API keys:
   ```
   OPENAI_API_KEY=your_openai_key_here
   ANTHROPIC_API_KEY=your_anthropic_key_here
   DEEPSEEK_API_KEY=your_deepseek_key_here
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open http://localhost:5000 in your browser

## 🚀 Deployment

### Replit Deploy (Recommended)
1. Click the "Deploy" button in Replit
2. Add environment variables in the Secrets tab
3. Application available at your `.replit.app` domain

### Vercel Deployment
1. Connect repository to Vercel
2. Add environment variables in project settings
3. Deploy with automatic builds on push

### Manual Deployment
1. Build the project: `npm run build`
2. Deploy the `dist` folder to any static hosting service
3. Ensure environment variables are configured

## 🎯 How to Use

The app offers two powerful evaluation modes:

### Single Provider Evaluation
1. Write your prompt in the input field
2. Select a specific AI provider (OpenAI, Anthropic, Google Gemini, DeepSeek, or Grok)
3. Click "Evaluate My Prompt" for immediate feedback

### Multi-LLM Evaluation with AI Judge
1. Write your prompt in the input field
2. Select from 3 judge options:
   - "🏆 2 LLM Evaluation + OpenAI Judge"
   - "🧠 2 LLM Evaluation + Anthropic Judge"
   - "⚡ 2 LLM Evaluation + DeepSeek Judge"
3. Click "Evaluate My Prompt" - the system will:
   - Send your prompt to 2 different LLMs (Anthropic, OpenAI, DeepSeek)
   - Collect all evaluations with scores and feedback
   - Use your chosen AI as an expert judge to analyze all evaluations
   - Present the best evaluation with detailed reasoning
   - Show comparison scores from all providers

### Additional Features
- **View Judge Analysis**: See step-by-step reasoning from the AI judge
- **Copy Improved Prompts**: Instantly copy enhanced versions to your clipboard
- **Export Results**: Download evaluation data in multiple formats:
  - **JSON Format**: Complete evaluation data with scores, feedback, and judge analysis
  - **YAML Format**: Structured as CrewAI agent configuration for direct integration
- **Track History**: Access your complete evaluation history
- **Example Prompts**: Learn from high-quality examples across different categories

## 📁 Export Formats

### JSON Export Example
```json
{
  "originalPrompt": "Write a short story about a robot learning to cook.",
  "evaluation": {
    "overallScore": 8,
    "clarityScore": 8,
    "specificityScore": 7,
    "taskAlignmentScore": 9,
    "completenessScore": 8,
    "feedback": {
      "clarity": "The prompt clearly communicates the basic intent...",
      "specificity": "The prompt is quite general and would benefit...",
      "taskAlignment": "The prompt aligns well with creative writing...",
      "completeness": "While the basic concept is present..."
    }
  },
  "improvedPrompt": "Write a 500-word short story about a domestic service robot named ARIA...",
  "improvements": ["Added specific character name", "Defined story length", "..."],
  "judgeAnalysis": "After analyzing all four evaluations, I selected...",
  "allEvaluations": [...]
}
```

### YAML Export Example (CrewAI Agent Format)
```yaml
researcher:
  role: >
    Senior Prompt Engineering Researcher for Instructional prompts
  goal: >
    Analyze and improve prompt quality with 8/10 overall effectiveness
  backstory: >
    You're a seasoned prompt engineering specialist with a talent for evaluating
    prompt clarity (8/10), specificity (7/10), task alignment (9/10), and completeness (8/10).
    Known for your ability to identify the most critical improvements
    and present them in a clear and actionable manner.
  
  original_prompt: |
    Write a short story about a robot learning to cook.
  
  improved_prompt: |
    Write a 500-word short story about a domestic service robot named ARIA 
    who discovers the art of cooking through trial and error...
  
  feedback:
    clarity: |
      The prompt clearly communicates the basic intent to create a story...
    specificity: |
      The prompt is quite general and would benefit from more specific parameters...
    task_alignment: |
      The prompt aligns well with creative writing objectives...
    completeness: |
      While the basic concept is present, the prompt lacks important context...
  
  key_improvements:
    - Added specific character name and personality (ARIA)
    - Defined clear story length requirement (500 words)
    - Included specific plot elements (mishaps, growth, meaningful meal)
    - Specified tone and emotional journey requirements
    - Added sensory description requirements for vivid storytelling
```

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

## 🔗 Links

- **Product Requirements Document**: See attached PRD for detailed feature specifications
- **Technical Specification**: See attached tech spec for implementation details
- **API Documentation**: In-code documentation for all endpoints and schemas

---

**Built with ❤️ for the prompt engineering community**