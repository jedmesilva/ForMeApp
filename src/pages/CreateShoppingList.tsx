import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import IntelligentShoppingList from '../components/IntelligentShoppingList';
import { EstablishmentSearch } from '../components/EstablishmentSearch';

interface Product {
  id: string;
  name: string;
  quantity: number;
  addedBy: 'search' | 'text' | 'audio' | 'photo';
}

export default function CreateShoppingList() {
  const navigate = useNavigate();
  const [selectedEstablishment, setSelectedEstablishment] = useState("todos");
  const [searchTerm, setSearchTerm] = useState("");

  // Estabelecimentos com dados compatíveis com EstablishmentSearch
  const estabelecimentos = [
    { id: "mercado-x", nome: "Mercado X", endereco: "Rua das Compras, 123 - Centro", tipo: "Supermercado", logo: "🛒" },
    { id: "mercado-y", nome: "Mercado Y", endereco: "Av. Principal, 456 - Bairro Norte", tipo: "Supermercado", logo: "🏪" },
    { id: "farmacia-z", nome: "Farmácia Z", endereco: "Rua da Saúde, 789 - Centro", tipo: "Farmácia", logo: "💊" },
    { id: "padaria-a", nome: "Padaria do João", endereco: "Rua do Pão, 321 - Vila Nova", tipo: "Padaria", logo: "🥖" },
    { id: "loja-b", nome: "Loja de Conveniência 24h", endereco: "Av. Central, 654 - Centro", tipo: "Conveniência", logo: "🏬" },
  ];

  // Manter compatibilidade com o formato esperado pelo IntelligentShoppingList
  const availableStores = estabelecimentos.map(est => ({
    id: est.id,
    name: est.nome,
    address: est.endereco
  }));

  const handleSave = (products: Product[], selectedStore: string) => {
    if (products.length === 0) {
      alert('Adicione pelo menos um produto à lista');
      return;
    }

    // Se não há estabelecimento específico selecionado, usar o primeiro da lista
    const storeToUse = selectedStore && selectedStore !== "todos" ? selectedStore : availableStores[0].id;
    const selectedStoreData = availableStores.find(store => store.id === storeToUse);
    
    const shoppingListData = {
      id: Date.now().toString(),
      products,
      store: selectedStoreData,
      createdAt: new Date().toISOString(),
      totalItems: products.reduce((sum, product) => sum + product.quantity, 0),
      status: 'criado'
    };

    console.log('Lista de compras criada:', shoppingListData);
    
    navigate('/orders', { 
      state: { 
        message: 'Lista de compras criada com sucesso!',
        newOrder: shoppingListData 
      } 
    });
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header com busca de estabelecimento */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-4 pt-6 pb-6">
        <div className="flex items-center gap-3 mb-6">
          <button 
            onClick={handleCancel}
            className="text-white hover:text-blue-200 transition-colors"
          >
            ←
          </button>
          <div>
            <h1 className="text-white text-xl font-bold">Criar Lista de Compras</h1>
            <p className="text-blue-100 text-sm">Adicione produtos à sua lista</p>
          </div>
        </div>

        <EstablishmentSearch
          estabelecimentos={estabelecimentos}
          selectedEstablishment={selectedEstablishment}
          setSelectedEstablishment={setSelectedEstablishment}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />
      </div>

      {/* Conteúdo da lista */}
      <div className="flex-1">
        <IntelligentShoppingList 
          onSave={(products: Product[]) => handleSave(products, selectedEstablishment)}
          onCancel={handleCancel}
          availableStores={availableStores}
          hideStoreSelection={true}
        />
      </div>
    </div>
  );
}