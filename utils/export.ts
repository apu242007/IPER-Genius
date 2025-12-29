import { IPERRow } from "../types";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

export const downloadExcel = (rows: IPERRow[], approvers: string[], area: string, sector: string, month: string, year: string, revision: string, logo: string | null) => {
  // Styles
  const borderStyle = 'border: 1px solid black;';
  const yellowHeader = 'background-color: #FFFACD; ' + borderStyle + ' font-weight: bold; text-align: center; vertical-align: middle;';
  const centerStyle = borderStyle + ' text-align: center; vertical-align: top;';
  const leftStyle = borderStyle + ' text-align: left; vertical-align: top; white-space: pre-wrap;';
  
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
  
  // Logo content: Image tag or Text
  const logoContent = logo 
    ? `<img src="${logo}" width="100" height="40" alt="Logo" style="display:block; margin:auto;"/>` 
    : `TACKER`;

  // Document Info Header (Merged Cells approximation for Excel)
  const docHeader = `
    <tr>
      <td colspan="4" style="${borderStyle} color: red; font-size: 16px; font-weight: bold; font-style: italic; text-align: center; vertical-align: middle; height: 50px;">
        ${logoContent}
      </td>
      <td colspan="12" style="${borderStyle} font-size: 14px; font-weight: bold; text-align: center; vertical-align: middle;">MATRIZ DE IDENTIFICACIÓN DE PELIGROS Y EVALUACIÓN DE RIESGOS</td>
      <td colspan="4" style="${borderStyle} font-weight: bold; text-align: center; vertical-align: middle;">PGTAC008-A1-2</td>
    </tr>
    <tr>
      <td style="${borderStyle} font-weight: bold;">Area</td>
      <td colspan="5" style="${borderStyle} font-weight: bold; background-color: #00B0F0;">${area}</td>
      <td style="${borderStyle} font-weight: bold;">Sector</td>
      <td colspan="5" style="${borderStyle}">${sector}</td>
      <td style="${borderStyle} font-weight: bold;">Elabora</td>
      <td colspan="4" style="${borderStyle} font-weight: bold;">${approversString}</td>
      <td style="${borderStyle} font-weight: bold; background-color: #D3D3D3;">Actualizada</td>
      <td style="${borderStyle} font-weight: bold; text-align: center;">${month}</td>
      <td style="${borderStyle} font-weight: bold; text-align: center;">${year}</td>
    </tr>
    <tr>
      <td style="${borderStyle} font-weight: bold;">Proceso</td>
      <td colspan="4" style="${borderStyle} font-weight: bold;">Herramientas y Operaciones</td>
      <td colspan="3" style="${borderStyle} font-weight: bold;">Actividad Principal</td>
      <td colspan="9" style="${borderStyle} font-weight: bold;">Servico de Operaciones de Herramientas</td>
      <td style="${borderStyle} font-weight: bold; background-color: #D3D3D3;">Revisión</td>
      <td colspan="2" style="${borderStyle} font-weight: bold; text-align: center;">${revision}</td>
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

export const downloadPDF = (rows: IPERRow[], approvers: string[], area: string, sector: string, month: string, year: string, revision: string, logo: string | null) => {
  const doc = new jsPDF({ orientation: 'landscape', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const approversString = approvers && approvers.length > 0 ? approvers.join(' / ') : '';

  // --- Document Header (Manual Drawing) ---
  const startY = 10;
  const colW = pageWidth / 20; // 20 grid units

  // Row 1
  if (logo) {
    doc.addImage(logo, 'PNG', 15, startY + 2, 20, 10);
  } else {
    doc.setTextColor(255, 0, 0);
    doc.setFont("helvetica", "bolditalic");
    doc.setFontSize(16);
    doc.text("TACKER", 15, startY + 10);
  }
  
  doc.setTextColor(0, 0, 0);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text("MATRIZ DE IDENTIFICACIÓN DE PELIGROS Y EVALUACIÓN DE RIESGOS", pageWidth / 2, startY + 10, { align: 'center' });
  
  doc.setFontSize(10);
  doc.text("PGTAC008-A1-2", pageWidth - 15, startY + 10, { align: 'right' });

  // Draw Lines for Header 1
  doc.line(10, startY + 15, pageWidth - 10, startY + 15);

  // Metadata Section (Simplified text dump for PDF to save complexity vs HTML table)
  doc.setFontSize(8);
  doc.text(`Area: ${area}`, 12, startY + 20);
  doc.text(`Sector: ${sector}`, 80, startY + 20);
  doc.text(`Elabora: ${approversString}`, 140, startY + 20);
  doc.text(`Actualizada: ${month}/${year}`, pageWidth - 40, startY + 20);

  doc.text(`Proceso: Herramientas y Operaciones`, 12, startY + 25);
  doc.text(`Actividad Principal: Servico de Operaciones de Herramientas`, 80, startY + 25);
  doc.text(`Revisión: ${revision}`, pageWidth - 40, startY + 25);
  
  // --- Table Data ---
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
    startY: startY + 30,
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