import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { operatorApiMap, paymentStatusOptions } from "./appConstants";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * Process table data with optional sorting and filtering.
 * Kept generic so it can be reused by multiple table components.
 *
 * @param {Array} items - source data array
 * @param {{sortBy?: string, sortDir?: 'asc'|'desc', filters?: object}} opts
 * @returns {Array} processed items (shallow copy)
 */
export function processTableData(items = [], opts = {}) {
  const { sortBy = null, sortDir = "asc" } = opts;
  const out = items.slice();

  if (sortBy) {
    out.sort((a, b) => {
      const aVal = a[sortBy];
      const bVal = b[sortBy];
      if (typeof aVal === "number" && typeof bVal === "number") {
        return sortDir === "asc" ? aVal - bVal : bVal - aVal;
      }
      const av = String(aVal ?? "").toLowerCase();
      const bv = String(bVal ?? "").toLowerCase();
      if (av < bv) return sortDir === "asc" ? -1 : 1;
      if (av > bv) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
  }

  return out;
}

/**
 * Return the first error message found in a react-hook-form `errors` object.
 * Traverses the object depth-first and returns the first `message` string it finds.
 * @param {object} errors - react-hook-form formState.errors
 * @returns {string|null} first error message or null if none found
 */
export function getFirstErrorMessage(errors) {
  if (!errors || typeof errors !== "object") return null;

  const stack = [errors];
  while (stack.length) {
    const node = stack.shift();
    if (!node || typeof node !== "object") continue;
    // if node has a message, return it
    if (node.message && typeof node.message === "string") return node.message;
    // push child values for inspection
    for (const val of Object.values(node)) {
      if (val && typeof val === "object") stack.push(val);
    }
  }

  return null;
}

/**
 * Transform applied filters to API payload format
 * Converts filter objects to array of { key, value, op } objects for backend consumption
 *
 * @param {object} appliedFilters - Object of filters keyed by filter ID
 * @returns {array} Array of filter payload objects
 *
 * @example
 * Input: { customerName: { id: "customerName", label: "Customer Name", operator: "is", value: "Acme Corp" } }
 * Output: [{ key: "customer_name", value: "Acme Corp", op: "eq" }]
 */
export function transformFiltersToPayload(appliedFilters) {
  if (!appliedFilters || typeof appliedFilters !== "object") return [];

  return Object.values(appliedFilters).map((filter) => {
    // Use filter.id directly (already snake_case)
    const key = filter.id;
    // Map user-friendly operator to API operator code
    const op = operatorApiMap[filter.operator] || "eq";
    return {
      key,
      value: filter.value,
      op,
    };
  });
}

/**
 * Get default invoice form values for Create Invoice form
 * Centralizes defaults to keep pages/components consistent
 */
export function getDefaultInvoiceValues() {
  return {
    identifier: "",
    paymentStatus: paymentStatusOptions && paymentStatusOptions[0]?.value,
    amountDue: "",
    reference: "",
    notesToCustomer: "",
    customerName: "",
    company: "",
    email: "",
    phone: "",
    billingAddress: "",
    invoiceDate: null,
    dueDate: null,
  };
}

/**
 * Transform invoice form values (camelCase) to API payload (snake_case)
 * @param {object} values - Form values from react-hook-form
 * @returns {object} API payload with snake_case keys
 */
export function transformInvoiceFormToPayload(values) {
  const toYMD = (d) => {
    if (!d) return null;
    if (d instanceof Date) return d.toISOString().split("T")[0];
    // if already a YYYY-MM-DD string (or any string), pass through
    return d;
  };
  return {
    identifier: values.identifier,
    payment_status: values.paymentStatus,
    amount_due: values.amountDue,
    reference: values.reference,
    notes_to_customer: values.notesToCustomer,
    customer_name: values.customerName,
    company: values.company,
    email: values.email,
    phone: values.phone,
    billing_address: values.billingAddress,
    invoice_date: toYMD(values.invoiceDate),
    due_date: toYMD(values.dueDate),
  };
}
