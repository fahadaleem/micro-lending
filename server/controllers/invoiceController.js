import { ApiError, asyncHandler } from "../utils/errorMiddleware.js";
import crypto from "crypto";
import Invoice from "../schema/Invoice.js";

/**
 * Get all invoices
 * @route GET /api/invoices
 * @access Private
 */
export const getAllInvoices = asyncHandler(async (req, res, next) => {
  // Parse pagination params
  let page = parseInt(req.query.page, 10) || 1;
  let limit = parseInt(req.query.limit, 10) || 10;
  if (page < 1) page = 1;
  if (limit < 1) limit = 10;

  // Build MongoDB filter query
  let query = {};

  if (req.query.filters) {
    try {
      const filters = JSON.parse(req.query.filters);
      for (const filter of filters) {
        const { key, value, op } = filter;
        if (!key || value === undefined || value === null) continue;

        // Check if the key is a date field
        const isDateField = key === "invoice_date" || key === "due_date";

        if (op === "eq") {
          query[key] = value;
        } else if (op === "contains") {
          query[key] = { $regex: value, $options: "i" };
        } else if (op === "gt") {
          // For date fields, use the value as-is (string date comparison works in MongoDB)
          // For number fields, convert to number
          query[key] = { $gt: isDateField ? value : Number(value) };
        } else if (op === "lt") {
          query[key] = { $lt: isDateField ? value : Number(value) };
        } else if (op === "gte") {
          query[key] = { $gte: isDateField ? value : Number(value) };
        } else if (op === "lte") {
          query[key] = { $lte: isDateField ? value : Number(value) };
        }
      }
    } catch (e) {
      // ignore filter parse errors
    }
  }

  // Parse sorting params
  const sortBy = req.query.sortBy || "createdAt";
  // Default to newest first
  const sortDir = (req.query.sortDir || "desc") === "desc" ? -1 : 1;
  const sortOptions = { [sortBy]: sortDir };

  // Execute query with pagination
  const skip = (page - 1) * limit;

  const [invoices, total] = await Promise.all([
    Invoice.find(query).sort(sortOptions).skip(skip).limit(limit).lean(),
    Invoice.countDocuments(query),
  ]);

  // Transform _id to id for frontend compatibility
  const transformedInvoices = invoices.map((inv) => ({
    ...inv,
    id: inv._id.toString(),
  }));

  res.status(200).json({
    success: true,
    data: {
      invoices: transformedInvoices,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  });
});

/**
 * Get single invoice by ID
 * @route GET /api/invoices/:id
 * @access Private
 */
export const getInvoiceById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const invoice = await Invoice.findById(id).lean();

  if (!invoice) {
    throw new ApiError(404, "Invoice not found");
  }

  const transformedInvoice = {
    ...invoice,
    id: invoice._id.toString(),
  };

  res.status(200).json({
    success: true,
    data: { invoice: transformedInvoice },
  });
});

/**
 * Create new invoice
 * @route POST /api/invoices
 * @access Private
 */
export const createInvoice = asyncHandler(async (req, res, next) => {
  const {
    identifier,
    customer_name,
    company,
    email,
    phone,
    amount_due,
    payment_status,
    invoice_date,
    due_date,
    reference,
    billing_address,
    notes_to_customer,
  } = req.body;

  // Validate required fields
  if (!identifier || !customer_name || !amount_due) {
    throw new ApiError(
      400,
      "Missing required fields: identifier, customer_name, amount_due"
    );
  }

  // Check if identifier already exists
  const existing = await Invoice.findOne({ identifier });
  if (existing) {
    throw new ApiError(409, "Invoice with this identifier already exists");
  }

  // Create new invoice
  const newInvoice = await Invoice.create({
    identifier,
    customer_name,
    company: company || "",
    email: email || "",
    phone: phone || "",
    amount_due: Number(amount_due),
    payment_status: payment_status || "pending",
    invoice_date: invoice_date || new Date().toISOString().split("T")[0],
    due_date: due_date || null,
    reference: reference || "",
    billing_address: billing_address || "",
    notes_to_customer: notes_to_customer || "",
    created_by: req.user.id, // From auth middleware
  });

  const transformedInvoice = {
    ...newInvoice.toObject(),
    id: newInvoice._id.toString(),
  };

  res.status(201).json({
    success: true,
    message: "Invoice created successfully",
    data: { invoice: transformedInvoice },
  });
});

/**
 * Update invoice
 * @route PUT /api/invoices/:id
 * @access Private
 */
export const updateInvoice = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const invoice = await Invoice.findByIdAndUpdate(
    id,
    { ...req.body },
    { new: true, runValidators: true }
  ).lean();

  if (!invoice) {
    throw new ApiError(404, "Invoice not found");
  }

  const transformedInvoice = {
    ...invoice,
    id: invoice._id.toString(),
  };

  res.status(200).json({
    success: true,
    message: "Invoice updated successfully",
    data: { invoice: transformedInvoice },
  });
});

/**
 * Delete invoice
 * @route DELETE /api/invoices/:id
 * @access Private
 */
export const deleteInvoice = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const invoice = await Invoice.findByIdAndDelete(id);

  if (!invoice) {
    throw new ApiError(404, "Invoice not found");
  }

  res.status(200).json({
    success: true,
    message: "Invoice deleted successfully",
  });
});

/**
 * Generate a public payment link for an invoice
 * @route POST /api/invoices/:id/payment-link
 * @access Private (finance manager)
 */
export const generatePaymentLink = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const invoice = await Invoice.findById(id);
  if (!invoice) throw new ApiError(404, "Invoice not found");

  // If already paid, optionally block link generation
  if (invoice.payment_status === "paid") {
    throw new ApiError(400, "Invoice is already paid");
  }

  const now = Date.now();
  const existingToken = invoice.payment_link_token;
  const existingExpiry = invoice.payment_link_expires_at
    ? new Date(invoice.payment_link_expires_at).getTime()
    : 0;

  // Reuse token if valid and not used
  if (existingToken && existingExpiry > now && !invoice.payment_link_used_at) {
    return res.status(200).json({
      success: true,
      data: {
        token: existingToken,
        expiresAt: invoice.payment_link_expires_at,
      },
    });
  }

  // Generate new token and set expiry (e.g., 7 days)
  const token = crypto.randomBytes(24).toString("hex");
  const expiresAt = new Date(now + 7 * 24 * 60 * 60 * 1000);

  invoice.payment_link_token = token;
  invoice.payment_link_expires_at = expiresAt;
  invoice.payment_link_used_at = null;
  await invoice.save();

  res.status(201).json({
    success: true,
    data: { token, expiresAt: expiresAt.toISOString() },
  });
});

/**
 * Public: Get invoice details by payment token
 * @route GET /api/pay/:token
 * @access Public
 */
export const getInvoiceByToken = asyncHandler(async (req, res, next) => {
  const { token } = req.params;
  const invoice = await Invoice.findOne({ payment_link_token: token }).lean();
  if (!invoice) throw new ApiError(404, "Invalid payment link");

  const now = Date.now();
  const exp = invoice.payment_link_expires_at
    ? new Date(invoice.payment_link_expires_at).getTime()
    : 0;
  if (!exp || exp <= now) throw new ApiError(410, "Payment link expired");
  if (invoice.payment_link_used_at)
    throw new ApiError(400, "Payment link already used");

  // Return only necessary fields
  const publicInvoice = {
    id: invoice._id.toString(),
    identifier: invoice.identifier,
    customer_name: invoice.customer_name,
    company: invoice.company,
    amount_due: invoice.amount_due,
    due_date: invoice.due_date,
    payment_status: invoice.payment_status,
  };
  res.status(200).json({ success: true, data: { invoice: publicInvoice } });
});

/**
 * Public: Mark invoice as paid via token (no real gateway)
 * @route POST /api/pay/:token
 * @access Public
 */
export const payInvoiceByToken = asyncHandler(async (req, res, next) => {
  const { token } = req.params;
  const invoice = await Invoice.findOne({ payment_link_token: token });
  if (!invoice) throw new ApiError(404, "Invalid payment link");

  const now = Date.now();
  const exp = invoice.payment_link_expires_at
    ? new Date(invoice.payment_link_expires_at).getTime()
    : 0;
  if (!exp || exp <= now) throw new ApiError(410, "Payment link expired");
  if (invoice.payment_link_used_at)
    throw new ApiError(400, "Payment link already used");

  // Simulate payment success
  invoice.payment_status = "paid";
  invoice.payment_date = new Date().toISOString().split("T")[0];
  invoice.payment_link_used_at = new Date();
  await invoice.save();

  res.status(200).json({
    success: true,
    message: "Payment recorded",
    data: {
      invoice: {
        id: invoice._id.toString(),
        payment_status: invoice.payment_status,
      },
    },
  });
});
