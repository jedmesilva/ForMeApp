
import { MapPin, Clock, DollarSign, Briefcase } from "lucide-react";

interface OrderCardProps {
  pedido: any;
  activeTab: string;
}

export function OrderCard({ pedido, activeTab }: OrderCardProps) {
  const getUrgenciaColor = (urgencia: string) => {
    switch(urgencia) {
      case "Muito Alta": return "bg-red-100 text-red-800";
      case "Alta": return "bg-orange-100 text-orange-800";
      case "Média": return "bg-yellow-100 text-yellow-800";
      case "Baixa": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-all transform hover:-translate-y-1">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-semibold text-gray-800">{pedido.usuario}</span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getUrgenciaColor(pedido.urgencia)}`}>
              {pedido.urgencia}
            </span>
          </div>
          
          {activeTab === "buy" ? (
            <>
              {/* Estabelecimento melhorado */}
              <div className="text-sm text-gray-700 mb-1">
                <span className="font-medium">{pedido.estabelecimento}</span>
                {pedido.estabelecimentoEspecifico && pedido.estabelecimentoEndereco && (
                  <span className="text-gray-500"> • {pedido.estabelecimentoEndereco}</span>
                )}
              </div>
              
              {/* Região do cliente e distância */}
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                <MapPin className="w-4 h-4" />
                <span>{pedido.clienteRegiao}</span>
                <span>•</span>
                <span>{pedido.distancia}km</span>
              </div>

              {/* Itens */}
              <div className="text-gray-700 mb-2">
                <span className="font-medium">{pedido.itens.length} {pedido.itens.length === 1 ? 'item' : 'itens'}</span>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                <Briefcase className="w-4 h-4" />
                <span>{pedido.categoria}</span>
              </div>
              
              {/* Região do cliente e distância */}
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                <MapPin className="w-4 h-4" />
                <span>{pedido.clienteRegiao}</span>
                <span>•</span>
                <span>{pedido.distancia}km</span>
              </div>
              
              <div className="text-gray-700 mb-2">
                <span className="font-medium">Serviço:</span> {pedido.servico}
              </div>
            </>
          )}
          
          <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{pedido.tempo}</span>
            </div>
          </div>
          
          {pedido.observacoes && (
            <p className="text-sm text-gray-600 italic">"{pedido.observacoes}"</p>
          )}
        </div>
        
        <div className="text-right ml-4">
          <div className="flex items-center gap-1 text-blue-600 font-bold text-lg">
            <DollarSign className="w-4 h-4" />
            <span>{pedido.recompensa.toFixed(2)}</span>
          </div>
        </div>
      </div>
      
      <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-all transform hover:scale-105 active:scale-95">
        {activeTab === "buy" ? "Aceitar Pedido" : "Oferecer Serviço"}
      </button>
    </div>
  );
}
