
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Briefcase, Sparkles, FileText, MapPin, DollarSign, Clock, User } from "lucide-react";
import { useState } from "react";

export default function RequestMakeForMe() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<'manual' | 'ai'>('manual');
  const [aiInput, setAiInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  
  const [formData, setFormData] = useState({
    serviceType: '',
    category: '',
    description: '',
    address: '',
    reward: '',
    urgency: 'Média',
    estimatedDuration: '',
    skillLevel: 'Básico',
    observations: ''
  });

  const categorias = [
    "Casa e Jardim",
    "Educação", 
    "Tecnologia",
    "Saúde",
    "Transporte",
    "Beleza e Estética",
    "Consultoria",
    "Outros"
  ];

  const tiposServico = {
    "Casa e Jardim": ["Montagem de móveis", "Limpeza", "Jardinagem", "Pequenos reparos", "Pintura"],
    "Educação": ["Aulas particulares", "Reforço escolar", "Idiomas", "Música", "Informática"],
    "Tecnologia": ["Suporte técnico", "Instalação de software", "Configuração de equipamentos", "Desenvolvimento"],
    "Saúde": ["Cuidados pessoais", "Acompanhamento médico", "Fisioterapia", "Massagem"],
    "Transporte": ["Motorista particular", "Entrega", "Mudança", "Frete"],
    "Beleza e Estética": ["Cabelo", "Manicure", "Maquiagem", "Depilação"],
    "Consultoria": ["Jurídica", "Financeira", "Marketing", "Negócios"],
    "Outros": ["Diversos"]
  };

  const processWithAI = async () => {
    if (!aiInput) return;
    
    setIsProcessing(true);
    
    setTimeout(() => {
      setFormData({
        ...formData,
        serviceType: 'Montagem de móveis',
        category: 'Casa e Jardim',
        description: 'Montagem de guarda-roupa de 3 portas',
        estimatedDuration: '2-3 horas',
        observations: 'Gerado automaticamente pela IA com base na sua solicitação'
      });
      setIsProcessing(false);
      setMode('manual');
    }, 2000);
  };

  const handleSubmit = () => {
    console.log('Solicitação de serviço:', formData);
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
              <Briefcase className="w-6 h-6" />
              Solicitar Serviço
            </h1>
            <p className="text-blue-100 text-sm">
              Descreva o serviço que você precisa
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
              <div className="text-xs text-gray-500">Descreva sua necessidade</div>
            </button>
          </div>
        </div>

        {/* Modo IA */}
        {mode === 'ai' && (
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-600" />
              Assistente IA para Serviços
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Descreva o serviço que você precisa
                </label>
                <textarea
                  value={aiInput}
                  onChange={(e) => setAiInput(e.target.value)}
                  className="w-full border rounded-lg p-3 h-24 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ex: Preciso montar um guarda-roupa de 3 portas que comprei"
                />
              </div>

              <button
                onClick={processWithAI}
                disabled={!aiInput || isProcessing}
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
                    Gerar Solicitação com IA
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
              <Briefcase className="w-5 h-5" />
              Detalhes da Solicitação de Serviço
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Categoria *
                </label>
                <select 
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value, serviceType: ''})}
                  className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Selecione uma categoria</option>
                  {categorias.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {formData.category && (
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Tipo de Serviço *
                  </label>
                  <select 
                    value={formData.serviceType}
                    onChange={(e) => setFormData({...formData, serviceType: e.target.value})}
                    className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Selecione o tipo de serviço</option>
                    {tiposServico[formData.category as keyof typeof tiposServico]?.map((tipo) => (
                      <option key={tipo} value={tipo}>{tipo}</option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium mb-2">
                  Descrição Detalhada *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full border rounded-lg p-3 h-24 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ex: Montagem de guarda-roupa de 3 portas, já tenho todas as peças e ferramentas..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  <MapPin className="w-4 h-4 inline mr-1" />
                  Endereço de Atendimento *
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
                    placeholder="50.00"
                    min="1"
                    step="0.01"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    <Clock className="w-4 h-4 inline mr-1" />
                    Duração Estimada
                  </label>
                  <input
                    type="text"
                    value={formData.estimatedDuration}
                    onChange={(e) => setFormData({...formData, estimatedDuration: e.target.value})}
                    className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ex: 2-3 horas"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
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

                <div>
                  <label className="block text-sm font-medium mb-2">
                    <User className="w-4 h-4 inline mr-1" />
                    Nível de Habilidade
                  </label>
                  <select 
                    value={formData.skillLevel}
                    onChange={(e) => setFormData({...formData, skillLevel: e.target.value})}
                    className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option>Básico</option>
                    <option>Intermediário</option>
                    <option>Avançado</option>
                    <option>Profissional</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Observações</label>
                <textarea
                  value={formData.observations}
                  onChange={(e) => setFormData({...formData, observations: e.target.value})}
                  className="w-full border rounded-lg p-3 h-16 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Instruções especiais, materiais disponíveis, horários preferenciais, etc..."
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
            Publicar Solicitação
          </button>
        </div>
      </div>
    </div>
  );
}
