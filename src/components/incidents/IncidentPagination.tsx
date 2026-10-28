import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

interface IncidentPaginationProps {
  startIndex: number;
  endIndex: number;
  totalItems: number;
  pageSize: number;
  onPageSizeChange: (size: number) => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function IncidentPagination({
  startIndex,
  endIndex,
  totalItems,
  pageSize,
  onPageSizeChange,
  currentPage,
  totalPages,
  onPageChange
}: IncidentPaginationProps) {
  return (
    <div className="table-pagination-bar">
      <div className="pagination-info font-mono">
        Showing <strong>{startIndex + 1}–{endIndex}</strong> of <strong>{totalItems}</strong> incidents
      </div>

      <div className="pagination-actions">
        <div className="pagination-page-size">
          <span className="page-size-label">Per page:</span>
          <select
            aria-label="Incidents per page"
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="page-size-select font-mono"
          >
            <option value={6}>6</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
          </select>
        </div>

        <div className="pagination-nav-buttons" role="navigation" aria-label="Incident Pagination">
          <button
            type="button"
            className="pagination-btn"
            onClick={() => onPageChange(1)}
            disabled={currentPage <= 1}
            title="First Page"
            aria-label="First Page"
          >
            <ChevronsLeft size={15} />
          </button>
          <button
            type="button"
            className="pagination-btn"
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage <= 1}
            title="Previous Page"
            aria-label="Previous Page"
          >
            <ChevronLeft size={15} />
          </button>

          <div className="pagination-page-numbers">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
              <button
                key={pageNum}
                type="button"
                className={`pagination-num-btn font-mono ${pageNum === currentPage ? 'active' : ''}`}
                onClick={() => onPageChange(pageNum)}
              >
                {pageNum}
              </button>
            ))}
          </div>

          <button
            type="button"
            className="pagination-btn"
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage >= totalPages}
            title="Next Page"
            aria-label="Next Page"
          >
            <ChevronRight size={15} />
          </button>
          <button
            type="button"
            className="pagination-btn"
            onClick={() => onPageChange(totalPages)}
            disabled={currentPage >= totalPages}
            title="Last Page"
            aria-label="Last Page"
          >
            <ChevronsRight size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}
