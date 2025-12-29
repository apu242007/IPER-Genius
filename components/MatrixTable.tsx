import React, { useRef } from 'react';
import { IPERRow, RiskLevel, Probability, Severity } from '../types';
import { TABLE_HEADERS } from '../constants';

interface MatrixTableProps {
  rows: IPERRow[];
  onDeleteRow: (id: string) => void;
}

const MatrixTable: React.FC<MatrixTableProps> = ({ rows, onDeleteRow }) => {
  const tableRef = useRef<HTMLTableElement>(null);

  const getRiskColor = (cal: RiskLevel) => {
    switch (cal) {
      case RiskLevel.INTOLERABLE: return 'bg-red-500 text-white font-bold';
      case RiskLevel.SIGNIFICATIVO: return 'bg-orange-400 text-white font-bold';
      case RiskLevel.MODERADO: return 'bg-yellow-300 text-black font-semibold';
      case RiskLevel.POCO_SIGNIFICATIVO: return 'bg-green-200 text-green-900';
      default: return 'bg-white';
    }
  };

  if (rows.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-400 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
        <i className="fas fa-clipboard-list text-4xl mb-4"></i>
        <p>No hay datos en la matriz. Describe una actividad para comenzar.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto border rounded-lg shadow-sm">
      <table ref={tableRef} className="min-w-max w-full text-xs text-left border-collapse bg-white">
        <thead className="bg-[#FFFACD] text-gray-900 sticky top-0 z-10 shadow-sm">
          <tr>
            {TABLE_HEADERS.map((header, idx) => (
              <th key={idx} className="border border-gray-300 px-2 py-3 font-bold uppercase tracking-wider text-[11px] text-center align-middle h-16">
                {header}
              </th>
            ))}
            <th className="border border-gray-300 px-2 py-3 bg-gray-100">Acción</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className="hover:bg-gray-50 transition-colors">
              {/* Actividad */}
              <td className="border border-gray-300 px-2 py-2 max-w-xs">{row.activity}</td>
              
              {/* TR / TNR */}
              <td className="border border-gray-300 px-1 py-2 text-center">{row.isRoutine ? 'X' : ''}</td>
              <td className="border border-gray-300 px-1 py-2 text-center">{!row.isRoutine ? 'X' : ''}</td>
              
              {/* Peligro & Riesgo */}
              <td className="border border-gray-300 px-2 py-2 max-w-[200px]">{row.hazard}</td>
              <td className="border border-gray-300 px-2 py-2 max-w-[200px]">{row.riskDescription}</td>
              
              {/* Evaluación Inicial */}
              <td className="border border-gray-300 px-2 py-2 text-center font-bold">{row.probInitial}</td>
              <td className="border border-gray-300 px-2 py-2 text-center font-bold">{row.sevInitial}</td>
              <td className="border border-gray-300 px-2 py-2 text-center font-mono">{row.valInitial}</td>
              <td className={`border border-gray-300 px-2 py-2 text-center text-[10px] ${getRiskColor(row.calInitial)}`}>
                {row.calInitial}
              </td>
              
              {/* Controles */}
              <td className="border border-gray-300 px-2 py-2 max-w-[250px] whitespace-pre-wrap">{row.mitigationControls}</td>
              <td className="border border-gray-300 px-2 py-2 max-w-[250px] whitespace-pre-wrap">{row.documentControls}</td>
              
              {/* Jerarquía */}
              <td className="border border-gray-300 px-1 py-2 text-center">{row.controlElimination ? 'X' : ''}</td>
              <td className="border border-gray-300 px-1 py-2 text-center">{row.controlSubstitution ? 'X' : ''}</td>
              <td className="border border-gray-300 px-1 py-2 text-center">{row.controlEngineering ? 'X' : ''}</td>
              <td className="border border-gray-300 px-1 py-2 text-center">{row.controlAdmin ? 'X' : ''}</td>
              <td className="border border-gray-300 px-1 py-2 text-center">{row.controlPPE ? 'X' : ''}</td>
              
              {/* Evaluación Final */}
              <td className="border border-gray-300 px-2 py-2 text-center font-bold">{row.probFinal}</td>
              <td className="border border-gray-300 px-2 py-2 text-center font-bold">{row.sevFinal}</td>
              <td className="border border-gray-300 px-2 py-2 text-center font-mono">{row.valFinal}</td>
              <td className={`border border-gray-300 px-2 py-2 text-center text-[10px] ${getRiskColor(row.calFinal)}`}>
                {row.calFinal}
              </td>

              {/* Delete Action */}
              <td className="border border-gray-300 px-2 py-2 text-center">
                 <button onClick={() => onDeleteRow(row.id)} className="text-red-500 hover:text-red-700 transition-colors">
                    <i className="fas fa-trash"></i>
                 </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MatrixTable;