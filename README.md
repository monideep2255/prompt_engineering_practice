*Last Updated: July 08, 2025*

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

### ✅ Phase 2: Prompt Types & Style Modes (COMPLETED - June 24, 2025)

**Core Features:**
- **✅ 6 Specialized Prompt Types**: Each with unique evaluation criteria tailored to specific use cases:
  - **Creative Writing**: Creativity, Narrative Structure, Character Development, Emotional Resonance
  - **Instructional**: Clarity, Step-by-Step Flow, Actionability, Completeness  
  - **System Prompts**: Role Definition, Constraint Specification, Output Format, Behavioral Guidance
  - **Few-Shot Learning**: Example Quality, Pattern Clarity, Consistency, Learning Effectiveness
  - **Summarization**: Compression Efficiency, Key Point Extraction, Audience Targeting, Structure Clarity
  - **Analysis**: Analytical Depth, Framework Application, Evidence Integration, Insight Generation

**Advanced Features:**
- **✅ Dynamic Style-Specific Evaluation**: AI feedback adapts contextually based on selected prompt type
- **✅ Professional Template Library**: 16 expertly crafted templates organized by:
  - Difficulty levels (Beginner/Intermediate/Advanced)
  - Use case scenarios (fiction, tutorials, system design, etc.)
  - One-click integration with prompt input
  - Copy/paste functionality for manual customization
- **✅ Comprehensive Learning Hub**: Dedicated Learn page featuring:
  - Good vs. bad examples for each prompt type
  - Best practices and universal prompt writing tips
  - Detailed FAQ addressing common questions
  - Mobile-responsive design with clean navigation
- **✅ Enhanced User Experience**: 
  - Seamless navigation between Practice and Learn sections
  - Responsive template library with optimized tab layout
  - "Back to Practice" functionality from Learn page

### ✅ Phase 3: RAG-Based Feedback Coach (COMPLETED - July 08, 2025)

Transform prompt evaluation with expert knowledge integration and database-powered learning. This phase introduces the RAG (Retrieval-Augmented Generation) system that allows users to upload expert content and receive enhanced, contextual feedback on their prompts.

**Database Infrastructure:**
- **✅ PostgreSQL Integration**: Full database backend with content storage and chunking system
- **✅ Drizzle ORM Setup**: Type-safe database operations with content sources and chunks tables
- **✅ Database Migration**: Seamless transition from in-memory to persistent storage

**Content Management System:**
- **✅ File Upload Support**: Upload .txt, .md, and .pdf files with proper encoding handling
- **✅ Text Paste Interface**: Direct text input for quick content addition
- **✅ Expert Content Library**: Dedicated /content route for managing expert knowledge base
- **✅ CRUD Operations**: Full create, read, update, delete functionality for content sources
- **✅ Content Source Tracking**: Track expert names, source types, and original URLs

**RAG Processing Pipeline:**
- **✅ Automatic Content Chunking**: Intelligent text splitting with proper sentence boundaries
- **✅ AI-Powered Topic Extraction**: Automatic categorization of content topics and themes
- **✅ Prompt Type Classification**: Smart matching of content to specific prompt types
- **✅ Content Cleaning**: Robust handling of encoding issues and special characters

**Enhanced AI Evaluation:**
- **✅ Expert Context Integration**: RAG-enhanced evaluations using relevant expert content
- **✅ Contextual Feedback**: Prompt evaluations now include insights from uploaded expert knowledge
- **✅ Content Relevance Matching**: Automatic selection of most relevant content chunks for evaluation
- **✅ Multi-Provider RAG Support**: RAG integration works with all AI providers (OpenAI, Anthropic, DeepSeek)
- **✅ Expert Feedback Indicators**: Clear visual indicators when expert advice is included in evaluations

**User Experience Enhancements:**
- **✅ Navigation Integration**: Expert Content tab in main navigation
- **✅ Upload Progress Tracking**: Real-time feedback during content processing
- **✅ Content Statistics**: View chunk counts and processing status for uploaded content
- **✅ Error Handling**: Comprehensive error messages for upload and processing issues
- **✅ Voice Input**: Speech-to-text functionality for prompt dictation
- **✅ Streamlined Upload**: Two-tab interface (File Upload, Paste Text) for simplified content addition
- **✅ Expert Attribution**: Clear attribution of expert sources used in feedback

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