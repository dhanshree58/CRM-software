import dotenv from "dotenv";

import app from "./app.js";
import { testDatabaseConnection } from "./db/database.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

// Test database connection
await testDatabaseConnection();

// Start server
app.listen(PORT, () => {
  console.log("====================================");
  console.log("🚀 CRM Backend Server Started");
  console.log(`📡 Server: http://localhost:${PORT}`);
  console.log(`📊 API: http://localhost:${PORT}/api`);
  console.log("====================================");
});