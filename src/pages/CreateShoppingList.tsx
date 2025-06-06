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

  const handleSave = (products: Product[], selectedStore: string) => {
    if (products.length === 0) {
      alert('Adicione pelo menos um produto à lista');
      return;
    }

    if (!selectedStore) {
      alert('Selecione um estabelecimento');
      return;
    }

    // Salvar a lista de compras (aqui você pode integrar com sua API)
    const shoppingListData = {
      products,
      store: selectedStore,
      createdAt: new Date().toISOString(),
      totalItems: products.reduce((sum, product) => sum + product.quantity, 0),
      estimatedTotal: products.reduce((sum, product) => sum + (product.price * product.quantity), 0)
    };

    console.log('Lista de compras criada:', shoppingListData);
    
    // Redirecionar para a página de pedidos ou onde for apropriado
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