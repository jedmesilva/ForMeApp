
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Menu, 
  Bell, 
  ChevronDown,
  ChevronUp,
  DollarSign,
  ShoppingBag,
  CheckCircle,
  Send,
  History,
  Filter,
  Clock,
  MapPin,
  User,
  ClipboardList,
  Briefcase,
  Star,
  Package
} from "lucide-react";

export default function OrdersApp() {
  const navigate = useNavigate();
  const [isDashboardExpanded, setIsDashboardExpanded] = useState(true);
  const [activeOrderTab, setActiveOrderTab] = useState("todos");
  const [activeFilter, setActiveFilter] = useState("maior-prioridade");

  // Dados do dashboard
  const dashboardData = {
    saldoDia: 85.50,
    pedidosAceitos: 12,
    pedidosConcluidos: 8,
    pedidosEnviados: 5
  };

  // Pedidos simulados
  const pedidos = {
    aceitos: [
      {
        id: 1,
        tipo: "compra",
        cliente: "Maria Silva",
        itens: ["Leite integral 1L", "Pão francês 500g", "Ovos 12un"],
        estabelecimento: "Mercado X",
        endereco: "Rua das Flores, 123 - Centro",
        valor: 15.00,
        status: "aceito",
        urgencia: "Alta",
        distancia: 1.2,
        tempo: "30 min",
        observacoes: "Leite da marca Tirol se possível"
      },
      {
        id: 2,
        tipo: "servico",
        cliente: "João Santos",
        servico: "Montagem de móvel",
        categoria: "Casa e Jardim",
        endereco: "Av. Central, 456 - Bairro Norte",
        valor: 50.00,
        status: "em-andamento",
        urgencia: "Média",
        distancia: 2.1,
        tempo: "2 horas",
        observacoes: "Guarda-roupa de 3 portas"
      }
    ],
    enviados: [
      {
        id: 3,
        tipo: "compra",
        aceito_por: "Carlos Lima",
        itens: ["Arroz 5kg", "Feijão 1kg"],
        estabelecimento: "Supermercado Big",
        valor: 12.00,
        status: "aguardando",
        urgencia: "Baixa",
        tempo: "1 hora"
      },
      {
        id: 4,
        tipo: "compra",
        aceito_por: "Ana Costa",
        itens: ["Medicamentos"],
        estabelecimento: "Farmácia Popular",
        valor: 8.00,
        status: "concluido",
        urgencia: "Alta",
        tempo: "45 min"
      }
    ]
  };

  const filtros = [
    { id: "maior-prioridade", label: "Maior prioridade" },
    { id: "menor-prioridade", label: "Menor prioridade" },
    { id: "mais-recente", label: "Mais recente" },
    { id: "mais-antigo", label: "Mais antigo" },
    { id: "mais-itens", label: "Mais itens" },
    { id: "menos-itens", label: "Menos itens" }
  ];

  const getUrgenciaColor = (urgencia) => {
    switch(urgencia) {
      case "Alta": return "bg-red-100 text-red-800";
      case "Média": return "bg-yellow-100 text-yellow-800";
      case "Baixa": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case "aceito": return "bg-blue-100 text-blue-800";
      case "em-andamento": return "bg-orange-100 text-orange-800";
      case "concluido": return "bg-green-100 text-green-800";
      case "aguardando": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusLabel = (status) => {
    switch(status) {
      case "aceito": return "Aceito";
      case "em-andamento": return "Em andamento";
      case "concluido": return "Concluído";
      case "aguardando": return "Aguardando";
      default: return status;
    }
  };

  // Filtrar pedidos baseado na tab ativa
  const getPedidosFiltrados = () => {
    switch(activeOrderTab) {
      case "aceitos":
        return pedidos.aceitos;
      case "enviados":
        return pedidos.enviados;
      default:
        return [...pedidos.aceitos, ...pedidos.enviados];
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header Azul */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-4 pt-12 pb-6">
        {/* Navbar Superior */}
        <div className="flex items-center justify-between mb-4">
          <button className="p-2 rounded-lg bg-white bg-opacity-10 backdrop-blur-sm">
            <Menu className="w-6 h-6 text-white" />
          </button>
          <h1 className="text-white text-xl font-bold">Meus Pedidos</h1>
          <button className="p-2 rounded-lg bg-white bg-opacity-10 backdrop-blur-sm relative">
            <Bell className="w-6 h-6 text-white" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
          </button>
        </div>
        
        {/* Saudação */}
        <div className="mb-4">
          <p className="text-blue-100 text-sm">Gerencie seus pedidos, Lucas</p>
        </div>

        {/* Dashboard Card Recolhível */}
        <div className="bg-white bg-opacity-15 backdrop-blur-sm rounded-xl text-white overflow-hidden">
          {/* Cabeçalho sempre visível com saldo do dia */}
          <div 
            className="p-4 cursor-pointer hover:bg-white hover:bg-opacity-5 transition-colors"
            onClick={() => setIsDashboardExpanded(!isDashboardExpanded)}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-blue-100 text-sm">Saldo de hoje</p>
                <div className="flex items-center gap-2">
                  <DollarSign className="w-6 h-6" />
                  <span className="text-2xl font-bold">
                    {dashboardData.saldoDia.toFixed(2)}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-blue-200">
                  {isDashboardExpanded ? "Recolher" : "Expandir"}
                </span>
                {isDashboardExpanded ? 
                  <ChevronUp className="w-5 h-5 text-blue-200" /> : 
                  <ChevronDown className="w-5 h-5 text-blue-200" />
                }
              </div>
            </div>
          </div>

          {/* Conteúdo expansível */}
          {isDashboardExpanded && (
            <div className="px-4 pb-4">
              <div className="h-px bg-white bg-opacity-20 mb-4"></div>
              <div className="grid grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="flex items-center justify-center mb-1">
                    <CheckCircle className="w-4 h-4" />
                  </div>
                  <p className="text-lg font-semibold">{dashboardData.pedidosAceitos}</p>
                  <p className="text-xs text-blue-100">Aceitos</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center mb-1">
                    <Package className="w-4 h-4" />
                  </div>
                  <p className="text-lg font-semibold">{dashboardData.pedidosConcluidos}</p>
                  <p className="text-xs text-blue-100">Concluídos</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center mb-1">
                    <Send className="w-4 h-4" />
                  </div>
                  <p className="text-lg font-semibold">{dashboardData.pedidosEnviados}</p>
                  <p className="text-xs text-blue-100">Enviados</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center mb-1">
                    <History className="w-4 h-4" />
                  </div>
                  <button className="text-lg font-semibold hover:text-blue-200 transition-colors">
                    <span className="text-xs">→</span>
                  </button>
                  <p className="text-xs text-blue-100">Histórico</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 p-4 space-y-4 overflow-y-auto pb-28">
        {/* Tabs de Pedidos */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveOrderTab("todos")}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                activeOrderTab === "todos" 
                  ? "bg-blue-50 text-blue-600 border-b-2 border-blue-600" 
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => setActiveOrderTab("aceitos")}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                activeOrderTab === "aceitos" 
                  ? "bg-blue-50 text-blue-600 border-b-2 border-blue-600" 
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              Aceitos
            </button>
            <button
              onClick={() => setActiveOrderTab("enviados")}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                activeOrderTab === "enviados" 
                  ? "bg-blue-50 text-blue-600 border-b-2 border-blue-600" 
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              Meus Pedidos
            </button>
          </div>
        </div>

        {/* Filtros */}
        <div className="bg-white p-4 rounded-xl shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <Filter className="w-4 h-4 text-gray-400" />
            <span className="font-medium text-gray-700">Ordenar por</span>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {filtros.map((filtro) => (
              <button
                key={filtro.id}
                onClick={() => setActiveFilter(filtro.id)}
                className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-all ${
                  activeFilter === filtro.id 
                    ? "bg-blue-600 text-white shadow-md" 
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {filtro.label}
              </button>
            ))}
          </div>
        </div>

        {/* Lista de Pedidos */}
        <div className="space-y-4">
          {getPedidosFiltrados().map((pedido) => (
            <div key={pedido.id} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-semibold text-gray-800">
                      {pedido.cliente || `Aceito por: ${pedido.aceito_por}`}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(pedido.status)}`}>
                      {getStatusLabel(pedido.status)}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getUrgenciaColor(pedido.urgencia)}`}>
                      {pedido.urgencia}
                    </span>
                  </div>
                  
                  {pedido.tipo === "compra" ? (
                    <>
                      <div className="text-sm text-gray-700 mb-1">
                        <span className="font-medium">{pedido.estabelecimento}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                        <MapPin className="w-4 h-4" />
                        <span>{pedido.endereco}</span>
                        {pedido.distancia && (
                          <>
                            <span>•</span>
                            <span>{pedido.distancia}km</span>
                          </>
                        )}
                      </div>

                      <div className="text-gray-700 mb-2">
                        <span className="font-medium">{pedido.itens.length} {pedido.itens.length === 1 ? 'item' : 'itens'}</span>
                        <span className="text-gray-500 ml-2">{pedido.itens.join(", ")}</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                        <Briefcase className="w-4 h-4" />
                        <span>{pedido.categoria}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                        <MapPin className="w-4 h-4" />
                        <span>{pedido.endereco}</span>
                        {pedido.distancia && (
                          <>
                            <span>•</span>
                            <span>{pedido.distancia}km</span>
                          </>
                        )}
                      </div>
                      
                      <div className="text-gray-700 mb-2">
                        <span className="font-medium">Serviço:</span> {pedido.servico}
                      </div>
                    </>
                  )}
                  
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{pedido.tempo}</span>
                    </div>
                  </div>
                  
                  {pedido.observacoes && (
                    <p className="text-sm text-gray-600 italic">"{pedido.observacoes}"</p>
                  )}
                </div>
                
                <div className="text-right ml-4">
                  <div className="flex items-center gap-1 text-blue-600 font-bold text-lg">
                    <DollarSign className="w-4 h-4" />
                    <span>{pedido.valor.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              
              {/* Botões de ação baseado no status */}
              <div className="flex gap-2">
                {pedido.status === "aceito" && (
                  <button className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                    Iniciar
                  </button>
                )}
                {pedido.status === "em-andamento" && (
                  <button className="flex-1 bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors">
                    Finalizar
                  </button>
                )}
                {pedido.status === "concluido" && (
                  <button className="flex-1 bg-gray-100 text-gray-600 py-3 rounded-lg font-medium cursor-not-allowed" disabled>
                    Concluído
                  </button>
                )}
                {pedido.status === "aguardando" && (
                  <button className="flex-1 bg-yellow-100 text-yellow-800 py-3 rounded-lg font-medium cursor-not-allowed" disabled>
                    Aguardando aceite
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Mensagem quando não há pedidos */}
        {getPedidosFiltrados().length === 0 && (
          <div className="text-center py-12">
            <ClipboardList className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Nenhum pedido encontrado</p>
            <p className="text-sm text-gray-400">Os pedidos aparecerão aqui quando disponíveis</p>
          </div>
        )}
      </div>

      {/* Navbar Inferior Fixa */}
      <div className="fixed bottom-0 left-0 right-0 flex justify-around items-center border-t bg-white p-3 shadow-lg z-50">
        <button 
          onClick={() => navigate("/")}
          className="flex flex-col items-center py-2 px-4 rounded-lg text-gray-600"
        >
          <ShoppingBag className="w-5 h-5 mb-1" />
          <span className="text-xs font-medium">BuyForMe</span>
        </button>
        
        <button 
          onClick={() => navigate("/")}
          className="flex flex-col items-center py-2 px-4 rounded-lg text-gray-600"
        >
          <Briefcase className="w-5 h-5 mb-1" />
          <span className="text-xs font-medium">MakeForMe</span>
        </button>
        
        <button className="flex flex-col items-center py-2 px-4 rounded-lg bg-blue-50 text-blue-600">
          <ClipboardList className="w-5 h-5 mb-1" />
          <span className="text-xs font-medium">Pedidos</span>
        </button>
        
        <button 
          onClick={() => navigate("/account")}
          className="flex flex-col items-center py-2 px-4 rounded-lg text-gray-600"
        >
          <div className="w-5 h-5 mb-1 bg-gray-400 rounded-full flex items-center justify-center">
            <User className="w-3 h-3 text-white" />
          </div>
          <span className="text-xs font-medium">Conta</span>
        </button>
      </div>
    </div>
  );
}
