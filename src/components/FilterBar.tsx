
import { Filter } from "lucide-react";

interface FilterBarProps {
  activeFilter: string;
  setActiveFilter: (filter: string) => void;
}

export function FilterBar({ activeFilter, setActiveFilter }: FilterBarProps) {
  const filtros = [
    "todos",
    "menos itens", 
    "mais itens", 
    "mais recente", 
    "mais antigo",
    "mais perto", 
    "mais longe",
    "maior urgência", 
    "menor urgência"
  ];

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm">
      <div className="flex items-center gap-2 mb-3">
        <Filter className="w-4 h-4 text-gray-400" />
        <span className="font-medium text-gray-700">Filtros</span>
      </div>
      <div className="flex gap-2 overflow-x-auto pb-2">
        {filtros.map((filtro) => (
          <button
            key={filtro}
            onClick={() => setActiveFilter(filtro)}
            className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-all transform hover:scale-105 ${
              activeFilter === filtro 
                ? "bg-blue-600 text-white shadow-md" 
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {filtro}
          </button>
        ))}
      </div>
    </div>
  );
}
