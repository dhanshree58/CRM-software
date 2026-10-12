import { pool } from "../db/database.js";

// ======================================================
// GET ALL ORDERS
// GET /api/orders
// ======================================================

export async function getOrders(req, res, next) {
  try {
    const result = await pool.query(`
      SELECT
        o.id,
        o.order_number,
        o.customer_id,
        c.name AS customer_name,
        c.phone AS customer_phone,
        o.status,
        o.subtotal,
        o.discount,
        o.tax,
        o.total,
        o.payment_status,
        o.payment_method,
        o.created_at,
        o.updated_at,

        (
          SELECT COUNT(*)
          FROM order_items oi
          WHERE oi.order_id = o.id
        )::int AS item_count

      FROM orders o

      LEFT JOIN customers c
        ON c.id = o.customer_id

      ORDER BY o.created_at DESC
    `);

    res.json(result.rows);
  } catch (error) {
    next(error);
  }
}


// ======================================================
// GET SINGLE ORDER
// GET /api/orders/:id
// ======================================================

export async function getOrder(req, res, next) {
  try {
    const { id } = req.params;

    const orderResult = await pool.query(
      `
      SELECT
        o.id,
        o.order_number,
        o.customer_id,
        c.name AS customer_name,
        c.phone AS customer_phone,
        c.email AS customer_email,
        c.address AS customer_address,
        c.city AS customer_city,
        c.state AS customer_state,
        c.pincode AS customer_pincode,

        o.status,
        o.subtotal,
        o.discount,
        o.tax,
        o.total,
        o.payment_status,
        o.payment_method,
        o.created_at,
        o.updated_at

      FROM orders o

      LEFT JOIN customers c
        ON c.id = o.customer_id

      WHERE o.id = $1
      `,
      [id]
    );

    if (orderResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    const order = orderResult.rows[0];

    const itemsResult = await pool.query(
      `
      SELECT
        oi.id,
        oi.product_id,
        p.name AS product_name,
        p.sku,
        oi.quantity,
        oi.price,
        oi.total

      FROM order_items oi

      LEFT JOIN products p
        ON p.id = oi.product_id

      WHERE oi.order_id = $1

      ORDER BY oi.id
      `,
      [id]
    );

    order.items = itemsResult.rows;

    res.json(order);
  } catch (error) {
    next(error);
  }
}


// ======================================================
// CREATE ORDER
// POST /api/orders
// ======================================================

export async function createOrder(req, res, next) {
  const client = await pool.connect();

  try {
    const {
      customer_id,
      payment_method = "COD",
      discount = 0,
      items = []
    } = req.body;

    // -----------------------------
    // Validate request
    // -----------------------------

    if (!customer_id) {
      return res.status(400).json({
        success: false,
        message: "Customer is required"
      });
    }

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one product is required"
      });
    }

    // -----------------------------
    // Check customer
    // -----------------------------

    const customerResult = await client.query(
      `
      SELECT id
      FROM customers
      WHERE id = $1
      `,
      [customer_id]
    );

    if (customerResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Customer not found"
      });
    }

    // -----------------------------
    // Start transaction
    // -----------------------------

    await client.query("BEGIN");

    let subtotal = 0;
    let tax = 0;

    const processedItems = [];

    // -----------------------------
    // Process each product
    // -----------------------------

    for (const item of items) {
      const productId = Number(item.product_id);
      const quantity = Number(item.quantity);

      if (!productId || quantity <= 0) {
        throw new Error("Invalid product or quantity");
      }

      // Lock product row while processing order
      const productResult = await client.query(
        `
        SELECT
          id,
          name,
          selling_price,
          gst,
          stock
        FROM products
        WHERE id = $1
        FOR UPDATE
        `,
        [productId]
      );

      if (productResult.rows.length === 0) {
        throw new Error(`Product with ID ${productId} not found`);
      }

      const product = productResult.rows[0];

      // -----------------------------
      // Check stock
      // -----------------------------

      if (Number(product.stock) < quantity) {
        throw new Error(
          `Insufficient stock for ${product.name}. Available stock: ${product.stock}`
        );
      }

      const price = Number(product.selling_price);
      const gstRate = Number(product.gst || 0);

      const lineTotal = price * quantity;
      const lineTax = lineTotal * (gstRate / 100);

      subtotal += lineTotal;
      tax += lineTax;

      processedItems.push({
        product_id: product.id,
        product_name: product.name,
        quantity,
        price,
        total: lineTotal
      });
    }

    // -----------------------------
    // Calculate discount
    // -----------------------------

    let discountAmount = Number(discount) || 0;

    if (discountAmount < 0) {
      discountAmount = 0;
    }

    if (discountAmount > subtotal) {
      discountAmount = subtotal;
    }

    // -----------------------------
    // Final total
    // -----------------------------

    const total = subtotal - discountAmount + tax;

    // -----------------------------
    // Generate order number
    // -----------------------------

    const orderNumber = `ORD-${Date.now()}`;

    // -----------------------------
    // Payment status
    // -----------------------------

    const paymentStatus =
      payment_method === "COD"
        ? "PENDING"
        : "PAID";

    // -----------------------------
    // Insert order
    // -----------------------------

    const orderResult = await client.query(
      `
      INSERT INTO orders
      (
        order_number,
        customer_id,
        status,
        subtotal,
        discount,
        tax,
        total,
        payment_status,
        payment_method
      )
      VALUES
      (
        $1,
        $2,
        'PENDING',
        $3,
        $4,
        $5,
        $6,
        $7,
        $8
      )
      RETURNING *
      `,
      [
        orderNumber,
        customer_id,
        subtotal,
        discountAmount,
        tax,
        total,
        paymentStatus,
        payment_method
      ]
    );

    const order = orderResult.rows[0];

    // -----------------------------
    // Insert order items
    // -----------------------------

    for (const item of processedItems) {
      await client.query(
        `
        INSERT INTO order_items
        (
          order_id,
          product_id,
          quantity,
          price,
          total
        )
        VALUES
        ($1, $2, $3, $4, $5)
        `,
        [
          order.id,
          item.product_id,
          item.quantity,
          item.price,
          item.total
        ]
      );

      // -----------------------------
      // Deduct stock
      // -----------------------------

      await client.query(
        `
        UPDATE products
        SET stock = stock - $1
        WHERE id = $2
        `,
        [
          item.quantity,
          item.product_id
        ]
      );
    }

    // -----------------------------
    // Insert payment record
    // -----------------------------

    if (paymentStatus === "PAID") {
      await client.query(
        `
        INSERT INTO payments
        (
          order_id,
          amount,
          method,
          status
        )
        VALUES
        ($1, $2, $3, 'SUCCESS')
        `,
        [
          order.id,
          total,
          payment_method
        ]
      );
    }

    // -----------------------------
    // Commit transaction
    // -----------------------------

    await client.query("COMMIT");

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      order
    });

  } catch (error) {

    // -----------------------------
    // Rollback if anything fails
    // -----------------------------

    await client.query("ROLLBACK");

    next(error);

  } finally {

    // Always release database client
    client.release();
  }
}


// ======================================================
// UPDATE ORDER STATUS
// PUT /api/orders/:id/status
// ======================================================

export async function updateOrderStatus(req, res, next) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = [
      "PENDING",
      "PROCESSING",
      "SHIPPED",
      "DELIVERED",
      "CANCELLED"
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order status"
      });
    }

    const result = await pool.query(
      `
      UPDATE orders
      SET
        status = $1,
        updated_at = NOW()
      WHERE id = $2
      RETURNING *
      `,
      [status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    res.json({
      success: true,
      message: "Order status updated successfully",
      order: result.rows[0]
    });

  } catch (error) {
    next(error);
  }
}