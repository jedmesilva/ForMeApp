
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ShoppingBag, Camera, Sparkles, FileText, MapPin, DollarSign, Clock } from "lucide-react";
import { useState } from "react";

export default function CreatePurchaseRequest() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<'manual' | 'ai'>('manual');
  const [aiInput, setAiInput] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const [formData, setFormData] = useState({
    items: '',
    establishment: '',
    address: '',
    reward: '',
    urgency: 'Média',
    observations: ''
  });

  const estabelecimentos = [
    { id: "mercado-x", nome: "Mercado X", logo: "🛒" },
    { id: "mercado-y", nome: "Mercado Y", logo: "🏪" },
    { id: "farmacia-z", nome: "Farmácia Z", logo: "💊" },
    { id: "padaria-a", nome: "Padaria do João", logo: "🥖" },
  ];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
    }
  };

  const processWithAI = async () => {
    if (!aiInput && !imageFile) return;
    
    setIsProcessing(true);
    
    setTimeout(() => {
      setFormData({
        ...formData,
        items: 'Leite integral 1L, Pão francês 500g, Ovos 12un, Manteiga 500g',
        establishment: 'mercado-x',
        observations: 'Gerado automaticamente pela IA com base na sua solicitação'
      });
      setIsProcessing(false);
      setMode('manual');
    }, 2000);
  };

  const handleSubmit = () => {
    console.log('Pedido de compra:', formData);
    navigate(-1);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-6">
        <div className="flex items-center gap-3 mb-4">
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
              Descreva os itens que precisa comprar
            </p>
          </div>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="flex-1 p-4 space-y-6">
        {/* Seletor de Modo */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <h3 className="font-semibold mb-3">Como você quer criar?</h3>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setMode('manual')}
              className={`p-4 rounded-lg border-2 transition-all ${
                mode === 'manual' 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <FileText className="w-6 h-6 mx-auto mb-2 text-blue-600" />
              <div className="text-sm font-medium">Manual</div>
              <div className="text-xs text-gray-500">Preencha os campos</div>
            </button>
            
            <button
              onClick={() => setMode('ai')}
              className={`p-4 rounded-lg border-2 transition-all ${
                mode === 'ai' 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <Sparkles className="w-6 h-6 mx-auto mb-2 text-purple-600" />
              <div className="text-sm font-medium">Com IA</div>
              <div className="text-xs text-gray-500">Texto ou foto</div>
            </button>
          </div>
        </div>

        {/* Modo IA */}
        {mode === 'ai' && (
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-600" />
              Assistente IA para Compras
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Descreva o que você precisa comprar
                </label>
                <textarea
                  value={aiInput}
                  onChange={(e) => setAiInput(e.target.value)}
                  className="w-full border rounded-lg p-3 h-24 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ex: Preciso de ingredientes para fazer um bolo de chocolate"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Ou envie uma foto da lista de compras
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <label htmlFor="image-upload" className="cursor-pointer">
                    <Camera className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                    <p className="text-sm text-gray-600">
                      {imageFile ? imageFile.name : 'Clique para enviar uma foto da lista'}
                    </p>
                  </label>
                </div>
              </div>

              <button
                onClick={processWithAI}
                disabled={(!aiInput && !imageFile) || isProcessing}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Processando...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Gerar Lista com IA
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Formulário Manual */}
        {mode === 'manual' && (
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <ShoppingBag className="w-5 h-5" />
              Detalhes do Pedido de Compra
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Lista de Itens *
                </label>
                <textarea
                  value={formData.items}
                  onChange={(e) => setFormData({...formData, items: e.target.value})}
                  className="w-full border rounded-lg p-3 h-24 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ex: Leite 1L, Pão francês, Ovos 12un, Manteiga 500g..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  <ShoppingBag className="w-4 h-4 inline mr-1" />
                  Estabelecimento Preferido
                </label>
                <select 
                  value={formData.establishment}
                  onChange={(e) => setFormData({...formData, establishment: e.target.value})}
                  className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Qualquer estabelecimento</option>
                  {estabelecimentos.map((est) => (
                    <option key={est.id} value={est.id}>
                      {est.logo} {est.nome}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  <MapPin className="w-4 h-4 inline mr-1" />
                  Endereço de Entrega *
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Rua, número, bairro..."
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    <DollarSign className="w-4 h-4 inline mr-1" />
                    Recompensa (R$) *
                  </label>
                  <input
                    type="number"
                    value={formData.reward}
                    onChange={(e) => setFormData({...formData, reward: e.target.value})}
                    className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="10.00"
                    min="1"
                    step="0.01"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    <Clock className="w-4 h-4 inline mr-1" />
                    Urgência
                  </label>
                  <select 
                    value={formData.urgency}
                    onChange={(e) => setFormData({...formData, urgency: e.target.value})}
                    className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option>Baixa</option>
                    <option>Média</option>
                    <option>Alta</option>
                    <option>Muito Alta</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Observações</label>
                <textarea
                  value={formData.observations}
                  onChange={(e) => setFormData({...formData, observations: e.target.value})}
                  className="w-full border rounded-lg p-3 h-16 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Instruções especiais, marcas preferidas, etc..."
                />
              </div>
            </div>
          </div>
        )}

        {/* Botões de Ação */}
        <div className="flex gap-3 pb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex-1 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-all"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-all transform hover:scale-105"
          >
            Publicar Pedido
          </button>
        </div>
      </div>
    </div>
  );
}
