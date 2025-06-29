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
}

const CompareContext = createContext<CompareContextType | undefined>(undefined);

const MAX_COMPARE_ITEMS = 4; // Max items to compare

export const CompareContextProvider = ({ children }: { children: ReactNode }) => {
  const [compareItems, setCompareItems] = useState<FinancialProduct[]>([]);
  const { toast } = useToast();

  // Load compare items from localStorage on initial render
  useEffect(() => {
    const storedItems = localStorage.getItem('compareItems');
    if (storedItems) {
      try {
        const parsedItems = JSON.parse(storedItems);
        if (Array.isArray(parsedItems)) {
           setCompareItems(parsedItems.slice(0, MAX_COMPARE_ITEMS));
        }
      } catch (error) {
        console.error("Failed to parse compare items from localStorage", error);
        localStorage.removeItem('compareItems');
      }
    }
  }, []);

  // Save compare items to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('compareItems', JSON.stringify(compareItems));
  }, [compareItems]);

  const addToCompare = (product: FinancialProduct) => {
    setCompareItems((prevItems) => {
      if (prevItems.find(item => item.id === product.id)) {
        toast({
          title: "Already Added",
          description: `${product.name} is already in your comparison list.`,
          variant: "default",
        });
        return prevItems;
      }
      if (prevItems.length >= MAX_COMPARE_ITEMS) {
        toast({
          title: "Comparison Limit Reached",
          description: `You can compare a maximum of ${MAX_COMPARE_ITEMS} products. Please remove an item to add a new one.`,
          variant: "destructive",
        });
        return prevItems;
      }
      toast({
        title: "Product Added",
        description: `${product.name} has been added to comparison.`,
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
          title: "Product Removed",
          description: `${itemToRemove.name} has been removed from comparison.`,
        });
      }
      return prevItems.filter(item => item.id !== productId);
    });
  };

  const clearCompare = () => {
    setCompareItems([]);
     toast({
      title: "Comparison Cleared",
      description: "All products have been removed from comparison.",
    });
  };

  const isInCompare = (productId: string) => {
    return compareItems.some(item => item.id === productId);
  };

  return (
    <CompareContext.Provider value={{ compareItems, addToCompare, removeFromCompare, clearCompare, isInCompare }}>
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
