import React, { useState, useEffect, useCallback } from "react";
import { useHeader } from "../../../contexts/HeaderContext";
import InvoiceDataTable from "./DataTable";
import Filters from "./Filters";
import { Badge } from "../../ui/badge";
import { X } from "lucide-react";
import { invoicesApi } from "../../../services/api";
import { transformFiltersToPayload } from "../../../lib/utils";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const { setHeader, resetHeader } = useHeader();
  const navigate = useNavigate();

  useEffect(() => {
    setHeader({
      title: "Invoices",
      actionLabel: "Create Invoice",
      onAction: () => navigate("/invoices/create"),
      showAction: true,
    });
    return () => resetHeader();
  }, [setHeader, resetHeader]);

  const [appliedFilters, setAppliedFilters] = useState({});
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedFilterId, setSelectedFilterId] = useState(null);
  const [invoices, setInvoices] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Default sort: newest first by createdAt
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortDir, setSortDir] = useState("desc");

  const fetchInvoices = useCallback(
    async (pageOverride, limitOverride, sortByOverride, sortDirOverride) => {
      setLoading(true);
      setError(null);
      try {
        const filterPayload = transformFiltersToPayload(appliedFilters);
        const pageNum = pageOverride || 1;
        const limitNum = limitOverride || rowsPerPage;
        const sortField =
          sortByOverride !== undefined ? sortByOverride : sortBy;
        const sortDirection =
          sortDirOverride !== undefined ? sortDirOverride : sortDir;
        const opts = {
          page: pageNum,
          limit: limitNum,
        };
        if (sortField) opts.sortBy = sortField;
        if (sortDirection) opts.sortDir = sortDirection;
        const data = await invoicesApi.getAll(filterPayload, opts);
        setInvoices(data.invoices);
        setTotal(data.total);
        setPage(data.page);
        setRowsPerPage(data.limit);
      } catch (err) {
        console.error("Failed to fetch invoices:", err);
        setError(err.message || "Failed to load invoices");
      } finally {
        setLoading(false);
      }
    },
    [appliedFilters, rowsPerPage, sortBy, sortDir]
  );

  // Fetch invoices on mount and when filters change
  useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices]);

  const handleApplyFilters = (filters) => {
    setAppliedFilters(filters);
  };

  const handleFilterClick = (filterId) => {
    setSelectedFilterId(filterId);
    setIsFilterOpen(true);
  };

  const handlePageChange = (newPage) => {
    fetchInvoices(newPage, rowsPerPage);
  };

  const handleRowsPerPageChange = (newLimit) => {
    fetchInvoices(1, newLimit); // reset to page 1
  };

  const handleSort = (field) => {
    let direction = "asc";
    if (sortBy === field) {
      direction = sortDir === "asc" ? "desc" : "asc";
    }
    setSortBy(field);
    setSortDir(direction);
    fetchInvoices(1, rowsPerPage, field, direction); // reset to page 1 on sort
  };

  return (
    <div className='space-y-4'>
      <div className='flex items-center gap-4'>
        <Filters
          onApplyFilters={handleApplyFilters}
          isOpen={isFilterOpen}
          onOpenChange={setIsFilterOpen}
          initialFilterId={selectedFilterId}
        />

        {/* Display combined filter chips */}
        {Object.keys(appliedFilters).length > 0 && (
          <div className='flex flex-wrap gap-2 flex-1'>
            {Object.values(appliedFilters).map((filter) => (
              <Badge
                key={filter.id}
                variant='secondary'
                className='bg-brand/10 text-brand hover:bg-brand/20 px-4 py-2 text-sm cursor-pointer'
                onClick={() => handleFilterClick(filter.id)}
              >
                {filter.label}: {filter.operator} "{filter.value}"
              </Badge>
            ))}
          </div>
        )}
      </div>

      {loading ? (
        <div className='flex justify-center items-center py-12'>
          <p className='text-gray-500'>Loading invoices...</p>
        </div>
      ) : error ? (
        <div className='bg-red-50 border border-red-200 rounded-md p-4'>
          <p className='text-red-600'>{error}</p>
        </div>
      ) : (
        <InvoiceDataTable
          invoices={invoices}
          appliedFilters={appliedFilters}
          onRefresh={fetchInvoices}
          total={total}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
          sortBy={sortBy}
          sortDir={sortDir}
          onSort={handleSort}
        />
      )}
    </div>
  );
}
