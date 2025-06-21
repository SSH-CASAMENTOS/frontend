import { useState, useEffect } from 'react';
import { Contract } from '@/types';
import { getContractsByWeddingId } from '@/data/mockData';
import {
  editContract,
  deleteContract,
  viewContractDocument,
  downloadContractDocument,
} from '@/utils/contractActions';
import { useAppContext } from '@/context/AppContext';

export const useContracts = () => {
  const { activeWedding } = useAppContext();
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Contract;
    direction: 'asc' | 'desc';
  }>({ key: 'title', direction: 'asc' });
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    if (activeWedding) {
      const weddingContracts = getContractsByWeddingId(activeWedding.id);
      setContracts(weddingContracts);
    } else {
      setContracts([]);
    }
  }, [activeWedding]);

  const handleSort = (key: keyof Contract) => {
    const direction = sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc';
    setSortConfig({ key, direction });
  };

  const sortedContracts = [...contracts].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  const filteredContracts = sortedContracts.filter(
    (contract) =>
      contract.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (contract.supplierName &&
        contract.supplierName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (contract.category && contract.category.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleEditClick = (contract: Contract) => {
    setSelectedContract(contract);
    setIsEditDialogOpen(true);
  };

  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  const handleAddClick = () => {
    const newContract: Contract = {
      id: `contract-${Date.now()}`,
      weddingId: activeWedding?.id || '',
      title: '',
      type: 'supplier',
      value: 0,
      status: 'pending',
      supplierName: '',
      signedAt: new Date(),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    };

    setSelectedContract(newContract);
    setIsAddDialogOpen(true);
  };

  const handleAddSave = () => {
    if (!selectedContract || !activeWedding) return;

    const updatedContracts = [...contracts, selectedContract];
    setContracts(updatedContracts);

    setIsAddDialogOpen(false);
    setSelectedContract(null);
  };

  const handleEditSave = () => {
    if (!selectedContract) return;
    const updatedContract = editContract(selectedContract, selectedContract);
    setContracts((prev) => prev.map((c) => (c.id === updatedContract.id ? updatedContract : c)));
    setIsEditDialogOpen(false);
    setSelectedContract(null);
  };

  const handleViewDocument = (contract: Contract) => {
    const doc = viewContractDocument(contract);
    window.open(doc.output('bloburl'));
  };

  const handleDownloadDocument = (contract: Contract) => {
    downloadContractDocument(contract);
  };

  const handleDelete = (contract: Contract) => {
    deleteContract(contract);
    setContracts((prev) => prev.filter((c) => c.id !== contract.id));
  };

  return {
    activeWedding,
    contracts: filteredContracts,
    contractsCount: contracts.length,
    searchQuery,
    setSearchQuery,
    isAddDialogOpen,
    setIsAddDialogOpen,
    isEditDialogOpen,
    setIsEditDialogOpen,
    selectedContract,
    setSelectedContract,
    sortConfig,
    handleSort,
    isFilterOpen,
    toggleFilter,
    handleEditClick,
    handleAddClick,
    handleAddSave,
    handleEditSave,
    handleViewDocument,
    handleDownloadDocument,
    handleDelete,
  };
};
