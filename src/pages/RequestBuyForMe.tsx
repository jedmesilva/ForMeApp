
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ShoppingBag, Camera, Upload, FileText, MapPin, DollarSign, CreditCard, Check, Plus, Search, X, ListPlus } from "lucide-react";
import { useState } from "react";

interface Product {
  id: string;
  name: string;
  category: string;
  estimatedPrice: number;
  image: string;
}

interface CartItem extends Product {
  quantity: number;
}

export default function RequestBuyForMe() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [activeTab, setActiveTab] = useState<'select' | 'send'>('select');
  
  // Step 1 - Lista de compras
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [textList, setTextList] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Step 2 - Estabelecimentos
  const [selectedEstablishments, setSelectedEstablishments] = useState<string[]>([]);
  const [allowMultipleStores, setAllowMultipleStores] = useState(false);
  
  // Step 3 - Entrega e recompensa
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [observations, setObservations] = useState('');
  const [reward, setReward] = useState('');
  
  // Step 4 - Pagamento
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'balance' | 'pix'>('card');

  // Mock data para produtos
  const mockProducts: Product[] = [
    { id: '1', name: 'Leite Integral 1L', category: 'Laticínios', estimatedPrice: 4.50, image: '🥛' },
    { id: '2', name: 'Pão Francês 500g', category: 'Padaria', estimatedPrice: 3.20, image: '🥖' },
    { id: '3', name: 'Ovos 12 unidades', category: 'Laticínios', estimatedPrice: 8.90, image: '🥚' },
    { id: '4', name: 'Manteiga 500g', category: 'Laticínios', estimatedPrice: 12.50, image: '🧈' },
    { id: '5', name: 'Arroz 5kg', category: 'Grãos', estimatedPrice: 22.90, image: '🍚' },
    { id: '6', name: 'Feijão Preto 1kg', category: 'Grãos', estimatedPrice: 7.80, image: '🫘' },
    { id: '7', name: 'Banana Prata 1kg', category: 'Frutas', estimatedPrice: 5.90, image: '🍌' },
    { id: '8', name: 'Maçã Gala 1kg', category: 'Frutas', estimatedPrice: 8.50, image: '🍎' },
  ];

  const estabelecimentos = [
    { id: "mercado-x", nome: "Mercado X", logo: "🛒" },
    { id: "mercado-y", nome: "Mercado Y", logo: "🏪" },
    { id: "farmacia-z", nome: "Farmácia Z", logo: "💊" },
    { id: "padaria-a", nome: "Padaria do João", logo: "🥖" },
  ];

  const filteredProducts = mockProducts.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addToCart = (product: Product) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCartItems(prev => prev.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems(prev =>
      prev.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
    }
  };

  const processTextList = () => {
    const items = textList.split('\n').filter(item => item.trim());
    const newCartItems: CartItem[] = items.map((item, index) => ({
      id: `text-${index}`,
      name: item.trim(),
      category: 'Outros',
      estimatedPrice: 5.00,
      image: '📦',
      quantity: 1
    }));
    setCartItems(prev => [...prev, ...newCartItems]);
    setTextList('');
  };

  const getTotalEstimatedPrice = () => {
    return cartItems.reduce((total, item) => total + (item.estimatedPrice * item.quantity), 0);
  };

  const canProceedStep1 = () => cartItems.length > 0;
  const canProceedStep2 = () => selectedEstablishments.length > 0 || selectedEstablishments.includes('any');
  const canProceedStep3 = () => deliveryAddress.trim() !== '' && reward.trim() !== '';

  const handleSubmit = () => {
    const orderData = {
      items: cartItems,
      establishments: selectedEstablishments,
      allowMultipleStores,
      deliveryAddress,
      observations,
      reward: parseFloat(reward),
      paymentMethod,
      estimatedTotal: getTotalEstimatedPrice()
    };
    console.log('Pedido criado:', orderData);
    navigate(-1);
  };

  const nextStep = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate(-1)}
              className="p-2 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 transition-all"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-white flex items-center gap-2">
                <ShoppingBag className="w-6 h-6" />
                Criar Pedido de Compra
              </h1>
              <p className="text-blue-100 text-sm">
                Etapa {currentStep} de 4
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate('/create-shopping-list')}
            className="p-2 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 transition-all"
            title="Nova Lista Inteligente"
          >
            <ListPlus className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-white bg-opacity-20 rounded-full h-2">
          <div 
            className="bg-white h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / 4) * 100}%` }}
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 pb-24 space-y-6">
        {/* Step 1 - Lista de Compras */}
        {currentStep === 1 && (
          <>
            {/* Tabs */}
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex border-b border-gray-200 mb-4">
                <button
                  onClick={() => setActiveTab('select')}
                  className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                    activeTab === 'select' 
                      ? "bg-blue-50 text-blue-600 border-b-2 border-blue-600" 
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                >
                  Selecionar Produtos
                </button>
                <button
                  onClick={() => setActiveTab('send')}
                  className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                    activeTab === 'send' 
                      ? "bg-blue-50 text-blue-600 border-b-2 border-blue-600" 
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                >
                  Enviar Lista
                </button>
              </div>

              {activeTab === 'select' && (
                <div className="space-y-4">
                  {/* Search */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Buscar produtos..."
                    />
                  </div>

                  {/* Products Grid */}
                  <div className="grid grid-cols-1 gap-3 max-h-60 overflow-y-auto">
                    {filteredProducts.map((product) => (
                      <div 
                        key={product.id}
                        className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{product.image}</span>
                          <div>
                            <h3 className="font-medium text-gray-800">{product.name}</h3>
                            <p className="text-sm text-gray-500">{product.category}</p>
                            <p className="text-sm font-medium text-green-600">
                              R$ {product.estimatedPrice.toFixed(2)}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => addToCart(product)}
                          className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'send' && (
                <div className="space-y-4">
                  {/* Text List */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Digite sua lista (um item por linha)
                    </label>
                    <textarea
                      value={textList}
                      onChange={(e) => setTextList(e.target.value)}
                      className="w-full border rounded-lg p-3 h-24 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Ex:&#10;Leite 1L&#10;Pão francês&#10;Ovos 12un"
                    />
                    <button
                      onClick={processTextList}
                      disabled={!textList.trim()}
                      className="mt-2 w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      Adicionar à Lista
                    </button>
                  </div>

                  {/* Camera Upload */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Ou tire uma foto da lista
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      capture="environment"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="camera-upload"
                    />
                    <label htmlFor="camera-upload">
                      <button
                        type="button"
                        className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-all flex items-center justify-center gap-2"
                      >
                        <Camera className="w-5 h-5" />
                        {imageFile ? `Foto selecionada: ${imageFile.name}` : 'Tirar foto da lista'}
                      </button>
                    </label>
                  </div>
                </div>
              )}
            </div>

            {/* Cart */}
            {cartItems.length > 0 && (
              <div className="bg-white rounded-xl p-4 shadow-sm">
                <h3 className="font-semibold mb-3">
                  Itens no Carrinho ({cartItems.length})
                </h3>
                <div className="space-y-3 max-h-40 overflow-y-auto">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{item.image}</span>
                        <div>
                          <p className="font-medium text-sm">{item.name}</p>
                          <p className="text-xs text-gray-500">R$ {item.estimatedPrice.toFixed(2)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-6 h-6 bg-gray-200 rounded text-gray-600 hover:bg-gray-300 transition-colors"
                        >
                          -
                        </button>
                        <span className="text-sm font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-6 h-6 bg-gray-200 rounded text-gray-600 hover:bg-gray-300 transition-colors"
                        >
                          +
                        </button>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="w-6 h-6 bg-red-100 rounded text-red-600 hover:bg-red-200 transition-colors ml-2 flex items-center justify-center"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <p className="font-semibold text-right">
                    Total Estimado: R$ {getTotalEstimatedPrice().toFixed(2)}
                  </p>
                </div>
              </div>
            )}
          </>
        )}

        {/* Step 2 - Estabelecimentos */}
        {currentStep === 2 && (
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <h3 className="font-semibold mb-4">Selecione os Estabelecimentos</h3>
            
            <div className="space-y-3">
              <div
                className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                  selectedEstablishments.includes('any')
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedEstablishments(['any'])}
              >
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full border-2 border-current flex items-center justify-center">
                    {selectedEstablishments.includes('any') && <Check className="w-3 h-3" />}
                  </div>
                  <span className="font-medium">Qualquer estabelecimento</span>
                </div>
              </div>

              <p className="text-sm text-gray-600 text-center">ou selecione específicos:</p>

              {estabelecimentos.map((est) => (
                <div
                  key={est.id}
                  className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                    selectedEstablishments.includes(est.id)
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => {
                    setSelectedEstablishments(prev => {
                      if (prev.includes('any')) return [est.id];
                      if (prev.includes(est.id)) {
                        return prev.filter(id => id !== est.id);
                      }
                      return [...prev, est.id];
                    });
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full border-2 border-current flex items-center justify-center">
                      {selectedEstablishments.includes(est.id) && <Check className="w-3 h-3" />}
                    </div>
                    <span className="text-2xl">{est.logo}</span>
                    <span className="font-medium">{est.nome}</span>
                  </div>
                </div>
              ))}
            </div>

            {selectedEstablishments.length > 1 && !selectedEstablishments.includes('any') && (
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={allowMultipleStores}
                    onChange={(e) => setAllowMultipleStores(e.target.checked)}
                    className="rounded"
                  />
                  <span className="text-sm">
                    Permitir comprar em estabelecimentos diferentes
                  </span>
                </label>
              </div>
            )}
          </div>
        )}

        {/* Step 3 - Entrega e Observações */}
        {currentStep === 3 && (
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <h3 className="font-semibold mb-4">Entrega e Recompensa</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  <MapPin className="w-4 h-4 inline mr-1" />
                  Endereço de Entrega *
                </label>
                <input
                  type="text"
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Rua, número, bairro, CEP..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  <DollarSign className="w-4 h-4 inline mr-1" />
                  Recompensa (R$) *
                </label>
                <input
                  type="number"
                  value={reward}
                  onChange={(e) => setReward(e.target.value)}
                  className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="15.00"
                  min="1"
                  step="0.01"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Observações</label>
                <textarea
                  value={observations}
                  onChange={(e) => setObservations(e.target.value)}
                  className="w-full border rounded-lg p-3 h-20 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Instruções especiais, quem irá receber, marcas preferidas, etc..."
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 4 - Resumo e Pagamento */}
        {currentStep === 4 && (
          <div className="space-y-6">
            {/* Resumo do Pedido */}
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <h3 className="font-semibold mb-4">Resumo do Pedido</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Itens ({cartItems.length})</span>
                  <span>R$ {getTotalEstimatedPrice().toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Recompensa</span>
                  <span>R$ {parseFloat(reward || '0').toFixed(2)}</span>
                </div>
                <div className="border-t pt-2">
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total Estimado</span>
                    <span>R$ {(getTotalEstimatedPrice() + parseFloat(reward || '0')).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Forma de Pagamento */}
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <h3 className="font-semibold mb-4">Forma de Pagamento</h3>
              
              <div className="space-y-3">
                {[
                  { id: 'card', label: 'Cartão de Crédito/Débito', icon: '💳' },
                  { id: 'balance', label: 'Saldo no App', icon: '💰' },
                  { id: 'pix', label: 'PIX', icon: '📱' }
                ].map((method) => (
                  <div
                    key={method.id}
                    className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                      paymentMethod === method.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setPaymentMethod(method.id as any)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full border-2 border-current flex items-center justify-center">
                        {paymentMethod === method.id && <Check className="w-3 h-3" />}
                      </div>
                      <span className="text-xl">{method.icon}</span>
                      <span className="font-medium">{method.label}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-700">
                  💡 O valor será retido em seu {paymentMethod === 'card' ? 'cartão' : paymentMethod === 'balance' ? 'saldo' : 'PIX'} 
                  e cobrado apenas após a confirmação da entrega.
                </p>
              </div>
            </div>
          </div>
        )}

        </div>

      {/* Fixed Navigation Buttons */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
        <div className="flex gap-3">
          {currentStep > 1 && (
            <button
              onClick={prevStep}
              className="flex-1 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-all"
            >
              Voltar
            </button>
          )}
          
          {currentStep < 4 ? (
            <button
              onClick={nextStep}
              disabled={
                (currentStep === 1 && !canProceedStep1()) ||
                (currentStep === 2 && !canProceedStep2()) ||
                (currentStep === 3 && !canProceedStep3())
              }
              className="flex-1 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Próximo
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="flex-1 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-all transform hover:scale-105 flex items-center justify-center gap-2"
            >
              <Check className="w-4 h-4" />
              Enviar Pedido
            </button>
          )}
          
          {currentStep === 1 && (
            <button
              onClick={() => navigate(-1)}
              className="flex-1 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-all"
            >
              Cancelar
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
