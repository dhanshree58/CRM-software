import { pool } from "../db/database.js";

// GET /api/products
export async function getProducts(req, res, next) {
  try {
    const result = await pool.query(`
      SELECT
        id,
        name,
        sku,
        category,
        selling_price,
        purchase_price,
        gst,
        stock,
        low_stock_limit,
        created_at
      FROM products
      ORDER BY created_at DESC
    `);

    res.json(result.rows);
  } catch (error) {
    next(error);
  }
}

// POST /api/products
export async function createProduct(req, res, next) {
  try {
    const {
      name,
      sku,
      category,
      selling_price,
      purchase_price,
      gst,
      stock,
      low_stock_limit
    } = req.body;

    if (!name || selling_price === undefined) {
      return res.status(400).json({
        success: false,
        message: "Product name and selling price are required"
      });
    }

    const result = await pool.query(
      `
      INSERT INTO products
        (
          name,
          sku,
          category,
          selling_price,
          purchase_price,
          gst,
          stock,
          low_stock_limit
        )
      VALUES
        ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
      `,
      [
        name,
        sku || null,
        category || "General",
        Number(selling_price),
        Number(purchase_price || 0),
        Number(gst || 0),
        Number(stock || 0),
        Number(low_stock_limit || 5)
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    next(error);
  }
}

// PUT /api/products/:id
export async function updateProduct(req, res, next) {
  try {
    const { id } = req.params;

    const {
      name,
      sku,
      category,
      selling_price,
      purchase_price,
      gst,
      stock,
      low_stock_limit
    } = req.body;

    if (!name || selling_price === undefined) {
      return res.status(400).json({
        success: false,
        message: "Product name and selling price are required"
      });
    }

    const result = await pool.query(
      `
      UPDATE products
      SET
        name = $1,
        sku = $2,
        category = $3,
        selling_price = $4,
        purchase_price = $5,
        gst = $6,
        stock = $7,
        low_stock_limit = $8
      WHERE id = $9
      RETURNING *
      `,
      [
        name,
        sku || null,
        category || "General",
        Number(selling_price),
        Number(purchase_price || 0),
        Number(gst || 0),
        Number(stock || 0),
        Number(low_stock_limit || 5),
        id
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
}

// DELETE /api/products/:id
export async function deleteProduct(req, res, next) {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      DELETE FROM products
      WHERE id = $1
      RETURNING id
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    res.json({
      success: true,
      message: "Product deleted successfully"
    });
  } catch (error) {
    // Product may already be referenced by order_items.
    if (error.code === "23503") {
      return res.status(409).json({
        success: false,
        message: "This product cannot be deleted because it is used in an existing order"
      });
    }

    next(error);
  }
}