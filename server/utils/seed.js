import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import User from "../schema/User.js";
import Invoice from "../schema/Invoice.js";

dotenv.config();

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/micro-lending";

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    // Clear existing data
    await User.deleteMany({});
    await Invoice.deleteMany({});
    console.log("🗑️  Cleared existing data");

    // Create a test user
    const hashedPassword = await bcrypt.hash("password123", 10);
    const testUser = await User.create({
      email: "admin@example.com",
      password: hashedPassword,
      role: "finance_manager",
      name: "Admin User",
    });
    console.log("👤 Created test user: admin@example.com / password123");

    // Generate 20 sample invoices
    const paymentStatuses = ["pending", "paid", "overdue"];
    const invoices = [];

    for (let i = 1; i <= 20; i++) {
      const status = paymentStatuses[i % 3];
      invoices.push({
        identifier: `INV-2025-${String(i).padStart(3, "0")}`,
        customer_name: `Customer ${i}`,
        company: `Company ${i}`,
        email: `customer${i}@example.com`,
        phone: `555-${1000 + i}`,
        amount_due: 1000 + i * 100,
        payment_status: status,
        invoice_date: `2025-11-${String((i % 28) + 1).padStart(2, "0")}`,
        due_date: `2025-12-${String((i % 28) + 1).padStart(2, "0")}`,
        payment_date:
          status === "paid"
            ? `2025-11-${String((i % 28) + 1).padStart(2, "0")}`
            : null,
        reference: `PO-10${i}`,
        billing_address: `${i} Main St, City ${i}`,
        notes_to_customer: i % 2 === 0 ? "Thank you for your business!" : "",
        created_by: testUser._id,
      });
    }

    await Invoice.insertMany(invoices);
    console.log(`📄 Created ${invoices.length} sample invoices`);

    console.log("✅ Database seeded successfully!");
    console.log("\n📋 Test credentials:");
    console.log("   Email: admin@example.com");
    console.log("   Password: password123\n");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Disconnected from MongoDB");
    process.exit(0);
  }
};

seedDatabase();
