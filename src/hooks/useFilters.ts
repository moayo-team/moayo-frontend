import { useState, useCallback } from 'react';

export const useFilters = () => {
  const [selectedJobFilters, setSelectedJobFilters] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);

  const toggleJobFilter = useCallback((label: string) => {
    setSelectedJobFilters((prev) =>
      prev.includes(label)
        ? prev.filter((item) => item !== label)
        : [...prev, label]
    );
    setCurrentPage(1); // Reset to first page when filter changes
  }, []);

  const removeJobFilter = useCallback((label: string) => {
    setSelectedJobFilters((prev) => prev.filter((item) => item !== label));
    setCurrentPage(1);
  }, []);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  }, []);

  const resetFilters = useCallback(() => {
    setSelectedJobFilters([]);
    setSearchQuery('');
    setCurrentPage(1);
  }, []);

  return {
    selectedJobFilters,
    searchQuery,
    currentPage,
    toggleJobFilter,
    removeJobFilter,
    handleSearch,
    setCurrentPage,
    resetFilters,
  };
};
