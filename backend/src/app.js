import express from "express";
import cors from "cors";

import customerRoutes from "./routes/customerRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import deliveryRoutes from "./routes/deliveryRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";

import {
  notFound,
  errorHandler
} from "./middleware/errorMiddleware.js";

const app = express();


// GLOBAL MIDDLEWARE


app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://crm-software-eight.vercel.app"
    ],
    credentials: true
  })
);

app.use(express.json());




app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "CRM Backend API is running"
  });
});


// API ROUTES

app.use("/api/customers", customerRoutes);

app.use("/api/products", productRoutes);

app.use("/api/orders", orderRoutes);

app.use("/api/deliveries", deliveryRoutes);

app.use("/api/dashboard", dashboardRoutes);


// 404 HANDLER

app.use(notFound);


// GLOBAL ERROR HANDLER

app.use(errorHandler);


export default app;