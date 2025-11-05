import express from "express";
import {
  getAllInvoices,
  getInvoiceById,
  createInvoice,
  updateInvoice,
  deleteInvoice,
  generatePaymentLink,
} from "../controllers/invoiceController.js";
import { authenticateToken } from "../utils/authMiddleware.js";

const router = express.Router();

// All invoice routes require authentication
router.use(authenticateToken);

/**
 * @route   GET /api/invoices
 * @desc    Get all invoices
 * @access  Private
 */
router.get("/", getAllInvoices);

/**
 * @route   GET /api/invoices/:id
 * @desc    Get single invoice by ID
 * @access  Private
 */
router.get("/:id", getInvoiceById);

/**
 * @route   POST /api/invoices
 * @desc    Create new invoice
 * @access  Private
 */
router.post("/", createInvoice);

/**
 * @route   PUT /api/invoices/:id
 * @desc    Update invoice
 * @access  Private
 */
router.put("/:id", updateInvoice);

/**
 * @route   DELETE /api/invoices/:id
 * @desc    Delete invoice
 * @access  Private
 */
router.delete("/:id", deleteInvoice);

/**
 * @route   POST /api/invoices/:id/payment-link
 * @desc    Generate a payment link token for invoice
 * @access  Private
 */
router.post("/:id/payment-link", generatePaymentLink);

export default router;
