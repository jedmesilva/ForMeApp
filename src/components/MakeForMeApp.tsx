
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Briefcase
} from "lucide-react";
import { CreateOrderModal } from "./CreateOrderModal";
import { OrderDetailsModal } from "./OrderDetailsModal";
import { ServiceDetailsModal } from "./ServiceDetailsModal";
import { OrderCard } from "./OrderCard";
import { FilterBar } from "./FilterBar";
import { BottomNavbar } from "./BottomNavbar";
import { TopHeader } from "./TopHeader";

export default function MakeForMeApp() {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState("todos");
  const [showCreateOrder, setShowCreateOrder] = useState(false);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [showServiceDetails, setShowServiceDetails] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

  // Função para abrir detalhes do serviço
  const handleViewServiceDetails = (servico: any) => {
    setSelectedService(servico);
    setShowServiceDetails(true);
  };

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
      {/* Header Azul */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-4 pt-6 pb-6">
        <TopHeader title="MakeForMe" subtitle="Pronto para trabalhar, Lucas?" />

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
              <p className="text-blue-100 text-sm">
                {pedidosAndamento.aceitos} aceitos • {pedidosAndamento.emAndamento} em andamento
              </p>
            </div>
            <Briefcase className="w-8 h-8 text-blue-200" />
          </div>
          <div className="mt-2 text-right">
            <span className="text-xs text-blue-200">Toque para ver detalhes →</span>
          </div>
        </div>
      </div>

      <div className="flex-1 p-4 space-y-4 overflow-y-auto pb-28">
        {/* Filtros Horizontais */}
        <FilterBar activeFilter={activeFilter} setActiveFilter={setActiveFilter} />

        {/* Lista de Serviços */}
        <div className="space-y-4">
          {pedidosServico.map((pedido) => (
            <OrderCard 
              key={pedido.id} 
              pedido={pedido} 
              activeTab="make" 
              onViewDetails={() => handleViewServiceDetails(pedido)}
            />
          ))}
        </div>
      </div>

      {/* Botão Flutuante */}
      <button 
        onClick={() => navigate('/create?type=make')}
        className="fixed bottom-32 right-6 bg-blue-600 hover:bg-blue-700 p-4 rounded-full shadow-2xl text-white transition-all z-40 transform hover:scale-110 active:scale-95"
      >
        <div className="flex items-center justify-center">
          <Briefcase className="w-6 h-6" />
        </div>
      </button>

      {/* Navbar Inferior Fixa */}
      <BottomNavbar />

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
      {showServiceDetails && selectedService && (
        <ServiceDetailsModal 
          servico={selectedService}
          onClose={() => {
            setShowServiceDetails(false);
            setSelectedService(null);
          }}
        />
      )}
    </div>
  );
}
