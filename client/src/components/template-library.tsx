import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Copy, 
  Wand2, 
  GraduationCap, 
  Settings, 
  Target, 
  FileText, 
  BarChart3,
  CheckCircle 
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Template {
  id: string;
  title: string;
  description: string;
  category: string;
  promptType: string;
  template: string;
  useCase: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
}

interface TemplateLibraryProps {
  onUseTemplate?: (template: string, promptType: string) => void;
}

export default function TemplateLibrary({ onUseTemplate }: TemplateLibraryProps) {
  const { toast } = useToast();

  const templates: Template[] = [
    // Creative Writing Templates
    {
      id: "story-structure",
      title: "Story Structure Template",
      description: "Framework for writing compelling narratives",
      category: "creative-writing",
      promptType: "creative-writing",
      difficulty: "Beginner",
      useCase: "Fiction writing, storytelling",
      template: `Write a [GENRE] story of [LENGTH] words about [MAIN CHARACTER] who [INITIAL SITUATION]. The story should be told from [PERSPECTIVE] point of view and explore themes of [THEME1] and [THEME2].

Structure requirements:
- Opening: Establish character and setting in [SETTING]
- Inciting incident: [CONFLICT/CHALLENGE]
- Rising action: Show character growth through [OBSTACLES]
- Climax: [DECISIVE MOMENT]
- Resolution: [HOW IT ENDS]

Style notes:
- Tone: [TONE]
- Include dialogue that reveals character
- Use [LITERARY TECHNIQUE] to enhance the narrative
- Target audience: [AUDIENCE]`
    },
    {
      id: "character-dialogue",
      title: "Character Dialogue Template",
      description: "Create authentic character conversations",
      category: "creative-writing",
      promptType: "creative-writing",
      difficulty: "Intermediate",
      useCase: "Screenwriting, novel writing",
      template: `Write a dialogue scene between [CHARACTER A] and [CHARACTER B] in [SETTING]. 

Character A background: [PERSONALITY, MOTIVATION, SPEAKING STYLE]
Character B background: [PERSONALITY, MOTIVATION, SPEAKING STYLE]

Scene context: [WHAT'S HAPPENING, EMOTIONAL STATE]
Conflict/tension: [WHAT THEY DISAGREE ABOUT]
Subtext: [WHAT THEY'RE REALLY TALKING ABOUT]

Requirements:
- Each character should have a distinct voice
- Show emotion through dialogue and action
- Include [SPECIFIC REVELATION OR PLOT POINT]
- Length: [NUMBER] exchanges
- End with [HOW THE SCENE CONCLUDES]`
    },

    // Instructional Templates
    {
      id: "step-by-step-guide",
      title: "Step-by-Step Guide Template",
      description: "Clear instructional content framework",
      category: "instructional",
      promptType: "instructional",
      difficulty: "Beginner",
      useCase: "Tutorials, how-to guides",
      template: `Create a comprehensive step-by-step guide for [TASK/PROCESS] targeted at [AUDIENCE SKILL LEVEL].

Prerequisites:
- Required knowledge: [KNOWLEDGE NEEDED]
- Tools/materials needed: [LIST ITEMS]
- Estimated time: [DURATION]

Structure:
1. Overview: Explain what will be accomplished and why
2. Preparation: [SETUP STEPS]
3. Main process: Break into [NUMBER] clear steps
4. Verification: How to check each step worked
5. Troubleshooting: [COMMON PROBLEMS AND SOLUTIONS]
6. Next steps: [WHAT TO DO AFTER COMPLETION]

Format requirements:
- Use numbered steps for actions
- Include warnings for potential issues
- Provide examples where helpful
- Keep language simple and direct`
    },
    {
      id: "troubleshooting-guide",
      title: "Troubleshooting Guide Template",
      description: "Systematic problem-solving framework",
      category: "instructional",
      promptType: "instructional",
      difficulty: "Advanced",
      useCase: "Technical support, user manuals",
      template: `Create a troubleshooting guide for [PROBLEM/SYSTEM] issues experienced by [USER TYPE].

Problem scope: [WHAT CAN GO WRONG]
Symptoms to address: [LIST COMMON SYMPTOMS]

Structure as a decision tree:
1. Initial diagnosis questions
2. Quick fixes (try these first)
3. Systematic diagnosis steps
4. Advanced solutions
5. When to escalate

For each solution:
- Expected outcome
- Time required
- Risk level
- When to stop and try next step

Include:
- Prevention tips
- Warning signs to watch for
- Contact information for additional help`
    },

    // System Prompts Templates
    {
      id: "ai-assistant-role",
      title: "AI Assistant Role Template",
      description: "Define AI behavior and capabilities",
      category: "system",
      promptType: "system",
      difficulty: "Intermediate",
      useCase: "Chatbots, AI assistants",
      template: `You are [ROLE/TITLE] specialized in [DOMAIN/EXPERTISE]. Your primary function is to [MAIN PURPOSE].

Core responsibilities:
- [RESPONSIBILITY 1]
- [RESPONSIBILITY 2]
- [RESPONSIBILITY 3]

Behavioral guidelines:
- Communication style: [TONE AND MANNER]
- Always [REQUIRED BEHAVIORS]
- Never [PROHIBITED BEHAVIORS]
- When uncertain: [UNCERTAINTY HANDLING]

Response format:
- Structure: [HOW TO ORGANIZE RESPONSES]
- Length: [RESPONSE LENGTH GUIDELINES]
- Include: [REQUIRED ELEMENTS]

Constraints:
- Knowledge cutoff: [DATE IF RELEVANT]
- Cannot: [LIMITATIONS]
- Must escalate when: [ESCALATION TRIGGERS]
- Privacy: [DATA HANDLING RULES]`
    },
    {
      id: "content-moderation",
      title: "Content Moderation Template",
      description: "AI content review and safety framework",
      category: "system",
      promptType: "system",
      difficulty: "Advanced",
      useCase: "Content moderation, safety systems",
      template: `You are a content moderation system for [PLATFORM TYPE]. Your role is to review [CONTENT TYPE] and ensure compliance with community guidelines.

Evaluation criteria:
- Safety: [SAFETY RULES]
- Appropriateness: [CONTENT STANDARDS]
- Legal compliance: [LEGAL REQUIREMENTS]
- Community guidelines: [PLATFORM RULES]

Classification levels:
- APPROVED: Content meets all guidelines
- FLAGGED: Requires human review because [CONDITIONS]
- REJECTED: Violates guidelines due to [VIOLATIONS]

Response format:
{
  "decision": "[APPROVED/FLAGGED/REJECTED]",
  "confidence": "[1-10]",
  "reasons": ["specific rule references"],
  "explanation": "brief justification",
  "appeal_eligible": true/false
}

Special considerations:
- Cultural sensitivity: [GUIDELINES]
- Context awareness: [WHEN CONTEXT MATTERS]
- Edge cases: [DIFFICULT SCENARIOS]`
    },

    // Few-Shot Learning Templates
    {
      id: "classification-examples",
      title: "Classification Examples Template",
      description: "Teach AI through labeled examples",
      category: "few-shot",
      promptType: "few-shot",
      difficulty: "Beginner",
      useCase: "Content classification, data labeling",
      template: `Learn to classify [ITEMS] into categories: [CATEGORY LIST].

Here are examples with explanations:

Example 1: "[SAMPLE INPUT 1]"
Category: [CATEGORY]
Reasoning: [WHY THIS CATEGORY]

Example 2: "[SAMPLE INPUT 2]"
Category: [CATEGORY]
Reasoning: [WHY THIS CATEGORY]

Example 3: "[SAMPLE INPUT 3]"
Category: [CATEGORY]
Reasoning: [WHY THIS CATEGORY]

[Continue with 2-3 more examples]

Classification rules:
- [KEY IDENTIFYING FEATURE 1]
- [KEY IDENTIFYING FEATURE 2]
- [EDGE CASE HANDLING]

Now classify these new items using the same format and reasoning:`
    },
    {
      id: "format-conversion",
      title: "Format Conversion Template",
      description: "Transform content between formats",
      category: "few-shot",
      promptType: "few-shot",
      difficulty: "Intermediate",
      useCase: "Data transformation, content reformatting",
      template: `Learn to convert [INPUT FORMAT] to [OUTPUT FORMAT]. Here are examples:

Input 1: [EXAMPLE INPUT 1]
Output 1: [EXAMPLE OUTPUT 1]
Transformation notes: [WHAT CHANGED AND WHY]

Input 2: [EXAMPLE INPUT 2]
Output 2: [EXAMPLE OUTPUT 2]
Transformation notes: [WHAT CHANGED AND WHY]

Input 3: [EXAMPLE INPUT 3]
Output 3: [EXAMPLE OUTPUT 3]
Transformation notes: [WHAT CHANGED AND WHY]

Conversion rules:
- Preserve: [WHAT TO KEEP UNCHANGED]
- Transform: [WHAT TO CHANGE]
- Add: [WHAT TO ADD]
- Remove: [WHAT TO REMOVE]
- Format: [STRUCTURAL REQUIREMENTS]

Now convert these inputs using the same pattern:`
    },

    // Summarization Templates
    {
      id: "executive-summary",
      title: "Executive Summary Template",
      description: "High-level business summaries",
      category: "summarization",
      promptType: "summarization",
      difficulty: "Intermediate",
      useCase: "Business reports, decision support",
      template: `Create an executive summary of [DOCUMENT TYPE] for [AUDIENCE] who need to [PURPOSE/DECISION].

Summary structure:
1. Key findings (2-3 main points)
2. Critical metrics and performance indicators
3. Strategic implications and recommendations
4. Next actions required

Focus areas:
- Financial impact: [RELEVANT METRICS]
- Timeline: [KEY DATES]
- Resources required: [WHAT'S NEEDED]
- Risk factors: [POTENTIAL ISSUES]

Format requirements:
- Length: [WORD/BULLET COUNT LIMIT]
- Include specific numbers and data points
- Use action-oriented language
- Highlight urgent items
- Provide clear recommendations with rationale`
    },
    {
      id: "technical-abstract",
      title: "Technical Abstract Template",
      description: "Summarize complex technical content",
      category: "summarization",
      promptType: "summarization",
      difficulty: "Advanced",
      useCase: "Research papers, technical documentation",
      template: `Summarize this [TECHNICAL DOCUMENT TYPE] for [TARGET AUDIENCE] with [TECHNICAL BACKGROUND LEVEL].

Abstract sections:
- Purpose/Problem: [WHAT ISSUE IS ADDRESSED]
- Methodology: [HOW IT WAS APPROACHED]
- Key findings: [MAIN RESULTS]
- Implications: [WHAT IT MEANS]
- Applications: [HOW TO USE THIS]

Technical level: Balance accessibility with accuracy
- Explain [COMPLEX TERMS] in simpler language
- Preserve important technical details
- Include relevant metrics and measurements
- Note limitations and caveats

Length: [WORD COUNT] words
Include: Key terminology definitions
Avoid: Unnecessary jargon, excessive detail`
    },

    // Analysis Templates
    {
      id: "competitive-analysis",
      title: "Competitive Analysis Template",
      description: "Systematic competitor evaluation",
      category: "analysis",
      promptType: "analysis",
      difficulty: "Intermediate",
      useCase: "Market research, strategic planning",
      template: `Analyze the competitive landscape for [COMPANY/PRODUCT] in [MARKET/INDUSTRY].

Analysis framework:
1. Market overview and size
2. Key competitors identification
3. Competitive positioning analysis
4. Strengths and weaknesses assessment
5. Market share and performance metrics
6. Strategic implications and recommendations

For each major competitor, evaluate:
- Market position: [METRICS TO ASSESS]
- Product/service offerings: [COMPARISON POINTS]
- Pricing strategy: [PRICING ANALYSIS]
- Marketing approach: [MARKETING EVALUATION]
- Competitive advantages: [STRENGTH AREAS]
- Vulnerabilities: [WEAKNESS AREAS]

Deliverable format:
- Executive summary
- Competitor profiles
- SWOT analysis
- Strategic recommendations
- Action items with priorities`
    },
    {
      id: "root-cause-analysis",
      title: "Root Cause Analysis Template",
      description: "Systematic problem investigation",
      category: "analysis",
      promptType: "analysis",
      difficulty: "Advanced",
      useCase: "Problem solving, process improvement",
      template: `Conduct a root cause analysis for [PROBLEM/INCIDENT] using the 5 Whys methodology.

Problem statement: [CLEAR DESCRIPTION OF ISSUE]
Impact assessment: [WHO/WHAT IS AFFECTED]
Timeline: [WHEN IT OCCURRED/WAS DISCOVERED]

Analysis process:
1. Problem: [STATE THE PROBLEM]
   Why 1: [IMMEDIATE CAUSE]
   Why 2: [UNDERLYING CAUSE]
   Why 3: [DEEPER CAUSE]
   Why 4: [SYSTEM CAUSE]
   Why 5: [ROOT CAUSE]

2. Contributing factors:
   - Process factors: [PROCESS ISSUES]
   - People factors: [HUMAN FACTORS]
   - Technology factors: [SYSTEM ISSUES]
   - Environmental factors: [EXTERNAL INFLUENCES]

3. Solutions and prevention:
   - Immediate fixes: [SHORT-TERM ACTIONS]
   - Systemic changes: [LONG-TERM SOLUTIONS]
   - Prevention measures: [FUTURE SAFEGUARDS]
   - Success metrics: [HOW TO MEASURE IMPROVEMENT]`
    }
  ];

  const promptTypes = [
    { id: "creative-writing", label: "Creative", shortLabel: "Creative", icon: <Wand2 className="h-4 w-4" /> },
    { id: "instructional", label: "Instructional", shortLabel: "Instruct", icon: <GraduationCap className="h-4 w-4" /> },
    { id: "system", label: "System", shortLabel: "System", icon: <Settings className="h-4 w-4" /> },
    { id: "few-shot", label: "Few-Shot", shortLabel: "Few-Shot", icon: <Target className="h-4 w-4" /> },
    { id: "summarization", label: "Summary", shortLabel: "Summary", icon: <FileText className="h-4 w-4" /> },
    { id: "analysis", label: "Analysis", shortLabel: "Analysis", icon: <BarChart3 className="h-4 w-4" /> }
  ];

  const handleCopyTemplate = (template: string) => {
    navigator.clipboard.writeText(template);
    toast({
      title: "Template copied!",
      description: "Paste it into the prompt input and customize the placeholders.",
    });
  };

  const handleUseTemplate = (template: string, promptType: string) => {
    if (onUseTemplate) {
      onUseTemplate(template, promptType);
      toast({
        title: "Template applied!",
        description: "Template loaded into prompt input. Customize the placeholders to fit your needs.",
      });
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner": return "bg-green-100 text-green-800";
      case "Intermediate": return "bg-yellow-100 text-yellow-800";
      case "Advanced": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center text-xl">
          <FileText className="h-6 w-6 text-blue-600 mr-2" />
          Template Library
        </CardTitle>
        <CardDescription>
          Pre-built prompt templates to get you started quickly
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="creative-writing" className="w-full">
          <TabsList className="grid w-full grid-cols-6 h-auto p-1">
            {promptTypes.map((type) => (
              <TabsTrigger 
                key={type.id} 
                value={type.id} 
                className="text-[10px] sm:text-xs px-0.5 sm:px-2 py-2 h-auto min-h-[2rem] flex items-center justify-center"
              >
                <span className="leading-tight text-center break-words max-w-full">
                  <span className="hidden sm:inline">{type.label}</span>
                  <span className="sm:hidden">{type.shortLabel}</span>
                </span>
              </TabsTrigger>
            ))}
          </TabsList>
          
          {promptTypes.map((type) => (
            <TabsContent key={type.id} value={type.id} className="space-y-4">
              {templates
                .filter(template => template.category === type.id)
                .map((template) => (
                  <Card key={template.id} className="border-l-4 border-l-blue-500">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-lg">{template.title}</CardTitle>
                          <CardDescription className="mt-1">{template.description}</CardDescription>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={getDifficultyColor(template.difficulty)}>
                            {template.difficulty}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <span className="font-medium">Use case:</span>
                        <span className="ml-1">{template.useCase}</span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="bg-gray-50 rounded-lg p-4 mb-4">
                        <pre className="text-sm text-gray-800 whitespace-pre-wrap font-mono">
                          {template.template}
                        </pre>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCopyTemplate(template.template)}
                          className="flex items-center space-x-1"
                        >
                          <Copy className="h-4 w-4" />
                          <span>Copy</span>
                        </Button>
                        {onUseTemplate && (
                          <Button
                            size="sm"
                            onClick={() => handleUseTemplate(template.template, template.promptType)}
                            className="flex items-center space-x-1"
                          >
                            <CheckCircle className="h-4 w-4" />
                            <span>Use Template</span>
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}