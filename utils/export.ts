import { IPERRow } from "../types";

export const downloadExcel = (rows: IPERRow[]) => {
  // We construct a simple HTML Table string and download as .xls
  // This avoids heavy dependencies like xlsx/sheetjs but works natively in Excel/LibreOffice
  
  const headers = `
    <tr>
      <th style="background-color: #FFFACD; border: 1px solid black;">Descripción de la Actividad</th>
      <th style="background-color: #FFFACD; border: 1px solid black;">TR</th>
      <th style="background-color: #FFFACD; border: 1px solid black;">TNR</th>
      <th style="background-color: #FFFACD; border: 1px solid black;">Identificación de Peligros</th>
      <th style="background-color: #FFFACD; border: 1px solid black;">Descripción de Riesgos</th>
      
      <th style="background-color: #FFFACD; border: 1px solid black;">P (Inicial)</th>
      <th style="background-color: #FFFACD; border: 1px solid black;">G (Inicial)</th>
      <th style="background-color: #FFFACD; border: 1px solid black;">VAL</th>
      <th style="background-color: #FFFACD; border: 1px solid black;">CAL</th>
      
      <th style="background-color: #FFFACD; border: 1px solid black;">Acciones de Mitigación / Control Operativo</th>
      <th style="background-color: #FFFACD; border: 1px solid black;">Acciones de Control / Documentos y Normativa Legal</th>
      
      <th style="background-color: #FFFACD; border: 1px solid black;">CE</th>
      <th style="background-color: #FFFACD; border: 1px solid black;">CS</th>
      <th style="background-color: #FFFACD; border: 1px solid black;">CI</th>
      <th style="background-color: #FFFACD; border: 1px solid black;">CA</th>
      <th style="background-color: #FFFACD; border: 1px solid black;">EPP</th>
      
      <th style="background-color: #FFFACD; border: 1px solid black;">P (Final)</th>
      <th style="background-color: #FFFACD; border: 1px solid black;">G (Final)</th>
      <th style="background-color: #FFFACD; border: 1px solid black;">VAL</th>
      <th style="background-color: #FFFACD; border: 1px solid black;">CAL</th>
    </tr>
  `;

  const body = rows.map(row => `
    <tr>
      <td style="border: 1px solid black;">${row.activity}</td>
      <td style="border: 1px solid black; text-align: center;">${row.isRoutine ? 'X' : ''}</td>
      <td style="border: 1px solid black; text-align: center;">${!row.isRoutine ? 'X' : ''}</td>
      <td style="border: 1px solid black;">${row.hazard}</td>
      <td style="border: 1px solid black;">${row.riskDescription}</td>
      
      <td style="border: 1px solid black; text-align: center;">${row.probInitial}</td>
      <td style="border: 1px solid black; text-align: center;">${row.sevInitial}</td>
      <td style="border: 1px solid black; text-align: center;">${row.valInitial}</td>
      <td style="border: 1px solid black; text-align: center;">${row.calInitial}</td>
      
      <td style="border: 1px solid black;">${row.mitigationControls.replace(/\n/g, '<br>')}</td>
      <td style="border: 1px solid black;">${row.documentControls.replace(/\n/g, '<br>')}</td>
      
      <td style="border: 1px solid black; text-align: center;">${row.controlElimination ? 'X' : ''}</td>
      <td style="border: 1px solid black; text-align: center;">${row.controlSubstitution ? 'X' : ''}</td>
      <td style="border: 1px solid black; text-align: center;">${row.controlEngineering ? 'X' : ''}</td>
      <td style="border: 1px solid black; text-align: center;">${row.controlAdmin ? 'X' : ''}</td>
      <td style="border: 1px solid black; text-align: center;">${row.controlPPE ? 'X' : ''}</td>
      
      <td style="border: 1px solid black; text-align: center;">${row.probFinal}</td>
      <td style="border: 1px solid black; text-align: center;">${row.sevFinal}</td>
      <td style="border: 1px solid black; text-align: center;">${row.valFinal}</td>
      <td style="border: 1px solid black; text-align: center;">${row.calFinal}</td>
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
              </x:WorksheetOptions>
            </x:ExcelWorksheet>
          </x:ExcelWorksheets>
        </x:ExcelWorkbook>
      </xml>
      <![endif]-->
      <meta charset="UTF-8">
    </head>
    <body>
      <table>${headers}${body}</table>
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