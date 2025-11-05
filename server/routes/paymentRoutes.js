import express from "express";
import {
  getInvoiceByToken,
  payInvoiceByToken,
} from "../controllers/invoiceController.js";

const router = express.Router();

// Public payment endpoints - no auth middleware here
router.get("/:token", getInvoiceByToken);
router.post("/:token", payInvoiceByToken);

export default router;
