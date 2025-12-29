import { Probability, Severity } from "./types";

export const PROBABILITY_OPTIONS = Object.values(Probability);
export const SEVERITY_OPTIONS = Object.values(Severity);

export const TABLE_HEADERS = [
  "Descripción de la Actividad",
  "TR",
  "TNR",
  "Identificación de Peligros",
  "Descripción de Riesgos",
  "P (Inicial)",
  "G (Inicial)",
  "VAL",
  "CAL",
  "Acciones de Mitigación / Control Operativo",
  "Acciones de Control / Documentos y Normativa Legal",
  "CE",
  "CS",
  "CI",
  "CA",
  "EPP",
  "P (Final)",
  "G (Final)",
  "VAL",
  "CAL"
];

export const APPROVERS_LIST = [
  "Lucas Marchisone (Gerente Operaciones Herramientas)",
  "Luciano Dumrauf (Gte Operaciones WS)",
  "Carlos Rios (Gte Mantenimiento WS)",
  "Jorge Castro (Gte. QHSE)",
  "Guillermo Grispino (Gte Gral)",
  "Cristian Fernandez (Sup Campo WS)",
  "Hector Muñoz (Sup Campo WS)",
  "Luis Aguilera (Sup Campo WS)",
  "Walter Fernandez (Sup MASE)",
  "Damian Rojas (Sup MASE)",
  "Federico Garcia (Jefe de Base)",
  "Nicanor Peña (Jefe de Base)",
  "Diego Vidal (Sup Mtto WS)",
  "Daniel Mardones (Sup Mtto WS)",
  "Raul Alfonzo (Sup Mtto WS)",
  "Daniel Sobarzo (Sup Mtto WS)",
  "Maximiliano Toselli (Sup Mtto WS)",
  "Matias Ramirez (Sup Mtto WS)",
  "Gabriel Daros (Coordinador JACWELL)",
  "Lucio Agüero (Coordinador JACWELL)",
  "Estefania Dates (Lider Oper JACWELL)",
  "Eber Sorroche (Supervisor JACWELL)",
  "Martin Almaza (Supervisor JACWELL)",
  "Luis Garcia (Supervisor JACWELL)",
  "Luis Parra (Supervisor UTL)",
  "Pablo Cerioli (Coordinador UTL)",
  "Emanuel Brigante (Coordinador QHSE)",
  "Diego Roldan (Coordinador QHSE)",
  "Pablo Jara (Sup QHSE)",
  "Rafael Mori (Sup QHSE)",
  "Sebastian Flores (Sup QHSE)",
  "Marlene Alvarado (Sup QHSE)"
];

export const AREA_OPTIONS = [
  "Herramientas",
  "Operaciones WS",
  "Mantenimiento WS",
  "QHSE",
  "Well Service",
  "MASE",
  "Base Cipolletti",
  "Base Comodoro",
  "Base Pico Truncado",
  "Mtto WS",
  "JACWELL",
  "UTL"
];

export const SECTOR_OPTIONS = [
  "WELL SERVICE",
  "MANTENIMIENTO WS",
  "HERRAMIENTAS",
  "FABRICA",
  "ENSAMBLE",
  "ALMACEN",
  "OPERACIONES JACWELL",
  "UTL",
  "MASE",
  "PULLING",
  "WORKOVER"
];

export const MONTH_OPTIONS = [
  "ENE", "FEB", "MAR", "ABR", "MAY", "JUN", 
  "JUL", "AGO", "SEP", "OCT", "NOV", "DIC"
];

export const YEAR_OPTIONS = Array.from({ length: 11 }, (_, i) => (2025 + i).toString());