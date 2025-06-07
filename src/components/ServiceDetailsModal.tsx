import { X, MapPin, Clock, DollarSign, User, Briefcase, Tag } from "lucide-react";

interface ServiceDetailsModalProps {
  servico: any;
  onClose: () => void;
}

export function ServiceDetailsModal({ servico, onClose }: ServiceDetailsModalProps) {
  const getUrgenciaColor = (urgencia: string) => {
    switch(urgencia) {
      case "Muito Alta": return "bg-red-100 text-red-800 border-red-200";
      case "Alta": return "bg-orange-100 text-orange-800 border-orange-200";
      case "Média": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Baixa": return "bg-green-100 text-green-800 border-green-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getCategoriaColor = (categoria: string) => {
    switch(categoria) {
      case "Casa e Jardim": return "bg-green-100 text-green-800 border-green-200";
      case "Educação": return "bg-blue-100 text-blue-800 border-blue-200";
      case "Tecnologia": return "bg-purple-100 text-purple-800 border-purple-200";
      case "Saúde": return "bg-pink-100 text-pink-800 border-pink-200";
      case "Transporte": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white w-full h-full flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 text-white">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Detalhes do Serviço</h2>
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
                <h3 className="font-semibold text-lg text-gray-800">{servico.usuario}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getUrgenciaColor(servico.urgencia)}`}>
                    {servico.urgencia}
                  </span>
                </div>
              </div>
            </div>

            {/* Location and Time */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-gray-600">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">{servico.clienteRegiao}</span>
                <span className="text-sm">• {servico.distancia}km</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Clock className="w-4 h-4" />
                <span className="text-sm">{servico.tempo}</span>
              </div>
            </div>
          </div>

          {/* Service Info */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-2 mb-4">
              <Briefcase className="w-5 h-5 text-blue-600" />
              <h4 className="font-semibold text-gray-800">Serviço Solicitado</h4>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <h3 className="text-xl font-bold text-gray-800 mb-2">{servico.servico}</h3>
              
              <div className="flex items-center gap-2 mb-3">
                <Tag className="w-4 h-4 text-gray-500" />
                <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getCategoriaColor(servico.categoria)}`}>
                  {servico.categoria}
                </span>
              </div>
            </div>
          </div>

          {/* Service Details */}
          <div className="p-6">
            {/* Observations */}
            {servico.observacoes && (
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <h5 className="font-semibold text-amber-800 mb-2">Descrição detalhada:</h5>
                <p className="text-amber-700">"{servico.observacoes}"</p>
              </div>
            )}

            {/* Service Requirements */}
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h5 className="font-semibold text-blue-800 mb-3">Informações do Serviço</h5>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-blue-700 font-medium">Tempo estimado:</span>
                  <span className="text-blue-800 font-semibold">{servico.tempo}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-blue-700 font-medium">Distância:</span>
                  <span className="text-blue-800 font-semibold">{servico.distancia}km</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-blue-700 font-medium">Categoria:</span>
                  <span className="text-blue-800 font-semibold">{servico.categoria}</span>
                </div>
              </div>
            </div>

            {/* Tips */}
            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <h5 className="font-semibold text-green-800 mb-2">💡 Dica:</h5>
              <p className="text-green-700 text-sm">
                Certifique-se de ter as habilidades necessárias para este tipo de serviço antes de aceitar. 
                Entre em contato com o cliente para esclarecer detalhes se necessário.
              </p>
            </div>
          </div>
        </div>

        {/* Footer with Reward and Action */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-600 font-medium">Recompensa:</span>
            <div className="flex items-center gap-1 text-blue-600 font-bold text-xl">
              <DollarSign className="w-5 h-5" />
              <span>{servico.recompensa.toFixed(2)}</span>
            </div>
          </div>
          
          <button className="w-full bg-blue-600 text-white py-4 rounded-lg font-medium hover:bg-blue-700 transition-all transform hover:scale-105 active:scale-95">
            Aceitar Serviço
          </button>
        </div>
      </div>
    </div>
  );
}