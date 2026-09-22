import React, { useEffect, useState, useCallback } from 'react';
import {
  Compass,
  Plus,
  RefreshCw,
  Waves,
  SearchX,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { attractionService } from '../../services/attractionService';
import SummaryChips from '../../components/admin/attractions/SummaryChips';
import FiltersBar from '../../components/admin/attractions/FiltersBar';
import AttractionsTable from '../../components/admin/attractions/AttractionsTable';
import AttractionCard from '../../components/admin/attractions/AttractionCard';
import AttractionFormModal from '../../components/admin/attractions/AttractionFormModal';
import DeleteConfirmModal from '../../components/admin/attractions/DeleteConfirmModal';
import Pagination from '../../components/admin/attractions/Pagination';
import Card from '../../components/Card';
import Button from '../../components/Button';
import toast from 'react-hot-toast';

export default function AdminAttractions() {
  // Data state
  const [attractions, setAttractions] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [summaryCounts, setSummaryCounts] = useState({
    total: 0,
    SpeedBay: 0,
    SplashBay: 0,
    ChillBay: 0,
  });

  // UI state
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  // Filter & pagination state
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(12);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [status, setStatus] = useState('all');
  const [sort, setSort] = useState('-createdAt');

  // View Mode: persist in localStorage
  const [viewMode, setViewMode] = useState(() => {
    try {
      return localStorage.getItem('bluewave_attractions_view') || 'table';
    } catch {
      return 'table';
    }
  });

  const handleViewModeChange = (mode) => {
    setViewMode(mode);
    try {
      localStorage.setItem('bluewave_attractions_view', mode);
    } catch (e) {
      console.warn('Could not persist view mode:', e);
    }
  };

  // Modals state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deletingItem, setDeletingItem] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // 1. Fetch summary counts (for summary chips)
  const fetchSummaryCounts = useCallback(async () => {
    try {
      const res = await attractionService.list({
        limit: 100,
        includeInactive: true,
      });
      const items = res?.items || (Array.isArray(res) ? res : []);
      setSummaryCounts({
        total: items.length,
        SpeedBay: items.filter((a) => a.category === 'SpeedBay').length,
        SplashBay: items.filter((a) => a.category === 'SplashBay').length,
        ChillBay: items.filter((a) => a.category === 'ChillBay').length,
      });
    } catch (err) {
      console.warn('Could not fetch summary counts:', err);
    }
  }, []);

  // 2. Fetch paginated attractions
  const fetchAttractions = useCallback(
    async (isManualRefresh = false) => {
      if (isManualRefresh) setRefreshing(true);
      setError(null);

      try {
        const data = await attractionService.list({
          page,
          limit,
          search,
          category,
          status,
          sort,
          includeInactive: true,
        });

        if (data && data.items) {
          setAttractions(data.items);
          setTotal(data.total);
          setTotalPages(data.totalPages);
        } else if (Array.isArray(data)) {
          setAttractions(data);
          setTotal(data.length);
          setTotalPages(1);
        }

        if (isManualRefresh) {
          toast.success('Attractions list updated');
        }
      } catch (err) {
        console.error('Failed to load attractions:', err);
        const msg =
          err.response?.data?.detail ||
          err.response?.data?.message ||
          'Failed to load attractions directory. Please check your connection.';
        setError(msg);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [page, limit, search, category, status, sort]
  );

  useEffect(() => {
    fetchAttractions();
  }, [fetchAttractions]);

  useEffect(() => {
    fetchSummaryCounts();
  }, [fetchSummaryCounts]);

  // Handle Search & Filter Resets
  const handleResetFilters = () => {
    setSearch('');
    setCategory('All');
    setStatus('all');
    setSort('-createdAt');
    setPage(1);
  };

  const handleCategoryChipSelect = (selectedCategory) => {
    setCategory(selectedCategory);
    setPage(1);
  };

  // Create or Update
  const handleOpenAdd = () => {
    setEditingItem(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setIsFormOpen(true);
  };

  const handleSaveAttraction = async (formData) => {
    try {
      if (editingItem) {
        await attractionService.update(editingItem.id, formData);
        toast.success(`Attraction "${formData.name}" updated successfully!`);
      } else {
        await attractionService.create(formData);
        toast.success(`Attraction "${formData.name}" added to catalog!`);
      }
      setIsFormOpen(false);
      setEditingItem(null);
      await Promise.all([fetchAttractions(), fetchSummaryCounts()]);
    } catch (err) {
      const msg =
        err.response?.data?.detail ||
        err.response?.data?.message ||
        'Could not save attraction. Please try again.';
      toast.error(msg);
      throw err; // Re-throw so modal remains open for correction
    }
  };

  // Optimistic Status Toggle
  const handleToggleStatus = async (item) => {
    const previousState = item.isActive !== false;
    const newState = !previousState;

    // Optimistic UI update in local table/grid
    setAttractions((prev) =>
      prev.map((a) => (a.id === item.id ? { ...a, isActive: newState } : a))
    );

    try {
      await attractionService.patch(item.id, { isActive: newState });
      toast.success(
        `"${item.name}" is now ${newState ? 'published' : 'hidden from public view'}.`
      );
      fetchSummaryCounts();
    } catch (err) {
      // Rollback on failure
      setAttractions((prev) =>
        prev.map((a) => (a.id === item.id ? { ...a, isActive: previousState } : a))
      );
      const msg = err.response?.data?.detail || 'Failed to update publishing status';
      toast.error(msg);
    }
  };

  // Optimistic Delete
  const handlePromptDelete = (item) => {
    setDeletingItem(item);
    setIsDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingItem) return;
    const targetItem = deletingItem;
    setDeleting(true);

    try {
      await attractionService.delete(targetItem.id);
      toast.success(`Attraction "${targetItem.name}" deleted successfully.`);
      setIsDeleteOpen(false);
      setDeletingItem(null);

      // If last item on page and page > 1, go to previous page
      if (attractions.length === 1 && page > 1) {
        setPage((p) => p - 1);
      } else {
        await Promise.all([fetchAttractions(), fetchSummaryCounts()]);
      }
    } catch (err) {
      const msg = err.response?.data?.detail || 'Failed to delete attraction.';
      toast.error(msg);
    } finally {
      setDeleting(false);
    }
  };

  const hasActiveFilters = search.trim() !== '' || category !== 'All' || status !== 'all';

  return (
    <div className="space-y-6 animate-fadeIn pb-8">
      {/* 1. Header with Title, Actions & Refresh */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80 dark:border-slate-700/80">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-aqua-50 dark:bg-aqua-950/80 text-aqua-800 dark:text-aqua-300 border border-aqua-200/80 dark:border-slate-700 text-xs font-semibold uppercase tracking-wider mb-2 font-heading shadow-xs">
            <Compass className="w-3.5 h-3.5 text-aqua-600 dark:text-aqua-400" />
            <span>Park Directory Management</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-ocean-950 dark:text-white font-heading tracking-tight">
            Manage Attractions
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Curate, categorize, publish, and manage exhilarating slides, wave arenas, and family zones.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <button
            onClick={() => {
              fetchAttractions(true);
              fetchSummaryCounts();
            }}
            disabled={refreshing}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl bg-white dark:bg-navy-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-navy-700 active:scale-95 transition-all font-heading shadow-xs cursor-pointer disabled:opacity-60"
            title="Refresh attractions list"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-ocean-600 dark:text-aqua-400 ${refreshing ? 'animate-spin' : ''}`} />
            <span>{refreshing ? 'Refreshing...' : 'Refresh'}</span>
          </button>

          <Button
            variant="primary"
            size="md"
            icon={Plus}
            onClick={handleOpenAdd}
            className="shadow-coral cursor-pointer"
          >
            Add Attraction
          </Button>
        </div>
      </div>

      {/* 2. Summary Chips: Clickable per Category */}
      <SummaryChips
        counts={summaryCounts}
        activeCategory={category}
        onSelectCategory={handleCategoryChipSelect}
      />

      {/* 3. Toolbar & Filters Bar */}
      <FiltersBar
        search={search}
        onSearchChange={(q) => {
          setSearch(q);
          setPage(1);
        }}
        category={category}
        onCategoryChange={(c) => {
          setCategory(c);
          setPage(1);
        }}
        status={status}
        onStatusChange={(s) => {
          setStatus(s);
          setPage(1);
        }}
        sort={sort}
        onSortChange={setSort}
        viewMode={viewMode}
        onViewModeChange={handleViewModeChange}
        onResetFilters={handleResetFilters}
      />

      {/* 4. Content Area: Table / Grid / Skeleton / Empty / Error */}
      {loading ? (
        // Skeleton Loaders
        viewMode === 'table' ? (
          <Card className="p-0 overflow-hidden border-slate-200/80 dark:border-slate-700/80 bg-white dark:bg-navy-800">
            <div className="p-6 space-y-4 animate-pulse">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-slate-200 dark:bg-navy-700" />
                  <div className="space-y-2 flex-1">
                    <div className="h-4 w-48 bg-slate-200 dark:bg-navy-700 rounded" />
                    <div className="h-3 w-80 bg-slate-100 dark:bg-navy-900 rounded" />
                  </div>
                  <div className="w-20 h-6 bg-slate-200 dark:bg-navy-700 rounded-full" />
                </div>
              ))}
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="p-0 overflow-hidden border-slate-200/80 dark:border-slate-700/80 bg-white dark:bg-navy-800">
                <div className="h-48 bg-slate-200 dark:bg-navy-700" />
                <div className="p-4 space-y-2">
                  <div className="h-4 w-32 bg-slate-200 dark:bg-navy-700 rounded" />
                  <div className="h-3 w-full bg-slate-100 dark:bg-navy-900 rounded" />
                </div>
              </Card>
            ))}
          </div>
        )
      ) : error ? (
        // Error Retry State
        <Card className="p-10 text-center max-w-lg mx-auto border-rose-200/80 dark:border-rose-900/60 bg-white dark:bg-navy-800 shadow-soft">
          <div className="w-14 h-14 rounded-2xl bg-rose-50 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto mb-3">
            <AlertCircle className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-ocean-950 dark:text-white font-heading">
            Failed to Load Attractions
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 mb-5">
            {error}
          </p>
          <Button variant="primary" size="sm" onClick={() => fetchAttractions(true)}>
            Try Again
          </Button>
        </Card>
      ) : attractions.length === 0 ? (
        // Empty State: No results or No attractions
        hasActiveFilters ? (
          <Card className="p-12 text-center max-w-md mx-auto border-slate-200/80 dark:border-slate-700/80 bg-white dark:bg-navy-800 shadow-soft">
            <div className="w-16 h-16 rounded-2xl bg-ocean-50 dark:bg-navy-900 text-ocean-600 dark:text-aqua-400 flex items-center justify-center mx-auto mb-4">
              <SearchX className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-ocean-950 dark:text-white font-heading">
              No Attractions Match Your Filters
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-5 leading-relaxed">
              We couldn't find any attractions matching your search criteria or category filter.
            </p>
            <Button variant="ghost" size="sm" onClick={handleResetFilters}>
              Clear All Filters
            </Button>
          </Card>
        ) : (
          <Card className="p-12 text-center max-w-md mx-auto border-slate-200/80 dark:border-slate-700/80 bg-white dark:bg-navy-800 shadow-soft">
            <div className="w-16 h-16 rounded-2xl bg-ocean-50 dark:bg-navy-900 text-ocean-600 dark:text-aqua-400 flex items-center justify-center mx-auto mb-4">
              <Waves className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-ocean-950 dark:text-white font-heading">
              No Attractions in Catalog
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-5 leading-relaxed">
              Your park directory is currently empty. Add your first thrilling attraction or wave pool to get started.
            </p>
            <Button
              variant="primary"
              size="md"
              icon={Plus}
              onClick={handleOpenAdd}
              className="shadow-coral cursor-pointer"
            >
              Add Your First Attraction
            </Button>
          </Card>
        )
      ) : viewMode === 'table' ? (
        // TABLE VIEW
        <AttractionsTable
          attractions={attractions}
          onEdit={handleOpenEdit}
          onDelete={handlePromptDelete}
          onToggleStatus={handleToggleStatus}
        />
      ) : (
        // GRID VIEW
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {attractions.map((item) => (
            <AttractionCard
              key={item.id}
              item={item}
              onEdit={handleOpenEdit}
              onDelete={handlePromptDelete}
              onToggleStatus={handleToggleStatus}
            />
          ))}
        </div>
      )}

      {/* 5. Pagination Bar (when items exist) */}
      {!loading && attractions.length > 0 && (
        <Pagination
          page={page}
          totalPages={totalPages}
          limit={limit}
          total={total}
          onPageChange={setPage}
          onLimitChange={(newLimit) => {
            setLimit(newLimit);
            setPage(1);
          }}
        />
      )}

      {/* 6. Add / Edit Modal */}
      <AttractionFormModal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingItem(null);
        }}
        initialData={editingItem}
        onSave={handleSaveAttraction}
      />

      {/* 7. Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={isDeleteOpen}
        onClose={() => {
          setIsDeleteOpen(false);
          setDeletingItem(null);
        }}
        item={deletingItem}
        onConfirm={handleConfirmDelete}
        deleting={deleting}
      />
    </div>
  );
}
