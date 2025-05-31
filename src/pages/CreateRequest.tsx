import { useState } from "react";
import { ArrowLeft, ShoppingCart, Wrench } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { TopHeader } from "@/components/TopHeader";
import { CreateRequestForm } from "@/components/CreateRequestForm";

export default function CreateRequest() {
  const navigate = useNavigate();
  const [requestType, setRequestType] = useState<"purchase" | "service" | null>(null);

  const handleBack = () => {
    if (requestType) {
      setRequestType(null);
    } else {
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <TopHeader 
        title={requestType ? 
          (requestType === "purchase" ? "Nova Compra" : "Novo Serviço") : 
          "Criar Solicitação"
        }
      />
      
      <div className="p-4 pb-20">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-blue-600 mb-6 hover:text-blue-700 transition-colors"
        >
          <ArrowLeft size={20} />
          Voltar
        </button>

        {!requestType ? (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">
              Que tipo de solicitação você quer criar?
            </h2>
            
            <div className="grid grid-cols-1 gap-4">
              <button
                onClick={() => setRequestType("purchase")}
                className="p-6 bg-white rounded-xl border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 text-left group"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                    <ShoppingCart className="text-blue-600" size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 text-lg">Pedido de Compra</h3>
                    <p className="text-gray-600 text-sm">
                      Solicite que alguém compre itens para você
                    </p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => setRequestType("service")}
                className="p-6 bg-white rounded-xl border-2 border-gray-200 hover:border-green-500 hover:bg-green-50 transition-all duration-200 text-left group"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                    <Wrench className="text-green-600" size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 text-lg">Solicitação de Serviço</h3>
                    <p className="text-gray-600 text-sm">
                      Peça ajuda com tarefas e serviços
                    </p>
                  </div>
                </div>
              </button>
            </div>
          </div>
        ) : (
          <CreateRequestForm 
            type={requestType} 
            onSuccess={() => navigate("/")}
            onCancel={() => setRequestType(null)}
          />
        )}
      </div>
    </div>
  );
}