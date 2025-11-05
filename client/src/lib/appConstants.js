import {
  Hash,
  User,
  DollarSign,
  Calendar,
  Clock,
  CheckCircle,
} from "lucide-react";

// Default rows per page used across table components
const DEFAULT_ROWS_PER_PAGE = 10;

const availableFilters = [
  { id: "invoice_number", label: "Invoice Number", icon: Hash, type: "text" },
  { id: "customer_name", label: "Customer Name", icon: User, type: "text" },
  { id: "amount_due", label: "Amount", icon: DollarSign, type: "number" },
  { id: "invoice_date", label: "Invoice Date", icon: Calendar, type: "date" },
  { id: "due_date", label: "Due Date", icon: Clock, type: "date" },
  {
    id: "payment_status",
    label: "Payment Status",
    icon: CheckCircle,
    type: "select",
  },
  { id: "customer_number", label: "Customer Number", icon: Hash, type: "text" },
];

// Operator mapping for API payloads
// Maps user-friendly operator labels to backend operator codes
const operatorApiMap = {
  is: "eq",
  contains: "contains",
  "starts with": "starts_with",
  "ends with": "ends_with",
  equals: "eq",
  "greater than": "gt",
  "less than": "lt",
  "greater than or equal": "gte",
  "less than or equal": "lte",
  on: "eq",
  before: "lt",
  after: "gt",
};

const operatorsMap = {
  text: ["equals", "contains", "starts with", "ends with"],
  number: [
    "equals",
    "greater than",
    "less than",
    "greater than or equal",
    "less than or equal",
  ],
  date: ["on", "before", "after"],
  select: ["equals"],
};

// Align with server enum: ["pending", "paid", "overdue"]
const paymentStatusOptions = [
  { value: "pending", label: "Pending" },
  { value: "paid", label: "Paid" },
  { value: "overdue", label: "Overdue" },
];

export {
  availableFilters,
  operatorsMap,
  operatorApiMap,
  paymentStatusOptions,
  DEFAULT_ROWS_PER_PAGE,
};
