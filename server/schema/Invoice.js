import mongoose from "mongoose";

const invoiceSchema = new mongoose.Schema(
  {
    identifier: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    customer_name: {
      type: String,
      required: true,
      trim: true,
    },
    company: {
      type: String,
      default: "",
      trim: true,
    },
    email: {
      type: String,
      default: "",
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      default: "",
      trim: true,
    },
    amount_due: {
      type: Number,
      required: true,
      min: 0,
    },
    payment_status: {
      type: String,
      enum: ["pending", "paid", "overdue"],
      default: "pending",
    },
    invoice_date: {
      type: String, // stored as YYYY-MM-DD
      required: true,
    },
    due_date: {
      type: String, // stored as YYYY-MM-DD
      default: null,
    },
    payment_date: {
      type: String, // stored as YYYY-MM-DD
      default: null,
    },
    reference: {
      type: String,
      default: "",
      trim: true,
    },
    billing_address: {
      type: String,
      default: "",
      trim: true,
    },
    notes_to_customer: {
      type: String,
      default: "",
      trim: true,
    },
    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // Payment link fields
    payment_link_token: {
      type: String,
      default: null,
    },
    payment_link_expires_at: {
      type: Date,
      default: null,
    },
    payment_link_used_at: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
invoiceSchema.index({ identifier: 1 });
invoiceSchema.index({ payment_status: 1 });
invoiceSchema.index({ customer_name: 1 });
invoiceSchema.index({ payment_link_token: 1 });
invoiceSchema.index({ created_by: 1 });

const Invoice = mongoose.model("Invoice", invoiceSchema);

export default Invoice;
