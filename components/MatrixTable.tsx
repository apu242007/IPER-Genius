import React, { useRef, useState } from 'react';
import { IPERRow, RiskLevel } from '../types';
import { APPROVERS_LIST, AREA_OPTIONS, SECTOR_OPTIONS, MONTH_OPTIONS, YEAR_OPTIONS } from '../constants';

interface MatrixTableProps {
  rows: IPERRow[];
  onDeleteRow: (id: string) => void;
  approvers: string[];
  setApprovers: (val: string[]) => void;
  area: string;
  setArea: (val: string) => void;
  sector: string;
  setSector: (val: string) => void;
  month: string;
  setMonth: (val: string) => void;
  year: string;
  setYear: (val: string) => void;
  revision: string;
  setRevision: (val: string) => void;
  logo: string | null;
  setLogo: (val: string | null) => void;
}

const MatrixTable: React.FC<MatrixTableProps> = ({ 
  rows, onDeleteRow, 
  approvers, setApprovers, 
  area, setArea, 
  sector, setSector,
  month, setMonth,
  year, setYear,
  revision, setRevision,
  logo, setLogo
}) => {
  const tableRef = useRef<HTMLTableElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isApproverDropdownOpen, setIsApproverDropdownOpen] = useState(false);

  const getRiskColor = (cal: RiskLevel) => {
    switch (cal) {
      case RiskLevel.INTOLERABLE: return 'bg-red-500 text-white font-bold';
      case RiskLevel.SIGNIFICATIVO: return 'bg-orange-400 text-white font-bold';
      case RiskLevel.MODERADO: return 'bg-yellow-300 text-black font-semibold';
      case RiskLevel.POCO_SIGNIFICATIVO: return 'bg-green-200 text-green-900';
      default: return 'bg-white';
    }
  };

  const toggleApprover = (name: string) => {
    setApprovers(prev => {
      if (prev.includes(name)) {
        return prev.filter(p => p !== name);
      } else {
        return [...prev, name];
      }
    });
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogo(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="border border-black bg-white shadow-sm overflow-x-auto min-h-[400px] mb-20">
      <div className="min-w-max"> {/* Wrapper to force header and table to share width */}
      
      {/* DOCUMENT HEADER SECTION (Static Data per Request) */}
      <div className="border-b-2 border-black">
        {/* Row 1: Logo, Title, Code */}
        <div className="flex border-b border-black">
          <div 
            className="w-[15%] p-2 border-r border-black flex items-center justify-center cursor-pointer hover:bg-gray-50 relative group"
            onClick={() => fileInputRef.current?.click()}
            title="Clic para cambiar logo"
          >
             <input 
               type="file" 
               ref={fileInputRef} 
               onChange={handleLogoUpload} 
               className="hidden" 
               accept="image/*"
             />
             {logo ? (
               <img src={logo} alt="Logo" className="max-h-12 max-w-full object-contain" />
             ) : (
               <span className="text-red-600 font-extrabold text-2xl italic tracking-tighter" style={{fontFamily: 'Arial, sans-serif'}}>TACKER</span>
             )}
             <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 flex items-center justify-center transition-all">
               <i className="fas fa-camera text-gray-500 opacity-0 group-hover:opacity-100"></i>
             </div>
          </div>
          <div className="w-[70%] p-2 flex items-center justify-center font-bold text-xl text-center bg-white">
            MATRIZ DE IDENTIFICACIÓN DE PELIGROS Y EVALUACIÓN DE RIESGOS
          </div>
          <div className="w-[15%] p-2 border-l border-black flex items-center justify-center font-bold text-lg bg-white">
            PGTAC008-A1-2
          </div>
        </div>

        {/* Row 2: Metadata Grid */}
        <div className="flex border-b border-black text-xs h-8">
          {/* Area - Dropdown Selection - Adjusted Width to 30% */}
          <div className="flex w-[30%] border-r border-black">
            <div className="w-12 font-bold p-1 flex items-center justify-center bg-white border-r border-black">Area</div>
            <div className="flex-1 p-0 flex items-center font-bold bg-[#00B0F0] text-black">
                <select 
                    value={area} 
                    onChange={(e) => setArea(e.target.value)}
                    className="w-full h-full bg-[#00B0F0] text-black font-bold outline-none border-none p-1 cursor-pointer"
                >
                    {AREA_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                    ))}
                </select>
            </div>
          </div>

          {/* Sector - Dropdown Selection - Adjusted Width to 20% */}
          <div className="flex w-[20%] border-r border-black">
            <div className="w-12 font-bold p-1 flex items-center justify-center bg-white border-r border-black">Sector</div>
            <div className="flex-1 p-0 flex items-center font-bold bg-white">
                <select 
                    value={sector} 
                    onChange={(e) => setSector(e.target.value)}
                    className="w-full h-full bg-white text-black font-bold outline-none border-none p-1 cursor-pointer text-[10px]"
                >
                    {SECTOR_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                    ))}
                </select>
            </div>
          </div>
          
          {/* Elabora - Multi Select Dropdown - Adjusted Width to 35% */}
          <div className="flex w-[35%] border-r border-black relative">
            <div className="w-16 font-bold p-1 flex items-center justify-center bg-white border-r border-black">Elabora</div>
            
            <div 
              className="flex-1 p-1 flex items-center justify-between font-bold bg-white cursor-pointer hover:bg-gray-50 text-[10px] leading-tight overflow-hidden relative"
              onClick={() => setIsApproverDropdownOpen(!isApproverDropdownOpen)}
            >
              <span className="line-clamp-2">{approvers.length > 0 ? approvers.join(' / ') : 'Seleccionar...'}</span>
              <i className="fas fa-chevron-down text-gray-500 ml-1"></i>
            </div>

            {isApproverDropdownOpen && (
              <div className="absolute top-full left-0 w-full bg-white border border-gray-300 shadow-xl z-50 max-h-60 overflow-y-auto">
                <div className="sticky top-0 bg-gray-100 p-2 border-b flex justify-between items-center">
                  <span className="font-bold text-xs">Seleccionar Responsables</span>
                  <button onClick={() => setIsApproverDropdownOpen(false)} className="text-red-500">
                    <i className="fas fa-times"></i>
                  </button>
                </div>
                {APPROVERS_LIST.map((name, idx) => (
                  <label key={idx} className="flex items-center px-2 py-1 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-0">
                    <input 
                      type="checkbox" 
                      className="mr-2"
                      checked={approvers.includes(name)}
                      onChange={() => toggleApprover(name)}
                    />
                    <span className="text-[10px]">{name}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Actualizada - Kept at 15% */}
          <div className="flex w-[15%]">
            <div className="flex-1 font-bold p-1 flex items-center justify-center bg-gray-300 border-r border-black">Actualizada</div>
            {/* Month Dropdown */}
            <div className="w-12 p-0 flex items-center justify-center font-bold border-r border-black">
                <select 
                    value={month} 
                    onChange={(e) => setMonth(e.target.value)}
                    className="w-full h-full bg-white text-black font-bold outline-none border-none p-0 cursor-pointer text-center text-[10px]"
                >
                    {MONTH_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                    ))}
                </select>
            </div>
            {/* Year Dropdown */}
            <div className="w-12 p-0 flex items-center justify-center font-bold">
                 <select 
                    value={year} 
                    onChange={(e) => setYear(e.target.value)}
                    className="w-full h-full bg-white text-black font-bold outline-none border-none p-0 cursor-pointer text-center text-[10px]"
                >
                    {YEAR_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                    ))}
                </select>
            </div>
          </div>
        </div>

        {/* Row 3: Metadata Grid */}
        <div className="flex text-xs h-8">
          {/* Proceso */}
          <div className="flex w-[25%] border-r border-black">
            <div className="w-16 font-bold p-1 flex items-center justify-center bg-white border-r border-black">Proceso</div>
            <div className="flex-1 p-1 flex items-center font-bold bg-white pl-2">Herramientas y Operaciones</div>
          </div>
          {/* Actividad Principal (Expanded) */}
          <div className="flex w-[60%] border-r border-black">
            <div className="w-32 font-bold p-1 flex items-center justify-center bg-white border-r border-black">Actividad Principal</div>
            <div className="flex-1 p-1 flex items-center font-bold bg-white pl-2">Servico de Operaciones de Herramientas</div>
          </div>
          {/* Revisión */}
          <div className="flex w-[15%]">
            <div className="flex-1 font-bold p-1 flex items-center justify-center bg-gray-300 border-r border-black">Revisión</div>
            <div className="w-20 p-0 flex items-center justify-center font-bold">
                <input 
                  type="text" 
                  value={revision} 
                  onChange={(e) => setRevision(e.target.value)}
                  className="w-full h-full text-center outline-none border-none bg-white font-bold"
                />
            </div>
          </div>
        </div>
      </div>

      {/* DATA TABLE */}
      <table ref={tableRef} className="w-full text-xs text-left border-collapse bg-white">
        <thead className="text-gray-900 border-b-2 border-black">
          {/* Upper Header Row */}
          <tr className="bg-[#FFFACD]">
            <th rowSpan={2} className="border border-black px-2 py-1 text-center align-middle w-48">Descripción de la<br/>Actividad</th>
            
            {/* Tareas Merged */}
            <th colSpan={2} className="border border-black px-1 py-1 text-center align-middle w-16">
              <div className="flex items-center justify-center h-full transform -rotate-90 md:rotate-0">Tareas</div>
            </th>

            <th rowSpan={2} className="border border-black px-2 py-1 text-center align-middle w-48">Identificación de Peligros</th>
            <th rowSpan={2} className="border border-black px-2 py-1 text-center align-middle w-48">Descripción de Riesgos</th>
            
            {/* Initial Evaluation Merged */}
            <th colSpan={4} className="border border-black px-1 py-1 text-center align-middle font-bold">
              Valoración Determinación y<br/>Evaluación INICIAL<br/>del Riesgo
            </th>

            <th rowSpan={2} className="border border-black px-2 py-1 text-center align-middle w-64">Acciones de Mitigación<br/>Control Operativo</th>
            <th rowSpan={2} className="border border-black px-2 py-1 text-center align-middle w-64">Acciones de Control<br/>Documentos y Normativa Legal</th>
            
            {/* Hierarchy Merged */}
            <th colSpan={5} className="border border-black px-1 py-1 text-center align-middle font-bold">
              Jerarquia de Control<br/>del Riesgo
            </th>

            {/* Final Evaluation Merged */}
            <th colSpan={4} className="border border-black px-1 py-1 text-center align-middle font-bold">
              Valoración Determinación y<br/>Evaluación FINAL<br/>del Riesgo
            </th>

            <th rowSpan={2} className="border border-black px-1 py-1 bg-gray-100 w-10"></th>
          </tr>

          {/* Lower Header Row */}
          <tr className="bg-[#FFFACD]">
            {/* Tareas sub-cols */}
            <th className="border border-black px-1 py-1 text-center w-8 text-[10px]">TR</th>
            <th className="border border-black px-1 py-1 text-center w-8 text-[10px]">TNR</th>

            {/* Init Eval sub-cols */}
            <th className="border border-black px-1 py-1 text-center w-8">P</th>
            <th className="border border-black px-1 py-1 text-center w-8">G</th>
            <th className="border border-black px-1 py-1 text-center w-8">VAL</th>
            <th className="border border-black px-1 py-1 text-center w-10">CAL</th>

            {/* Hierarchy sub-cols */}
            <th className="border border-black px-1 py-1 text-center w-6 text-[10px]">CE</th>
            <th className="border border-black px-1 py-1 text-center w-6 text-[10px]">CS</th>
            <th className="border border-black px-1 py-1 text-center w-6 text-[10px]">CI</th>
            <th className="border border-black px-1 py-1 text-center w-6 text-[10px]">CA</th>
            <th className="border border-black px-1 py-1 text-center w-6 text-[10px]">EPP</th>

            {/* Final Eval sub-cols */}
            <th className="border border-black px-1 py-1 text-center w-8">P</th>
            <th className="border border-black px-1 py-1 text-center w-8">G</th>
            <th className="border border-black px-1 py-1 text-center w-8">VAL</th>
            <th className="border border-black px-1 py-1 text-center w-10">CAL</th>
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={21} className="h-32 text-center text-gray-400 border border-black bg-gray-50">
                <div className="flex flex-col items-center justify-center h-full">
                  <i className="fas fa-clipboard-list text-3xl mb-2"></i>
                  <p>No hay datos. Ingresa una actividad para comenzar.</p>
                </div>
              </td>
            </tr>
          ) : (
            rows.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                <td className="border border-black px-2 py-2 align-top">{row.activity}</td>
                <td className="border border-black px-1 py-2 text-center align-top">{row.isRoutine ? 'X' : ''}</td>
                <td className="border border-black px-1 py-2 text-center align-top">{!row.isRoutine ? 'X' : ''}</td>
                <td className="border border-black px-2 py-2 align-top">{row.hazard}</td>
                <td className="border border-black px-2 py-2 align-top">{row.riskDescription}</td>
                
                <td className="border border-black px-1 py-2 text-center align-top font-bold">{row.probInitial}</td>
                <td className="border border-black px-1 py-2 text-center align-top font-bold">{row.sevInitial}</td>
                <td className="border border-black px-1 py-2 text-center align-top font-mono">{row.valInitial}</td>
                <td className={`border border-black px-1 py-2 text-center align-top text-[10px] font-bold ${getRiskColor(row.calInitial)}`}>
                  {row.calInitial}
                </td>
                
                <td className="border border-black px-2 py-2 align-top whitespace-pre-wrap">{row.mitigationControls}</td>
                <td className="border border-black px-2 py-2 align-top whitespace-pre-wrap">{row.documentControls}</td>
                
                <td className="border border-black px-1 py-2 text-center align-top">{row.controlElimination ? 'X' : ''}</td>
                <td className="border border-black px-1 py-2 text-center align-top">{row.controlSubstitution ? 'X' : ''}</td>
                <td className="border border-black px-1 py-2 text-center align-top">{row.controlEngineering ? 'X' : ''}</td>
                <td className="border border-black px-1 py-2 text-center align-top">{row.controlAdmin ? 'X' : ''}</td>
                <td className="border border-black px-1 py-2 text-center align-top">{row.controlPPE ? 'X' : ''}</td>
                
                <td className="border border-black px-1 py-2 text-center align-top font-bold">{row.probFinal}</td>
                <td className="border border-black px-1 py-2 text-center align-top font-bold">{row.sevFinal}</td>
                <td className="border border-black px-1 py-2 text-center align-top font-mono">{row.valFinal}</td>
                <td className={`border border-black px-1 py-2 text-center align-top text-[10px] font-bold ${getRiskColor(row.calFinal)}`}>
                  {row.calFinal}
                </td>

                <td className="border border-black px-1 py-2 text-center align-middle">
                   <button onClick={() => onDeleteRow(row.id)} className="text-red-500 hover:text-red-700 transition-colors">
                      <i className="fas fa-trash"></i>
                   </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      </div>
    </div>
  );
};

export default MatrixTable;