export type VariableType = "Quantitative" | "Categorical";
export type VariableRole = "Explanatory" | "Response";

export interface MathTest {
  question: string;
  items: string[];
  explanation: string;
  mathExplanation: string;
  averageAllowed: boolean;
}

export interface VisualAnalogy {
  title: string;
  analogyText: string;
  type: "ruler" | "buckets" | "labels" | "scale";
  concept: string;
}

export interface StudyVariable {
  name: string;
  description: string;
  exampleData: string[];
  type: VariableType;
  typeReasoning: string;
  mathTest: MathTest;
  visualAnalogy: VisualAnalogy;
}

export interface Scenario {
  id: string;
  title: string;
  category: "gym" | "school" | "coffee" | "tech" | "custom";
  description: string;
  researchQuestion: string;
  variables: StudyVariable[]; // Exactly 2
  explanatoryIndex: number; // Index of explanatory variable in variables array
  responseIndex: number;    // Index of response variable in variables array
  driverExplanation: string;
  outcomeExplanation: string;
}

export interface UserScenarioState {
  scenarioId: string;
  currentStep: "intro" | "classify_v1" | "classify_v2" | "explanatory_vs_response" | "completed";
  classifiedV1: VariableType | null;
  classifiedV2: VariableType | null;
  selectedExplanatoryIndex: number | null; // 0 or 1
  selectedResponseIndex: number | null;    // 0 or 1
  mathTestV1Triggered: boolean;
  mathTestV2Triggered: boolean;
  analogyV1Triggered: boolean;
  analogyV2Triggered: boolean;
  v1ErrorCount: number;
  v2ErrorCount: number;
  roleErrorCount: number;
}
