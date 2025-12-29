import React, { useState } from 'react';
import { IPERRow } from './types';
import MatrixTable from './components/MatrixTable';
import KnowledgePanel from './components/KnowledgePanel';
import { generateIPERRows } from './services/geminiService';
import { downloadExcel } from './utils/export';
import { INITIAL_KNOWLEDGE } from './data/regulatoryData';

// Use environment variable or the provided fallback key
const API_KEY = process.env.API_KEY || 'AIzaSyBQ7l3WyxzIKX9jioyUAR4Sv1P6xqWlpsA';

const App: React.FC = () => {
  const [rows, setRows] = useState<IPERRow[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  // Initialize with the massive regulatory text
  const [knowledgeBase, setKnowledgeBase] = useState(INITIAL_KNOWLEDGE);
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setIsLoading(true);
    try {
      const newRows = await generateIPERRows(API_KEY, input, knowledgeBase);
      setRows(prev => [...prev, ...newRows]);
      setInput('');
    } catch (error) {
      alert("Error al generar la matriz. Verifica la conexión o intenta de nuevo.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteRow = (id: string) => {
    setRows(prev => prev.filter(r => r.id !== id));
  };

  const handleClear = () => {
    if (confirm("¿Estás seguro de querer borrar toda la tabla?")) {
      setRows([]);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-hse-dark text-white p-4 shadow-md z-20 sticky top-0">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="bg-yellow-400 text-black p-2 rounded font-bold text-xl">
              <i className="fas fa-hard-hat"></i>
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">IPER-Genius Agent</h1>
              <p className="text-xs text-gray-400">Especialista HSE/SST - Argentina & ISO 45001</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
             <button 
              onClick={() => setIsPanelOpen(true)}
              className="text-sm bg-blue-700 hover:bg-blue-600 px-3 py-2 rounded transition-colors flex items-center gap-2"
            >
              <i className="fas fa-book"></i> Conocimientos
              {knowledgeBase.length > 0 && <span className="flex h-2 w-2 relative"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span></span>}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto p-4 flex flex-col gap-6 relative">
        
        {/* Input Section */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">Generar Matriz de Riesgos</h2>
            <form onSubmit={handleSubmit} className="flex gap-4 items-start">
              <div className="flex-1">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Describe la actividad (ej: 'Soldadura de tubería en altura para mantenimiento de red de incendio')..."
                  className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[80px] text-gray-700"
                  disabled={isLoading}
                />
                <p className="text-xs text-gray-500 mt-2">
                  <i className="fas fa-info-circle mr-1"></i>
                  El agente identificará peligros, calculará VAL/CAL, y propondrá controles basados en normativa argentina y tus documentos cargados.
                </p>
              </div>
              <button 
                type="submit" 
                disabled={isLoading || !input}
                className={`px-6 py-4 rounded-lg font-bold text-white shadow-md flex items-center gap-2 transition-all ${isLoading || !input ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 hover:-translate-y-1'}`}
              >
                {isLoading ? (
                  <><i className="fas fa-circle-notch fa-spin"></i> Analizando...</>
                ) : (
                  <><i className="fas fa-magic"></i> Generar</>
                )}
              </button>
            </form>
        </div>

        {/* Action Bar */}
        {rows.length > 0 && (
          <div className="flex justify-end gap-3">
            <button 
              onClick={handleClear}
              className="px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded border border-red-200"
            >
              <i className="fas fa-trash-alt mr-2"></i> Limpiar
            </button>
            <button 
              onClick={() => downloadExcel(rows)}
              className="px-4 py-2 text-sm text-white bg-green-600 hover:bg-green-700 rounded shadow-sm font-medium"
            >
              <i className="fas fa-file-excel mr-2"></i> Descargar Excel
            </button>
          </div>
        )}

        {/* Table Section */}
        <MatrixTable rows={rows} onDeleteRow={handleDeleteRow} />

      </main>

      {/* Side Panel for Knowledge */}
      <KnowledgePanel 
        knowledgeBase={knowledgeBase} 
        setKnowledgeBase={setKnowledgeBase} 
        isOpen={isPanelOpen} 
        onClose={() => setIsPanelOpen(false)} 
      />
    </div>
  );
};

export default App;