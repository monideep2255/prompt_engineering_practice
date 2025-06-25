import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  BookOpen, 
  Lightbulb, 
  Target, 
  Wand2,
  Settings,
  GraduationCap,
  BarChart3,
  FileText,
  CheckCircle,
  AlertTriangle,
  ArrowRight
} from "lucide-react";

export default function Learn() {
  const promptTypes = [
    {
      type: "Creative Writing",
      icon: <Wand2 className="h-5 w-5" />,
      color: "bg-purple-100 text-purple-800",
      criteria: ["Creativity", "Narrative Structure", "Character Development", "Emotional Resonance"],
      description: "Prompts for generating stories, dialogue, poetry, and creative content",
      goodExample: `Write a short story about two strangers who meet during a power outage in an elevator. The story should be 800-1000 words, told from alternating perspectives, and explore themes of human connection and vulnerability. Include realistic dialogue and end with a meaningful resolution that feels earned rather than forced.`,
      badExample: `Write a story about people in an elevator.`,
      tips: [
        "Set clear parameters (length, perspective, themes)",
        "Specify the emotional tone you want",
        "Include character details and motivations",
        "Define the story structure or format",
        "Mention specific literary techniques if needed"
      ]
    },
    {
      type: "Instructional",
      icon: <GraduationCap className="h-5 w-5" />,
      color: "bg-blue-100 text-blue-800",
      criteria: ["Clarity", "Step-by-Step Flow", "Actionability", "Completeness"],
      description: "Prompts for creating tutorials, guides, and educational content",
      goodExample: `Create a step-by-step guide for setting up a home Wi-Fi network for non-technical users. Include equipment needed, safety precautions, troubleshooting common issues, and how to secure the network. Use simple language, number each step clearly, and include what success looks like at each stage.`,
      badExample: `Explain how to set up Wi-Fi.`,
      tips: [
        "Define your target audience's skill level",
        "Break complex tasks into clear sequential steps",
        "Include prerequisites and required materials",
        "Add troubleshooting for common problems",
        "Specify the desired outcome or success criteria"
      ]
    },
    {
      type: "System Prompts",
      icon: <Settings className="h-5 w-5" />,
      color: "bg-green-100 text-green-800",
      criteria: ["Role Definition", "Constraint Specification", "Output Format", "Behavioral Guidance"],
      description: "Prompts that define AI assistant behavior and capabilities",
      goodExample: `You are a professional email writing assistant for customer service teams. Your role is to help draft empathetic, solution-focused responses to customer complaints. Always maintain a professional but warm tone, acknowledge the customer's frustration, provide specific next steps, and include contact information for follow-up. Format responses with clear paragraphs, avoid jargon, and keep messages under 200 words unless complex issues require more detail.`,
      badExample: `Help me write customer service emails.`,
      tips: [
        "Clearly define the AI's role and expertise",
        "Set specific behavioral guidelines and tone",
        "Specify output format and length constraints",
        "Include what to avoid or limitations",
        "Define escalation procedures if applicable"
      ]
    },
    {
      type: "Few-Shot Learning",
      icon: <Target className="h-5 w-5" />,
      color: "bg-orange-100 text-orange-800",
      criteria: ["Example Quality", "Pattern Clarity", "Consistency", "Learning Effectiveness"],
      description: "Prompts that teach through examples and patterns",
      goodExample: `Learn to classify customer support tickets by urgency. Here are examples:

HIGH URGENCY: "Payment failed for premium subscription, can't access account" (affects paid service access)
MEDIUM URGENCY: "Feature request: add dark mode to mobile app" (enhancement, not blocking)
LOW URGENCY: "Question about privacy policy section 3.2" (informational, non-blocking)

Now classify these tickets using the same format and reasoning:`,
      badExample: `Here are some examples of support tickets. Classify new ones.`,
      tips: [
        "Provide 3-5 high-quality, diverse examples",
        "Show the pattern clearly in each example",
        "Include reasoning or explanation for each example",
        "Ensure examples cover edge cases",
        "Use consistent format across all examples"
      ]
    },
    {
      type: "Summarization",
      icon: <FileText className="h-5 w-5" />,
      color: "bg-yellow-100 text-yellow-800",
      criteria: ["Compression Efficiency", "Key Point Extraction", "Audience Targeting", "Structure Clarity"],
      description: "Prompts for condensing and organizing information",
      goodExample: `Summarize this quarterly business report for C-level executives who need to make strategic decisions. Create a 3-paragraph executive summary covering: 1) Key financial performance vs targets, 2) Major operational achievements and challenges, 3) Strategic recommendations for next quarter. Use bullet points for specific metrics and keep the total summary under 300 words. Focus on actionable insights rather than descriptive details.`,
      badExample: `Summarize this report.`,
      tips: [
        "Specify the target audience and their needs",
        "Define the desired length and format",
        "Indicate what type of information to prioritize",
        "Request specific structure or organization",
        "Clarify the purpose (decision-making, briefing, etc.)"
      ]
    },
    {
      type: "Analysis",
      icon: <BarChart3 className="h-5 w-5" />,
      color: "bg-red-100 text-red-800",
      criteria: ["Analytical Depth", "Framework Application", "Evidence Integration", "Insight Generation"],
      description: "Prompts for evaluation, research, and analytical thinking",
      goodExample: `Analyze the competitive landscape for a meal delivery startup entering the college market. Use Porter's Five Forces framework to evaluate: supplier power, buyer power, competitive rivalry, threat of substitutes, and barriers to entry. For each force, provide specific evidence from the market, rate the intensity (low/medium/high), and explain the strategic implications. Conclude with 3 actionable recommendations based on your analysis.`,
      badExample: `Analyze the meal delivery market.`,
      tips: [
        "Specify the analytical framework or methodology",
        "Define what evidence or data to consider",
        "Request specific depth of analysis",
        "Ask for actionable conclusions or recommendations",
        "Clarify the perspective or stakeholder viewpoint"
      ]
    }
  ];

  const generalTips = [
    {
      title: "Be Specific About Context",
      description: "Provide relevant background information, constraints, and requirements"
    },
    {
      title: "Define Your Audience",
      description: "Specify who the output is for and their level of expertise"
    },
    {
      title: "Set Clear Expectations",
      description: "Include desired length, format, tone, and success criteria"
    },
    {
      title: "Include Examples When Helpful",
      description: "Show what good output looks like, especially for complex tasks"
    },
    {
      title: "Iterate and Refine",
      description: "Use the 'Use This Version' feature to build on AI suggestions"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center space-x-3">
            <BookOpen className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Learn Prompt Engineering</h1>
              <p className="text-lg text-gray-600">Master the art of writing effective prompts for different AI tasks</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* General Tips Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center text-xl">
              <Lightbulb className="h-6 w-6 text-yellow-500 mr-2" />
              Universal Prompt Writing Tips
            </CardTitle>
            <CardDescription>
              These principles apply to all prompt types and will improve your results
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {generalTips.map((tip, index) => (
                <div key={index} className="flex items-start space-x-3 p-4 rounded-lg bg-gray-50">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-gray-900">{tip.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">{tip.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Prompt Types Section */}
        <div className="space-y-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Prompt Type Guidelines</h2>
            <p className="text-gray-600">Each prompt type has specific evaluation criteria and best practices</p>
          </div>

          {promptTypes.map((promptType, index) => (
            <Card key={index} className="border-l-4 border-l-blue-500">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${promptType.color}`}>
                      {promptType.icon}
                    </div>
                    <div>
                      <CardTitle className="text-xl">{promptType.type}</CardTitle>
                      <CardDescription className="mt-1">{promptType.description}</CardDescription>
                    </div>
                  </div>
                </div>
                
                {/* Evaluation Criteria */}
                <div className="flex flex-wrap gap-2 mt-4">
                  <span className="text-sm font-medium text-gray-700">Evaluated on:</span>
                  {promptType.criteria.map((criterion, idx) => (
                    <Badge key={idx} variant="secondary" className="text-xs">
                      {criterion}
                    </Badge>
                  ))}
                </div>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {/* Best Practices */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Best Practices
                  </h4>
                  <ul className="space-y-2">
                    {promptType.tips.map((tip, idx) => (
                      <li key={idx} className="flex items-start space-x-2">
                        <ArrowRight className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Separator />

                {/* Examples */}
                <div className="grid lg:grid-cols-2 gap-6">
                  {/* Good Example */}
                  <div>
                    <h4 className="font-semibold text-green-700 mb-3 flex items-center">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Good Example
                    </h4>
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <p className="text-sm text-gray-800 leading-relaxed">{promptType.goodExample}</p>
                    </div>
                  </div>

                  {/* Bad Example */}
                  <div>
                    <h4 className="font-semibold text-red-700 mb-3 flex items-center">
                      <AlertTriangle className="h-4 w-4 mr-2" />
                      Avoid This
                    </h4>
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <p className="text-sm text-gray-800 leading-relaxed">{promptType.badExample}</p>
                      <p className="text-xs text-red-600 mt-2 italic">
                        Too vague, lacks context, no clear success criteria
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* FAQ Section */}
        <Card className="mt-12">
          <CardHeader>
            <CardTitle className="text-xl">Frequently Asked Questions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Why do different prompt types have different evaluation criteria?</h4>
              <p className="text-sm text-gray-700">
                Each prompt type serves a different purpose and requires different skills. Creative writing prompts need imagination and narrative structure, while system prompts need clear role definition and constraints. Using specialized criteria helps you improve at the specific type of prompting you're practicing.
              </p>
            </div>
            
            <Separator />
            
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">How should I use the practice scenarios?</h4>
              <p className="text-sm text-gray-700">
                Practice scenarios give you realistic contexts to work with. You can use the provided scenarios or create custom ones. Try to write prompts that would actually solve the given problem, then use the evaluation feedback to improve your approach.
              </p>
            </div>
            
            <Separator />
            
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">What should I do if my prompt gets a low score?</h4>
              <p className="text-sm text-gray-700">
                Low scores are learning opportunities! Read the detailed feedback for each criterion, look at the suggested improvements, and use the "Use This Version" button to iterate. Focus on one aspect at a time - if clarity is low, work on being more specific before tackling other areas.
              </p>
            </div>
            
            <Separator />
            
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Can I practice with my own use cases?</h4>
              <p className="text-sm text-gray-700">
                Absolutely! Use the "Custom" mode in the practice scenarios to enter your own tasks and contexts. This is especially valuable for practicing prompts you'll actually use in your work or projects.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}