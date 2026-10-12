import { pool } from "../db/database.js";

// ======================================================
// GET ALL DELIVERIES
// GET /api/deliveries
// ======================================================

export async function getDeliveries(req, res, next) {
  try {
    const result = await pool.query(`
      SELECT
        d.id,
        d.order_id,
        o.order_number,

        c.name AS customer_name,
        c.phone AS customer_phone,

        d.delivery_person,
        d.phone AS delivery_phone,
        d.address,
        d.status,
        d.delivered_at,
        d.created_at,

        o.total AS order_total

      FROM deliveries d

      INNER JOIN orders o
        ON o.id = d.order_id

      LEFT JOIN customers c
        ON c.id = o.customer_id

      ORDER BY d.created_at DESC
    `);

    res.json(result.rows);
  } catch (error) {
    next(error);
  }
}


// ======================================================
// CREATE DELIVERY
// POST /api/deliveries
// ======================================================

export async function createDelivery(req, res, next) {
  try {
    const {
      order_id,
      delivery_person,
      phone,
      address,
      status = "ASSIGNED"
    } = req.body;

    if (!order_id) {
      return res.status(400).json({
        success: false,
        message: "Order is required"
      });
    }

    // --------------------------------------------------
    // Check order exists
    // --------------------------------------------------

    const orderResult = await pool.query(
      `
      SELECT
        id,
        status
      FROM orders
      WHERE id = $1
      `,
      [order_id]
    );

    if (orderResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    // --------------------------------------------------
    // Check whether delivery already exists
    // --------------------------------------------------

    const existingResult = await pool.query(
      `
      SELECT id
      FROM deliveries
      WHERE order_id = $1
      `,
      [order_id]
    );

    if (existingResult.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: "Delivery already exists for this order"
      });
    }

    // --------------------------------------------------
    // Validate status
    // --------------------------------------------------

    const allowedStatuses = [
      "ASSIGNED",
      "OUT_FOR_DELIVERY",
      "DELIVERED",
      "CANCELLED"
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid delivery status"
      });
    }

    // --------------------------------------------------
    // Create delivery
    // --------------------------------------------------

    const deliveryResult = await pool.query(
      `
      INSERT INTO deliveries
      (
        order_id,
        delivery_person,
        phone,
        address,
        status,
        delivered_at
      )
      VALUES
      (
        $1,
        $2,
        $3,
        $4,
        $5,
        $6
      )
      RETURNING *
      `,
      [
        order_id,
        delivery_person || null,
        phone || null,
        address || null,
        status,
        status === "DELIVERED" ? new Date() : null
      ]
    );

    // --------------------------------------------------
    // Update order status
    // --------------------------------------------------

    let orderStatus = "SHIPPED";

    if (status === "DELIVERED") {
      orderStatus = "DELIVERED";
    }

    if (status === "CANCELLED") {
      orderStatus = "CANCELLED";
    }

    await pool.query(
      `
      UPDATE orders
      SET
        status = $1,
        updated_at = NOW()
      WHERE id = $2
      `,
      [orderStatus, order_id]
    );

    res.status(201).json({
      success: true,
      message: "Delivery created successfully",
      delivery: deliveryResult.rows[0]
    });

  } catch (error) {
    next(error);
  }
}


// ======================================================
// UPDATE DELIVERY
// PUT /api/deliveries/:id
// ======================================================

export async function updateDelivery(req, res, next) {
  try {
    const { id } = req.params;

    const {
      delivery_person,
      phone,
      address,
      status
    } = req.body;

    const allowedStatuses = [
      "ASSIGNED",
      "OUT_FOR_DELIVERY",
      "DELIVERED",
      "CANCELLED"
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid delivery status"
      });
    }

    // --------------------------------------------------
    // Find delivery
    // --------------------------------------------------

    const existingResult = await pool.query(
      `
      SELECT
        id,
        order_id
      FROM deliveries
      WHERE id = $1
      `,
      [id]
    );

    if (existingResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Delivery not found"
      });
    }

    const orderId = existingResult.rows[0].order_id;

    // --------------------------------------------------
    // Delivered timestamp
    // --------------------------------------------------

    const deliveredAt =
      status === "DELIVERED"
        ? new Date()
        : null;

    // --------------------------------------------------
    // Update delivery
    // --------------------------------------------------

    const result = await pool.query(
      `
      UPDATE deliveries
      SET
        delivery_person = $1,
        phone = $2,
        address = $3,
        status = $4,
        delivered_at = $5
      WHERE id = $6
      RETURNING *
      `,
      [
        delivery_person || null,
        phone || null,
        address || null,
        status,
        deliveredAt,
        id
      ]
    );

    // --------------------------------------------------
    // Synchronize order status
    // --------------------------------------------------

    let orderStatus = "SHIPPED";

    if (status === "ASSIGNED") {
      orderStatus = "SHIPPED";
    }

    if (status === "OUT_FOR_DELIVERY") {
      orderStatus = "SHIPPED";
    }

    if (status === "DELIVERED") {
      orderStatus = "DELIVERED";
    }

    if (status === "CANCELLED") {
      orderStatus = "CANCELLED";
    }

    await pool.query(
      `
      UPDATE orders
      SET
        status = $1,
        updated_at = NOW()
      WHERE id = $2
      `,
      [orderStatus, orderId]
    );

    res.json({
      success: true,
      message: "Delivery updated successfully",
      delivery: result.rows[0]
    });

  } catch (error) {
    next(error);
  }
}