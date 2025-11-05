/**
 * Mock user database for authentication
 */
const MOCK_USERS = [
  {
    id: "user-1",
    email: "admin@microlending.com",
    password: "admin123",
    name: "Admin User",
    role: "admin",
  },
  {
    id: "user-2",
    email: "manager@microlending.com",
    password: "manager123",
    name: "Finance Manager",
    role: "manager",
  },
];

/**
 * Mock invoices data
 */
const MOCK_INVOICES = [
  {
    id: "inv-001",
    identifier: "INV-2024-001",
    customer_name: "Acme Corp",
    company: "Acme Corporation Ltd",
    email: "billing@acme.com",
    phone: "+1-555-0100",
    amount_due: 1500.0,
    payment_status: "paid",
    invoice_date: "2024-01-15",
    due_date: "2024-02-15",
    reference: "PO-12345",
    billing_address: "123 Main St, New York, NY 10001, USA",
    notes_to_customer: "Thank you for your business!",
  },
  {
    id: "inv-002",
    identifier: "INV-2024-002",
    customer_name: "Tech Innovators",
    company: "Tech Innovators Inc",
    email: "accounts@techinnovators.com",
    phone: "+1-555-0200",
    amount_due: 2800.5,
    payment_status: "pending",
    invoice_date: "2024-01-20",
    due_date: "2024-02-20",
    reference: "PO-67890",
    billing_address: "456 Tech Blvd, San Francisco, CA 94102, USA",
    notes_to_customer: "Net 30 payment terms apply.",
  },
  {
    id: "inv-003",
    identifier: "INV-2024-003",
    customer_name: "Global Traders",
    company: "Global Traders LLC",
    email: "finance@globaltraders.com",
    phone: "+1-555-0300",
    amount_due: 950.0,
    payment_status: "overdue",
    invoice_date: "2023-12-10",
    due_date: "2024-01-10",
    reference: "",
    billing_address: "789 Commerce St, Chicago, IL 60601, USA",
    notes_to_customer: "",
  },
  {
    id: "inv-004",
    identifier: "INV-2024-004",
    customer_name: "Startup Hub",
    company: "",
    email: "billing@startuphub.io",
    phone: "+1-555-0400",
    amount_due: 3200.0,
    payment_status: "pending",
    invoice_date: "2024-02-01",
    due_date: "2024-03-01",
    reference: "PO-STARTUP-2024",
    billing_address: "321 Innovation Dr, Austin, TX 78701, USA",
    notes_to_customer: "Early payment discount available.",
  },
  {
    id: "inv-005",
    identifier: "INV-2024-005",
    customer_name: "Enterprise Solutions",
    company: "Enterprise Solutions Group",
    email: "ap@enterprisesolutions.com",
    phone: "+1-555-0500",
    amount_due: 5750.25,
    payment_status: "paid",
    invoice_date: "2024-01-05",
    due_date: "2024-02-05",
    reference: "CONTRACT-2024-A",
    billing_address: "654 Corporate Way, Boston, MA 02101, USA",
    notes_to_customer: "Recurring monthly service fee.",
  },
];

export { MOCK_USERS, MOCK_INVOICES };
