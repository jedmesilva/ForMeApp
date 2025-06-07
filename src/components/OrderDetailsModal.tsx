
interface OrderDetailsModalProps {
  onClose: () => void;
}

export function OrderDetailsModal({ onClose }: OrderDetailsModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto transform transition-all">
        <h2 className="text-2xl font-bold mb-4">Meus Pedidos</h2>
        
        <div className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold">Pedido #1234</span>
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">Em andamento</span>
            </div>
            <p className="text-sm text-gray-600">Mercado X - Leite, Pão</p>
            <p className="text-sm text-gray-600">Aceito por: João Silva</p>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold">Pedido #1233</span>
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">Aceito</span>
            </div>
            <p className="text-sm text-gray-600">Farmácia Z - Medicamentos</p>
            <p className="text-sm text-gray-600">Aceito por: Maria Santos</p>
          </div>
          
          <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-100">
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold">Pedido #1232</span>
              <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">Aguardando</span>
            </div>
            <p className="text-sm text-gray-600">Qualquer - Produtos de limpeza</p>
          </div>
        </div>
        
        <button 
          onClick={onClose}
          className="w-full mt-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-all transform hover:scale-105"
        >
          Fechar
        </button>
      </div>
    </div>
  );
}
