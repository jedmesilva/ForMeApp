
interface OrderProductsModalProps {
  pedido: any;
  onClose: () => void;
}

export function OrderProductsModal({ pedido, onClose }: OrderProductsModalProps) {
  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <button 
            onClick={onClose}
            className="text-white hover:text-blue-200 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h2 className="text-xl font-bold">Detalhes do Pedido</h2>
          <div className="w-6"></div>
        </div>
        
        <div className="bg-white bg-opacity-15 backdrop-blur-sm p-4 rounded-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="font-semibold text-lg">{pedido.usuario}</span>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
              pedido.urgencia === 'Muito Alta' ? 'bg-red-500 text-white' :
              pedido.urgencia === 'Alta' ? 'bg-orange-500 text-white' :
              pedido.urgencia === 'Média' ? 'bg-yellow-500 text-white' :
              'bg-green-500 text-white'
            }`}>
              {pedido.urgencia}
            </span>
          </div>
          <p className="text-blue-100 text-sm">{pedido.clienteRegiao}</p>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="flex-1 p-6 overflow-y-auto bg-gray-50">
        <div className="space-y-6">
          {/* Informações do Estabelecimento */}
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <h3 className="font-semibold text-gray-800 mb-3">Estabelecimento</h3>
            <div className="space-y-2">
              <p className="text-blue-600 font-medium">{pedido.estabelecimento}</p>
              {pedido.estabelecimentoEndereco && (
                <p className="text-gray-600 text-sm">{pedido.estabelecimentoEndereco}</p>
              )}
              {!pedido.estabelecimentoEspecifico && (
                <p className="text-orange-600 text-sm font-medium">Qualquer estabelecimento</p>
              )}
            </div>
          </div>

          {/* Lista de Produtos */}
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <h3 className="font-semibold text-gray-800 mb-3">Produtos</h3>
            <div className="space-y-2">
              {pedido.itens.map((item: string, index: number) => (
                <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                  <span className="text-gray-800">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Informações Adicionais */}
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <h3 className="font-semibold text-gray-800 mb-3">Informações</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Distância</span>
                <span className="font-medium text-gray-800">{pedido.distancia} km</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Tempo estimado</span>
                <span className="font-medium text-gray-800">{pedido.tempo}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Recompensa</span>
                <span className="font-bold text-green-600">R$ {pedido.recompensa.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Observações */}
          {pedido.observacoes && (
            <div className="bg-white p-4 rounded-xl shadow-sm">
              <h3 className="font-semibold text-gray-800 mb-3">Observações</h3>
              <p className="text-gray-700 bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                {pedido.observacoes}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Botões de Ação */}
      <div className="p-6 bg-white border-t border-gray-200">
        <div className="space-y-3">
          <button className="w-full py-4 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold transition-all transform hover:scale-105 active:scale-95">
            Aceitar Pedido - R$ {pedido.recompensa.toFixed(2)}
          </button>
          <button 
            onClick={onClose}
            className="w-full py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl font-medium transition-all"
          >
            Voltar
          </button>
        </div>
      </div>
    </div>
  );
}
