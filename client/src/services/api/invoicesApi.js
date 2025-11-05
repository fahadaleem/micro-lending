/**
 * Invoices API service
 * Connects to backend API endpoints using axios
 */

import apiClient from "./apiClient.js";

/**
 * Get all invoices (paginated)
 * @param {array} filters - Array of filter objects { key, value, op }
 * @param {object} options - { page, limit }
 * @returns {Promise<object>} { invoices, total, page, limit, totalPages }
 */
export async function getAll(filters = [], options = {}) {
  const params = {
    filters: JSON.stringify(filters),
    ...options,
  };
  const response = await apiClient.get("/api/invoices", { params });
  return response.data.data;
}

/**
 * Get single invoice by ID
 * @param {string} id - invoice ID
 * @returns {Promise<object>} invoice object
 */
export async function getById(id) {
  const response = await apiClient.get(`/api/invoices/${id}`);
  return response.data.data.invoice;
}

/**
 * Create a new invoice
 * @param {object} data - invoice data
 * @returns {Promise<object>} created invoice
 */
export async function create(data) {
  const response = await apiClient.post("/api/invoices", data);
  return response.data.data.invoice;
}

/**
 * Update an existing invoice
 * @param {string} id - invoice ID
 * @param {object} data - updated invoice data
 * @returns {Promise<object>} updated invoice
 */
export async function update(id, data) {
  const response = await apiClient.put(`/api/invoices/${id}`, data);
  return response.data.data.invoice;
}

/**
 * Delete an invoice
 * @param {string} id - invoice ID
 * @returns {Promise<object>} success message
 */
export async function deleteInvoice(id) {
  const response = await apiClient.delete(`/api/invoices/${id}`);
  return response.data;
}

/**
 * Mark an invoice as paid
 * @param {string} id - invoice ID
 * @returns {Promise<object>} updated invoice
 */
export async function markAsPaid(id) {
  const response = await apiClient.put(`/api/invoices/${id}`, {
    payment_status: "paid",
  });
  return response.data.data.invoice;
}

/**
 * Generate a payment link for an invoice (returns token and expiry)
 * @param {string} id
 * @returns {Promise<{token:string, expiresAt:string}>}
 */
export async function generatePaymentLink(id) {
  const response = await apiClient.post(`/api/invoices/${id}/payment-link`);
  return response.data.data;
}

/**
 * Public: Get invoice details by payment token
 * @param {string} token
 */
export async function getPublicInvoiceByToken(token) {
  const response = await apiClient.get(`/api/pay/${token}`);
  return response.data.data.invoice;
}

/**
 * Public: Confirm payment (no gateway)
 * @param {string} token
 */
export async function payByToken(token) {
  const response = await apiClient.post(`/api/pay/${token}`);
  return response.data.data;
}
