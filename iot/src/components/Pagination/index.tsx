import React, { useMemo, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { MONO } from '../../lib/theme/theme';
import type { AppPaginationProps } from './type';

export const AppPagination: React.FC<AppPaginationProps> = ({
  currentPage,
  totalItems,
  pageSize,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [5, 10, 20, 50, 100],
  itemLabel = 'bản ghi',
  className = ''
}) => {
  // ─── Biến & useMemo ────────────────────────────────────────────────────────
  const totalPages = useMemo(() => Math.ceil(totalItems / pageSize) || 1, [totalItems, pageSize]);
  const startItem = useMemo(() => (totalItems > 0 ? (currentPage - 1) * pageSize + 1 : 0), [totalItems, currentPage, pageSize]);
  const endItem = useMemo(() => Math.min(currentPage * pageSize, totalItems), [currentPage, pageSize, totalItems]);
  const pageNumbers = useMemo(() => Array.from({ length: totalPages }, (_, i) => i + 1).slice(0, 5), [totalPages]);

  // ─── Function (useCallback) ────────────────────────────────────────────────
  const handlePrev = useCallback(() => {
    onPageChange(Math.max(currentPage - 1, 1));
  }, [currentPage, onPageChange]);

  const handleNext = useCallback(() => {
    onPageChange(Math.min(currentPage + 1, totalPages));
  }, [currentPage, totalPages, onPageChange]);

  const handleSizeChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    onPageSizeChange(Number(e.target.value));
    onPageChange(1);
  }, [onPageSizeChange, onPageChange]);

  // ─── Render JSX ────────────────────────────────────────────────────────────
  return (
    <div className={`px-6 py-4 border-t border-stone-100 flex flex-wrap items-center justify-between gap-4 text-xs ${className}`}>
      <div className="flex flex-wrap items-center gap-4 text-stone-500">
        <span>
          Hiển thị <span className="font-bold text-stone-800" style={MONO}>{startItem}</span> -{' '}
          <span className="font-bold text-stone-800" style={MONO}>{endItem}</span> /{' '}
          <span className="font-bold text-stone-800" style={MONO}>{totalItems}</span> {itemLabel}
        </span>

        {/* Page Size Selector */}
        <div className="flex items-center gap-2 border-l border-stone-200 pl-3.5">
          <span className="text-stone-500 font-medium">Số bản ghi/trang:</span>
          <select
            value={pageSize}
            onChange={handleSizeChange}
            className="px-2.5 py-1 rounded-lg border border-stone-200 bg-white font-mono font-bold text-stone-700 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 cursor-pointer shadow-sm"
          >
            {pageSizeOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={handlePrev}
          disabled={currentPage === 1}
          className="w-8 h-8 flex items-center justify-center rounded-lg border border-stone-200 text-stone-600 hover:bg-stone-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft size={14} />
        </button>
        {pageNumbers.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => onPageChange(p)}
            className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
              currentPage === p
                ? 'bg-[#C2410C] text-white shadow-sm'
                : 'border border-stone-200 text-stone-600 hover:bg-stone-50'
            }`}
            style={MONO}
          >
            {p}
          </button>
        ))}
        <button
          type="button"
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className="w-8 h-8 flex items-center justify-center rounded-lg border border-stone-200 text-stone-600 hover:bg-stone-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
};

export default AppPagination;
