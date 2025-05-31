
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Menu, 
  Bell, 
  DollarSign,
  ArrowUpRight,
  ArrowDownLeft,
  Plus,
  CreditCard,
  Smartphone,
  Eye,
  EyeOff,
  X,
  ShoppingBag,
  Briefcase,
  ClipboardList,
  User,
  Calendar,
  Clock,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  AlertCircle
} from "lucide-react";

export default function AccountApp() {
  const navigate = useNavigate();
  const [showBalance, setShowBalance] = useState(true);
  const [showCardsModal, setShowCardsModal] = useState(false);
  const [activeTab, setActiveTab] = useState("atividades");

  // Dados simulados
  const userData = {
    nome: "Lucas Silva",
    saldo: 245.80,
    cartaoPrincipal: {
      nome: "Cartão Principal",
      ultimos4: "1234",
      bandeira: "Visa"
    },
    totalCartoes: 3
  };

  const cartoesCadastrados = [
    {
      id: 1,
      nome: "Cartão Principal",
      numero: "**** **** **** 1234",
      bandeira: "Visa",
      validade: "12/26",
      principal: true
    },
    {
      id: 2,
      nome: "Cartão Secundário",
      numero: "**** **** **** 5678",
      bandeira: "Mastercard",
      validade: "08/25",
      principal: false
    },
    {
      id: 3,
      nome: "Cartão Empresarial",
      numero: "**** **** **** 9012",
      bandeira: "Elo",
      validade: "03/27",
      principal: false
    }
  ];

  const atividadesRecentes = [
    {
      id: 1,
      tipo: "recebimento",
      descricao: "Pedido #1234 - Maria Silva",
      valor: 15.00,
      data: "Hoje, 14:30",
      status: "concluido"
    },
    {
      id: 2,
      tipo: "pagamento",
      descricao: "Compra no Mercado X",
      valor: -42.50,
      data: "Hoje, 10:15",
      status: "concluido"
    },
    {
      id: 3,
      tipo: "recebimento",
      descricao: "Serviço - Montagem móvel",
      valor: 50.00,
      data: "Ontem, 16:45",
      status: "concluido"
    },
    {
      id: 4,
      tipo: "transferencia",
      descricao: "PIX para João Santos",
      valor: -25.00,
      data: "Ontem, 12:20",
      status: "concluido"
    },
    {
      id: 5,
      tipo: "deposito",
      descricao: "Depósito via TED",
      valor: 100.00,
      data: "23/05, 09:30",
      status: "processando"
    }
  ];

  const transacoes = [
    {
      id: 1,
      tipo: "entrada",
      categoria: "Serviços",
      descricao: "Montagem de móvel - Carlos Lima",
      valor: 50.00,
      data: "30/05/2025",
      status: "concluido"
    },
    {
      id: 2,
      tipo: "entrada",
      categoria: "Compras",
      descricao: "Pedido #1234 - Maria Silva",
      valor: 15.00,
      data: "30/05/2025",
      status: "concluido"
    },
    {
      id: 3,
      tipo: "saida",
      categoria: "Compras",
      descricao: "Mercado X - Produtos diversos",
      valor: -42.50,
      data: "30/05/2025",
      status: "concluido"
    },
    {
      id: 4,
      tipo: "saida",
      categoria: "Transferência",
      descricao: "PIX para João Santos",
      valor: -25.00,
      data: "29/05/2025",
      status: "concluido"
    }
  ];

  const getBandeiraIcon = (bandeira: string) => {
    // Retorna um emoji baseado na bandeira
    switch(bandeira.toLowerCase()) {
      case "visa": return "💳";
      case "mastercard": return "💳";
      case "elo": return "💳";
      default: return "💳";
    }
  };

  const getTransactionIcon = (tipo: string) => {
    switch(tipo) {
      case "recebimento":
      case "entrada":
        return <TrendingUp className="w-4 h-4 text-green-600" />;
      case "pagamento":
      case "saida":
      case "transferencia":
        return <TrendingDown className="w-4 h-4 text-red-600" />;
      case "deposito":
        return <ArrowDownLeft className="w-4 h-4 text-blue-600" />;
      default:
        return <DollarSign className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case "concluido":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "processando":
        return <AlertCircle className="w-4 h-4 text-yellow-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const CardsModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Meus Cartões</h2>
            <button 
              onClick={() => setShowCardsModal(false)}
              className="p-2 rounded-lg hover:bg-gray-100"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>
          
          <div className="space-y-4 mb-6">
            {cartoesCadastrados.map((cartao) => (
              <div key={cartao.id} className="bg-gradient-to-r from-blue-600 to-blue-700 p-4 rounded-xl text-white relative">
                {cartao.principal && (
                  <div className="absolute top-2 right-2 bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-medium">
                    Principal
                  </div>
                )}
                <div className="mb-2">
                  <p className="text-blue-100 text-sm">{cartao.nome}</p>
                </div>
                <div className="text-lg font-mono mb-2">
                  {cartao.numero}
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-blue-200">
                    Válido até {cartao.validade}
                  </span>
                  <span className="text-lg">
                    {getBandeiraIcon(cartao.bandeira)}
                  </span>
                </div>
              </div>
            ))}
          </div>
          
          <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
            <Plus className="w-5 h-5" />
            Adicionar novo cartão
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header Azul */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-4 pt-12 pb-6">
        {/* Navbar Superior */}
        <div className="flex items-center justify-between mb-4">
          <button className="p-2 rounded-lg bg-white bg-opacity-10 backdrop-blur-sm">
            <Menu className="w-6 h-6 text-white" />
          </button>
          <h1 className="text-white text-xl font-bold">Minha Conta</h1>
          <button className="p-2 rounded-lg bg-white bg-opacity-10 backdrop-blur-sm relative">
            <Bell className="w-6 h-6 text-white" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
          </button>
        </div>
        
        {/* Saudação */}
        <div className="mb-4">
          <p className="text-blue-100 text-sm">Olá, {userData.nome}</p>
        </div>

        {/* Card de Saldo */}
        <div className="bg-white bg-opacity-15 backdrop-blur-sm p-6 rounded-xl text-white">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-blue-100 text-sm mb-1">Saldo disponível</p>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-6 h-6" />
                  <span className="text-3xl font-bold">
                    {showBalance ? userData.saldo.toFixed(2) : "•••••"}
                  </span>
                </div>
                <button 
                  onClick={() => setShowBalance(!showBalance)}
                  className="p-1 rounded-lg hover:bg-white hover:bg-opacity-10 transition-colors"
                >
                  {showBalance ? 
                    <EyeOff className="w-5 h-5 text-blue-200" /> : 
                    <Eye className="w-5 h-5 text-blue-200" />
                  }
                </button>
              </div>
            </div>
          </div>

          {/* Botões de Ações Financeiras */}
          <div className="grid grid-cols-4 gap-3">
            <button className="flex flex-col items-center p-3 rounded-xl bg-white bg-opacity-10 hover:bg-opacity-20 transition-colors">
              <ArrowUpRight className="w-6 h-6 mb-2" />
              <span className="text-xs font-medium">Transferir</span>
            </button>
            <button className="flex flex-col items-center p-3 rounded-xl bg-white bg-opacity-10 hover:bg-opacity-20 transition-colors">
              <CreditCard className="w-6 h-6 mb-2" />
              <span className="text-xs font-medium">Pagar</span>
            </button>
            <button className="flex flex-col items-center p-3 rounded-xl bg-white bg-opacity-10 hover:bg-opacity-20 transition-colors">
              <ArrowDownLeft className="w-6 h-6 mb-2" />
              <span className="text-xs font-medium">Depositar</span>
            </button>
            <button className="flex flex-col items-center p-3 rounded-xl bg-white bg-opacity-10 hover:bg-opacity-20 transition-colors">
              <Smartphone className="w-6 h-6 mb-2" />
              <span className="text-xs font-medium">PIX</span>
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 p-4 space-y-4 overflow-y-auto pb-28">
        {/* Card de Cartões */}
        <div 
          className="bg-white p-4 rounded-xl shadow-sm cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => setShowCardsModal(true)}
        >
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-gray-800">{userData.cartaoPrincipal.nome}</p>
                  <p className="text-sm text-gray-600">•••• {userData.cartaoPrincipal.ultimos4}</p>
                </div>
              </div>
              <p className="text-sm text-gray-500">
                {userData.totalCartoes} {userData.totalCartoes === 1 ? 'cartão cadastrado' : 'cartões cadastrados'}
              </p>
            </div>
            <div className="text-gray-400">
              <ArrowUpRight className="w-5 h-5 rotate-45" />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab("atividades")}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === "atividades" 
                  ? "bg-blue-50 text-blue-600 border-b-2 border-blue-600" 
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              Atividades Recentes
            </button>
            <button
              onClick={() => setActiveTab("transacoes")}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === "transacoes" 
                  ? "bg-blue-50 text-blue-600 border-b-2 border-blue-600" 
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              Transações
            </button>
          </div>
        </div>

        {/* Conteúdo das Tabs */}
        <div className="space-y-3">
          {activeTab === "atividades" && atividadesRecentes.map((atividade) => (
            <div key={atividade.id} className="bg-white p-4 rounded-xl shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                    {getTransactionIcon(atividade.tipo)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-800 truncate">{atividade.descricao}</p>
                    <div className="flex items-center gap-2">
                      <p className="text-sm text-gray-600">{atividade.data}</p>
                      {getStatusIcon(atividade.status)}
                    </div>
                  </div>
                </div>
                <div className="text-right ml-3">
                  <p className={`font-bold ${
                    atividade.valor > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {atividade.valor > 0 ? '+' : ''}R$ {Math.abs(atividade.valor).toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          ))}

          {activeTab === "transacoes" && transacoes.map((transacao) => (
            <div key={transacao.id} className="bg-white p-4 rounded-xl shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                    {getTransactionIcon(transacao.tipo)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-800 truncate">{transacao.descricao}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                        {transacao.categoria}
                      </span>
                      <p className="text-sm text-gray-600">{transacao.data}</p>
                    </div>
                  </div>
                </div>
                <div className="text-right ml-3">
                  <p className={`font-bold ${
                    transacao.valor > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {transacao.valor > 0 ? '+' : ''}R$ {Math.abs(transacao.valor).toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Mensagem quando não há itens */}
        {((activeTab === "atividades" && atividadesRecentes.length === 0) ||
          (activeTab === "transacoes" && transacoes.length === 0)) && (
          <div className="text-center py-12">
            <DollarSign className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Nenhuma {activeTab === "atividades" ? "atividade" : "transação"} encontrada</p>
            <p className="text-sm text-gray-400">
              {activeTab === "atividades" 
                ? "Suas atividades recentes aparecerão aqui" 
                : "Suas transações aparecerão aqui"
              }
            </p>
          </div>
        )}
      </div>

      {/* Modal de Cartões */}
      {showCardsModal && <CardsModal />}

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
        
        <button 
          onClick={() => navigate("/orders")}
          className="flex flex-col items-center py-2 px-4 rounded-lg text-gray-600"
        >
          <ClipboardList className="w-5 h-5 mb-1" />
          <span className="text-xs font-medium">Pedidos</span>
        </button>
        
        <button className="flex flex-col items-center py-2 px-4 rounded-lg bg-blue-50 text-blue-600">
          <div className="w-5 h-5 mb-1 bg-blue-600 rounded-full flex items-center justify-center">
            <User className="w-3 h-3 text-white" />
          </div>
          <span className="text-xs font-medium">Conta</span>
        </button>
      </div>
    </div>
  );
}
