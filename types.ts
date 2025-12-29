export enum Probability {
  BAJA = 'B',
  MEDIA = 'M',
  ALTA = 'A',
}

export enum Severity {
  LEVE = 'L',
  MODERADO = 'M',
  GRAVE = 'G',
}

export enum RiskLevel {
  POCO_SIGNIFICATIVO = 'PS',
  MODERADO = 'M',
  SIGNIFICATIVO = 'S',
  INTOLERABLE = 'I',
}

export interface IPERRow {
  id: string;
  activity: string;
  isRoutine: boolean; // True for TR, False for TNR
  hazard: string;
  riskDescription: string;
  
  // Initial Evaluation
  probInitial: Probability;
  sevInitial: Severity;
  valInitial: number;
  calInitial: RiskLevel;

  // Controls
  mitigationControls: string; // Acciones de Mitigación / Control Operativo
  documentControls: string; // Acciones de Control / Documentos y Normativa Legal
  
  // Hierarchy Checkboxes
  controlElimination: boolean; // CE
  controlSubstitution: boolean; // CS
  controlEngineering: boolean; // CI
  controlAdmin: boolean; // CA
  controlPPE: boolean; // EPP

  // Final Evaluation
  probFinal: Probability;
  sevFinal: Severity;
  valFinal: number;
  calFinal: RiskLevel;
}

export interface SystemState {
  knowledgeBase: string; // User pasted documents
  apiKey: string | null;
  rows: IPERRow[];
  isGenerating: boolean;
}