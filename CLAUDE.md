# CLAUDE.md - IPER-Genius Agent Documentation

## Project Overview

**IPER-Genius Agent** is an AI-powered web application designed to automatically generate IPER matrices (Identificación de Peligros y Evaluación de Riesgos / Hazard Identification and Risk Assessment) for workplace safety and health (HSE/SST) compliance in Argentina.

### Purpose
- Automate the creation of comprehensive risk assessment matrices
- Ensure compliance with Argentine labor safety regulations (Ley 19.587, Decreto 351/79, SRT Resolutions)
- Follow ISO 45001 occupational health and safety management system standards
- Generate professional Excel and PDF exports with metadata and approvals

### Target Users
HSE/SST professionals at TACKER S.R.L. (a well service company) who need to create detailed risk matrices for various work activities in the oil and gas industry.

---

## Technology Stack

### Frontend Framework
- **React 19.2.3** with TypeScript
- **Vite 6.2.0** as build tool and dev server
- Modern ES2022 features

### AI Integration
- **Google Gemini API** (`@google/genai` v1.34.0)
- Model: `gemini-2.0-flash`
- Structured output using JSON schema validation
- Temperature: 0.1 (for deterministic results)

### Export Libraries
- **jsPDF 2.5.1** - PDF generation
- **jspdf-autotable 3.8.2** - Table formatting in PDFs
- HTML-to-Excel export using native browser APIs

### Development Tools
- TypeScript 5.8.2
- Node.js type definitions
- Vite React plugin

---

## Codebase Structure

```
/IPER-Genius
├── App.tsx                    # Main application component
├── index.tsx                  # React entry point
├── index.html                 # HTML template
├── types.ts                   # TypeScript type definitions
├── constants.ts               # Application constants and options
├── vite.config.ts            # Vite configuration
├── tsconfig.json             # TypeScript configuration
├── package.json              # Dependencies and scripts
├── metadata.json             # Application metadata
├── .gitignore                # Git ignore rules
│
├── components/
│   ├── MatrixTable.tsx       # Main data table component (18KB+)
│   └── KnowledgePanel.tsx    # Side panel for regulatory knowledge base
│
├── services/
│   └── geminiService.ts      # Google Gemini API integration
│
├── data/
│   └── regulatoryData.ts     # Argentine safety regulations (11KB+)
│
└── utils/
    └── export.ts             # Excel and PDF export utilities
```

---

## Core Architecture

### Data Flow

1. **User Input** → Activity description (e.g., "Soldadura en altura")
2. **Knowledge Base** → Regulatory documents loaded in KnowledgePanel
3. **AI Processing** → Gemini API analyzes activity + regulations
4. **Structured Output** → JSON array of IPERRow objects
5. **Table Display** → MatrixTable renders editable rows
6. **Export** → Generate Excel/PDF with metadata

### State Management

The application uses React hooks for state management:

```typescript
// Main state in App.tsx
const [rows, setRows] = useState<IPERRow[]>([]);           // Risk matrix data
const [knowledgeBase, setKnowledgeBase] = useState(string); // Regulatory text
const [isLoading, setIsLoading] = useState(false);          // API call status
const [approvers, setApprovers] = useState<string[]>([]);   // Multiple selection
const [area, setArea] = useState<string>(...);              // Single selection
// ... additional metadata fields
```

---

## Key Type Definitions

### IPERRow Interface (types.ts:20-49)

The core data structure representing a single risk assessment row:

```typescript
export interface IPERRow {
  id: string;                    // UUID
  activity: string;              // Activity description
  isRoutine: boolean;            // TR (Routine) vs TNR (Non-routine)
  hazard: string;                // MUST use format: "N°. Name: Description"
  riskDescription: string;       // Event + consequence

  // Initial Risk Evaluation
  probInitial: Probability;      // B, M, A
  sevInitial: Severity;          // L, M, G
  valInitial: number;            // Calculated: 10-100
  calInitial: RiskLevel;         // PS, M, S, I

  // Control Measures
  mitigationControls: string;    // Operational controls
  documentControls: string;      // Legal docs & procedures

  // Hierarchy of Controls (Checkboxes)
  controlElimination: boolean;   // CE - Eliminate hazard
  controlSubstitution: boolean;  // CS - Substitute
  controlEngineering: boolean;   // CI - Engineering controls
  controlAdmin: boolean;         // CA - Administrative controls
  controlPPE: boolean;           // EPP - Personal protective equipment

  // Final Risk Evaluation (after controls)
  probFinal: Probability;
  sevFinal: Severity;
  valFinal: number;
  calFinal: RiskLevel;
}
```

### Risk Calculation Logic

**VAL (Risk Value) Calculation Matrix:**
```
P=B + G=L → 10   |  P=M + G=L → 40   |  P=A + G=L → 60
P=B + G=M → 40   |  P=M + G=M → 60   |  P=A + G=M → 80
P=B + G=G → 60   |  P=M + G=G → 80   |  P=A + G=G → 100
```

**CAL (Risk Classification):**
- VAL ≤ 40 → PS (Poco Significativo / Low)
- VAL = 60 → M (Moderado / Moderate)
- VAL = 80 → S (Significativo / Significant)
- VAL ≥ 100 → I (Intolerable / Intolerable)

Implementation: `services/geminiService.ts:164-179`

---

## Key Files and Responsibilities

### App.tsx (App.tsx:1-193)
**Main application container**
- Manages global state (rows, knowledge base, metadata)
- Handles form submission to Gemini API
- Coordinates MatrixTable and KnowledgePanel components
- Provides export functionality (Excel/PDF)
- API key handling via environment variables

**Critical Points:**
- API key loaded from `VITE_API_KEY` environment variable (App.tsx:11)
- Never hardcode API keys (removed in commit 6617562)
- Error handling for missing API key and network failures
- Default metadata values (area, sector, month, year, revision)

### services/geminiService.ts (179 lines)
**AI Integration Layer**
- Gemini API client configuration
- Structured output schema definition (iperSchema)
- Comprehensive system instruction (App.tsx:44-108)
- Response parsing and VAL/CAL calculation
- Error handling with descriptive messages

**System Instruction Key Rules:**
1. **Hazard Format**: MUST use `"N°. [Name]: [Description]"` from regulatory list (Items 1-28)
2. **No COVID-19**: Strictly prohibited to generate COVID-related risks
3. **Abbreviations Only**: P (B/M/A), G (L/M/G) - never full words
4. **Detailed Controls**: Specific equipment, procedures, PPE - not generic
5. **Legal Documentation**: Cite exact Argentine laws, decrees, resolutions with article numbers
6. **Knowledge Base Integration**: Use provided regulatory text for citations

### utils/export.ts (374 lines)
**Export Functionality**
- `downloadExcel()`: HTML-based Excel export with embedded styles and images
- `downloadPDF()`: jsPDF with autoTable for professional layouts
- Risk color coding (Red=I, Orange=S, Yellow=M, Green=PS)
- Metadata headers with logo support (base64 images)
- Responsive column widths and text wrapping

**Excel Export Features:**
- Uses HTML table with Microsoft Office XML namespace
- Inline CSS styling with borders and colors
- Logo embedding (may be blocked by Excel security settings)
- Filename format: `Matriz_IPER_YYYY-MM-DD.xls`

**PDF Export Features:**
- Landscape A4 orientation
- Multi-page support with automatic page breaks
- Metadata table using autoTable for text wrapping
- Font size: 6pt for data, 8pt for metadata
- Filename format: `Matriz_IPER_YYYY-MM-DD.pdf`

### constants.ts (98 lines)
**Application Constants**
- `APPROVERS_LIST`: 61 personnel names for "Elabora" field
- `AREA_OPTIONS`: 12 organizational areas
- `SECTOR_OPTIONS`: 11 operational sectors
- `MONTH_OPTIONS`: Spanish month abbreviations (ENE-DIC)
- `YEAR_OPTIONS`: 2025-2035 (generated array)
- `TABLE_HEADERS`: 26 column headers for matrix

### data/regulatoryData.ts (11KB+)
**Regulatory Knowledge Base**
- Argentine labor safety laws (Ley 19.587, Decreto 351/79)
- SRT resolutions (900/2015, 85/2012, 886/2015, 84/2012)
- ISO standards (45001, 14001, 9001)
- **28-item standardized hazard list** with descriptions
- Embedded in system instruction for AI context

### components/MatrixTable.tsx (18KB+)
**Main Data Grid Component**
- Displays all IPER rows in an editable table
- Metadata form fields (approvers, area, sector, date, revision)
- Logo upload functionality (converts to base64)
- Process and Main Activity editable fields
- Row deletion functionality
- Responsive design with horizontal scroll

### components/KnowledgePanel.tsx (1.8KB)
**Side Panel for Regulatory Documents**
- Slide-in panel from right side
- Textarea for pasting additional regulatory documents
- Pre-loaded with `INITIAL_KNOWLEDGE` from regulatoryData.ts
- Character count display
- Green indicator dot when knowledge base is populated

---

## Development Workflows

### Local Development

1. **Prerequisites**: Node.js installed
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Set API Key**: Create `.env.local` file:
   ```
   VITE_API_KEY=your_gemini_api_key_here
   ```
4. **Run dev server**:
   ```bash
   npm run dev
   ```
   Starts Vite dev server on http://localhost:3000

5. **Build for production**:
   ```bash
   npm run build
   ```
   Outputs to `/dist` folder

6. **Preview production build**:
   ```bash
   npm run preview
   ```

### Environment Variables

**Critical**: Never commit `.env.local` or hardcode API keys
- `.gitignore` excludes `*.local` files
- `vite.config.ts` loads `GEMINI_API_KEY` from environment
- `App.tsx` reads from `import.meta.env.VITE_API_KEY`
- Security fix applied in commit 6617562

### Git Workflow

**Branch Naming Convention:**
- Feature branches: `claude/[description]-[session-id]`
- Current branch: `claude/claude-md-mkr46w30ekympry8-yMv6C`

**Commit Message Style:**
```
feat: Add process and main activity fields
fix: Remove hardcoded API key and improve error handling
```

**Recent Commit History:**
- 5f8237b: Merge PR #1 (bug patterns fix)
- 6617562: Security fix (API key removal)
- 4039a5e: Process and main activity fields
- 12c8724: PDF export and metadata
- 5d41781: Hazard identification format update

---

## Coding Conventions

### TypeScript Usage
- Strict mode enabled (ES2022 target)
- Use enums for fixed value sets (Probability, Severity, RiskLevel)
- Explicit interface definitions for all data structures
- Avoid `any` types - use proper typing or `eslint-disable` comments when necessary

### Component Patterns
- Functional components with hooks
- Props destructuring with TypeScript interfaces
- State management via `useState`
- Event handlers prefixed with `handle` (e.g., `handleSubmit`, `handleDeleteRow`)

### File Organization
- One component per file
- Co-located types when component-specific
- Shared types in `types.ts`
- Utility functions in `utils/` folder
- Service integrations in `services/` folder

### Naming Conventions
- Components: PascalCase (`MatrixTable.tsx`)
- Files: PascalCase for components, camelCase for utilities
- Constants: SCREAMING_SNAKE_CASE (`AREA_OPTIONS`)
- Functions: camelCase (`generateIPERRows`)
- Interfaces: PascalCase with descriptive names (`IPERRow`)

### CSS/Styling
- Tailwind CSS utility classes (inline in JSX)
- Color scheme:
  - Primary: Blue (#3B82F6 hover #2563EB)
  - Danger: Red (#DC2626)
  - Success: Green (#16A34A)
  - Warning: Yellow (#EAB308)
  - HSE Dark: Custom dark blue (`bg-hse-dark`)
- FontAwesome icons via `<i className="fas fa-..." />`

---

## AI Assistant Guidelines

### When Working on This Codebase

1. **Never Hardcode Sensitive Data**
   - API keys must be in environment variables only
   - No credentials in committed code
   - Check `.gitignore` includes `*.local`, `.env`

2. **Preserve Regulatory Compliance**
   - Do not modify hazard identification format (N°. Name: Description)
   - Maintain 28-item hazard list integrity
   - Keep risk calculation matrix exact (VAL/CAL formulas)
   - Preserve Spanish terminology for official compliance

3. **Respect System Instruction**
   - The Gemini system instruction in `geminiService.ts` is critical
   - Modifications require HSE domain expert review
   - COVID-19 exclusion rule is mandatory
   - Format rules ensure legal compliance

4. **Data Integrity**
   - All IPERRow fields are required (no optional fields in schema)
   - UUID generation for row IDs (`crypto.randomUUID()`)
   - Deterministic VAL/CAL calculations (no AI-based calculation)
   - Hierarchy of controls checkboxes must reflect mitigation text

5. **Testing Changes**
   - Test export functionality after modifications (Excel and PDF)
   - Verify metadata fields appear correctly in exports
   - Check Spanish characters render properly (UTF-8 encoding)
   - Validate API responses match schema

6. **User Experience**
   - Loading states during API calls (`isLoading`)
   - Clear error messages in Spanish
   - Confirmation dialogs for destructive actions
   - Disabled states prevent invalid submissions

### Common Tasks for AI Assistants

#### Adding a New Metadata Field

1. Add state in `App.tsx`
2. Add form input in `MatrixTable.tsx`
3. Pass prop through component tree
4. Include in `downloadExcel()` parameters
5. Include in `downloadPDF()` parameters
6. Add to export templates

#### Modifying Risk Calculation

⚠️ **Caution**: Risk calculations follow Argentine regulations
- Modify `calculateVAL()` in `geminiService.ts:164`
- Update matrix documentation in this file
- Update system instruction if logic changes
- Verify with HSE compliance requirements

#### Adding New Hazard Types

1. Update `data/regulatoryData.ts` hazard list
2. Document source (law/decree/resolution)
3. Maintain numbering sequence (current: 1-28)
4. Include in Spanish (official language)
5. Test AI recognition in generated outputs

#### Updating Gemini Model

Current: `gemini-2.0-flash`
- Change model name in `geminiService.ts:112`
- Test schema compatibility (structured output)
- Verify temperature setting still appropriate
- Check response parsing logic

#### Extending Export Formats

Current: Excel (HTML-based), PDF (jsPDF)
- Add new function in `utils/export.ts`
- Import function in `App.tsx`
- Add button in action bar
- Include all metadata fields
- Match existing color coding

---

## API Integration Details

### Gemini API Configuration

**Endpoint**: Google GenAI SDK
**Authentication**: API key via environment variable
**Model**: `gemini-2.0-flash`
**Mode**: Structured output with JSON schema

### Request Structure

```typescript
await ai.models.generateContent({
  model: "gemini-2.0-flash",
  contents: userPrompt,           // Activity description
  config: {
    systemInstruction: "...",     // Regulatory context + rules
    responseMimeType: "application/json",
    responseSchema: iperSchema,   // Type-safe output
    temperature: 0.1,             // Low for consistency
  },
});
```

### Response Schema (iperSchema)

Type: `Array<Object>` with required fields:
- activity (string)
- isRoutine (boolean)
- hazard (string) - MUST follow format
- riskDescription (string)
- probInitial (enum: B/M/A)
- sevInitial (enum: L/M/G)
- mitigationControls (string)
- documentControls (string)
- controlElimination/Substitution/Engineering/Admin/PPE (boolean)
- probFinal (enum: B/M/A)
- sevFinal (enum: L/M/G)

### Error Handling

```typescript
try {
  const response = await ai.models.generateContent({...});
  const rawData = JSON.parse(response.text || "[]");
  // ... process rows
} catch (error) {
  if (error instanceof Error) {
    throw new Error(`Gemini API Error: ${error.message}`);
  }
  throw new Error("Error desconocido al comunicarse con Gemini API");
}
```

**User-Facing Errors** (App.tsx:53-55):
- "Error: API Key no configurada. Por favor configura VITE_API_KEY..."
- "Error al generar la matriz: [message]. Verifica la conexión..."

---

## Export Features

### Excel Export (HTML-based)

**File Format**: `.xls` (HTML with Office XML namespace)
**Encoding**: UTF-8 with explicit meta charset
**Features**:
- Inline CSS styling with borders
- Merged cells for headers
- Risk color coding with `background-color`
- Logo embedding (base64 img tag)
- Print settings (A4, 60% scale, fit to width)

**Layout**:
1. Header row: Logo | Title | Document Code
2. Metadata row 1: Area | Sector | Date | Revision
3. Metadata row 2: Elabora (approvers, full width)
4. Metadata row 3: Process | Main Activity
5. Column headers (2 rows with merged cells)
6. Data rows (one per IPERRow)

**Color Scheme**:
- Headers: `#FFFACD` (light yellow)
- Area field: `#00B0F0` (blue)
- Labels: `#f0f0f0` (light gray)
- Risk levels: Red (I), Orange (S), Yellow (M), Green (PS)

### PDF Export (jsPDF)

**Page Format**: A4 Landscape
**Library**: jsPDF 2.5.1 with autoTable 3.8.2
**Font Sizes**: 6pt (data), 8pt (metadata), 10-16pt (headers)

**Features**:
- Multi-page support with automatic page breaks
- Logo rendering from base64 (JPEG/PNG detection)
- Text wrapping in long columns
- Consistent column widths
- Border and grid styling

**Layout**:
1. Header table (autoTable): Logo | Title | Code
2. Metadata table (autoTable): 3 rows with labels and values
3. Data table (autoTable): Headers (2 rows) + body rows

**Special Handling**:
- `didDrawCell` callback for logo insertion
- `didParseCell` callback for risk color coding
- Column width constraints to prevent overflow
- Fallback text rendering if logo fails

---

## Common Issues and Solutions

### API Key Not Working
- Check `.env.local` file exists in project root
- Verify key starts with `VITE_` prefix
- Restart dev server after changing environment variables
- Check Vite config loads `GEMINI_API_KEY` correctly

### Export Files Not Opening
- **Excel**: Security settings may block base64 images - open in LibreOffice or Google Sheets as alternative
- **PDF**: Check jsPDF version compatibility, ensure logo is valid base64
- **Encoding**: Verify UTF-8 encoding for Spanish characters

### Gemini API Errors
- **429 (Rate Limit)**: Wait and retry, implement exponential backoff
- **400 (Bad Request)**: Check schema matches model capabilities
- **Network Errors**: Display user-friendly message, check internet connection

### Build Errors
- **TypeScript Errors**: Run `npm run build` to see all type errors
- **Missing Dependencies**: Run `npm install` to ensure all packages installed
- **Path Aliases**: Check `tsconfig.json` and `vite.config.ts` align on `@/*` alias

---

## Future Enhancement Ideas

### Potential Features
1. **Database Persistence**: Save matrices to backend database
2. **User Authentication**: Multi-user support with permissions
3. **Template Library**: Pre-built matrices for common activities
4. **Version History**: Track changes to risk assessments
5. **Audit Trail**: Log who made which changes
6. **Bulk Import**: Upload CSV/Excel to generate multiple rows
7. **Advanced Search**: Filter by risk level, hazard type, area
8. **Dashboard**: Statistics and visualizations of risk distribution
9. **Offline Mode**: Service worker for offline functionality
10. **Mobile App**: React Native version for field work

### Code Quality Improvements
- Unit tests (Jest + React Testing Library)
- E2E tests (Playwright or Cypress)
- Linting (ESLint configuration)
- Code formatting (Prettier)
- Accessibility audits (WCAG compliance)
- Performance monitoring (React DevTools Profiler)

---

## Resources and References

### Official Documentation
- [Gemini API Documentation](https://ai.google.dev/docs)
- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [jsPDF Documentation](https://github.com/parallax/jsPDF)

### Argentine Labor Safety Regulations
- Ley 19.587 - Hygiene and Safety at Work
- Decreto 351/79 - Regulatory Decree
- Ley 24.557 - Work Risks Law (LRT)
- SRT Resolutions: 900/2015 (PAT), 85/2012 (Noise), 886/2015 (Ergonomics), 84/2012 (Lighting)

### International Standards
- ISO 45001:2018 - Occupational Health and Safety Management Systems
- ISO 14001:2015 - Environmental Management Systems
- ISO 9001:2008 - Quality Management Systems

---

## Project Metadata

**Application Name**: IPER-Genius Agent
**Organization**: TACKER S.R.L.
**Domain**: Well Service Operations (Oil & Gas Industry)
**Geography**: Argentina (Patagonia region - Cipolletti, Comodoro, Pico Truncado)
**Language**: Spanish (official documentation and UI)
**License**: Private/Proprietary

**Technical Contact**: Check repository contributors
**Last Updated**: 2026-01-23
**Version**: 0.0.0 (Pre-release)

---

## Quick Reference

### Start Development
```bash
npm install
echo "VITE_API_KEY=your_key" > .env.local
npm run dev
```

### Key Commands
- `npm run dev` - Start dev server (port 3000)
- `npm run build` - Production build
- `npm run preview` - Preview production build

### Key Environment Variables
- `VITE_API_KEY` - Gemini API key (required)

### Important Paths
- Gemini integration: `services/geminiService.ts`
- Export logic: `utils/export.ts`
- Main component: `App.tsx`
- Type definitions: `types.ts`
- Regulatory data: `data/regulatoryData.ts`

### Risk Calculation Quick Reference
```
Probability: B (Baja/Low), M (Media/Medium), A (Alta/High)
Severity: L (Leve/Minor), M (Moderado/Moderate), G (Grave/Severe)
Risk Level: PS (Poco Significativo), M (Moderado), S (Significativo), I (Intolerable)
```

---

**Note to AI Assistants**: This documentation is comprehensive but the codebase evolves. Always verify current implementation by reading source files. When in doubt, preserve existing patterns and ask for clarification on regulatory compliance matters.
