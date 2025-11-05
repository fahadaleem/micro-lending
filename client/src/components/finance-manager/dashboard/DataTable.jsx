import React, { useState, useMemo } from "react";
import { format } from "date-fns";
import {
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { DEFAULT_ROWS_PER_PAGE } from "../../../lib/appConstants";
import { processTableData } from "../../../lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../ui/table";
import { Button } from "../../ui/button";
import { Badge } from "../../ui/badge";
import InvoiceActionsDropdown from "./InvoiceActionDropdown";

const StatusBadge = ({ status }) => {
  const statusMap = {
    pending: {
      text: "Pending",
      variant: "default",
      color: "bg-yellow-100 text-yellow-700 hover:bg-yellow-200",
    },
    paid: {
      text: "Paid",
      variant: "secondary",
      color: "bg-green-100 text-green-700 hover:bg-green-200",
    },
    overdue: {
      text: "Overdue",
      variant: "destructive",
      color: "bg-red-100 text-red-700 hover:bg-red-200",
    },
  };

  const { text, variant, color } = statusMap[status] || statusMap.pending;

  return (
    <Badge
      variant={variant}
      className={`capitalize w-24 justify-center text-md ${color}`}
    >
      {text}
    </Badge>
  );
};

/**
 * InvoiceDataTable
 *
 * Renders a paginated, sortable table of invoices.
 * Accepts invoices from parent via props and displays them with sorting/pagination.
 * The component manages its own pagination and sort state and delegates sorting/filtering
 * logic to `processTableData` in `src/lib/utils.js`.
 *
 * @param {array} invoices - Array of invoice objects from API
 * @param {object} appliedFilters - Filters object for client-side filtering
 * @returns {JSX.Element} The invoices table element.
 */
export default function InvoiceDataTable({
  invoices = [],
  appliedFilters = {},
  onRefresh = () => {},
  total = 0,
  page = 1,
  rowsPerPage = DEFAULT_ROWS_PER_PAGE,
  onPageChange = () => {},
  onRowsPerPageChange = () => {},
  sortBy = null,
  sortDir = "asc",
  onSort = () => {},
}) {
  const paginatedData = useMemo(() => {
    return invoices.map((inv) => ({
      id: inv.id,
      invoice: inv.identifier,
      customer: inv.customer_name,
      amount: inv.amount_due,
      status: inv.payment_status,
      due_date: inv.due_date,
      payment_date: inv.invoice_date,
    }));
  }, [invoices]);
  const totalPages = Math.max(1, Math.ceil(total / rowsPerPage));
  const startIndex = (page - 1) * rowsPerPage;
  const endIndex = startIndex + paginatedData.length;

  const handleNextPage = () => {
    if (page < totalPages) onPageChange(page + 1);
  };
  const handlePrevPage = () => {
    if (page > 1) onPageChange(page - 1);
  };

  // Map display column keys to backend field names
  const columnToField = {
    invoice: "identifier",
    customer: "customer_name",
    amount: "amount_due",
    status: "payment_status",
    due_date: "due_date",
    payment_date: "invoice_date",
  };

  const toggleSort = (field) => {
    const backendField = columnToField[field] || field;
    onSort(backendField);
  };

  // Format YYYY-MM-DD (string) or ISO date for display without timezone shift
  const formatDate = (val) => {
    if (!val) return "-";
    try {
      if (typeof val === "string" && /^\d{4}-\d{2}-\d{2}$/.test(val)) {
        const [y, m, d] = val.split("-").map(Number);
        const dt = new Date(y, m - 1, d); // local date
        return format(dt, "PP");
      }
      const dt = new Date(val);
      if (!isNaN(dt)) return format(dt, "PP");
      return String(val);
    } catch {
      return String(val);
    }
  };

  // No local page state; handled by parent

  return (
    <div className='flex flex-col gap-4 w-full'>
      {/* Header */}
      <div className='flex items-center justify-between gap-4 px-3 py-2 bg-white border rounded-t'>
        <div>
          <h2 className='text-lg font-semibold'>Invoices</h2>
          <div className='text-sm text-gray-600'>
            Showing rows {startIndex + 1} to {endIndex} of {total}
          </div>
        </div>

        <div className='flex items-center gap-2'>
          <label className='text-sm text-gray-600'>Rows:</label>
          <select
            value={rowsPerPage}
            onChange={(e) => onRowsPerPageChange(Number(e.target.value))}
            className='border rounded-md px-2 py-1 text-sm'
          >
            {[5, 10, 20, 50].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>
      </div>
      {/* Table Content */}
      <div className='rounded-sm border shadow-md bg-white'>
        <Table>
          <TableHeader className='bg-slate-200 sticky top-0 z-10'>
            <TableRow>
              <TableHead className='w-[120px]'>
                <button
                  className='flex items-center gap-1'
                  onClick={() => toggleSort("invoice")}
                >
                  Invoice
                  {sortBy === "invoice" ? (
                    sortDir === "asc" ? (
                      <ChevronUp className='h-3 w-3' />
                    ) : (
                      <ChevronDown className='h-3 w-3' />
                    )
                  ) : null}
                </button>
              </TableHead>
              <TableHead>
                <button
                  className='flex items-center gap-1'
                  onClick={() => toggleSort("customer")}
                >
                  Customer
                  {sortBy === "customer" ? (
                    sortDir === "asc" ? (
                      <ChevronUp className='h-3 w-3' />
                    ) : (
                      <ChevronDown className='h-3 w-3' />
                    )
                  ) : null}
                </button>
              </TableHead>
              <TableHead>
                <button
                  className='flex items-center gap-1'
                  onClick={() => toggleSort("amount")}
                >
                  Invoice Amount
                  {sortBy === "amount" ? (
                    sortDir === "asc" ? (
                      <ChevronUp className='h-3 w-3' />
                    ) : (
                      <ChevronDown className='h-3 w-3' />
                    )
                  ) : null}
                </button>
              </TableHead>
              <TableHead>Payment Status</TableHead>
              <TableHead>
                <button
                  className='flex items-center gap-1'
                  onClick={() => toggleSort("due_date")}
                >
                  Due Date
                  {sortBy === "due_date" ? (
                    sortDir === "asc" ? (
                      <ChevronUp className='h-3 w-3' />
                    ) : (
                      <ChevronDown className='h-3 w-3' />
                    )
                  ) : null}
                </button>
              </TableHead>
              <TableHead>
                <button
                  className='flex items-center gap-1'
                  onClick={() => toggleSort("payment_date")}
                >
                  Invoice Date
                  {sortBy === "payment_date" ? (
                    sortDir === "asc" ? (
                      <ChevronUp className='h-3 w-3' />
                    ) : (
                      <ChevronDown className='h-3 w-3' />
                    )
                  ) : null}
                </button>
              </TableHead>
              <TableHead className='w-[60px]'></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className='text-black'>
            {paginatedData.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className='text-center py-8 text-gray-500'
                >
                  No invoices found
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((payment) => (
                <TableRow
                  key={payment.id}
                  className='hover:bg-gray-50 transition-colors'
                >
                  <TableCell className='font-medium text-gray-900'>
                    {payment.invoice}
                  </TableCell>
                  <TableCell>{payment.customer}</TableCell>
                  <TableCell className='font-semibold'>
                    ${Number(payment.amount).toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={payment.status} />
                  </TableCell>
                  <TableCell>{formatDate(payment.due_date)}</TableCell>
                  <TableCell>{formatDate(payment.payment_date)}</TableCell>
                  <TableCell className='text-right'>
                    <InvoiceActionsDropdown
                      invoiceId={payment.id}
                      isPaid={payment.status === "paid"}
                      onUpdated={onRefresh}
                    />
                  </TableCell>
                </TableRow>
              ))
            )}
            {/* end rows */}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}
      <div className='flex items-center justify-end px-2 py-2'>
        <div className='space-x-2'>
          <Button
            variant='outline'
            size='sm'
            onClick={handlePrevPage}
            disabled={page === 1}
          >
            <ChevronLeft className='h-4 w-4 mr-1' />
            Previous
          </Button>

          <span className='text-sm font-medium px-4 py-2'>
            Page {page} of {totalPages}
          </span>

          <Button
            variant='outline'
            size='sm'
            onClick={handleNextPage}
            disabled={page === totalPages}
          >
            Next
            <ChevronRight className='h-4 w-4 ml-1' />
          </Button>
        </div>
      </div>
    </div>
  );
}
