
import { useState } from "react";

interface Estabelecimento {
  id: string;
  nome: string;
  endereco: string;
  tipo: string;
  logo: string;
}

interface EstablishmentSearchProps {
  estabelecimentos: Estabelecimento[];
  selectedEstablishment: string;
  setSelectedEstablishment: (id: string) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

export function EstablishmentSearch({
  estabelecimentos,
  selectedEstablishment,
  setSelectedEstablishment,
  searchTerm,
  setSearchTerm
}: EstablishmentSearchProps) {
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Filtrar estabelecimentos baseado na busca
  const filteredEstabelecimentos = estabelecimentos.filter(est => 
    est.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    est.endereco.toLowerCase().includes(searchTerm.toLowerCase()) ||
    est.tipo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Encontrar estabelecimento selecionado
  const selectedEstablishmentData = estabelecimentos.find(est => est.id === selectedEstablishment);

  return (
    <div className="relative">
      <p className="text-white text-sm mb-2">Filtrar por estabelecimento</p>
      <div className="relative">
        {/* Logo do estabelecimento selecionado */}
        {selectedEstablishmentData && selectedEstablishment !== "todos" && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-lg z-10">
            {selectedEstablishmentData.logo}
          </div>
        )}
        
        <input
          type="text"
          placeholder="buscar estabelecimento..."
          value={selectedEstablishmentData && selectedEstablishment !== "todos" 
            ? `${selectedEstablishmentData.nome} • ${selectedEstablishmentData.endereco}`
            : searchTerm}
          onChange={(e) => {
            const inputValue = e.target.value;
            setSearchTerm(inputValue);
            setShowSuggestions(inputValue.length > 0);
            // Se o campo estiver vazio, resetar seleção
            if (inputValue === "") {
              setSelectedEstablishment("todos");
            }
            // Se está editando um estabelecimento já selecionado, voltar ao modo de busca
            if (selectedEstablishment !== "todos" && !inputValue.includes(selectedEstablishmentData?.nome)) {
              setSelectedEstablishment("todos");
            }
          }}
          onFocus={() => {
            if (selectedEstablishment !== "todos") {
              // Se tem estabelecimento selecionado, limpar para permitir nova busca
              setSearchTerm("");
              setSelectedEstablishment("todos");
            }
            setShowSuggestions(true);
          }}
          className={`w-full bg-white bg-opacity-90 backdrop-blur-sm rounded-xl ${selectedEstablishmentData && selectedEstablishment !== "todos" ? 'pl-10' : 'pl-3'} pr-10 py-3 text-gray-700 placeholder-gray-500 focus:outline-none focus:bg-white focus:shadow-lg transition-all`}
          readOnly={selectedEstablishment !== "todos"}
        />
        
        {(searchTerm || selectedEstablishment !== "todos") && (
          <button
            onClick={() => {
              setSearchTerm("");
              setShowSuggestions(false);
              setSelectedEstablishment("todos");
            }}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 hover:text-gray-600 flex items-center justify-center text-lg font-bold transition-colors"
          >
            ×
          </button>
        )}
      </div>

      {/* Lista de Sugestões */}
      {showSuggestions && filteredEstabelecimentos.length > 0 && selectedEstablishment === "todos" && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 max-h-64 overflow-y-auto z-50">
          {filteredEstabelecimentos.map((est) => (
            <button
              key={est.id}
              onClick={() => {
                setSearchTerm("");
                setShowSuggestions(false);
                setSelectedEstablishment(est.id);
              }}
              className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="text-xl flex-shrink-0">
                  {est.logo}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-gray-800 truncate">{est.nome}</p>
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full ml-2 flex-shrink-0">
                      {est.tipo}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 truncate">{est.endereco}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Não encontrado */}
      {showSuggestions && searchTerm && filteredEstabelecimentos.length === 0 && selectedEstablishment === "todos" && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 p-4 z-50">
          <p className="text-gray-500 text-center">Nenhum estabelecimento encontrado</p>
        </div>
      )}
    </div>
  );
}
