# Prompt Practice Lab - Project Documentation

## Overview
AI-powered personal training tool for improving prompt engineering skills. Built with React + Express + TypeScript, focusing on practical skill development through real-world scenarios and AI-powered feedback.

**Current Status**: Phase 3 RAG-Based Feedback Coach Complete - Expert content integration with enhanced evaluation system and voice input functionality

## User Preferences
- Remove all deployment service references when requested
- Prefer clean, focused deployment options (Replit Deploy recommended)
- Emphasize practical features over technical complexity
- Value iterative improvement and user-driven feature development

## Project Architecture

### Current Tech Stack
- **Frontend**: React + TypeScript + Vite + TailwindCSS + shadcn/ui
- **Backend**: Express.js + TypeScript
- **Storage**: In-memory storage (MemStorage) for rapid prototyping
- **AI Integration**: OpenAI GPT-4, Anthropic Claude Sonnet 4, DeepSeek
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query for server state
- **Forms**: React Hook Form + Zod validation

### Key Components
- **PromptInput**: Main evaluation interface with provider selection
- **TaskScenario**: Dynamic scenario generator with custom input capability
- **EvaluationResults**: Comprehensive feedback display with export options
- **AIProviderService**: Multi-LLM evaluation system with judge selection

## Recent Changes

### December 27, 2024 - Phase 3 RAG-Based Feedback Coach Complete
- ✓ **Database Infrastructure**: PostgreSQL integration with content storage and chunking system
- ✓ **Content Upload System**: File upload (.txt, .md, .pdf) and text paste functionality (YouTube removed for simplicity)
- ✓ **Expert Content Management**: Dedicated content management interface with CRUD operations
- ✓ **RAG Processing Pipeline**: Automatic content chunking, topic extraction, and prompt type categorization
- ✓ **Enhanced AI Evaluation**: Expert context integration in prompt evaluation using RAG
- ✓ **Navigation Enhancement**: New /content route with expert content library access
- ✓ **Content Sources**: Support for Lenny Rachitsky, Colin Bryar, and custom expert content
- ✓ **AI-Powered Analysis**: Automatic content categorization and relevance matching for prompt types
- ✓ **Voice Input**: Speech-to-text functionality for prompt dictation with clear integration
- ✓ **Expert Feedback Indicators**: Prominent green banners showing when expert advice is included
- ✓ **User Experience**: Fixed voice transcription display and evaluation progress tracking

### December 25, 2024 - Phase 2 Complete
- ✓ **Template Library System**: 16 professional templates across all prompt types
  - Organized by difficulty level (Beginner/Intermediate/Advanced)
  - One-click integration with prompt input field
  - Copy/Use functionality for easy adoption
  - Covers all major use cases from creative writing to technical analysis
- ✓ **Style-Specific Evaluation**: Complete system with specialized criteria for each prompt type
- ✓ **Learn Page**: Comprehensive FAQ and prompt writing guidance with:
  - Style-specific recommendations for all 6 prompt types
  - Good vs bad examples for each type
  - Best practices and universal tips
  - FAQ section addressing common questions
  - Navigation between Practice and Learn sections
- ✓ **Enhanced Navigation**: Header navigation with "Back to Practice" functionality
- ✓ Added "System Prompts" and "Few-Shot Learning" prompt types
- ✓ Created specialized evaluation criteria for each prompt type:
  - Creative Writing: Creativity, Narrative Structure, Character Development, Emotional Resonance
  - Instructional: Clarity, Step-by-Step Flow, Actionability, Completeness
  - System: Role Definition, Constraint Specification, Output Format, Behavioral Guidance
  - Few-Shot: Example Quality, Pattern Clarity, Consistency, Learning Effectiveness
  - Summarization: Compression Efficiency, Key Point Extraction, Audience Targeting, Structure Clarity
  - Analysis: Analytical Depth, Framework Application, Evidence Integration, Insight Generation
- ✓ Updated AI evaluation system to use prompt-type-specific criteria
- ✓ Created dynamic criteria display component that adapts labels based on prompt type
- ✓ Added task scenarios for new prompt types (System and Few-Shot)
- ✓ Fixed UI component warnings and errors
- ✓ Updated documentation to reflect Phase 2 completion

### Previous Milestones
- ✓ 2-LLM evaluation system implementation (reduced from 4-LLM for efficiency)
- ✓ Enhanced progress tracking with detailed LLM thinking summaries
- ✓ AI judge decision process visualization
- ✓ "Use This Version" button for prompt iteration
- ✓ Logo reset functionality
- ✓ Export capabilities (JSON/YAML formats)
- ✓ Responsive design optimization

## Phase 1 MVP Feature Completeness (December 2024)

### ✅ Core Features Implemented
1. **Prompt Input Field** - Multi-line textarea with character counting
2. **AI-Generated Evaluation** - 2-LLM system with judge selection
3. **Rating System** - Numerical scores (1-10) across multiple criteria
4. **Written Feedback** - Comprehensive analysis across 4 criteria:
   - Clarity (communication effectiveness)
   - Specificity (detail and precision)  
   - Task Alignment (goal relevance)
   - Completeness (thoroughness)
5. **Suggested Improvements** - AI-generated enhanced versions
6. **Example Prompt Mode** - Pre-seeded task scenarios with randomizer

### ✅ Enhanced Features Beyond MVP
- **Custom Task/Context Input** - User-defined practice scenarios
- **Progress Visualization** - Real-time evaluation tracking
- **Export Functionality** - JSON and YAML format options
- **Iterative Workflow** - "Use This Version" button for refinement
- **Provider Selection** - Choose evaluation LLM (OpenAI, Anthropic, DeepSeek)
- **Judge System** - AI selects best evaluation when using multiple providers

## Phase 2 Complete Feature Set (December 25, 2024)

### ✅ Style-Specific Evaluation System
- **6 Prompt Types**: Each with specialized evaluation criteria
- **Dynamic Criteria Display**: Labels adapt to prompt type context
- **AI Evaluation Enhancement**: All LLMs use type-specific evaluation logic

### ✅ Template Library System  
- **16 Professional Templates**: Covering all prompt types and difficulty levels
- **Interactive Integration**: One-click template application to prompt input
- **Categorized Organization**: Tabs for each prompt type with difficulty badges
- **Copy/Use Functionality**: Easy template adoption and customization

### ✅ Comprehensive Learning Resources
- **Learn Page**: Complete prompt writing guidance with examples
- **Navigation Integration**: Seamless routing between Practice and Learn
- **FAQ Section**: Common questions and detailed explanations
- **Best Practices**: Universal and type-specific recommendations

## Technical Decisions

### Storage Strategy
- In-memory storage chosen for MVP rapid development
- Structured with IStorage interface for future database migration
- Pre-seeded with diverse task scenarios across prompt types

### AI Provider Integration
- Reduced from 4 to 2 active LLMs for cost efficiency and speed
- Maintained provider infrastructure for easy re-activation
- Judge system uses OpenAI by default for consistency

### UI/UX Approach
- Mobile-first responsive design
- Clear visual hierarchy with color-coded sections
- Progressive disclosure of evaluation details
- Streamlined workflow from input to results

## Deployment Configuration
- Optimized for Replit Deploy (primary recommendation)
- Vercel deployment support maintained
- Environment variables: OPENAI_API_KEY, ANTHROPIC_API_KEY, DEEPSEEK_API_KEY
- Single build command: `npm run build`

## Next Phase Considerations
- Database integration for persistent user data
- User authentication and progress tracking
- Advanced prompt templates and categories
- RAG integration for contextual examples
- Analytics and learning insights dashboard