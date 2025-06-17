import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Wedding, ModuleType } from '@/types';
import { weddings as defaultWeddings } from '@/data/mockData';

interface AppContextType {
  activeWedding: Wedding | null;
  setActiveWedding: (wedding: Wedding | null) => void;
  activeModule: ModuleType;
  setActiveModule: (module: ModuleType) => void;
  isNavOpen: boolean;
  setIsNavOpen: (isOpen: boolean) => void;
  availableWeddings: Wedding[];
  addWedding: (wedding: Wedding) => void;
  updateWedding: (wedding: Wedding) => void;
  deleteWedding: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const getInitialWeddings = (): Wedding[] => {
    const storedWeddings = localStorage.getItem('weddings');
    if (storedWeddings) {
      try {
        const parsed = JSON.parse(storedWeddings) as Wedding[];
        return parsed.map((wedding) => ({
          ...wedding,
          date: new Date(wedding.date),
        }));
      } catch (error) {
        console.error('Failed to parse weddings from localStorage:', error);
        return defaultWeddings;
      }
    }
    return defaultWeddings;
  };

  const [availableWeddings, setAvailableWeddings] = useState<Wedding[]>(getInitialWeddings);
  const [activeWedding, setActiveWedding] = useState<Wedding | null>(availableWeddings[0] || null);
  const [activeModule, setActiveModule] = useState<ModuleType>('dashboard');
  const [isNavOpen, setIsNavOpen] = useState(true);

  useEffect(() => {
    localStorage.setItem('weddings', JSON.stringify(availableWeddings));
  }, [availableWeddings]);

  const addWedding = (wedding: Wedding) => {
    setAvailableWeddings((prev) => [...prev, wedding]);
  };

  const updateWedding = (updatedWedding: Wedding) => {
    setAvailableWeddings((prev) =>
      prev.map((wedding) => (wedding.id === updatedWedding.id ? updatedWedding : wedding))
    );

    if (activeWedding && activeWedding.id === updatedWedding.id) {
      setActiveWedding(updatedWedding);
    }
  };

  const deleteWedding = (id: string) => {
    setAvailableWeddings((prev) => prev.filter((wedding) => wedding.id !== id));

    if (activeWedding && activeWedding.id === id) {
      const remaining = availableWeddings.filter((wedding) => wedding.id !== id);
      setActiveWedding(remaining.length > 0 ? remaining[0] : null);
    }
  };

  return (
    <AppContext.Provider
      value={{
        activeWedding,
        setActiveWedding,
        activeModule,
        setActiveModule,
        isNavOpen,
        setIsNavOpen,
        availableWeddings,
        addWedding,
        updateWedding,
        deleteWedding,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
