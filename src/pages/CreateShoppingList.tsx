import React from 'react';
import { useNavigate } from 'react-router-dom';
import ShoppingListCreator from '../components/ShoppingListCreator';

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  quantity: number;
}

export default function CreateShoppingList() {
  const navigate = useNavigate();

  // Estabelecimentos reais do seu app
  const availableStores = [
    { id: "mercado-x", name: "Mercado X", address: "Rua das Compras, 123 - Centro" },
    { id: "mercado-y", name: "Mercado Y", address: "Av. Principal, 456 - Bairro Norte" },
    { id: "farmacia-z", name: "Farmácia Z", address: "Rua da Saúde, 789 - Centro" },
    { id: "padaria-a", name: "Padaria do João", address: "Rua do Pão, 321 - Vila Nova" },
    { id: "loja-b", name: "Loja de Conveniência 24h", address: "Av. Central, 654 - Centro" },
  ];

  const handleSave = (products: Product[], selectedStore: string) => {
    if (products.length === 0) {
      alert('Adicione pelo menos um produto à lista');
      return;
    }

    if (!selectedStore) {
      alert('Selecione um estabelecimento');
      return;
    }

    const selectedStoreData = availableStores.find(store => store.id === selectedStore);
    
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
    <ShoppingListCreator 
      onSave={handleSave}
      onCancel={handleCancel}
    />
  );
}