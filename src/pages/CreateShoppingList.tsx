
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ShoppingBag, Plus } from 'lucide-react';
import { EstablishmentSearch } from '../components/EstablishmentSearch';

interface Product {
  id: string;
  name: string;
  quantity: number;
  addedBy: 'search' | 'text' | 'audio' | 'photo';
}

export default function CreateShoppingList() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedEstablishment, setSelectedEstablishment] = useState("todos");
  const [searchTerm, setSearchTerm] = useState("");
  const [newProductName, setNewProductName] = useState("");

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

  const addProduct = () => {
    if (newProductName.trim()) {
      const newProduct: Product = {
        id: Date.now().toString(),
        name: newProductName.trim(),
        quantity: 1,
        addedBy: 'text'
      };
      setProducts([...products, newProduct]);
      setNewProductName("");
    }
  };

  const removeProduct = (id: string) => {
    setProducts(products.filter(p => p.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity > 0) {
      setProducts(products.map(p => 
        p.id === id ? { ...p, quantity } : p
      ));
    }
  };

  const handleSave = () => {
    if (products.length === 0) {
      alert('Adicione pelo menos um produto à lista');
      return;
    }

    if (selectedEstablishment === "todos") {
      alert('Selecione um estabelecimento específico');
      return;
    }

    const selectedStoreData = estabelecimentos.find(store => store.id === selectedEstablishment);
    
    const shoppingListData = {
      id: Date.now().toString(),
      products,
      store: {
        id: selectedStoreData?.id,
        name: selectedStoreData?.nome,
        address: selectedStoreData?.endereco
      },
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

        {/* Seletor de Estabelecimento - APENAS ESTA PARTE FOI TROCADA */}
        <EstablishmentSearch
          estabelecimentos={estabelecimentos}
          selectedEstablishment={selectedEstablishment}
          setSelectedEstablishment={setSelectedEstablishment}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />
      </div>

      {/* Content */}
      <div className="flex-1 p-4 pb-20">
        {/* Add Product Form */}
        <div className="bg-white rounded-xl p-4 shadow-sm mb-4">
          <h3 className="font-semibold mb-3">Adicionar Produto</h3>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Nome do produto..."
              value={newProductName}
              onChange={(e) => setNewProductName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addProduct()}
              className="flex-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={addProduct}
              disabled={!newProductName.trim()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Adicionar
            </button>
          </div>
        </div>

        {/* Products List */}
        <div className="space-y-3">
          {products.map((product) => (
            <div key={product.id} className="bg-white p-4 rounded-lg shadow-sm border">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="font-medium text-gray-800">{product.name}</h3>
                  <p className="text-sm text-gray-500">
                    Quantidade: {product.quantity}
                  </p>
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateQuantity(product.id, product.quantity - 1)}
                    className="w-8 h-8 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all flex items-center justify-center"
                  >
                    -
                  </button>
                  <span className="w-8 text-center">{product.quantity}</span>
                  <button
                    onClick={() => updateQuantity(product.id, product.quantity + 1)}
                    className="w-8 h-8 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all flex items-center justify-center"
                  >
                    +
                  </button>
                  <button
                    onClick={() => removeProduct(product.id)}
                    className="ml-2 px-3 py-1 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-all text-sm"
                  >
                    Remover
                  </button>
                </div>
              </div>
            </div>
          ))}
          
          {products.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <ShoppingBag className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>Nenhum produto adicionado ainda</p>
              <p className="text-sm">Comece adicionando produtos à sua lista</p>
            </div>
          )}
        </div>
      </div>

      {/* Fixed Bottom Actions */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
        <div className="flex gap-3">
          <button
            onClick={handleCancel}
            className="flex-1 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-all"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={products.length === 0 || selectedEstablishment === "todos"}
            className="flex-1 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            Salvar Lista ({products.length} itens)
          </button>
        </div>
      </div>
    </div>
  );
}
