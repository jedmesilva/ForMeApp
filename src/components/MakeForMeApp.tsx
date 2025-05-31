
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Menu, 
  Bell, 
  ShoppingBag, 
  User, 
  DollarSign,
  ClipboardList,
  Briefcase
} from "lucide-react";
import { CreateOrderModal } from "./CreateOrderModal";
import { OrderDetailsModal } from "./OrderDetailsModal";
import { OrderCard } from "./OrderCard";
import { FilterBar } from "./FilterBar";

export default function MakeForMeApp() {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState("todos");
  const [showCreateOrder, setShowCreateOrder] = useState(false);
  const [showOrderDetails, setShowOrderDetails] = useState(false);

  // Dados simulados
  const pedidosAndamento = {
    aceitos: 1,
    emAndamento: 2
  };

  const pedidosServico = [
    {
      id: 1,
      usuario: "Carlos Lima",
      servico: "Montagem de móvel",
      categoria: "Casa e Jardim",
      clienteRegiao: "Rua dos Técnicos - Centro",
      distancia: 1.8,
      recompensa: 50.00,
      urgencia: "Baixa",
      tempo: "2 horas",
      observacoes: "Guarda-roupa de 3 portas"
    },
    {
      id: 2,
      usuario: "Lucia Mendes",
      servico: "Aula de inglês",
      categoria: "Educação",
      clienteRegiao: "Av. das Américas - Zona Sul",
      distancia: 3.2,
      recompensa: 30.00,
      urgencia: "Média",
      tempo: "1 hora",
      observacoes: "Nível básico, presencial"
    },
    {
      id: 3,
      usuario: "Pedro Santos",
      servico: "Conserto de computador",
      categoria: "Tecnologia",
      clienteRegiao: "Rua da Informática - Centro",
      distancia: 0.9,
      recompensa: 40.00,
      urgencia: "Alta",
      tempo: "1.5 horas",
      observacoes: "Notebook não liga"
    },
    {
      id: 4,
      usuario: "Ana Silva",
      servico: "Limpeza residencial",
      categoria: "Casa e Jardim",
      clienteRegiao: "Condomínio Flores - Zona Norte",
      distancia: 2.1,
      recompensa: 60.00,
      urgencia: "Média",
      tempo: "3 horas",
      observacoes: "Casa de 2 quartos"
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header Verde */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 px-4 pt-12 pb-6">
        {/* Navbar Superior */}
        <div className="flex items-center justify-between mb-4">
          <button className="p-2 rounded-lg bg-white bg-opacity-10 backdrop-blur-sm hover:bg-opacity-20 transition-all">
            <Menu className="w-6 h-6 text-white" />
          </button>
          <h1 className="text-white text-xl font-bold">MakeForMe</h1>
          <button className="p-2 rounded-lg bg-white bg-opacity-10 backdrop-blur-sm hover:bg-opacity-20 transition-all relative">
            <Bell className="w-6 h-6 text-white" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
          </button>
        </div>
        
        {/* Saudação */}
        <div className="mb-4">
          <p className="text-green-100 text-sm">Pronto para trabalhar, Lucas?</p>
        </div>

        {/* Card de Serviços em Andamento */}
        <div 
          className="bg-white bg-opacity-15 backdrop-blur-sm p-4 rounded-xl text-white cursor-pointer hover:bg-opacity-20 transition-all mb-6 transform hover:scale-105"
          onClick={() => setShowOrderDetails(true)}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-lg">
                {pedidosAndamento.aceitos + pedidosAndamento.emAndamento} serviços ativos
              </p>
              <p className="text-green-100 text-sm">
                {pedidosAndamento.aceitos} aceitos • {pedidosAndamento.emAndamento} em andamento
              </p>
            </div>
            <Briefcase className="w-8 h-8 text-green-200" />
          </div>
          <div className="mt-2 text-right">
            <span className="text-xs text-green-200">Toque para ver detalhes →</span>
          </div>
        </div>
      </div>

      <div className="flex-1 p-4 space-y-4 overflow-y-auto pb-28">
        {/* Filtros Horizontais */}
        <FilterBar activeFilter={activeFilter} setActiveFilter={setActiveFilter} />

        {/* Lista de Serviços */}
        <div className="space-y-4">
          {pedidosServico.map((pedido) => (
            <OrderCard key={pedido.id} pedido={pedido} activeTab="make" />
          ))}
        </div>
      </div>

      {/* Botão Flutuante */}
      <button 
        onClick={() => setShowCreateOrder(true)}
        className="fixed bottom-32 right-6 bg-green-600 hover:bg-green-700 p-4 rounded-full shadow-2xl text-white transition-all z-40 transform hover:scale-110 active:scale-95"
      >
        <div className="flex items-center justify-center">
          <Briefcase className="w-6 h-6" />
        </div>
      </button>

      {/* Navbar Inferior Fixa */}
      <div className="fixed bottom-0 left-0 right-0 flex justify-around items-center border-t bg-white p-3 shadow-lg z-50">
        <button 
          onClick={() => navigate("/")}
          className="flex flex-col items-center py-2 px-4 rounded-lg text-gray-600 transition-all transform hover:scale-105"
        >
          <ShoppingBag className="w-5 h-5 mb-1" />
          <span className="text-xs font-medium">BuyForMe</span>
        </button>
        
        <button 
          onClick={() => navigate("/makeforme")} 
          className="flex flex-col items-center py-2 px-4 rounded-lg bg-green-50 text-green-600 shadow-sm transition-all transform hover:scale-105"
        >
          <Briefcase className="w-5 h-5 mb-1" />
          <span className="text-xs font-medium">MakeForMe</span>
        </button>
        
        <button 
          onClick={() => navigate("/orders")}
          className="flex flex-col items-center py-2 px-4 rounded-lg text-gray-600 transition-all transform hover:scale-105"
        >
          <ClipboardList className="w-5 h-5 mb-1" />
          <span className="text-xs font-medium">Pedidos</span>
        </button>
        
        <button 
          onClick={() => navigate("/account")}
          className="flex flex-col items-center py-2 px-4 rounded-lg text-gray-600 transition-all transform hover:scale-105"
        >
          <div className="w-5 h-5 mb-1 bg-gray-400 rounded-full flex items-center justify-center">
            <User className="w-3 h-3 text-white" />
          </div>
          <span className="text-xs font-medium">Conta</span>
        </button>
      </div>

      {/* Modais */}
      {showCreateOrder && (
        <CreateOrderModal 
          activeTab="make"
          estabelecimentos={[]}
          onClose={() => setShowCreateOrder(false)}
        />
      )}
      {showOrderDetails && (
        <OrderDetailsModal onClose={() => setShowOrderDetails(false)} />
      )}
    </div>
  );
}
