import { pool } from "../db/database.js";

// GET /api/customers
export async function getCustomers(req, res, next) {
  try {
    const result = await pool.query(`
      SELECT
        c.id,
        c.name,
        c.phone,
        c.email,
        c.address,
        c.city,
        c.state,
        c.pincode,
        c.created_at,
        COUNT(DISTINCT o.id)::int AS order_count,
        COALESCE(SUM(o.total), 0)::numeric AS total_spent
      FROM customers c
      LEFT JOIN orders o
        ON o.customer_id = c.id
        AND o.status <> 'CANCELLED'
      GROUP BY c.id
      ORDER BY c.created_at DESC
    `);

    res.json(result.rows);
  } catch (error) {
    next(error);
  }
}

// POST /api/customers
export async function createCustomer(req, res, next) {
  try {
    const {
      name,
      phone,
      email,
      address,
      city,
      state,
      pincode
    } = req.body;

    if (!name || !phone) {
      return res.status(400).json({
        success: false,
        message: "Customer name and phone are required"
      });
    }

    const result = await pool.query(
      `
      INSERT INTO customers
        (name, phone, email, address, city, state, pincode)
      VALUES
        ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
      `,
      [
        name,
        phone,
        email || null,
        address || null,
        city || null,
        state || null,
        pincode || null
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    next(error);
  }
}

// PUT /api/customers/:id
export async function updateCustomer(req, res, next) {
  try {
    const { id } = req.params;

    const {
      name,
      phone,
      email,
      address,
      city,
      state,
      pincode
    } = req.body;

    if (!name || !phone) {
      return res.status(400).json({
        success: false,
        message: "Customer name and phone are required"
      });
    }

    const result = await pool.query(
      `
      UPDATE customers
      SET
        name = $1,
        phone = $2,
        email = $3,
        address = $4,
        city = $5,
        state = $6,
        pincode = $7
      WHERE id = $8
      RETURNING *
      `,
      [
        name,
        phone,
        email || null,
        address || null,
        city || null,
        state || null,
        pincode || null,
        id
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Customer not found"
      });
    }

    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
}