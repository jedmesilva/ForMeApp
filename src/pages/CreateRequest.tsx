
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import CreateRequestForm from "@/components/CreateRequestForm";

export default function CreateRequest() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const type = searchParams.get('type') || 'buy'; // 'buy' ou 'make'

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-6">
        <div className="flex items-center gap-3 mb-4">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 transition-all"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-white">
              {type === 'buy' ? 'Criar Pedido de Compra' : 'Solicitar Serviço'}
            </h1>
            <p className="text-blue-100 text-sm">
              {type === 'buy' 
                ? 'Descreva os itens que precisa comprar' 
                : 'Descreva o serviço que você precisa'
              }
            </p>
          </div>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="flex-1 p-4">
        <CreateRequestForm type={type} />
      </div>
    </div>
  );
}
