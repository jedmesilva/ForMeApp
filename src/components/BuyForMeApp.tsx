
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ShoppingBag, 
  User, 
  MapPin, 
  Clock, 
  DollarSign,
  Filter,
  ClipboardList,
  Briefcase
} from "lucide-react";
import { CreateOrderModal } from "./CreateOrderModal";
import { OrderDetailsModal } from "./OrderDetailsModal";
import { OrderProductsModal } from "./OrderProductsModal";
import { EstablishmentSearch } from "./EstablishmentSearch";
import { OrderCard } from "./OrderCard";
import { FilterBar } from "./FilterBar";
import { BottomNavbar } from "./BottomNavbar";
import { TopHeader } from "./TopHeader";

export default function BuyForMeApp() {
  const [selectedEstablishment, setSelectedEstablishment] = useState("todos");
  const [activeFilter, setActiveFilter] = useState("todos");
  const [showCreateOrder, setShowCreateOrder] = useState(false);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [showOrderProducts, setShowOrderProducts] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Função para abrir detalhes dos produtos
  const handleViewOrderProducts = (pedido: any) => {
    setSelectedOrder(pedido);
    setShowOrderProducts(true);
  };

  // Dados simulados
  const pedidosAndamento = {
    aceitos: 2,
    emAndamento: 1
  };

  const estabelecimentos = [
    { id: "mercado-x", nome: "Mercado X", endereco: "Rua das Compras, 123 - Centro", tipo: "Supermercado", logo: "🛒" },
    { id: "mercado-y", nome: "Mercado Y", endereco: "Av. Principal, 456 - Bairro Norte", tipo: "Supermercado", logo: "🏪" },
    { id: "farmacia-z", nome: "Farmácia Z", endereco: "Rua da Saúde, 789 - Centro", tipo: "Farmácia", logo: "💊" },
    { id: "padaria-a", nome: "Padaria do João", endereco: "Rua do Pão, 321 - Vila Nova", tipo: "Padaria", logo: "🥖" },
    { id: "loja-b", nome: "Loja de Conveniência 24h", endereco: "Av. Central, 654 - Centro", tipo: "Conveniência", logo: "🏬" },
    { id: "mercado-c", nome: "Supermercado Big", endereco: "Shopping Center - Zona Sul", tipo: "Supermercado", logo: "🛍️" },
    { id: "farmacia-d", nome: "Drogaria Popular", endereco: "Rua das Flores, 987 - Bairro Norte", tipo: "Farmácia", logo: "⚕️" }
  ];

  const pedidosCompra = [
    {
      id: 1,
      usuario: "Maria Silva",
      itens: ["Leite integral 1L", "Pão francês 500g", "Ovos 12un"],
      estabelecimento: "Mercado X",
      estabelecimentoEndereco: "Rua das Compras, 123 - Centro",
      estabelecimentoEspecifico: true,
      clienteRegiao: "Rua das Flores - Centro",
      distancia: 1.2,
      recompensa: 10.00,
      urgencia: "Alta",
      tempo: "15 min",
      observacoes: "Leite da marca Tirol se possível"
    },
    {
      id: 2,
      usuario: "João Santos",
      itens: ["Arroz 5kg", "Feijão 1kg", "Óleo de soja", "Açúcar cristal"],
      estabelecimento: "Qualquer estabelecimento",
      estabelecimentoEndereco: "",
      estabelecimentoEspecifico: false,
      clienteRegiao: "Av. Central - Bairro Norte",
      distancia: 2.5,
      recompensa: 15.00,
      urgencia: "Média",
      tempo: "1 hora",
      observacoes: ""
    },
    {
      id: 3,
      usuario: "Ana Costa",
      itens: ["Dipirona", "Paracetamol"],
      estabelecimento: "Farmácia Z",
      estabelecimentoEndereco: "Rua da Saúde, 789 - Centro",
      estabelecimentoEspecifico: true,
      clienteRegiao: "Rua dos Remédios - Vila Nova",
      distancia: 0.8,
      recompensa: 8.00,
      urgencia: "Muito Alta",
      tempo: "30 min",
      observacoes: "Remédio urgente!"
    }
  ];

  

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header Azul */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-4 pt-6 pb-6">
        <TopHeader title="BuyForMe" subtitle="Bem-vindo, Lucas" />

        {/* Card de Pedidos em Andamento */}
        <div 
          className="bg-white bg-opacity-15 backdrop-blur-sm p-4 rounded-xl text-white cursor-pointer hover:bg-opacity-20 transition-all mb-6"
          onClick={() => setShowOrderDetails(true)}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-lg">
                {pedidosAndamento.aceitos + pedidosAndamento.emAndamento} pedidos ativos
              </p>
              <p className="text-blue-100 text-sm">
                {pedidosAndamento.aceitos} aceitos • {pedidosAndamento.emAndamento} em andamento
              </p>
            </div>
            <ClipboardList className="w-8 h-8 text-blue-200" />
          </div>
          <div className="mt-2 text-right">
            <span className="text-xs text-blue-200">Toque para ver detalhes →</span>
          </div>
        </div>

        {/* Campo de Busca */}
        <EstablishmentSearch
          estabelecimentos={estabelecimentos}
          selectedEstablishment={selectedEstablishment}
          setSelectedEstablishment={setSelectedEstablishment}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />
      </div>

      <div className="flex-1 p-4 space-y-4 overflow-y-auto pb-28">
        {/* Filtros Horizontais */}
        <FilterBar activeFilter={activeFilter} setActiveFilter={setActiveFilter} />

        {/* Lista de Pedidos */}
        <div className="space-y-4">
          {pedidosCompra.map((pedido) => (
            <OrderCard 
              key={pedido.id} 
              pedido={pedido} 
              activeTab="buy" 
              onViewDetails={() => handleViewOrderProducts(pedido)}
            />
          ))}
        </div>
      </div>

      {/* Botão Flutuante */}
      <button 
        onClick={() => setShowCreateOrder(true)}
        className="fixed bottom-32 right-6 bg-blue-600 hover:bg-blue-700 p-4 rounded-full shadow-2xl text-white transition-all z-40 transform hover:scale-110 active:scale-95"
      >
        <div className="flex items-center justify-center">
          <ShoppingBag className="w-6 h-6" />
        </div>
      </button>

      {/* Navbar Inferior Fixa */}
      <BottomNavbar />

      {/* Modais */}
      {showCreateOrder && (
        <CreateOrderModal 
          activeTab="buy"
          estabelecimentos={estabelecimentos}
          onClose={() => setShowCreateOrder(false)}
        />
      )}
      {showOrderDetails && (
        <OrderDetailsModal onClose={() => setShowOrderDetails(false)} />
      )}
    </div>
  );
}
