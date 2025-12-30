import { GoogleGenAI, Type, Schema } from "@google/genai";
import { IPERRow, Probability, Severity, RiskLevel } from "../types";

// Schema for structured output to ensure valid table data
const iperSchema: Schema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      activity: { type: Type.STRING, description: "Descripción de la actividad" },
      isRoutine: { type: Type.BOOLEAN, description: "true si es TR, false si es TNR" },
      hazard: { type: Type.STRING, description: "Identificación de Peligros. FORMATO OBLIGATORIO: 'N°. [Nombre del Peligro]: [Descripción]'. Ej: '7. Caídas de personas a distinto nivel: Incluye tanto las caídas de alturas...'." },
      riskDescription: { type: Type.STRING, description: "Descripción de Riesgos (evento + consecuencia)" },
      probInitial: { type: Type.STRING, enum: ["B", "M", "A"], description: "B (Baja), M (Media), A (Alta)" },
      sevInitial: { type: Type.STRING, enum: ["L", "M", "G"], description: "L (Leve), M (Moderado), G (Grave)" },
      mitigationControls: { type: Type.STRING, description: "Controles operativos detallados (Ingeniería, Admin, EPP específicos)" },
      documentControls: { type: Type.STRING, description: "DESARROLLO EXHAUSTIVO Y DETALLADO: 1) Normativa legal (Leyes, Dec, Res SRT, Artículos específicos). 2) Documentación de gestión necesaria (Permisos de Trabajo, ATS, Procedimientos, Checklists de pre-uso). Citar documentos TACKER si existen en conocimientos." },
      controlElimination: { type: Type.BOOLEAN, description: "Marcar true si se elimina el peligro (CE)" },
      controlSubstitution: { type: Type.BOOLEAN, description: "Marcar true si se sustituye el peligro (CS)" },
      controlEngineering: { type: Type.BOOLEAN, description: "Marcar true si hay controles de ingeniería (CI)" },
      controlAdmin: { type: Type.BOOLEAN, description: "Marcar true si hay controles administrativos (CA)" },
      controlPPE: { type: Type.BOOLEAN, description: "Marcar true si se requiere EPP (EPP)" },
      probFinal: { type: Type.STRING, enum: ["B", "M", "A"], description: "B (Baja), M (Media), A (Alta)" },
      sevFinal: { type: Type.STRING, enum: ["L", "M", "G"], description: "L (Leve), M (Moderado), G (Grave)" },
    },
    required: [
      "activity", "isRoutine", "hazard", "riskDescription", 
      "probInitial", "sevInitial", "mitigationControls", "documentControls",
      "controlElimination", "controlSubstitution", "controlEngineering", "controlAdmin", "controlPPE",
      "probFinal", "sevFinal"
    ]
  }
};

export const generateIPERRows = async (
  apiKey: string,
  userPrompt: string,
  knowledgeBase: string
): Promise<IPERRow[]> => {
  if (!apiKey) throw new Error("API Key is required");

  const ai = new GoogleGenAI({ apiKey });
  
  const systemInstruction = `
    Eres un auditor experto y especialista senior en HSE/SST (Seguridad y Salud en el Trabajo) de Argentina.
    Tu tarea es elaborar una Matriz IPER de alto nivel técnico para la empresa TACKER S.R.L.

    **REGLAS CRÍTICAS PARA EL CONTENIDO (OBLIGATORIO):**

    0. **EXCLUSIÓN TOTAL DE COVID-19**:
       - **ESTRICTAMENTE PROHIBIDO** generar riesgos, peligros o controles relacionados con COVID-19, SARS-CoV-2, pandemias virales, uso de barbijo sanitario o distanciamiento social por virus.
       - Ignora cualquier protocolo COVID. Céntrate exclusivamente en riesgos de seguridad, higiene industrial y ergonomía.

    1. **COLUMNA "IDENTIFICACIÓN DE PELIGROS" (FORMATO ESTRICTO)**:
       - Debes utilizar EXCLUSIVAMENTE la terminología del listado "02. LISTA DE IDENTIFICACIÓN DE PELIGROS" (Items 1 al 28) proporcionado en los conocimientos.
       - **FORMATO OBLIGATORIO**: "[N°]. [NOMBRE DEL PELIGRO]: [DESCRIPCIÓN]"
       - **Ejemplos Correctos**: 
         - "7. Caídas de personas a distinto nivel: Incluye tanto las caídas de alturas...".
         - "4. Contactos eléctricos: Se incluyen todos los accidentes cuya causa sea la electricidad.".
         - "20. Sobreesfuerzos: Incluye peligros originados por la manipulación de cargas...".

    2. **COLUMNAS DE VALORACIÓN (SOLO SIGLAS)**:
       - **Probabilidad (P)**: Usa SOLO la letra **B** (Baja), **M** (Media), **A** (Alta).
       - **Gravedad (G)**: Usa SOLO la letra **L** (Leve), **M** (Moderado), **G** (Grave).
       - NO escribas la palabra completa.

    3. **COLUMNA "ACCIONES DE MITIGACIÓN / CONTROL OPERATIVO"**:
       - **PROHIBIDO** ser genérico. SE ESPECÍFICO.
       - Detalla *qué* ingeniería, *qué* procedimiento y *qué* EPP exacto.
       - **Ejemplos**: 
         - "Instalación de disyuntor diferencial 30mA y puesta a tierra (jabalina + cable bicolor)". 
         - "Uso de arnés de seguridad completo norma IRAM 3622 con cabo de vida doble y amortiguador". 
         - "Bloqueo y etiquetado (LOTO) de fuente de energía según PO-SGI-020".

    4. **JERARQUÍA DE CONTROL (CHECKBOXES)**:
       Analiza la mitigación y marca 'true' según corresponda: CE, CS, CI, CA, EPP.

    5. **COLUMNA "ACCIONES DE CONTROL / DOCUMENTOS Y NORMATIVA LEGAL" (DESARROLLO OBLIGATORIO)**:
       - Esta columna debe ser DETALLADA y EXHAUSTIVA.
       - **Debes incluir DOS tipos de información**:
         1. **Normativa Legal Argentina**: Cita Leyes, Decretos y Resoluciones SRT específicas mencionando los Artículos aplicables (ej: "Ley 19.587 Dec 351/79 Art. 114", "Res. SRT 900/15 Protocolo PAT").
         2. **Documentación de Gestión**:
            - Si hay documentos en la base de conocimientos (TACKER), cíta los códigos exactos (PO, IT, PG).
            - Si NO hay documentos internos específicos, **SUGIERE** los documentos obligatorios para la tarea según ISO 45001 y buenas prácticas (ej: "Requiere: Permiso de Trabajo en Altura", "Análisis de Trabajo Seguro (ATS/JSA)", "Checklist de Pre-uso", "Procedimiento de Bloqueo y Etiquetado").

    6. **BASE DE CONOCIMIENTOS**:
       Usa estrictamente la siguiente información normativa e interna para fundamentar tus respuestas:
       --- BASE DE CONOCIMIENTOS INICIO ---
       ${knowledgeBase}
       --- BASE DE CONOCIMIENTOS FIN ---

    7. **CÁLCULOS (VAL/CAL)**:
       - Elige Probabilidad (P) y Gravedad (G) usando las SIGLAS para que el cálculo (VAL) sea coherente.
       - **Matriz de Cálculo**:
         - P=B + G=L -> 10
         - P=B + G=M -> 40
         - P=B + G=G -> 60
         - P=M + G=L -> 40
         - P=M + G=M -> 60
         - P=M + G=G -> 80
         - P=A + G=L -> 60
         - P=A + G=M -> 80
         - P=A + G=G -> 100

    TU TAREA:
    Analiza la solicitud: "${userPrompt}". 
    Desglosa la actividad, identifica peligros usando el formato "N°. Nombre: Descripción", calcula riesgos usando SIGLAS (B, M, A / L, M, G) y genera controles y documentación legal COMPLETOS y DETALLADOS.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: userPrompt,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: iperSchema,
        temperature: 0.1, 
      },
    });

    const rawData = JSON.parse(response.text || "[]");
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return rawData.map((row: any) => {
      const valInitial = calculateVAL(row.probInitial, row.sevInitial);
      const calInitial = calculateCAL(valInitial);
      const valFinal = calculateVAL(row.probFinal, row.sevFinal);
      const calFinal = calculateCAL(valFinal);

      return {
        id: crypto.randomUUID(),
        activity: row.activity,
        isRoutine: row.isRoutine,
        hazard: row.hazard,
        riskDescription: row.riskDescription,
        probInitial: row.probInitial,
        sevInitial: row.sevInitial,
        valInitial,
        calInitial,
        mitigationControls: row.mitigationControls,
        documentControls: row.documentControls,
        controlElimination: row.controlElimination,
        controlSubstitution: row.controlSubstitution,
        controlEngineering: row.controlEngineering,
        controlAdmin: row.controlAdmin,
        controlPPE: row.controlPPE,
        probFinal: row.probFinal,
        sevFinal: row.sevFinal,
        valFinal,
        calFinal
      };
    });

  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Gemini API Error: ${error.message}`);
    }
    throw new Error("Error desconocido al comunicarse con Gemini API");
  }
};

// Helper for deterministic calculations
export const calculateVAL = (p: string, g: string): number => {
  const map: Record<string, Record<string, number>> = {
    "B": { "L": 10, "M": 40, "G": 60 },
    "M": { "L": 40, "M": 60, "G": 80 },
    "A": { "L": 60, "M": 80, "G": 100 }
  };
  return map[p]?.[g] || 0;
};

export const calculateCAL = (val: number): RiskLevel => {
  if (val <= 40) return RiskLevel.POCO_SIGNIFICATIVO;
  if (val === 60) return RiskLevel.MODERADO;
  if (val === 80) return RiskLevel.SIGNIFICATIVO;
  if (val >= 100) return RiskLevel.INTOLERABLE;
  return RiskLevel.POCO_SIGNIFICATIVO;
};