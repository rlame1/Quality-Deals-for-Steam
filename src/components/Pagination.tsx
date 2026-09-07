import React from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { Translations } from '../utils/i18n';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  t: Translations;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  onPageSizeChange,
  t,
}) => {
  if (totalItems === 0) return null;

  const startItem = Math.min((currentPage - 1) * pageSize + 1, totalItems);
  const endItem = Math.min(currentPage * pageSize, totalItems);

  // Generate page numbers to display with smart ellipsis
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible + 2) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      const left = Math.max(2, currentPage - 1);
      const right = Math.min(totalPages - 1, currentPage + 1);

      if (left > 2) {
        pages.push('...');
      }

      for (let i = left; i <= right; i++) {
        pages.push(i);
      }

      if (right < totalPages - 1) {
        pages.push('...');
      }

      pages.push(totalPages);
    }

    return pages;
  };

  const showingText = t.paginationShowing
    .replace('{start}', startItem.toString())
    .replace('{end}', endItem.toString())
    .replace('{total}', totalItems.toString());

  return (
    <div 
      id="pagination-container"
      className="mt-6 p-3 sm:p-4 rounded-xl bg-[#161b22] border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm"
    >
      {/* Left side: Showing X–Y of Z & Per-page selector */}
      <div className="flex items-center gap-4 text-xs text-slate-400 flex-wrap justify-center sm:justify-start">
        <span className="font-medium text-slate-300">
          {showingText}
        </span>

        <div className="flex items-center gap-1.5 pl-2 sm:border-l border-slate-800">
          <span className="text-slate-500 hidden md:inline">{t.paginationPerPage}</span>
          <select
            id="page-size-select"
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="bg-[#0b0e14] border border-slate-700 text-slate-300 font-medium rounded-md px-2 py-1 text-xs focus:ring-1 focus:ring-cyan-500 focus:outline-none cursor-pointer"
          >
            <option value={20} className="bg-[#0b0e14] text-white">20</option>
            <option value={50} className="bg-[#0b0e14] text-white">50</option>
            <option value={100} className="bg-[#0b0e14] text-white">100</option>
          </select>
        </div>
      </div>

      {/* Right side: Navigation buttons (Previous, Page numbers, Next) */}
      <div className="flex items-center gap-1 sm:gap-1.5">
        {/* Jump to first page */}
        {totalPages > 4 && (
          <button
            id="pagination-first-btn"
            onClick={() => onPageChange(1)}
            disabled={currentPage === 1}
            className="p-1.5 rounded-lg border border-slate-800 text-slate-400 hover:text-white hover:bg-[#0b0e14] disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
            title={t.paginationFirst}
          >
            <ChevronsLeft className="w-4 h-4" />
          </button>
        )}

        {/* Previous page button */}
        <button
          id="pagination-prev-btn"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-700 bg-[#0b0e14] text-xs font-semibold text-slate-300 hover:text-white hover:bg-[#1c222d] hover:border-slate-600 disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer shadow-sm"
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="hidden xs:inline">{t.paginationPrev}</span>
        </button>

        {/* Numbered page buttons */}
        <div className="flex items-center gap-1 px-1">
          {getPageNumbers().map((page, idx) => {
            if (page === '...') {
              return (
                <span
                  key={`ellipsis-${idx}`}
                  className="w-7 h-7 flex items-center justify-center text-xs text-slate-600 font-bold"
                >
                  ...
                </span>
              );
            }

            const pageNum = Number(page);
            const isCurrent = pageNum === currentPage;

            return (
              <button
                key={`page-${pageNum}`}
                id={`pagination-page-${pageNum}`}
                onClick={() => onPageChange(pageNum)}
                className={`min-w-[32px] h-8 px-2 rounded-md text-xs font-bold transition-all cursor-pointer ${
                  isCurrent
                    ? 'bg-cyan-600 text-white shadow-sm shadow-cyan-950/50'
                    : 'bg-[#0b0e14] text-slate-400 hover:text-white hover:bg-[#1c222d] border border-slate-800 hover:border-slate-700'
                }`}
              >
                {pageNum}
              </button>
            );
          })}
        </div>

        {/* Next page button */}
        <button
          id="pagination-next-btn"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-700 bg-[#0b0e14] text-xs font-semibold text-slate-300 hover:text-white hover:bg-[#1c222d] hover:border-slate-600 disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer shadow-sm"
        >
          <span className="hidden xs:inline">{t.paginationNext}</span>
          <ChevronRight className="w-4 h-4" />
        </button>

        {/* Jump to last page */}
        {totalPages > 4 && (
          <button
            id="pagination-last-btn"
            onClick={() => onPageChange(totalPages)}
            disabled={currentPage >= totalPages}
            className="p-1.5 rounded-lg border border-slate-800 text-slate-400 hover:text-white hover:bg-[#0b0e14] disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
            title={t.paginationLast}
          >
            <ChevronsRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
