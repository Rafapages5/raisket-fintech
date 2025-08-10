// src/contexts/CompareContext.tsx
"use client";
import type { FinancialProduct } from '@/types';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useToast } from '@/hooks/use-toast';

interface CompareContextType {
  compareItems: FinancialProduct[];
  addToCompare: (product: FinancialProduct) => void;
  removeFromCompare: (productId: string) => void;
  clearCompare: () => void;
  isInCompare: (productId: string) => boolean;
  isLoaded: boolean; // Nuevo: indica si ya cargó del localStorage
}

const CompareContext = createContext<CompareContextType | undefined>(undefined);
const MAX_COMPARE_ITEMS = 4; // Max items to compare

export const CompareContextProvider = ({ children }: { children: ReactNode }) => {
  const [compareItems, setCompareItems] = useState<FinancialProduct[]>([]);
  const [isLoaded, setIsLoaded] = useState(false); // Nuevo estado
  const { toast } = useToast();

  // Load compare items from localStorage on initial render (solo en el cliente)
  useEffect(() => {
    // Verificar que estamos en el cliente
    if (typeof window !== 'undefined') {
      try {
        const storedItems = localStorage.getItem('compareItems');
        if (storedItems) {
          const parsedItems = JSON.parse(storedItems);
          if (Array.isArray(parsedItems)) {
            setCompareItems(parsedItems.slice(0, MAX_COMPARE_ITEMS));
          }
        }
      } catch (error) {
        console.error("Failed to parse compare items from localStorage", error);
        localStorage.removeItem('compareItems');
      } finally {
        setIsLoaded(true); // Marcar como cargado
      }
    }
  }, []);

  // Save compare items to localStorage whenever they change (solo en el cliente)
  useEffect(() => {
    if (isLoaded && typeof window !== 'undefined') {
      localStorage.setItem('compareItems', JSON.stringify(compareItems));
    }
  }, [compareItems, isLoaded]);

  const addToCompare = (product: FinancialProduct) => {
    setCompareItems((prevItems) => {
      if (prevItems.find(item => item.id === product.id)) {
        toast({
          title: "Ya Agregado",
          description: `${product.name} ya está en tu lista de comparación.`,
          variant: "default",
        });
        return prevItems;
      }

      if (prevItems.length >= MAX_COMPARE_ITEMS) {
        toast({
          title: "Límite de Comparación Alcanzado",
          description: `Puedes comparar un máximo de ${MAX_COMPARE_ITEMS} productos. Por favor elimina un elemento para agregar uno nuevo.`,
          variant: "destructive",
        });
        return prevItems;
      }

      toast({
        title: "Producto Agregado",
        description: `${product.name} ha sido agregado a la comparación.`,
        variant: "default",
      });
      return [...prevItems, product];
    });
  };

  const removeFromCompare = (productId: string) => {
    setCompareItems((prevItems) => {
      const itemToRemove = prevItems.find(item => item.id === productId);
      if (itemToRemove) {
        toast({
          title: "Producto Eliminado",
          description: `${itemToRemove.name} ha sido eliminado de la comparación.`,
        });
      }
      return prevItems.filter(item => item.id !== productId);
    });
  };

  const clearCompare = () => {
    setCompareItems([]);
    toast({
      title: "Comparación Limpiada",
      description: "Todos los productos han sido eliminados de la comparación.",
    });
  };

  const isInCompare = (productId: string) => {
    return compareItems.some(item => item.id === productId);
  };

  return (
    <CompareContext.Provider value={{ 
      compareItems, 
      addToCompare, 
      removeFromCompare, 
      clearCompare, 
      isInCompare,
      isLoaded 
    }}>
      {children}
    </CompareContext.Provider>
  );
};

export const useCompare = (): CompareContextType => {
  const context = useContext(CompareContext);
  if (context === undefined) {
    throw new Error('useCompare must be used within a CompareContextProvider');
  }
  return context;
};
