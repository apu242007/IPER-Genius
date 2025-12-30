import { IPERRow } from "../types";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

// Type for jsPDF with autoTable extension
interface jsPDFWithAutoTable extends jsPDF {
  lastAutoTable?: {
    finalY: number;
  };
}

// Helper to get image format from base64 string
const getImageFormat = (dataUrl: string): string => {
  if (dataUrl.startsWith("data:image/jpeg") || dataUrl.startsWith("data:image/jpg")) return "JPEG";
  if (dataUrl.startsWith("data:image/png")) return "PNG";
  return "PNG"; // Default fallback
};

export const downloadExcel = (rows: IPERRow[], approvers: string[], area: string, sector: string, month: string, year: string, revision: string, logo: string | null, process: string, mainActivity: string) => {
  // Styles
  const borderStyle = 'border: 1px solid black;';
  const yellowHeader = 'background-color: #FFFACD; ' + borderStyle + ' font-weight: bold; text-align: center; vertical-align: middle;';
  const centerStyle = borderStyle + ' text-align: center; vertical-align: top;';
  const leftStyle = borderStyle + ' text-align: left; vertical-align: top; white-space: pre-wrap;';
  const labelStyle = borderStyle + ' font-weight: bold; background-color: #f0f0f0; width: 100px;';
  
  // Format approvers string
  const approversString = approvers && approvers.length > 0 ? approvers.join(' / ') : '';

  // Helper for color logic
  const getRiskColor = (cal: string) => {
      switch (cal) {
        case 'I': return '#FF0000; color: white'; // Red
        case 'S': return '#FFA500; color: white'; // Orange
        case 'M': return '#FFFF00'; // Yellow
        case 'PS': return '#90EE90'; // LightGreen
        default: return '#FFFFFF';
      }
  };
  
  // Logo content: Image tag or Text. 
  // NOTE: Base64 images in HTML-Excel are sometimes blocked by Excel security settings. 
  // We use standard img tag with dimensions.
  const logoContent = logo 
    ? `<img src="${logo}" width="120" height="50" alt="Logo" style="display:block; margin:auto;"/>` 
    : `<span style="font-size: 20px; color: red; font-weight: bold;">TACKER</span>`;

  // Document Info Header (Improved Layout to avoid overlap)
  // We use specific widths to ensure Excel renders columns reasonably
  const docHeader = `
    <tr style="height: 60px;">
      <td colspan="4" style="${borderStyle} text-align: center; vertical-align: middle;">
        ${logoContent}
      </td>
      <td colspan="12" style="${borderStyle} font-size: 18px; font-weight: bold; text-align: center; vertical-align: middle; background-color: white;">MATRIZ DE IDENTIFICACIÓN DE PELIGROS Y EVALUACIÓN DE RIESGOS</td>
      <td colspan="4" style="${borderStyle} font-size: 14px; font-weight: bold; text-align: center; vertical-align: middle;">PGTAC008-A1-2</td>
    </tr>
    
    <!-- Row 2: Metadata 1 -->
    <tr style="height: 30px;">
      <td style="${labelStyle}">Area</td>
      <td colspan="5" style="${borderStyle} font-weight: bold; background-color: #00B0F0; vertical-align: middle;">${area}</td>
      
      <td style="${labelStyle}">Sector</td>
      <td colspan="5" style="${borderStyle} vertical-align: middle;">${sector}</td>
      
      <td style="${labelStyle}">Actualizada</td>
      <td colspan="3" style="${borderStyle} text-align: center; vertical-align: middle;">${month} / ${year}</td>
      
      <td style="${labelStyle}">Revisión</td>
      <td colspan="2" style="${borderStyle} text-align: center; vertical-align: middle;">${revision}</td>
    </tr>

    <!-- Row 3: Metadata 2 (Full Width for Elabora to prevent overlap) -->
    <tr style="height: 30px;">
      <td style="${labelStyle}">Elabora</td>
      <td colspan="19" style="${borderStyle} font-weight: bold; vertical-align: middle; flex-wrap: wrap;">${approversString}</td>
    </tr>

    <!-- Row 4: Process info -->
    <tr style="height: 30px;">
      <td style="${labelStyle}">Proceso</td>
      <td colspan="5" style="${borderStyle} font-weight: bold; vertical-align: middle;">${process}</td>
      
      <td style="${labelStyle}">Actividad P.</td>
      <td colspan="13" style="${borderStyle} font-weight: bold; vertical-align: middle;">${mainActivity}</td>
    </tr>
  `;

  const headers = `
    <tr>
      <th rowspan="2" style="${yellowHeader}">Descripción de la Actividad</th>
      <th colspan="2" style="${yellowHeader}">Tareas</th>
      <th rowspan="2" style="${yellowHeader}">Identificación de Peligros</th>
      <th rowspan="2" style="${yellowHeader}">Descripción de Riesgos</th>
      
      <th colspan="4" style="${yellowHeader}">Valoración Determinación y Evaluación INICIAL del Riesgo</th>
      
      <th rowspan="2" style="${yellowHeader}">Acciones de Mitigación Control Operativo</th>
      <th rowspan="2" style="${yellowHeader}">Acciones de Control Documentos y Normativa Legal</th>
      
      <th colspan="5" style="${yellowHeader}">Jerarquia de Control del Riesgo</th>
      
      <th colspan="4" style="${yellowHeader}">Valoración Determinación y Evaluación FINAL del Riesgo</th>
    </tr>
    <tr>
      <th style="${yellowHeader}">TR</th>
      <th style="${yellowHeader}">TNR</th>
      
      <th style="${yellowHeader}">P</th>
      <th style="${yellowHeader}">G</th>
      <th style="${yellowHeader}">VAL</th>
      <th style="${yellowHeader}">CAL</th>
      
      <th style="${yellowHeader}">CE</th>
      <th style="${yellowHeader}">CS</th>
      <th style="${yellowHeader}">CI</th>
      <th style="${yellowHeader}">CA</th>
      <th style="${yellowHeader}">EPP</th>
      
      <th style="${yellowHeader}">P</th>
      <th style="${yellowHeader}">G</th>
      <th style="${yellowHeader}">VAL</th>
      <th style="${yellowHeader}">CAL</th>
    </tr>
  `;

  const body = rows.map(row => `
    <tr>
      <td style="${leftStyle}">${row.activity}</td>
      <td style="${centerStyle}">${row.isRoutine ? 'X' : ''}</td>
      <td style="${centerStyle}">${!row.isRoutine ? 'X' : ''}</td>
      <td style="${leftStyle}">${row.hazard}</td>
      <td style="${leftStyle}">${row.riskDescription}</td>
      
      <td style="${centerStyle} font-weight: bold;">${row.probInitial}</td>
      <td style="${centerStyle} font-weight: bold;">${row.sevInitial}</td>
      <td style="${centerStyle}">${row.valInitial}</td>
      <td style="${centerStyle} font-weight: bold; background-color: ${getRiskColor(row.calInitial)}">${row.calInitial}</td>
      
      <td style="${leftStyle}">${row.mitigationControls.replace(/\n/g, '<br>')}</td>
      <td style="${leftStyle}">${row.documentControls.replace(/\n/g, '<br>')}</td>
      
      <td style="${centerStyle}">${row.controlElimination ? 'X' : ''}</td>
      <td style="${centerStyle}">${row.controlSubstitution ? 'X' : ''}</td>
      <td style="${centerStyle}">${row.controlEngineering ? 'X' : ''}</td>
      <td style="${centerStyle}">${row.controlAdmin ? 'X' : ''}</td>
      <td style="${centerStyle}">${row.controlPPE ? 'X' : ''}</td>
      
      <td style="${centerStyle} font-weight: bold;">${row.probFinal}</td>
      <td style="${centerStyle} font-weight: bold;">${row.sevFinal}</td>
      <td style="${centerStyle}">${row.valFinal}</td>
      <td style="${centerStyle} font-weight: bold; background-color: ${getRiskColor(row.calFinal)}">${row.calFinal}</td>
    </tr>
  `).join('');

  const table = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
    <head>
      <!--[if gte mso 9]>
      <xml>
        <x:ExcelWorkbook>
          <x:ExcelWorksheets>
            <x:ExcelWorksheet>
              <x:Name>Matriz IPER</x:Name>
              <x:WorksheetOptions>
                <x:DisplayGridlines/>
                <x:FitToPage/>
                <x:Print>
                  <x:ValidPrinterInfo/>
                  <x:PaperSizeIndex>9</x:PaperSizeIndex> <!-- A4 -->
                  <x:Scale>60</x:Scale>
                  <x:HorizontalResolution>600</x:HorizontalResolution>
                  <x:VerticalResolution>600</x:VerticalResolution>
                  <x:FitWidth>1</x:FitWidth>
                  <x:FitHeight>0</x:FitHeight>
                </x:Print>
              </x:WorksheetOptions>
            </x:ExcelWorksheet>
          </x:ExcelWorksheets>
        </x:ExcelWorkbook>
      </xml>
      <![endif]-->
      <meta charset="UTF-8">
    </head>
    <body>
      <table>${docHeader}${headers}${body}</table>
    </body>
    </html>
  `;

  const blob = new Blob([table], { type: 'application/vnd.ms-excel' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Matriz_IPER_${new Date().toISOString().slice(0,10)}.xls`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};

export const downloadPDF = (rows: IPERRow[], approvers: string[], area: string, sector: string, month: string, year: string, revision: string, logo: string | null, process: string, mainActivity: string) => {
  const doc = new jsPDF({ orientation: 'landscape', format: 'a4' }) as jsPDFWithAutoTable;
  const pageWidth = doc.internal.pageSize.getWidth();
  const approversString = approvers && approvers.length > 0 ? approvers.join(' / ') : '';

  // Use autoTable for the Header layout to prevent overlap and handle wrapping
  
  // 1. Logo and Title Table
  autoTable(doc, {
    startY: 10,
    head: [[
      { content: '', styles: { minCellWidth: 30 } }, // Logo placeholder
      { content: 'MATRIZ DE IDENTIFICACIÓN DE PELIGROS Y EVALUACIÓN DE RIESGOS', styles: { halign: 'center', valign: 'middle', fontSize: 14, fontStyle: 'bold' } },
      { content: 'PGTAC008-A1-2', styles: { halign: 'center', valign: 'middle', fontSize: 10 } }
    ]],
    body: [],
    theme: 'plain',
    styles: { cellPadding: 2, minCellHeight: 15 },
    columnStyles: {
      0: { cellWidth: 40 },
      1: { cellWidth: 'auto' }, // Takes remaining space
      2: { cellWidth: 30 }
    },
    didDrawCell: (data) => {
      // Draw Logo in the first cell if it exists and we are in the header row
      if (data.section === 'head' && data.column.index === 0 && logo) {
        try {
            const format = getImageFormat(logo);
            doc.addImage(logo, format, data.cell.x + 2, data.cell.y + 2, 35, 12);
        } catch {
            // Fallback text if image fails
            doc.setFontSize(10);
            doc.setTextColor(255,0,0);
            doc.text("TACKER", data.cell.x + 5, data.cell.y + 10);
        }
      } else if (data.section === 'head' && data.column.index === 0 && !logo) {
         doc.setFontSize(16);
         doc.setTextColor(255,0,0);
         doc.setFont("helvetica", "bolditalic");
         doc.text("TACKER", data.cell.x + 5, data.cell.y + 10);
      }
    }
  });

  // 2. Metadata Table (Area, Sector, Elabora, etc.)
  // We use a table here so text wraps automatically if names are too long
  autoTable(doc, {
    startY: (doc.lastAutoTable?.finalY ?? 10) + 2,
    body: [
      [ 
        { content: 'Area:', styles: { fontStyle: 'bold', fillColor: [240, 240, 240] } }, 
        { content: area, styles: { fillColor: [0, 176, 240] } },
        { content: 'Sector:', styles: { fontStyle: 'bold', fillColor: [240, 240, 240] } }, 
        { content: sector },
        { content: 'Actualizada:', styles: { fontStyle: 'bold', fillColor: [240, 240, 240] } }, 
        { content: `${month} / ${year}` } 
      ],
      [
        { content: 'Elabora:', styles: { fontStyle: 'bold', fillColor: [240, 240, 240] } },
        { content: approversString, colSpan: 3 }, // Span across middle columns to give space
        { content: 'Revisión:', styles: { fontStyle: 'bold', fillColor: [240, 240, 240] } },
        { content: revision }
      ],
      [
        { content: 'Proceso:', styles: { fontStyle: 'bold', fillColor: [240, 240, 240] } },
        { content: process, colSpan: 2 },
        { content: 'Actividad Principal:', styles: { fontStyle: 'bold', fillColor: [240, 240, 240] } },
        { content: mainActivity, colSpan: 2 }
      ]
    ],
    theme: 'grid',
    styles: { 
      fontSize: 8, 
      cellPadding: 1.5,
      lineColor: [0,0,0],
      lineWidth: 0.1,
      valign: 'middle'
    },
    columnStyles: {
      0: { cellWidth: 20 }, // Label
      2: { cellWidth: 20 }, // Label
      4: { cellWidth: 20 }, // Label
      // Values auto-size
    }
  });

  // --- Main Data Table ---
  const tableHead = [
    [
      { content: 'Descripción de la Actividad', rowSpan: 2, styles: { valign: 'middle', halign: 'center' } },
      { content: 'Tareas', colSpan: 2, styles: { halign: 'center' } },
      { content: 'Identificación de Peligros', rowSpan: 2, styles: { valign: 'middle', halign: 'center' } },
      { content: 'Descripción de Riesgos', rowSpan: 2, styles: { valign: 'middle', halign: 'center' } },
      { content: 'Evaluación INICIAL', colSpan: 4, styles: { halign: 'center', fontStyle: 'bold' } },
      { content: 'Mitigación / Control', rowSpan: 2, styles: { valign: 'middle', halign: 'center' } },
      { content: 'Documentos y Normativa', rowSpan: 2, styles: { valign: 'middle', halign: 'center' } },
      { content: 'Jerarquia de Control', colSpan: 5, styles: { halign: 'center', fontStyle: 'bold' } },
      { content: 'Evaluación FINAL', colSpan: 4, styles: { halign: 'center', fontStyle: 'bold' } },
    ],
    [
      'TR', 'TNR', // Tareas sub
      'P', 'G', 'VAL', 'CAL', // Init sub
      'CE', 'CS', 'CI', 'CA', 'EPP', // Hierarchy sub
      'P', 'G', 'VAL', 'CAL' // Final sub
    ]
  ];

  const tableBody = rows.map(row => [
    row.activity,
    row.isRoutine ? 'X' : '',
    !row.isRoutine ? 'X' : '',
    row.hazard,
    row.riskDescription,
    
    row.probInitial,
    row.sevInitial,
    row.valInitial,
    row.calInitial,

    row.mitigationControls,
    row.documentControls,

    row.controlElimination ? 'X' : '',
    row.controlSubstitution ? 'X' : '',
    row.controlEngineering ? 'X' : '',
    row.controlAdmin ? 'X' : '',
    row.controlPPE ? 'X' : '',

    row.probFinal,
    row.sevFinal,
    row.valFinal,
    row.calFinal
  ]);

  autoTable(doc, {
    startY: (doc.lastAutoTable?.finalY ?? 10) + 5,
    head: tableHead,
    body: tableBody,
    theme: 'grid',
    styles: { 
      fontSize: 6,
      cellPadding: 1,
      overflow: 'linebreak',
    },
    headStyles: {
      fillColor: [255, 250, 205], // #FFFACD
      textColor: [0, 0, 0],
      lineWidth: 0.1,
      lineColor: [0, 0, 0]
    },
    columnStyles: {
      0: { cellWidth: 25 }, // Activity
      3: { cellWidth: 25 }, // Hazard
      4: { cellWidth: 25 }, // Risk
      9: { cellWidth: 35 }, // Controls
      10: { cellWidth: 35 }, // Docs
    },
    didParseCell: (data) => {
      // Risk Color Logic for PDF
      if (data.section === 'body') {
        if (data.column.index === 8 || data.column.index === 19) { // CAL Columns
          const val = data.cell.raw as string;
          if (val === 'I') data.cell.styles.fillColor = [255, 0, 0];
          else if (val === 'S') data.cell.styles.fillColor = [255, 165, 0];
          else if (val === 'M') data.cell.styles.fillColor = [255, 255, 0];
          else if (val === 'PS') data.cell.styles.fillColor = [144, 238, 144];
        }
      }
    }
  });

  doc.save(`Matriz_IPER_${new Date().toISOString().slice(0,10)}.pdf`);
};