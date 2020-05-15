import React, {
  createContext,
  useState,
  useCallback,
  useContext,
  useEffect,
} from 'react';

import AsyncStorage from '@react-native-community/async-storage';

interface Product {
  id: string;
  title: string;
  image_url: string;
  price: number;
  quantity: number;
}

interface CartContext {
  products: Product[];
  addToCart(item: Omit<Product, 'quantity'>): void;
  increment(id: string): void;
  decrement(id: string): void;
}

const CartContext = createContext<CartContext | null>(null);

const CART_STORAGE_KEY = '@GoMarketplace:CART';

const CartProvider: React.FC = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function loadProducts(): Promise<void> {
      // TODO LOAD ITEMS FROM ASYNC STORAGE
    }

    loadProducts();
  }, []);

  const addToCart = useCallback(
    async product => {
      await AsyncStorage.removeItem(CART_STORAGE_KEY);
      const findCallback = ({ id }: Product) => id === product.id;
      const findedProductIndex = products.findIndex(findCallback);
      if (findedProductIndex < 0) {
        const newProduct = { ...product, quantity: 1 };
        const newListOfProducts = [...products, newProduct];

        setProducts(newListOfProducts);

        await AsyncStorage.setItem(
          CART_STORAGE_KEY,
          JSON.stringify(newListOfProducts),
        );
        return;
      }

      const internalProductsList = [...products];
      const actualProduct = internalProductsList[findedProductIndex];

      internalProductsList[findedProductIndex] = {
        ...actualProduct,
        quantity: actualProduct.quantity + 1,
      };

      setProducts(internalProductsList);
      await AsyncStorage.setItem(
        CART_STORAGE_KEY,
        JSON.stringify(internalProductsList),
      );
    },
    [products],
  );

  const increment = useCallback(async id => {
    // TODO INCREMENTS A PRODUCT QUANTITY IN THE CART
  }, []);

  const decrement = useCallback(async id => {
    // TODO DECREMENTS A PRODUCT QUANTITY IN THE CART
  }, []);

  const value = React.useMemo(
    () => ({ addToCart, increment, decrement, products }),
    [products, addToCart, increment, decrement],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

function useCart(): CartContext {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(`useCart must be used within a CartProvider`);
  }

  return context;
}

export { CartProvider, useCart };
