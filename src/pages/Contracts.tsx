import React from 'react';
import { motion } from 'framer-motion';
import ContractsHeader from './contracts/ContractsHeader';
import NoWeddingSelected from './contracts/NoWeddingSelected';
import SearchBar from './contracts/SearchBar';
import FilterBar from './contracts/FilterBar';
import ContractsContent from './contracts/ContractsContent';
import ContractDialog from './contracts/ContractDialog';
import { useContracts } from '@/hooks/useContracts';
import { useFilteredContracts } from '@/hooks/useFilteredContracts';

const ContractsPage = () => {
  const {
    activeWedding,
    contracts,
    contractsCount,
    isAddDialogOpen,
    setIsAddDialogOpen,
    isEditDialogOpen,
    setIsEditDialogOpen,
    selectedContract,
    setSelectedContract,
    handleEditClick,
    handleAddClick,
    handleAddSave,
    handleEditSave,
    handleViewDocument,
    handleDownloadDocument,
    handleDelete,
  } = useContracts();

  const {
    filteredContracts,
    searchQuery,
    setSearchQuery,
    sortConfig,
    handleSort,
    isFilterOpen,
    toggleFilter,
    filterOptions,
    handleTypeChange,
    handleStatusChange,
    resetFilters,
  } = useFilteredContracts(contracts);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <motion.div className="space-y-6" variants={container} initial="hidden" animate="show">
      <ContractsHeader
        contractsCount={contractsCount}
        activeWedding={activeWedding}
        onAddClick={handleAddClick}
      />

      {!activeWedding ? (
        <NoWeddingSelected />
      ) : (
        <>
          <SearchBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            isFilterOpen={isFilterOpen}
            toggleFilter={toggleFilter}
          />

          <FilterBar
            isOpen={isFilterOpen}
            onClose={toggleFilter}
            onTypeChange={handleTypeChange}
            onStatusChange={handleStatusChange}
            selectedType={filterOptions.type}
            selectedStatus={filterOptions.status}
            onReset={resetFilters}
          />

          <ContractsContent
            contracts={filteredContracts}
            onEdit={handleEditClick}
            onView={handleViewDocument}
            onDownload={handleDownloadDocument}
            onDelete={handleDelete}
            sortConfig={sortConfig}
            handleSort={handleSort}
          />
        </>
      )}

      <ContractDialog
        isOpen={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        selectedContract={selectedContract}
        onSave={handleEditSave}
        setSelectedContract={setSelectedContract}
      />

      <ContractDialog
        isOpen={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        selectedContract={selectedContract}
        onSave={handleAddSave}
        setSelectedContract={setSelectedContract}
      />
    </motion.div>
  );
};

export default ContractsPage;
