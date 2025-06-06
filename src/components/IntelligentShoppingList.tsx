import React, { useState, useRef, useEffect } from 'react';
import { Search, Mic, Camera, FileText, Plus, MapPin, ShoppingCart, X, Minus, ArrowLeft } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  quantity: number;
  addedBy: 'search' | 'text' | 'audio' | 'photo';
}

interface Store {
  id: string;
  name: string;
  address: string;
}

interface IntelligentShoppingListProps {
  onSave?: (products: Product[], selectedStore: string) => void;
  onCancel?: () => void;
  availableStores?: Store[];
}

const IntelligentShoppingList: React.FC<IntelligentShoppingListProps> = ({ 
  onSave, 
  onCancel, 
  availableStores = [] 
}) => {
  const [selectedStore, setSelectedStore] = useState('');
  const [activeTab, setActiveTab] = useState<'search' | 'audio' | 'photo' | 'text'>('search');
  const [searchQuery, setSearchQuery] = useState('');
  const [textInput, setTextInput] = useState('');
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [selectedSuggestion, setSelectedSuggestion] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [audioTranscript, setAudioTranscript] = useState('');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isProcessingImage, setIsProcessingImage] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Lista básica de produtos comuns para sugestões
  const commonProducts = [
    'Arroz', 'Feijão', 'Açúcar', 'Óleo', 'Leite', 'Ovos', 'Pão', 'Manteiga',
    'Queijo', 'Presunto', 'Banana', 'Maçã', 'Tomate', 'Cebola', 'Alho', 'Batata',
    'Frango', 'Carne moída', 'Peixe', 'Iogurte', 'Detergente', 'Sabão', 'Papel higiênico'
  ];

  // Filtrar sugestões baseadas na entrada do usuário
  const filterSuggestions = (query: string) => {
    if (!query.trim()) return [];
    return commonProducts.filter(product => 
      product.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 6);
  };

  // Atualizar sugestões quando a query mudar
  useEffect(() => {
    if (activeTab === 'search') {
      const filtered = filterSuggestions(searchQuery);
      setSuggestions(filtered);
      setSelectedSuggestion(0);
    } else if (activeTab === 'text') {
      const lines = textInput.split('\n');
      const lastLine = lines[lines.length - 1];
      if (lastLine.trim()) {
        const filtered = filterSuggestions(lastLine);
        setSuggestions(filtered);
        setSelectedSuggestion(0);
      } else {
        setSuggestions([]);
      }
    }
  }, [searchQuery, textInput, activeTab]);

  // Adicionar produto à lista
  const addProduct = (productName: string, addedBy: Product['addedBy'] = 'search') => {
    const existingProduct = selectedProducts.find(p => p.name.toLowerCase() === productName.toLowerCase());
    if (existingProduct) {
      setSelectedProducts(prev => prev.map(p => 
        p.name.toLowerCase() === productName.toLowerCase() 
          ? { ...p, quantity: p.quantity + 1 } 
          : p
      ));
    } else {
      const newProduct: Product = {
        id: Date.now().toString(),
        name: productName.trim(),
        quantity: 1,
        addedBy
      };
      setSelectedProducts(prev => [...prev, newProduct]);
    }
  };

  // Remover produto da lista
  const removeProduct = (id: string) => {
    setSelectedProducts(prev => prev.filter(p => p.id !== id));
  };

  // Atualizar quantidade do produto
  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeProduct(id);
      return;
    }
    setSelectedProducts(prev => prev.map(p => 
      p.id === id ? { ...p, quantity: newQuantity } : p
    ));
  };

  // Navegação com teclado para sugestões
  const handleKeyDown = (e: React.KeyboardEvent, isTextArea = false) => {
    if (suggestions.length > 0) {
      if (e.key === 'Enter' && !isTextArea) {
        e.preventDefault();
        addProduct(suggestions[selectedSuggestion]);
        setSearchQuery('');
        setSuggestions([]);
      } else if (e.key === 'Enter' && isTextArea && !e.shiftKey) {
        e.preventDefault();
        const lines = textInput.split('\n');
        lines[lines.length - 1] = suggestions[selectedSuggestion];
        setTextInput(lines.join('\n') + '\n');
        setSuggestions([]);
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedSuggestion(prev => 
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedSuggestion(prev => 
          prev > 0 ? prev - 1 : suggestions.length - 1
        );
      }
    }
  };

  // Processar lista de texto
  const handleTextSubmit = () => {
    if (textInput.trim()) {
      const lines = textInput.split('\n').filter(line => line.trim());
      lines.forEach(line => {
        const trimmed = line.trim();
        if (trimmed) {
          addProduct(trimmed, 'text');
        }
      });
      setTextInput('');
    }
  };

  // Simular gravação de áudio (aqui seria integrado com API de speech-to-text)
  const toggleRecording = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      // Simular início da gravação
      setTimeout(() => {
        setAudioTranscript('Leite, pão, ovos e queijo');
        setIsRecording(false);
      }, 3000);
    }
  };

  // Processar áudio transcrito
  const processAudio = () => {
    if (audioTranscript) {
      const items = audioTranscript.split(/[,\s]+/).filter(item => item.trim());
      items.forEach(item => {
        if (item.trim()) {
          addProduct(item.trim(), 'audio');
        }
      });
      setAudioTranscript('');
    }
  };

  // Upload e processamento de imagem
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setUploadedImage(result);
        setIsProcessingImage(true);

        // Simular processamento OCR (aqui seria integrado com API de OCR)
        setTimeout(() => {
          const extractedItems = ['Leite', 'Pão', 'Queijo', 'Presunto'];
          extractedItems.forEach(item => addProduct(item, 'photo'));
          setUploadedImage(null);
          setIsProcessingImage(false);
        }, 2000);
      };
      reader.readAsDataURL(file);
    }
  };

  // Renderizar conteúdo da aba ativa
  const renderTabContent = () => {
    switch (activeTab) {
      case 'search':
        return (
          <div className="relative">
            <div className="flex items-center space-x-2 bg-white rounded-xl px-4 py-3 shadow-sm">
              <Search className="w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar produtos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => handleKeyDown(e)}
                className="flex-1 outline-none text-gray-700 placeholder-gray-400"
              />
            </div>

            {suggestions.length > 0 && (
              <div className="absolute bottom-full left-0 right-0 mb-2 bg-white rounded-xl shadow-lg max-h-48 overflow-y-auto z-10">
                {suggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    className={`px-4 py-3 cursor-pointer transition-colors ${
                      index === selectedSuggestion ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'
                    }`}
                    onClick={() => {
                      addProduct(suggestion);
                      setSearchQuery('');
                      setSuggestions([]);
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{suggestion}</span>
                      <Plus className="w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case 'audio':
        return (
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="font-medium text-gray-700">Gravação de Áudio</span>
              <button
                onClick={toggleRecording}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  isRecording 
                    ? 'bg-red-500 text-white' 
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {isRecording ? 'Parar' : 'Gravar'}
              </button>
            </div>

            {isRecording && (
              <div className="flex items-center space-x-2 text-red-500 mb-3">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-sm">Gravando...</span>
              </div>
            )}

            {audioTranscript && (
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">Transcrição:</p>
                <p className="text-gray-800 mb-3">{audioTranscript}</p>
                <button
                  onClick={processAudio}
                  className="px-3 py-1 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600 transition-colors"
                >
                  Adicionar à Lista
                </button>
              </div>
            )}
          </div>
        );

      case 'photo':
        return (
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="text-center">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                ref={fileInputRef}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 transition-colors"
                disabled={isProcessingImage}
              >
                <Camera className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600 font-medium">Tirar foto ou enviar imagem</p>
                <p className="text-sm text-gray-400 mt-1">da sua lista de compras</p>
              </button>

              {uploadedImage && (
                <div className="mt-3">
                  <img src={uploadedImage} alt="Lista enviada" className="w-full h-32 object-cover rounded-lg" />
                  <p className="text-sm text-blue-600 mt-2">
                    {isProcessingImage ? 'Processando imagem...' : 'Imagem processada!'}
                  </p>
                </div>
              )}
            </div>
          </div>
        );

      case 'text':
        return (
          <div className="relative">
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <textarea
                ref={textareaRef}
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, true)}
                placeholder="Digite sua lista de compras (um item por linha)"
                className="w-full h-24 outline-none resize-none text-gray-700 placeholder-gray-400"
              />
              <button
                onClick={handleTextSubmit}
                disabled={!textInput.trim()}
                className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
              >
                Adicionar à Lista
              </button>
            </div>

            {suggestions.length > 0 && (
              <div className="absolute bottom-full left-0 right-0 mb-2 bg-white rounded-xl shadow-lg max-h-48 overflow-y-auto z-10">
                {suggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    className={`px-4 py-3 cursor-pointer transition-colors ${
                      index === selectedSuggestion ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'
                    }`}
                    onClick={() => {
                      const lines = textInput.split('\n');
                      lines[lines.length - 1] = suggestion;
                      setTextInput(lines.join('\n') + '\n');
                      setSuggestions([]);
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{suggestion}</span>
                      <Plus className="w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            {onCancel && (
              <button 
                onClick={onCancel}
                className="p-2 rounded-lg bg-white bg-opacity-10 backdrop-blur-sm hover:bg-opacity-20 transition-all"
              >
                <ArrowLeft className="w-5 h-5 text-white" />
              </button>
            )}
            <div>
              <h1 className="text-white text-xl font-bold flex items-center gap-2">
                <ShoppingCart className="w-6 h-6" />
                Lista de Compras Inteligente
              </h1>
              <p className="text-blue-100 text-sm">
                {selectedProducts.length} {selectedProducts.length === 1 ? 'item' : 'itens'} adicionados
              </p>
            </div>
          </div>
          <button
            onClick={() => onSave?.(selectedProducts, selectedStore)}
            disabled={selectedProducts.length === 0}
            className="px-4 py-2 bg-white text-blue-700 rounded-lg font-medium hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Salvar
          </button>
        </div>

        {/* Seleção de Estabelecimento */}
        <div className="flex items-center space-x-2 bg-white bg-opacity-10 backdrop-blur-sm rounded-xl px-4 py-3">
          <MapPin className="w-5 h-5 text-white" />
          <select
            value={selectedStore}
            onChange={(e) => setSelectedStore(e.target.value)}
            className="flex-1 bg-transparent outline-none text-white"
          >
            <option value="" className="text-gray-800">Selecione o estabelecimento</option>
            {availableStores.map(store => (
              <option key={store.id} value={store.id} className="text-gray-800">
                {store.name} - {store.address}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Lista de Produtos */}
      <div className="flex-1 px-4 py-4 pb-52 overflow-y-auto">
        {selectedProducts.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <ShoppingCart className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p className="font-medium">Sua lista está vazia</p>
            <p className="text-sm">Comece adicionando produtos usando as opções abaixo</p>
          </div>
        ) : (
          <div className="space-y-3">
            {selectedProducts.map(product => (
              <div
                key={product.id}
                className="bg-white rounded-xl p-4 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 flex-1">
                    <span className="font-medium text-gray-800">{product.name}</span>
                    <div className="flex items-center space-x-1 bg-blue-50 text-blue-600 px-2 py-1 rounded-full text-xs">
                      <span>{product.quantity}</span>
                      <span className="text-gray-400">•</span>
                      <span className="text-xs opacity-70">{product.addedBy}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => updateQuantity(product.id, product.quantity - 1)}
                      className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => updateQuantity(product.id, product.quantity + 1)}
                      className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => removeProduct(product.id)}
                      className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center text-red-600 hover:bg-red-200 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Interface Fixa Inferior */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg max-w-full">
        {/* Área de Conteúdo Dinâmico */}
        <div className="px-2 sm:px-4 py-2 sm:py-4">
          {renderTabContent()}
        </div>

        {/* Botões de Navegação */}
        <div className="flex items-center justify-around px-2 sm:px-4 py-2 sm:py-3 bg-gray-50 border-t">
          <button
            onClick={() => setActiveTab('search')}
            className={`flex flex-col items-center py-1 sm:py-2 px-1 sm:px-3 rounded-lg transition-all transform hover:scale-105 min-w-0 flex-1 max-w-[80px] sm:max-w-none ${
              activeTab === 'search' 
                ? 'bg-blue-50 text-blue-600 shadow-sm' 
                : 'text-gray-600'
            }`}
          >
            <Search className="w-4 h-4 sm:w-5 sm:h-5 mb-0.5 sm:mb-1" />
            <span className="text-[10px] sm:text-xs font-medium leading-tight">Procurar</span>
          </button>

          <button
            onClick={() => setActiveTab('audio')}
            className={`flex flex-col items-center py-1 sm:py-2 px-1 sm:px-3 rounded-lg transition-all transform hover:scale-105 min-w-0 flex-1 max-w-[80px] sm:max-w-none ${
              activeTab === 'audio' 
                ? 'bg-blue-50 text-blue-600 shadow-sm' 
                : 'text-gray-600'
            }`}
          >
            <Mic className="w-4 h-4 sm:w-5 sm:h-5 mb-0.5 sm:mb-1" />
            <span className="text-[10px] sm:text-xs font-medium leading-tight">Áudio</span>
          </button>

          <button
            onClick={() => setActiveTab('photo')}
            className={`flex flex-col items-center py-1 sm:py-2 px-1 sm:px-3 rounded-lg transition-all transform hover:scale-105 min-w-0 flex-1 max-w-[80px] sm:max-w-none ${
              activeTab === 'photo' 
                ? 'bg-blue-50 text-blue-600 shadow-sm' 
                : 'text-gray-600'
            }`}
          >
            <Camera className="w-4 h-4 sm:w-5 sm:h-5 mb-0.5 sm:mb-1" />
            <span className="text-[10px] sm:text-xs font-medium leading-tight">Foto</span>
          </button>

          <button
            onClick={() => setActiveTab('text')}
            className={`flex flex-col items-center py-1 sm:py-2 px-1 sm:px-3 rounded-lg transition-all transform hover:scale-105 min-w-0 flex-1 max-w-[80px] sm:max-w-none ${
              activeTab === 'text' 
                ? 'bg-blue-50 text-blue-600 shadow-sm' 
                : 'text-gray-600'
            }`}
          >
            <FileText className="w-4 h-4 sm:w-5 sm:h-5 mb-0.5 sm:mb-1" />
            <span className="text-[10px] sm:text-xs font-medium leading-tight">Texto</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default IntelligentShoppingList;