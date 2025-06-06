import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ShoppingBag } from 'lucide-react';
import { EstablishmentSearch } from '../components/EstablishmentSearch';

export default function CreateShoppingList() {
  const navigate = useNavigate();
  const [selectedEstablishment, setSelectedEstablishment] = useState("todos");
  const [searchTerm, setSearchTerm] = useState("");

  // Estabelecimentos com o mesmo formato usado no BuyForMeApp
  const estabelecimentos = [
    {
      id: "mercado-x",
      nome: "Mercado X",
      endereco: "Rua das Compras, 123 - Centro",
      tipo: "Supermercado",
      logo: "🛒"
    },
    {
      id: "mercado-y", 
      nome: "Mercado Y",
      endereco: "Av. Principal, 456 - Bairro Norte",
      tipo: "Supermercado",
      logo: "🏪"
    },
    {
      id: "farmacia-z",
      nome: "Farmácia Z", 
      endereco: "Rua da Saúde, 789 - Centro",
      tipo: "Farmácia",
      logo: "💊"
    },
    {
      id: "padaria-a",
      nome: "Padaria do João",
      endereco: "Rua do Pão, 321 - Vila Nova", 
      tipo: "Padaria",
      logo: "🥖"
    },
    {
      id: "loja-b",
      nome: "Loja de Conveniência 24h",
      endereco: "Av. Central, 654 - Centro",
      tipo: "Conveniência", 
      logo: "🏬"
    }
  ];

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-6 text-white">
        <div className="flex items-center gap-3 mb-4">
          <button 
            onClick={handleCancel}
            className="p-2 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <h1 className="text-xl font-bold flex items-center gap-2">
              <ShoppingBag className="w-6 h-6" />
              Nova Lista de Compras
            </h1>
            <p className="text-blue-100 text-sm">
              Crie sua lista personalizada
            </p>
          </div>
        </div>

        {/* Seletor de Estabelecimento */}
        <EstablishmentSearch
          estabelecimentos={estabelecimentos}
          selectedEstablishment={selectedEstablishment}
          setSelectedEstablishment={setSelectedEstablishment}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />
      </div>

      {/* Content */}
      <div className="flex-1 p-4">
        <div className="text-center py-8 text-gray-500">
          <ShoppingBag className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>Página em desenvolvimento</p>
          <p className="text-sm">Funcionalidade de criar lista será implementada</p>
        </div>
      </div>
    </div>
  );
}