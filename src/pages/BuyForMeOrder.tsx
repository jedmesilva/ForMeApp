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
  CheckCircle2,
  Navigation,
  CheckCircle,
  Package,
  Timer,
  Eye,
  ExternalLink,
  Search
} from "lucide-react";

interface Product {
  id: number;
  name: string;
  status: 'not_purchased' | 'selected' | 'purchased' | 'not_found';
  establishment?: string;
  markedForOtherLocation?: boolean;
}

interface Order {
  id: number;
  usuario: string;
  estabelecimento: string;
  estabelecimentoEndereco: string;
  clienteRegiao: string;
  clienteEndereco: string;
  codigoFinalizacao: string;
  recompensa: number;
  urgencia: string;
  tempo: string;
  observacoes: string;
  itens: string[];
}

type OrderStage = 'shopping' | 'delivery' | 'summary';

export default function BuyForMeOrder() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [order, setOrder] = useState<Order | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [activeTab, setActiveTab] = useState<'not_purchased' | 'selected' | 'purchased' | 'not_found'>('not_purchased');
  const [showPayment, setShowPayment] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [receiptFiles, setReceiptFiles] = useState<File[]>([]);
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [currentEstablishment, setCurrentEstablishment] = useState('');
  const [currentStage, setCurrentStage] = useState<OrderStage>('shopping');
  const [deliveryStartTime, setDeliveryStartTime] = useState<Date | null>(null);
  const [orderStartTime] = useState<Date>(new Date());

  // Simulated order data - in real app would come from API
  useEffect(() => {
    const mockOrder = {
      id: Number(id),
      usuario: "Maria Silva",
      estabelecimento: "Mercado X",
      estabelecimentoEndereco: "Rua das Compras, 123 - Centro",
      clienteRegiao: "Rua das Flores - Centro",
      clienteEndereco: "Rua das Flores, 456 - Centro - CEP: 12345-678",
      codigoFinalizacao: "AB123C",
      recompensa: 10.00,
      urgencia: "Alta",
      tempo: "15 min",
      observacoes: "Leite da marca Tirol se possível",
      itens: ["Leite integral 1L", "Pão francês 500g", "Ovos 12un", "Manteiga 500g"]
    };
    
    setOrder(mockOrder);
    setCurrentEstablishment(mockOrder.estabelecimento);
    
    // Marcar pedido como iniciado no localStorage
    const startedOrders = JSON.parse(localStorage.getItem('startedOrders') || '[]');
    if (!startedOrders.includes(mockOrder.id)) {
      startedOrders.push(mockOrder.id);
      localStorage.setItem('startedOrders', JSON.stringify(startedOrders));
    }
    
    const initialProducts = mockOrder.itens.map((item, index) => ({
      id: index + 1,
      name: item,
      status: 'not_purchased' as const,
      establishment: mockOrder.estabelecimento,
      markedForOtherLocation: false
    }));
    
    setProducts(initialProducts);
  }, [id]);

  // Auto close summary after 5 seconds
  useEffect(() => {
    if (currentStage === 'summary') {
      const timer = setTimeout(() => {
        navigate('/orders');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [currentStage, navigate]);

  const moveProduct = (productId: number, newStatus: 'not_purchased' | 'selected' | 'purchased' | 'not_found') => {
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

  const getProductsByStatus = (status: 'not_purchased' | 'selected' | 'purchased' | 'not_found') => {
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

  const allItemsProcessed = () => {
    return products.every(product => 
      product.status === 'purchased' || product.status === 'not_found'
    );
  };

  const canStartDelivery = () => {
    return paymentCompleted && allItemsProcessed();
  };

  const handlePayment = () => {
    setPaymentCompleted(true);
    setShowPayment(false);
    
    // Move selected items to purchased
    setProducts(prev => prev.map(product => 
      product.status === 'selected' 
        ? { ...product, status: 'purchased', establishment: currentEstablishment }
        : product
    ));
  };

  const handleStartDelivery = () => {
    setCurrentStage('delivery');
    setDeliveryStartTime(new Date());
  };

  const handleFinishOrder = () => {
    setCurrentStage('summary');
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
  };

  const changeEstablishment = () => {
    const newEstablishment = currentEstablishment === "Mercado X" ? "Mercado Y" : "Mercado X";
    setCurrentEstablishment(newEstablishment);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getTotalOrderTime = () => {
    if (!deliveryStartTime) return "0 min";
    const now = new Date();
    const diffMs = now.getTime() - orderStartTime.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    return `${diffMins} min`;
  };

  const openMaps = () => {
    const address = encodeURIComponent(order?.clienteEndereco || '');
    window.open(`https://maps.google.com/?q=${address}`, '_blank');
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

  const getStageTitle = () => {
    switch(currentStage) {
      case 'shopping': return 'Etapa de Compras';
      case 'delivery': return 'Etapa de Entrega';
      case 'summary': return 'Pedido Finalizado';
      default: return 'Execução do Pedido';
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-6 text-white">
        <div className="flex items-center gap-3 mb-4">
          <button 
            onClick={() => navigate('/orders')}
            className="p-2 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <h1 className="text-xl font-bold flex items-center gap-2">
              <ShoppingBag className="w-6 h-6" />
              {getStageTitle()} #{order.id}
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
            {currentStage === 'shopping' && (
              <span className="text-blue-100 text-sm">
                Estabelecimento atual: {currentEstablishment}
              </span>
            )}
            {currentStage === 'delivery' && deliveryStartTime && (
              <span className="text-blue-100 text-sm">
                Entrega iniciada: {formatTime(deliveryStartTime)}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 pb-20">
        {currentStage === 'shopping' && (
          <>
            {/* Tabs */}
            <div className="flex gap-1 mb-4 overflow-x-auto">
              <button
                onClick={() => setActiveTab('not_purchased')}
                className={`flex-1 min-w-[100px] py-3 px-3 rounded-lg text-xs font-medium transition-all ${
                  activeTab === 'not_purchased' 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'bg-white text-blue-600 border border-blue-200 hover:bg-blue-50'
                }`}
              >
                Itens ({getProductsByStatus('not_purchased').length})
              </button>
              <button
                onClick={() => setActiveTab('selected')}
                className={`flex-1 min-w-[100px] py-3 px-3 rounded-lg text-xs font-medium transition-all ${
                  activeTab === 'selected' 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'bg-white text-blue-600 border border-blue-200 hover:bg-blue-50'
                }`}
              >
                Selecionados ({getProductsByStatus('selected').length})
              </button>
              <button
                onClick={() => setActiveTab('purchased')}
                className={`flex-1 min-w-[100px] py-3 px-3 rounded-lg text-xs font-medium transition-all ${
                  activeTab === 'purchased' 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'bg-white text-blue-600 border border-blue-200 hover:bg-blue-50'
                }`}
              >
                Comprados ({getProductsByStatus('purchased').length})
              </button>
              <button
                onClick={() => setActiveTab('not_found')}
                className={`flex-1 min-w-[120px] py-3 px-3 rounded-lg text-xs font-medium transition-all ${
                  activeTab === 'not_found' 
                    ? 'bg-red-600 text-white shadow-md' 
                    : 'bg-white text-red-600 border border-red-200 hover:bg-red-50'
                }`}
              >
                Não Encontrado ({getProductsByStatus('not_found').length})
              </button>
            </div>

            {/* Product Lists */}
            <div className="space-y-4">
              {activeTab === 'not_purchased' ? (
                <>
                  {getNotPurchasedNormalLocation().length > 0 && (
                    <div className="space-y-3">
                      <h3 className="font-medium text-gray-700 flex items-center gap-2">
                        <ShoppingBag className="w-4 h-4" />
                        Estabelecimento Atual ({getNotPurchasedNormalLocation().length})
                      </h3>
                      {getNotPurchasedNormalLocation().map((product) => (
                        <div 
                          key={product.id} 
                          className="bg-white p-4 rounded-lg shadow-sm border cursor-pointer hover:bg-blue-50 transition-colors"
                          onClick={() => moveProduct(product.id, 'selected')}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <h3 className="font-medium text-gray-800">{product.name}</h3>
                              <p className="text-sm text-gray-500 mt-1">
                                Estabelecimento: {currentEstablishment}
                              </p>
                            </div>
                            
                            <div className="flex gap-2">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleOtherLocation(product.id);
                                }}
                                className="px-3 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors text-xs font-medium"
                              >
                                Outro Local
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  moveProduct(product.id, 'selected');
                                }}
                                className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                title="Adicionar ao carrinho"
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  moveProduct(product.id, 'not_found');
                                }}
                                className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                                title="Marcar como não encontrado"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {hasProductsMarkedForOtherLocation() && getNotPurchasedOtherLocation().length > 0 && (
                    <div className="space-y-3">
                      <h3 className="font-medium text-blue-700 flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        Outro Estabelecimento ({getNotPurchasedOtherLocation().length})
                      </h3>
                      {getNotPurchasedOtherLocation().map((product) => (
                        <div 
                          key={product.id} 
                          className="bg-white p-4 rounded-lg shadow-sm border-2 border-blue-200 cursor-pointer hover:bg-blue-50 transition-colors"
                          onClick={() => moveProduct(product.id, 'selected')}
                        >
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
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleOtherLocation(product.id);
                                }}
                                className="px-3 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors text-xs font-medium"
                              >
                                ← Voltar
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  moveProduct(product.id, 'selected');
                                }}
                                className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                title="Adicionar ao carrinho"
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  moveProduct(product.id, 'not_found');
                                }}
                                className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                                title="Marcar como não encontrado"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {getProductsByStatus('not_purchased').length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <ShoppingBag className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p>Nenhum item para comprar</p>
                    </div>
                  )}
                </>
              ) : (
                <>
                  {getProductsByStatus(activeTab).map((product) => (
                    <div key={product.id} className={`bg-white p-4 rounded-lg shadow-sm border ${
                      activeTab === 'not_found' ? 'border-red-200 bg-red-50' : ''
                    }`}>
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
                            <button
                              onClick={() => moveProduct(product.id, 'not_purchased')}
                              className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                              title="Remover do carrinho"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          )}
                          
                          {activeTab === 'purchased' && (
                            <div className="flex items-center gap-2 text-green-600">
                              <CheckCircle2 className="w-4 h-4" />
                              <span className="text-sm font-medium">Comprado</span>
                            </div>
                          )}

                          {activeTab === 'not_found' && (
                            <>
                              <button
                                onClick={() => moveProduct(product.id, 'not_purchased')}
                                className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                                title="Voltar para lista"
                              >
                                <Search className="w-4 h-4" />
                              </button>
                              <div className="flex items-center gap-2 text-red-600">
                                <X className="w-4 h-4" />
                                <span className="text-sm font-medium">Não encontrado</span>
                              </div>
                            </>
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
          </>
        )}

        {currentStage === 'delivery' && (
          <div className="space-y-6">
            {/* Delivery Info Card */}
            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Navigation className="w-5 h-5 text-blue-600" />
                Informações de Entrega
              </h3>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Endereço de entrega:</p>
                  <p className="font-medium text-gray-800">{order.clienteEndereco}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600 mb-1">Código de finalização:</p>
                  <p className="font-bold text-xl text-blue-600 bg-blue-50 px-3 py-2 rounded-lg inline-block">
                    {order.codigoFinalizacao}
                  </p>
                </div>

                <button
                  onClick={openMaps}
                  className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-all flex items-center justify-center gap-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  Abrir no Google Maps
                </button>
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Package className="w-5 h-5 text-gray-600" />
                Resumo do Pedido
              </h3>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Itens comprados:</span>
                  <span className="font-medium">{getProductsByStatus('purchased').length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Itens não encontrados:</span>
                  <span className="font-medium text-red-600">{getProductsByStatus('not_found').length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Tempo total:</span>
                  <span className="font-medium">{getTotalOrderTime()}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {currentStage === 'summary' && (
          <div className="space-y-6">
            <div className="text-center">
              <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Pedido Finalizado!</h2>
              <p className="text-gray-600">Entrega realizada com sucesso</p>
            </div>

            {/* Final Summary */}
            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <h3 className="text-lg font-bold mb-4">Resumo Final</h3>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Pedido #:</span>
                  <span className="font-medium">{order.id}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Cliente:</span>
                  <span className="font-medium">{order.usuario}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Itens comprados:</span>
                  <span className="font-medium">{getProductsByStatus('purchased').length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Itens não encontrados:</span>
                  <span className="font-medium text-red-600">{getProductsByStatus('not_found').length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Tempo total:</span>
                  <span className="font-medium">{getTotalOrderTime()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Recompensa:</span>
                  <span className="font-bold text-green-600">R$ {order.recompensa.toFixed(2)}</span>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-800 text-center">
                  Redirecionando para a lista de pedidos em 5 segundos...
                </p>
              </div>
            </div>

            <button
              onClick={() => navigate('/orders')}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-all"
            >
              Fechar
            </button>
          </div>
        )}
      </div>

      {/* Fixed Bottom Actions */}
      {currentStage === 'shopping' && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 space-y-3">
          {getTotalSelected() > 0 && (
            <button
              onClick={() => setShowPayment(true)}
              className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-all flex items-center justify-center gap-2"
            >
              <CreditCard className="w-4 h-4" />
              Pagar {getTotalSelected()} itens
            </button>
          )}
          
          {getProductsByStatus('purchased').length > 0 && (
            <button
              onClick={() => setShowReceipt(true)}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
            >
              <Receipt className="w-4 h-4" />
              Enviar Comprovante
            </button>
          )}

          {canStartDelivery() && (
            <button
              onClick={handleStartDelivery}
              className="w-full bg-orange-600 text-white py-3 rounded-lg font-medium hover:bg-orange-700 transition-all flex items-center justify-center gap-2"
            >
              <Navigation className="w-4 h-4" />
              Iniciar Entrega
            </button>
          )}
        </div>
      )}

      {currentStage === 'delivery' && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
          <button
            onClick={handleFinishOrder}
            className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-all flex items-center justify-center gap-2"
          >
            <CheckCircle className="w-4 h-4" />
            Finalizar Entrega
          </button>
        </div>
      )}

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