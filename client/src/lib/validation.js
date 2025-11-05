import * as z from "zod";

import { paymentStatusOptions } from "./appConstants";
const PaymentStatusEnum = z.enum(paymentStatusOptions.map((opt) => opt.value));

export const InvoiceSchema = z.object({
  identifier: z.string().min(1, "Invoice ID is required."),
  paymentStatus: PaymentStatusEnum,
  // Coerce strings from inputs into Date and provide friendly errors
  invoiceDate: z.coerce
    .date({
      required_error: "Invoice Date is required.",
      invalid_type_error: "Invalid date format.",
    })
    .nullable()
    .refine((val) => val !== null, {
      message: "Invoice Date is required.",
    }),
  dueDate: z.coerce
    .date({
      required_error: "Due Date is required.",
      invalid_type_error: "Invalid date format.",
    })
    .nullable()
    .refine((val) => val !== null, {
      message: "Due Date is required.",
    }),
  amountDue: z
    .union([z.number(), z.string()])
    .transform((val) => Number(val))
    .refine((val) => !isNaN(val) && val >= 0, {
      message: "Amount must be a valid number greater than or equal to 0",
    }),
  reference: z.string().optional(),
  notesToCustomer: z.string().optional(),
  customerName: z.string().min(1, "Customer Name/Business is required."),
  customerNumber: z.string().optional(),
  company: z.string().optional(),
  email: z
    .string()
    .min(1, "Email is required.")
    .email("Invalid email address."),
  phone: z.string().min(1, "Phone number is required."),
  billingAddress: z.string().min(1, "Billing Address is required."),
});
