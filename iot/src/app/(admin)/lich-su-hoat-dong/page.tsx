import React, { useState, useMemo, useCallback } from 'react';
import { useAppStore } from '../../../stores/useAppStore';
import { matchDateTimeQuery } from '../../../lib/utils/string';
import { AppPagination } from '../../../components/Pagination';
import { ActionFilterBar } from './ActionFilterBar';
import { ActionDataTable } from './ActionDataTable';

export const ActivityLogPage: React.FC = () => {
  // ─── Biến ──────────────────────────────────────────────────────────────────
  const { historyRows } = useAppStore();
  const [search, setSearch] = useState('');
  const [deviceFilter, setDeviceFilter] = useState('all');
  const [actionFilter, setActionFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [limit, setLimit] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // ─── useMemo (Filter & Pagination) ─────────────────────────────────────────
  const filtered = useMemo(() => {
    return historyRows.filter((r) => {
      if (search) {
        const q = search.toLowerCase();
        const match =
          r.id.toLowerCase().includes(q) ||
          r.time.toLowerCase().includes(q) ||
          matchDateTimeQuery(r.time, search) ||
          r.device.toLowerCase().includes(q) ||
          r.action.toLowerCase().includes(q) ||
          r.status.toLowerCase().includes(q) ||
          r.operator.toLowerCase().includes(q) ||
          r.source.toLowerCase().includes(q);
        if (!match) return false;
      }
      if (deviceFilter !== 'all' && !r.device.includes(deviceFilter)) return false;
      if (actionFilter !== 'all' && r.action !== actionFilter) return false;
      if (statusFilter !== 'all' && r.status !== statusFilter) return false;
      return true;
    });
  }, [historyRows, search, deviceFilter, actionFilter, statusFilter]);

  const pageRows = useMemo(() => {
    return filtered.slice((currentPage - 1) * limit, currentPage * limit);
  }, [filtered, currentPage, limit]);

  // ─── Function (useCallback) ────────────────────────────────────────────────
  const handleSearchChange = useCallback((val: string) => {
    setSearch(val);
    setCurrentPage(1);
  }, []);

  const handleDeviceChange = useCallback((val: string) => {
    setDeviceFilter(val);
    setCurrentPage(1);
  }, []);

  const handleActionChange = useCallback((val: string) => {
    setActionFilter(val);
    setCurrentPage(1);
  }, []);

  const handleStatusChange = useCallback((val: string) => {
    setStatusFilter(val);
    setCurrentPage(1);
  }, []);

  // ─── Render JSX ────────────────────────────────────────────────────────────
  return (
    <div className="p-6 space-y-5 max-w-7xl mx-auto">
      {/* Top Search & Filter Bar */}
      <ActionFilterBar
        search={search}
        deviceFilter={deviceFilter}
        actionFilter={actionFilter}
        statusFilter={statusFilter}
        onSearchChange={handleSearchChange}
        onDeviceChange={handleDeviceChange}
        onActionChange={handleActionChange}
        onStatusChange={handleStatusChange}
      />

      {/* Table */}
      <div className="bg-white rounded-2xl border border-stone-200/80 shadow-sm overflow-hidden">
        <ActionDataTable records={pageRows} />
        <AppPagination
          currentPage={currentPage}
          totalItems={filtered.length}
          pageSize={limit}
          onPageChange={setCurrentPage}
          onPageSizeChange={setLimit}
          itemLabel="hành động"
        />
      </div>
    </div>
  );
};

export default ActivityLogPage;
