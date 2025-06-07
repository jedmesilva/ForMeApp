
interface CreateOrderModalProps {
  activeTab: string;
  estabelecimentos: any[];
  onClose: () => void;
}

export function CreateOrderModal({ activeTab, estabelecimentos, onClose }: CreateOrderModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto transform transition-all">
        <h2 className="text-2xl font-bold mb-4">
          {activeTab === "buy" ? "Criar Pedido de Compra" : "Solicitar Serviço"}
        </h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              {activeTab === "buy" ? "Lista de Itens" : "Descrição do Serviço"}
            </label>
            <textarea 
              className="w-full border rounded-lg p-3 h-24 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              placeholder={activeTab === "buy" ? "Ex: Leite 1L, Pão francês..." : "Ex: Montagem de móvel, aula de inglês..."}
            />
          </div>
          
          {activeTab === "buy" && (
            <div>
              <label className="block text-sm font-medium mb-2">Estabelecimento</label>
              <select className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all">
                <option>Qualquer estabelecimento</option>
                {estabelecimentos.map((est) => (
                  <option key={est.id} value={est.id}>
                    {est.logo} {est.nome}
                  </option>
                ))}
              </select>
            </div>
          )}
          
          {activeTab === "make" && (
            <div>
              <label className="block text-sm font-medium mb-2">Categoria</label>
              <select className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all">
                <option>Casa e Jardim</option>
                <option>Educação</option>
                <option>Tecnologia</option>
                <option>Saúde</option>
                <option>Outros</option>
              </select>
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium mb-2">Endereço de Entrega</label>
            <input 
              type="text" 
              className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              placeholder="Rua, número, bairro..."
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Recompensa (R$)</label>
            <input 
              type="number" 
              className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              placeholder="10.00"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Urgência</label>
            <select className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all">
              <option>Baixa</option>
              <option>Média</option>
              <option>Alta</option>
              <option>Muito Alta</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Observações</label>
            <textarea 
              className="w-full border rounded-lg p-3 h-16 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              placeholder="Instruções especiais..."
            />
          </div>
        </div>
        
        <div className="flex gap-3 mt-6">
          <button 
            onClick={onClose}
            className="flex-1 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-all"
          >
            Cancelar
          </button>
          <button 
            onClick={onClose}
            className="flex-1 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-all transform hover:scale-105"
          >
            Publicar
          </button>
        </div>
      </div>
    </div>
  );
}
