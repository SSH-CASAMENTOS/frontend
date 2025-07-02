import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Wedding, ModuleType } from '@/types';
import { getWeddingsByProfileId } from '@/services/weddings/getWeddingsByProfileId';
import { useAuth } from './AuthContext';

interface AppContextType {
  activeWedding: Wedding | null;
  setActiveWedding: (wedding: Wedding | null) => void;
  activeModule: ModuleType;
  setActiveModule: (module: ModuleType) => void;
  isNavOpen: boolean;
  setIsNavOpen: (isOpen: boolean) => void;
  availableWeddings: Wedding[];
  updateWedding: (wedding: Wedding) => void;
  deleteWedding: (id: string) => void;
  loadWeddings: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const { profileSelected } = useAuth();
  const [availableWeddings, setAvailableWeddings] = useState<Wedding[]>([]);
  const [activeWedding, setActiveWedding] = useState<Wedding | null>(availableWeddings[0] || null);
  const [activeModule, setActiveModule] = useState<ModuleType>('dashboard');
  const [isNavOpen, setIsNavOpen] = useState(true);

  const loadWeddings = async () => {
    if (profileSelected && profileSelected.id) {
      const weddings = await getWeddingsByProfileId(profileSelected.id);
      setAvailableWeddings(weddings);
      
      if (!activeWedding && weddings.length > 0) {
        setActiveWedding(weddings[0]);
      }
    }
  };

  useEffect(() => {
    loadWeddings();
  }, [profileSelected]);

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
        updateWedding,
        deleteWedding,
        loadWeddings,
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
