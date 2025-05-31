
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  ShoppingBag, 
  Check, 
  X, 
  Plus, 
  Receipt, 
  CreditCard,
  MapPin,
  Clock,
  DollarSign,
  User,
  Camera,
  Upload,
  AlertCircle,
  CheckCircle2
} from "lucide-react";

interface Product {
  id: number;
  name: string;
  status: 'not_purchased' | 'selected' | 'purchased';
  establishment?: string;
  markedForOtherLocation?: boolean;
}

interface Order {
  id: number;
  usuario: string;
  estabelecimento: string;
  estabelecimentoEndereco: string;
  clienteRegiao: string;
  recompensa: number;
  urgencia: string;
  tempo: string;
  observacoes: string;
  itens: string[];
}

export default function BuyForMeOrder() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [order, setOrder] = useState<Order | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [activeTab, setActiveTab] = useState<'not_purchased' | 'selected' | 'purchased'>('not_purchased');
  const [showPayment, setShowPayment] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [receiptFiles, setReceiptFiles] = useState<File[]>([]);
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [currentEstablishment, setCurrentEstablishment] = useState('');

  // Simulated order data - in real app would come from API
  useEffect(() => {
    const mockOrder = {
      id: Number(id),
      usuario: "Maria Silva",
      estabelecimento: "Mercado X",
      estabelecimentoEndereco: "Rua das Compras, 123 - Centro",
      clienteRegiao: "Rua das Flores - Centro",
      recompensa: 10.00,
      urgencia: "Alta",
      tempo: "15 min",
      observacoes: "Leite da marca Tirol se possível",
      itens: ["Leite integral 1L", "Pão francês 500g", "Ovos 12un", "Manteiga 500g"]
    };
    
    setOrder(mockOrder);
    setCurrentEstablishment(mockOrder.estabelecimento);
    
    const initialProducts = mockOrder.itens.map((item, index) => ({
      id: index + 1,
      name: item,
      status: 'not_purchased' as const,
      establishment: mockOrder.estabelecimento,
      markedForOtherLocation: false
    }));
    
    setProducts(initialProducts);
  }, [id]);

  const moveProduct = (productId: number, newStatus: 'not_purchased' | 'selected' | 'purchased') => {
    setProducts(prev => prev.map(product => 
      product.id === productId ? { ...product, status: newStatus } : product
    ));
  };

  const toggleOtherLocation = (productId: number) => {
    setProducts(prev => prev.map(product => 
      product.id === productId 
        ? { ...product, markedForOtherLocation: !product.markedForOtherLocation }
        : product
    ));
  };

  const getProductsByStatus = (status: 'not_purchased' | 'selected' | 'purchased') => {
    return products.filter(product => product.status === status);
  };

  const getNotPurchasedNormalLocation = () => {
    return products.filter(product => 
      product.status === 'not_purchased' && !product.markedForOtherLocation
    );
  };

  const getNotPurchasedOtherLocation = () => {
    return products.filter(product => 
      product.status === 'not_purchased' && product.markedForOtherLocation
    );
  };

  const hasProductsMarkedForOtherLocation = () => {
    return products.some(product => product.markedForOtherLocation);
  };

  const getTotalSelected = () => {
    return getProductsByStatus('selected').length;
  };

  const handlePayment = () => {
    // Simulate payment process
    setPaymentCompleted(true);
    setShowPayment(false);
    
    // Move selected items to purchased
    setProducts(prev => prev.map(product => 
      product.status === 'selected' 
        ? { ...product, status: 'purchased', establishment: currentEstablishment }
        : product
    ));
  };

  const handleReceiptUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setReceiptFiles(prev => [...prev, ...files]);
  };

  const removeReceipt = (index: number) => {
    setReceiptFiles(prev => prev.filter((_, i) => i !== index));
  };

  const submitReceipts = () => {
    console.log('Uploading receipts:', receiptFiles);
    setShowReceipt(false);
    // Here you would upload to server and update order status
  };

  const changeEstablishment = () => {
    // For simplicity, just change to a different establishment
    const newEstablishment = currentEstablishment === "Mercado X" ? "Mercado Y" : "Mercado X";
    setCurrentEstablishment(newEstablishment);
  };

  if (!order) {
    return <div className="flex justify-center items-center h-screen">Carregando...</div>;
  }

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
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-6 text-white">
        <div className="flex items-center gap-3 mb-4">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <h1 className="text-xl font-bold flex items-center gap-2">
              <ShoppingBag className="w-6 h-6" />
              Execução do Pedido #{order.id}
            </h1>
            <p className="text-blue-100 text-sm">
              Solicitado por {order.usuario}
            </p>
          </div>
        </div>

        {/* Order Info Card */}
        <div className="bg-white bg-opacity-15 backdrop-blur-sm p-4 rounded-xl mb-4">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span className="text-blue-100">Entrega:</span>
            </div>
            <div className="text-white font-medium">{order.clienteRegiao}</div>
            
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span className="text-blue-100">Prazo:</span>
            </div>
            <div className="text-white font-medium">{order.tempo}</div>
            
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              <span className="text-blue-100">Recompensa:</span>
            </div>
            <div className="text-white font-medium">R$ {order.recompensa.toFixed(2)}</div>
          </div>
          
          <div className="mt-3 flex items-center justify-between">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getUrgenciaColor(order.urgencia)}`}>
              {order.urgencia}
            </span>
            <span className="text-blue-100 text-sm">
              Estabelecimento atual: {currentEstablishment}
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-4">
        {/* Status Summary */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-white p-3 rounded-lg text-center border-2 border-red-200">
            <div className="text-2xl font-bold text-red-600">{getProductsByStatus('not_purchased').length}</div>
            <div className="text-sm text-gray-600">Itens</div>
          </div>
          <div className="bg-white p-3 rounded-lg text-center border-2 border-yellow-200">
            <div className="text-2xl font-bold text-yellow-600">{getProductsByStatus('selected').length}</div>
            <div className="text-sm text-gray-600">Selecionados</div>
          </div>
          <div className="bg-white p-3 rounded-lg text-center border-2 border-green-200">
            <div className="text-2xl font-bold text-green-600">{getProductsByStatus('purchased').length}</div>
            <div className="text-sm text-gray-600">Comprados</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 mb-4">
          {getTotalSelected() > 0 && (
            <button
              onClick={() => setShowPayment(true)}
              className="flex-1 bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-all flex items-center justify-center gap-2"
            >
              <CreditCard className="w-4 h-4" />
              Pagar {getTotalSelected()} itens
            </button>
          )}
          
          {getProductsByStatus('purchased').length > 0 && (
            <button
              onClick={() => setShowReceipt(true)}
              className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
            >
              <Receipt className="w-4 h-4" />
              Enviar Comprovante
            </button>
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setActiveTab('not_purchased')}
            className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'not_purchased' 
                ? 'bg-blue-600 text-white shadow-md' 
                : 'bg-white text-blue-600 border border-blue-200 hover:bg-blue-50'
            }`}
          >
            Itens ({getProductsByStatus('not_purchased').length})
          </button>
          <button
            onClick={() => setActiveTab('selected')}
            className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'selected' 
                ? 'bg-blue-600 text-white shadow-md' 
                : 'bg-white text-blue-600 border border-blue-200 hover:bg-blue-50'
            }`}
          >
            Selecionados ({getProductsByStatus('selected').length})
          </button>
          <button
            onClick={() => setActiveTab('purchased')}
            className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'purchased' 
                ? 'bg-blue-600 text-white shadow-md' 
                : 'bg-white text-blue-600 border border-blue-200 hover:bg-blue-50'
            }`}
          >
            Comprados ({getProductsByStatus('purchased').length})
          </button>
        </div>

        {/* Product Lists */}
        <div className="space-y-4">
          {activeTab === 'not_purchased' ? (
            <>
              {/* Lista Normal - só mostra se tiver itens não marcados para outro local */}
              {getNotPurchasedNormalLocation().length > 0 && (
                <div className="space-y-3">
                  <h3 className="font-medium text-gray-700 flex items-center gap-2">
                    <ShoppingBag className="w-4 h-4" />
                    Estabelecimento Atual ({getNotPurchasedNormalLocation().length})
                  </h3>
                  {getNotPurchasedNormalLocation().map((product) => (
                    <div key={product.id} className="bg-white p-4 rounded-lg shadow-sm border">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-800">{product.name}</h3>
                          <p className="text-sm text-gray-500 mt-1">
                            Estabelecimento: {currentEstablishment}
                          </p>
                        </div>
                        
                        <div className="flex gap-2">
                          <button
                            onClick={() => moveProduct(product.id, 'selected')}
                            className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                            title="Adicionar ao carrinho"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => toggleOtherLocation(product.id)}
                            className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-xs font-medium"
                          >
                            Outro Local
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Lista Outro Local - só mostra se tiver itens marcados */}
              {hasProductsMarkedForOtherLocation() && getNotPurchasedOtherLocation().length > 0 && (
                <div className="space-y-3">
                  <h3 className="font-medium text-blue-700 flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Outro Estabelecimento ({getNotPurchasedOtherLocation().length})
                  </h3>
                  {getNotPurchasedOtherLocation().map((product) => (
                    <div key={product.id} className="bg-white p-4 rounded-lg shadow-sm border-2 border-blue-200">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-800">{product.name}</h3>
                          <p className="text-sm text-blue-600 mt-1 flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            Para comprar em outro local
                          </p>
                        </div>
                        
                        <div className="flex gap-2">
                          <button
                            onClick={() => moveProduct(product.id, 'selected')}
                            className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                            title="Adicionar ao carrinho"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => toggleOtherLocation(product.id)}
                            className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-xs font-medium"
                          >
                            ← Voltar
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Mensagem quando não há itens */}
              {getProductsByStatus('not_purchased').length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <ShoppingBag className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>Nenhum item para comprar</p>
                </div>
              )}
            </>
          ) : (
            <>
              {/* Outras abas (Selecionados e Comprados) mantêm comportamento original */}
              {getProductsByStatus(activeTab).map((product) => (
                <div key={product.id} className="bg-white p-4 rounded-lg shadow-sm border">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-800">{product.name}</h3>
                      {product.establishment && (
                        <p className="text-sm text-gray-500 mt-1">
                          Estabelecimento: {product.establishment}
                        </p>
                      )}
                    </div>
                    
                    <div className="flex gap-2">
                      {activeTab === 'selected' && (
                        <>
                          <button
                            onClick={() => moveProduct(product.id, 'not_purchased')}
                            className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                            title="Remover do carrinho"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </>
                      )}
                      
                      {activeTab === 'purchased' && (
                        <div className="flex items-center gap-2 text-blue-600">
                          <CheckCircle2 className="w-4 h-4" />
                          <span className="text-sm font-medium">Comprado</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              
              {getProductsByStatus(activeTab).length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <ShoppingBag className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>Nenhum item nesta categoria</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Payment Modal */}
      {showPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-md">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <CreditCard className="w-6 h-6 text-green-600" />
                Pagamento
              </h2>
              
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-2">Itens selecionados:</p>
                  <ul className="space-y-1">
                    {getProductsByStatus('selected').map((product) => (
                      <li key={product.id} className="text-sm font-medium">{product.name}</li>
                    ))}
                  </ul>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-blue-600 mb-1">Estabelecimento:</p>
                  <p className="font-medium">{currentEstablishment}</p>
                </div>
                
                <div className="text-center">
                  <p className="text-sm text-gray-600">O pagamento será debitado do</p>
                  <p className="font-bold text-lg">cartão do solicitante</p>
                </div>
              </div>
              
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowPayment(false)}
                  className="flex-1 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-all"
                >
                  Cancelar
                </button>
                <button
                  onClick={handlePayment}
                  className="flex-1 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-all"
                >
                  Confirmar Pagamento
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Receipt Upload Modal */}
      {showReceipt && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-md max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Receipt className="w-6 h-6 text-blue-600" />
                Enviar Comprovantes
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Adicionar Nota Fiscal / Cupom
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleReceiptUpload}
                      className="hidden"
                      id="receipt-upload"
                    />
                    <label htmlFor="receipt-upload" className="cursor-pointer">
                      <Camera className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                      <p className="text-sm text-gray-600">
                        Clique para adicionar fotos dos comprovantes
                      </p>
                    </label>
                  </div>
                </div>

                {receiptFiles.length > 0 && (
                  <div>
                    <h3 className="font-medium mb-2">Comprovantes Adicionados:</h3>
                    <div className="space-y-2">
                      {receiptFiles.map((file, index) => (
                        <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                          <span className="text-sm font-medium">{file.name}</span>
                          <button
                            onClick={() => removeReceipt(index)}
                            className="p-1 text-red-600 hover:bg-red-100 rounded"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="bg-yellow-50 p-4 rounded-lg">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-yellow-800">Importante:</p>
                      <p className="text-xs text-yellow-700 mt-1">
                        Envie todos os comprovantes dos produtos comprados para auditoria e confirmação dos itens.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowReceipt(false)}
                  className="flex-1 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-all"
                >
                  Cancelar
                </button>
                <button
                  onClick={submitReceipts}
                  disabled={receiptFiles.length === 0}
                  className="flex-1 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  Enviar Comprovantes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
