import React, { useState, useRef, useEffect } from 'react';
import { Search, Mic, Camera, FileText, Plus, MapPin, ShoppingCart, X, Check, Minus } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  quantity: number;
}

interface Store {
  id: string;
  name: string;
  address: string;
  logo: string;
}

interface ShoppingListCreatorProps {
  onSave?: (products: Product[], selectedStore: string) => void;
  onCancel?: () => void;
}

const ShoppingListCreator: React.FC<ShoppingListCreatorProps> = ({ onSave, onCancel }) => {
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
  const [highlightedProducts, setHighlightedProducts] = useState<Set<string>>(new Set());
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Mock data para demonstração
  const stores: Store[] = [
    { id: '1', name: 'Supermercado Extra', address: 'Rua das Flores, 123', logo: '🛒' },
    { id: '2', name: 'Carrefour', address: 'Av. Paulista, 456', logo: '🏪' },
    { id: '3', name: 'Pão de Açúcar', address: 'Rua Augusta, 789', logo: '🏬' },
    { id: '4', name: 'Padaria do João', address: 'Rua das Palmeiras, 321', logo: '🥖' }
  ];

  const mockProducts = [
    'Arroz branco 5kg', 'Feijão preto 1kg', 'Açúcar cristal 1kg', 'Óleo de soja 900ml',
    'Leite integral 1L', 'Ovos brancos dúzia', 'Pão de forma integral', 'Manteiga sem sal',
    'Queijo mussarela fatiado', 'Presunto magro fatiado', 'Banana prata kg', 'Maçã gala kg',
    'Tomate italiano kg', 'Cebola branca kg', 'Alho roxo kg', 'Batata inglesa kg',
    'Frango inteiro kg', 'Carne moída kg', 'Peixe tilápia kg', 'Iogurte natural',
    'Detergente neutro', 'Sabão em pó', 'Papel higiênico 12 rolos', 'Shampoo anticaspa',
    'Café em pó 500g', 'Biscoito recheado', 'Refrigerante 2L', 'Água mineral 1,5L'
  ];

  // Função para filtrar sugestões
  const filterSuggestions = (query: string) => {
    if (!query.trim()) return [];
    return mockProducts.filter(product => 
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

  // Processar texto para destacar produtos
  const processTextForHighlighting = (text: string) => {
    const lines = text.split('\n');
    const highlighted = new Set<string>();
    
    lines.forEach((line, index) => {
      const trimmed = line.trim();
      if (trimmed) {
        const foundProduct = mockProducts.find(product => 
          product.toLowerCase().includes(trimmed.toLowerCase()) ||
          trimmed.toLowerCase().includes(product.toLowerCase().split(' ')[0])
        );
        if (foundProduct) {
          highlighted.add(`line-${index}`);
        }
      }
    });
    
    setHighlightedProducts(highlighted);
  };

  // Adicionar produto à lista
  const addProduct = (productName: string) => {
    const existingProduct = selectedProducts.find(p => p.name === productName);
    if (existingProduct) {
      setSelectedProducts(prev => prev.map(p => 
        p.name === productName ? { ...p, quantity: p.quantity + 1 } : p
      ));
    } else {
      const newProduct: Product = {
        id: Date.now().toString(),
        name: productName,
        category: 'Geral',
        price: Math.random() * 20 + 5, // Preço aleatório para demonstração
        quantity: 1
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

  // Lidar com tecla Enter na busca
  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && suggestions.length > 0) {
      e.preventDefault();
      addProduct(suggestions[selectedSuggestion]);
      setSearchQuery('');
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
  };

  // Lidar com teclas no textarea
  const handleTextKeyDown = (e: React.KeyboardEvent) => {
    if (suggestions.length > 0) {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        const lines = textInput.split('\n');
        lines[lines.length - 1] = suggestions[selectedSuggestion];
        const newText = lines.join('\n') + '\n';
        setTextInput(newText);
        processTextForHighlighting(newText);
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
          const foundProduct = mockProducts.find(product => 
            product.toLowerCase().includes(trimmed.toLowerCase()) ||
            trimmed.toLowerCase().includes(product.toLowerCase().split(' ')[0])
          ) || trimmed;
          addProduct(foundProduct);
        }
      });
      setTextInput('');
      setHighlightedProducts(new Set());
    }
  };

  // Simular gravação de áudio
  const toggleRecording = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      setTimeout(() => {
        setAudioTranscript('Preciso de leite, pão, ovos e queijo para o café da manhã');
        setIsRecording(false);
      }, 3000);
    }
  };

  // Processar áudio transcrito
  const processAudio = () => {
    if (audioTranscript) {
      const items = audioTranscript.replace(/,/g, '\n').split('\n');
      items.forEach(item => {
        const trimmed = item.trim();
        if (trimmed) {
          const foundProduct = mockProducts.find(product => 
            product.toLowerCase().includes(trimmed.toLowerCase())
          ) || trimmed;
          addProduct(foundProduct);
        }
      });
      setAudioTranscript('');
    }
  };

  // Lidar com upload de imagem
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setUploadedImage(result);
        
        // Simular OCR
        setTimeout(() => {
          const mockExtractedText = 'Leite\nPão\nQueijo\nPresunto\nTomate';
          const items = mockExtractedText.split('\n');
          items.forEach(item => addProduct(item.trim()));
          setUploadedImage(null);
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
            <div className="flex items-center space-x-2 bg-white rounded-xl px-4 py-3 shadow-sm border border-gray-200">
              <Search className="w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar produtos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearchKeyDown}
                className="flex-1 outline-none text-gray-700 placeholder-gray-400"
              />
            </div>
            
            {suggestions.length > 0 && (
              <div className="absolute bottom-full left-0 right-0 mb-2 bg-white rounded-xl shadow-lg border border-gray-200 max-h-48 overflow-y-auto z-10">
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
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <span className="font-medium text-gray-700">Gravação de Áudio</span>
              <button
                onClick={toggleRecording}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  isRecording 
                    ? 'bg-red-500 text-white' 
                    : 'bg-blue-500 text-white hover:bg-blue-600'
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
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
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
                className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 transition-colors"
              >
                <Camera className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600">Tirar foto ou enviar imagem</p>
                <p className="text-sm text-gray-400 mt-1">da sua lista de compras</p>
              </button>
              
              {uploadedImage && (
                <div className="mt-3">
                  <img src={uploadedImage} alt="Lista enviada" className="w-full h-32 object-cover rounded-lg" />
                  <p className="text-sm text-blue-600 mt-2">Processando imagem...</p>
                </div>
              )}
            </div>
          </div>
        );

      case 'text':
        return (
          <div className="relative">
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
              <textarea
                ref={textareaRef}
                value={textInput}
                onChange={(e) => {
                  setTextInput(e.target.value);
                  processTextForHighlighting(e.target.value);
                }}
                onKeyDown={handleTextKeyDown}
                placeholder="Digite sua lista de compras (um item por linha)"
                className="w-full h-24 outline-none resize-none text-gray-700 placeholder-gray-400"
              />
              <button
                onClick={handleTextSubmit}
                disabled={!textInput.trim()}
                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-blue-600 transition-colors"
              >
                Adicionar à Lista
              </button>
            </div>
            
            {suggestions.length > 0 && (
              <div className="absolute bottom-full left-0 right-0 mb-2 bg-white rounded-xl shadow-lg border border-gray-200 max-h-48 overflow-y-auto z-10">
                {suggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    className={`px-4 py-3 cursor-pointer transition-colors ${
                      index === selectedSuggestion ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'
                    }`}
                    onClick={() => {
                      const lines = textInput.split('\n');
                      lines[lines.length - 1] = suggestion;
                      const newText = lines.join('\n') + '\n';
                      setTextInput(newText);
                      processTextForHighlighting(newText);
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-800">Lista de Compras</h1>
            <div className="flex gap-2">
              {onCancel && (
                <button
                  onClick={onCancel}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Cancelar
                </button>
              )}
              <button
                onClick={() => onSave?.(selectedProducts, selectedStore)}
                disabled={selectedProducts.length === 0}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Salvar Lista
              </button>
            </div>
          </div>
          
          {/* Seleção de Estabelecimento */}
          <div className="flex items-center space-x-2 bg-gray-50 rounded-xl px-4 py-3">
            <MapPin className="w-5 h-5 text-gray-400" />
            <select
              value={selectedStore}
              onChange={(e) => setSelectedStore(e.target.value)}
              className="flex-1 bg-transparent outline-none text-gray-700"
            >
              <option value="">Selecione o estabelecimento</option>
              {stores.map(store => (
                <option key={store.id} value={store.id}>
                  {store.name} - {store.address}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Lista de Produtos */}
      <div className="flex-1 px-4 py-4 pb-52 overflow-y-auto">
        {selectedProducts.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <ShoppingCart className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Sua lista está vazia</p>
            <p className="text-sm">Comece adicionando produtos usando as opções abaixo</p>
          </div>
        ) : (
          <div className="space-y-2">
            {selectedProducts.map(product => (
              <div
                key={product.id}
                className="bg-white rounded-xl p-4 shadow-sm border border-gray-200"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 flex-1">
                    <span className="font-medium text-gray-800">{product.name}</span>
                    <div className="flex items-center space-x-1 bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                      <span>{product.quantity}</span>
                      <button
                        onClick={() => {
                          // Aqui poderia abrir um modal para editar quantidade
                          const newQuantity = prompt('Nova quantidade:', product.quantity.toString());
                          if (newQuantity && !isNaN(Number(newQuantity))) {
                            updateQuantity(product.id, Number(newQuantity));
                          }
                        }}
                        className="ml-1 text-blue-600 hover:text-blue-800"
                      >
                        •
                      </button>
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
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
        {/* Área de Conteúdo Dinâmico */}
        <div className="px-4 py-4">
          {renderTabContent()}
        </div>
        
        {/* Botões de Navegação */}
        <div className="flex items-center justify-around px-4 py-3 bg-gray-50 border-t border-gray-200">
          <button
            onClick={() => setActiveTab('search')}
            className={`flex flex-col items-center space-y-1 px-4 py-2 rounded-xl transition-colors ${
              activeTab === 'search' 
                ? 'bg-blue-500 text-white' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Search className="w-5 h-5" />
            <span className="text-xs font-medium">Procurar</span>
          </button>
          
          <button
            onClick={() => setActiveTab('audio')}
            className={`flex flex-col items-center space-y-1 px-4 py-2 rounded-xl transition-colors ${
              activeTab === 'audio' 
                ? 'bg-blue-500 text-white' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Mic className="w-5 h-5" />
            <span className="text-xs font-medium">Áudio</span>
          </button>
          
          <button
            onClick={() => setActiveTab('photo')}
            className={`flex flex-col items-center space-y-1 px-4 py-2 rounded-xl transition-colors ${
              activeTab === 'photo' 
                ? 'bg-blue-500 text-white' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Camera className="w-5 h-5" />
            <span className="text-xs font-medium">Foto</span>
          </button>
          
          <button
            onClick={() => setActiveTab('text')}
            className={`flex flex-col items-center space-y-1 px-4 py-2 rounded-xl transition-colors ${
              activeTab === 'text' 
                ? 'bg-blue-500 text-white' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <FileText className="w-5 h-5" />
            <span className="text-xs font-medium">Texto</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShoppingListCreator;