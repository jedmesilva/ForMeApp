import { X, MapPin, Clock, DollarSign, User, ShoppingBag } from "lucide-react";

interface OrderProductsModalProps {
  pedido: any;
  onClose: () => void;
}

export function OrderProductsModal({ pedido, onClose }: OrderProductsModalProps) {
  const getUrgenciaColor = (urgencia: string) => {
    switch(urgencia) {
      case "Muito Alta": return "bg-red-100 text-red-800 border-red-200";
      case "Alta": return "bg-orange-100 text-orange-800 border-orange-200";
      case "Média": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Baixa": return "bg-green-100 text-green-800 border-green-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white w-full h-full flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 text-white">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Detalhes do Pedido</h2>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {/* User Info Section */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-lg text-gray-800">{pedido.usuario}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getUrgenciaColor(pedido.urgencia)}`}>
                    {pedido.urgencia}
                  </span>
                </div>
              </div>
            </div>

            {/* Location and Time */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-gray-600">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">{pedido.clienteRegiao}</span>
                <span className="text-sm">• {pedido.distancia}km</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Clock className="w-4 h-4" />
                <span className="text-sm">{pedido.tempo}</span>
              </div>
            </div>
          </div>

          {/* Establishment Info */}
          <div className="p-6 border-b border-gray-200">
            <h4 className="font-semibold text-gray-800 mb-2">Local de Compra</h4>
            <p className="text-gray-700 font-medium">{pedido.estabelecimento}</p>
            {pedido.estabelecimentoEndereco && (
              <p className="text-sm text-gray-600 mt-1">{pedido.estabelecimentoEndereco}</p>
            )}
          </div>

          {/* Products List */}
          <div className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <ShoppingBag className="w-5 h-5 text-blue-600" />
              <h4 className="font-semibold text-gray-800">
                Lista de Produtos ({pedido.itens.length} {pedido.itens.length === 1 ? 'item' : 'itens'})
              </h4>
            </div>
            
            <div className="space-y-3">
              {pedido.itens.map((item: string, index: number) => (
                <div 
                  key={index}
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200"
                >
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold text-sm">
                    {index + 1}
                  </div>
                  <span className="text-gray-800 font-medium flex-1">{item}</span>
                </div>
              ))}
            </div>

            {/* Observations */}
            {pedido.observacoes && (
              <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <h5 className="font-semibold text-amber-800 mb-2">Observações:</h5>
                <p className="text-amber-700 italic">"{pedido.observacoes}"</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer with Reward and Action */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-600 font-medium">Recompensa:</span>
            <div className="flex items-center gap-1 text-blue-600 font-bold text-xl">
              <DollarSign className="w-5 h-5" />
              <span>{pedido.recompensa.toFixed(2)}</span>
            </div>
          </div>
          
          <button className="w-full bg-blue-600 text-white py-4 rounded-lg font-medium hover:bg-blue-700 transition-all transform hover:scale-105 active:scale-95">
            Aceitar Pedido
          </button>
        </div>
      </div>
    </div>
  );
}