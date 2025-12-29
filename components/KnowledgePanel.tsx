import React from 'react';

interface KnowledgePanelProps {
  knowledgeBase: string;
  setKnowledgeBase: (val: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

const KnowledgePanel: React.FC<KnowledgePanelProps> = ({ knowledgeBase, setKnowledgeBase, isOpen, onClose }) => {
  return (
    <div className={`fixed inset-y-0 right-0 w-96 bg-white shadow-2xl transform transition-transform duration-300 z-50 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
      <div className="h-full flex flex-col p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">
            <i className="fas fa-book-open mr-2 text-blue-600"></i>
            Base de Conocimientos
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <i className="fas fa-times text-xl"></i>
          </button>
        </div>
        
        <p className="text-sm text-gray-600 mb-4">
          Pega aquí el contenido de tus procedimientos, normas internas, estándares o permisos de trabajo. El Agente utilizará esta información para sugerir controles específicos.
        </p>

        <textarea
          className="flex-1 w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm font-mono resize-none bg-gray-50"
          placeholder="Ej: PROCEDIMIENTO DE TRABAJO EN ALTURA (PT-001)..."
          value={knowledgeBase}
          onChange={(e) => setKnowledgeBase(e.target.value)}
        />
        
        <div className="mt-4 text-xs text-gray-400">
          <i className="fas fa-shield-alt mr-1"></i>
          La información se envía al modelo para contexto y no se guarda persistentemente.
        </div>
      </div>
    </div>
  );
};

export default KnowledgePanel;