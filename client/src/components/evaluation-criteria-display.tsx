import { Progress } from "@/components/ui/progress";

interface EvaluationCriteriaDisplayProps {
  evaluationData: any;
  promptType: string;
}

// Style-specific criteria labels matching the backend
const CRITERIA_LABELS = {
  "creative-writing": ["Creativity", "Narrative Structure", "Character Development", "Emotional Resonance"],
  "instructional": ["Clarity", "Step-by-Step Flow", "Actionability", "Completeness"],
  "system": ["Role Definition", "Constraint Specification", "Output Format", "Behavioral Guidance"],
  "few-shot": ["Example Quality", "Pattern Clarity", "Consistency", "Learning Effectiveness"],
  "summarization": ["Compression Efficiency", "Key Point Extraction", "Audience Targeting", "Structure Clarity"],
  "analysis": ["Analytical Depth", "Framework Application", "Evidence Integration", "Insight Generation"]
};

const DEFAULT_LABELS = ["Clarity", "Specificity", "Task Alignment", "Completeness"];

export default function EvaluationCriteriaDisplay({ evaluationData, promptType }: EvaluationCriteriaDisplayProps) {
  const criteriaLabels = CRITERIA_LABELS[promptType] || DEFAULT_LABELS;
  
  const getScoreColor = (score: number) => {
    if (score >= 8) return "text-lab-success";
    if (score >= 6) return "text-lab-warning";
    return "text-lab-danger";
  };

  const getProgressColor = (score: number) => {
    if (score >= 8) return "bg-lab-success";
    if (score >= 6) return "bg-lab-warning";
    return "bg-lab-danger";
  };

  const scores = [
    evaluationData.clarityScore,
    evaluationData.specificityScore,
    evaluationData.taskAlignmentScore,
    evaluationData.completenessScore
  ];

  const feedbackKeys = ["clarity", "specificity", "taskAlignment", "completeness"];

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {criteriaLabels.map((label, index) => (
        <div key={index} className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">{label}</span>
            <span className={`text-sm font-bold ${getScoreColor(scores[index])}`}>
              {scores[index]}/10
            </span>
          </div>
          <Progress 
            value={scores[index] * 10} 
            className={`h-2 ${getProgressColor(scores[index])}`}
          />
          <p className="text-xs text-gray-600 leading-relaxed">
            {evaluationData.feedback?.[feedbackKeys[index]]}
          </p>
        </div>
      ))}
    </div>
  );
}