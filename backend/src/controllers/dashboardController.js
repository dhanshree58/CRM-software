import { pool } from "../db/database.js";

// ======================================================
// DASHBOARD
// GET /api/dashboard
// ======================================================

export async function getDashboard(req, res, next) {
  try {
    // -----------------------------
    // Total sales
    // -----------------------------

    const salesResult = await pool.query(`
      SELECT COALESCE(SUM(total), 0) AS total_sales
      FROM orders
      WHERE status <> 'CANCELLED'
    `);

    // -----------------------------
    // Total orders
    // -----------------------------

    const ordersResult = await pool.query(`
      SELECT COUNT(*)::int AS total_orders
      FROM orders
      WHERE status <> 'CANCELLED'
    `);

    // -----------------------------
    // Total customers
    // -----------------------------

    const customersResult = await pool.query(`
      SELECT COUNT(*)::int AS total_customers
      FROM customers
    `);

    // -----------------------------
    // Pending orders
    // -----------------------------

    const pendingResult = await pool.query(`
      SELECT COUNT(*)::int AS pending_orders
      FROM orders
      WHERE status IN ('PENDING', 'PROCESSING')
    `);

    // -----------------------------
    // Sales chart - last 7 days
    // -----------------------------

    const salesChartResult = await pool.query(`
      SELECT
        TO_CHAR(day, 'DD Mon') AS date,
        COALESCE(SUM(o.total), 0) AS sales
      FROM generate_series(
        CURRENT_DATE - INTERVAL '6 days',
        CURRENT_DATE,
        INTERVAL '1 day'
      ) AS day

      LEFT JOIN orders o
        ON DATE(o.created_at) = day::date
        AND o.status <> 'CANCELLED'

      GROUP BY day
      ORDER BY day
    `);

    // -----------------------------
    // Order status chart
    // -----------------------------

    const statusChartResult = await pool.query(`
      SELECT
        status AS name,
        COUNT(*)::int AS value
      FROM orders
      GROUP BY status
      ORDER BY value DESC
    `);

    // -----------------------------
    // Recent orders
    // -----------------------------

    const recentOrdersResult = await pool.query(`
      SELECT
        o.id,
        o.order_number,
        c.name AS customer_name,
        o.total,
        o.status,
        o.created_at

      FROM orders o

      LEFT JOIN customers c
        ON c.id = o.customer_id

      ORDER BY o.created_at DESC
      LIMIT 5
    `);

    // -----------------------------
    // Low stock products
    // -----------------------------

    const lowStockResult = await pool.query(`
      SELECT
        id,
        name,
        sku,
        stock,
        low_stock_limit
      FROM products
      WHERE stock <= low_stock_limit
      ORDER BY stock ASC, name ASC
      LIMIT 10
    `);

    // -----------------------------
    // Send dashboard response
    // -----------------------------

    res.json({
      totalSales: Number(salesResult.rows[0].total_sales),
      totalOrders: Number(ordersResult.rows[0].total_orders),
      totalCustomers: Number(customersResult.rows[0].total_customers),
      pendingOrders: Number(pendingResult.rows[0].pending_orders),

      salesChart: salesChartResult.rows.map((row) => ({
        date: row.date,
        sales: Number(row.sales)
      })),

      statusChart: statusChartResult.rows.map((row) => ({
        name: row.name,
        value: Number(row.value)
      })),

      recentOrders: recentOrdersResult.rows.map((row) => ({
        ...row,
        total: Number(row.total)
      })),

      lowStock: lowStockResult.rows.map((row) => ({
        ...row,
        stock: Number(row.stock),
        low_stock_limit: Number(row.low_stock_limit)
      }))
    });

  } catch (error) {
    next(error);
  }
}


// ======================================================
// REPORTS
// GET /api/dashboard/reports
// ======================================================

export async function getReports(req, res, next) {
  try {
    // -----------------------------
    // Summary
    // -----------------------------

    const summaryResult = await pool.query(`
      SELECT
        COALESCE(
          SUM(
            CASE
              WHEN status <> 'CANCELLED'
              THEN total
              ELSE 0
            END
          ),
          0
        ) AS total_sales,

        COUNT(
          CASE
            WHEN status <> 'CANCELLED'
            THEN 1
          END
        )::int AS total_orders

      FROM orders
    `);

    // -----------------------------
    // Total customers
    // -----------------------------

    const customersResult = await pool.query(`
      SELECT COUNT(*)::int AS total_customers
      FROM customers
    `);

    // -----------------------------
    // Average order value
    // -----------------------------

    const averageResult = await pool.query(`
      SELECT
        COALESCE(
          AVG(total)
          FILTER (WHERE status <> 'CANCELLED'),
          0
        ) AS average_order_value
      FROM orders
    `);

    // -----------------------------
    // Sales trend - last 30 days
    // -----------------------------

    const salesResult = await pool.query(`
      SELECT
        TO_CHAR(day, 'DD Mon') AS date,
        COALESCE(SUM(o.total), 0) AS sales
      FROM generate_series(
        CURRENT_DATE - INTERVAL '29 days',
        CURRENT_DATE,
        INTERVAL '1 day'
      ) AS day

      LEFT JOIN orders o
        ON DATE(o.created_at) = day::date
        AND o.status <> 'CANCELLED'

      GROUP BY day
      ORDER BY day
    `);

    // -----------------------------
    // Product performance
    // -----------------------------

    const productResult = await pool.query(`
      SELECT
        p.id,
        p.name,
        p.sku,
        COALESCE(SUM(oi.quantity), 0)::int AS quantity,
        COALESCE(SUM(oi.total), 0) AS sales

      FROM products p

      LEFT JOIN order_items oi
        ON oi.product_id = p.id

      LEFT JOIN orders o
        ON o.id = oi.order_id
        AND o.status <> 'CANCELLED'

      GROUP BY
        p.id,
        p.name,
        p.sku

      ORDER BY sales DESC
      LIMIT 10
    `);

    // -----------------------------
    // Payment breakdown
    // -----------------------------

    const paymentResult = await pool.query(`
      SELECT
        payment_method AS name,
        COUNT(*)::int AS value
      FROM orders
      WHERE status <> 'CANCELLED'
      GROUP BY payment_method
      ORDER BY value DESC
    `);

    // -----------------------------
    // Order status
    // -----------------------------

    const statusResult = await pool.query(`
      SELECT
        status AS name,
        COUNT(*)::int AS value
      FROM orders
      GROUP BY status
      ORDER BY value DESC
    `);

    // -----------------------------
    // Response
    // -----------------------------

    res.json({
      totalSales: Number(summaryResult.rows[0].total_sales),

      totalOrders: Number(summaryResult.rows[0].total_orders),

      totalCustomers:
        Number(customersResult.rows[0].total_customers),

      averageOrderValue:
        Number(averageResult.rows[0].average_order_value),

      salesChart: salesResult.rows.map((row) => ({
        date: row.date,
        sales: Number(row.sales)
      })),

      productSales: productResult.rows.map((row) => ({
        id: row.id,
        name: row.name,
        sku: row.sku,
        quantity: Number(row.quantity),
        sales: Number(row.sales)
      })),

      paymentChart: paymentResult.rows,

      statusChart: statusResult.rows
    });

  } catch (error) {
    next(error);
  }
}