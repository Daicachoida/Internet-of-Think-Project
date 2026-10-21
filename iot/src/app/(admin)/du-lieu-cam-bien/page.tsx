import React, { useState, useMemo, useCallback } from 'react';
import { useAppStore } from '../../../stores/useAppStore';
import { matchDateTimeQuery } from '../../../lib/utils/string';
import { AppPagination } from '../../../components/Pagination';
import { SensorFilterBar } from './SensorFilterBar';
import { SensorDataTable } from './SensorDataTable';

export const SensorDataPage: React.FC = () => {
  // ─── Biến ──────────────────────────────────────────────────────────────────
  const { sensorRecords, resetSensorRecords } = useAppStore();
  const [search, setSearch] = useState('');
  const [sensorTypeFilter, setSensorTypeFilter] = useState('all');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');
  const [limit, setLimit] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [isResetting, setIsResetting] = useState(false);

  // ─── useMemo (Filter & Sort) ───────────────────────────────────────────────
  const filtered = useMemo(() => {
    return sensorRecords.filter((r) => {
      // Nếu chọn mục 'Thời gian', chỉ tìm kiếm khớp với trường thời gian
      if (sensorTypeFilter === 'time') {
        if (!search.trim()) return true;
        const q = search.trim().toLowerCase();
        return r.time.toLowerCase().includes(q) || matchDateTimeQuery(r.time, search);
      }

      // Nếu chọn loại cảm biến cụ thể (Nhiệt độ, Ánh sáng, Độ ẩm)
      if (sensorTypeFilter !== 'all' && r.sensorType !== sensorTypeFilter) {
        return false;
      }

      // Tìm kiếm từ khóa chung khi chọn 'Tất cả' hoặc các cảm biến
      if (search) {
        const q = search.toLowerCase();
        const match =
          r.id.toLowerCase().includes(q) ||
          r.time.toLowerCase().includes(q) ||
          matchDateTimeQuery(r.time, search) ||
          r.sensorType.toLowerCase().includes(q) ||
          String(r.value).toLowerCase().includes(q) ||
          r.unit.toLowerCase().includes(q) ||
          r.status.toLowerCase().includes(q) ||
          r.deviceId.toLowerCase().includes(q);
        if (!match) return false;
      }

      return true;
    });
  }, [sensorRecords, search, sensorTypeFilter]);

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      return sortOrder === 'asc' ? a.time.localeCompare(b.time) : b.time.localeCompare(a.time);
    });
  }, [filtered, sortOrder]);

  const pageRows = useMemo(() => {
    return sorted.slice((currentPage - 1) * limit, currentPage * limit);
  }, [sorted, currentPage, limit]);

  // ─── Function (useCallback) ────────────────────────────────────────────────
  const handleReset = useCallback(() => {
    setIsResetting(true);
    setSearch('');
    setSensorTypeFilter('all');
    setCurrentPage(1);
    resetSensorRecords();

    setTimeout(() => {
      setIsResetting(false);
    }, 400);
  }, [resetSensorRecords]);

  const handleSearch = useCallback(({ keyword, sensorType }: { keyword: string; sensorType: string }) => {
    setSearch(keyword);
    setSensorTypeFilter(sensorType);
    setCurrentPage(1);
  }, []);

  const handleToggleSortOrder = useCallback(() => {
    setSortOrder((prev) => (prev === 'desc' ? 'asc' : 'desc'));
  }, []);

  // ─── Render JSX ────────────────────────────────────────────────────────────
  return (
    <div className="p-6 space-y-4 max-w-7xl mx-auto">
      {/* Header banner */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
        <h2 className="text-base font-bold text-slate-900">
          Quản lý Lịch sử Dữ liệu Cảm biến
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Chuỗi thời gian các số đo Nhiệt độ, Ánh sáng, Độ ẩm từ nút cảm biến ESP8266
        </p>
      </div>

      {/* Filter Toolbar */}
      <SensorFilterBar
        appliedSearch={search}
        appliedSensorType={sensorTypeFilter}
        sortOrder={sortOrder}
        isResetting={isResetting}
        onSearch={handleSearch}
        onToggleSortOrder={handleToggleSortOrder}
        onReset={handleReset}
      />

      {/* Table Box */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <SensorDataTable records={pageRows} />
        <AppPagination
          currentPage={currentPage}
          totalItems={filtered.length}
          pageSize={limit}
          onPageChange={setCurrentPage}
          onPageSizeChange={setLimit}
          itemLabel="bản ghi"
        />
      </div>
    </div>
  );
};

export default SensorDataPage;
