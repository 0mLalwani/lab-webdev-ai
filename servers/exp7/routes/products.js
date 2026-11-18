/* exp7 · RESTful routes for /api/products */
const express = require("express");

const { asyncHandler, httpError } = require("../../lib/http");

const SORT_MAP = {
  price: "price",
  "-price": "-price",
  name: "name",
  "-name": "-name",
  createdat: "-createdAt",
  "-createdat": "createdAt",
};

function createProductsRouter(Product) {
  const router = express.Router();

  // GET /api/products — collection: filter, search, paginate, sort
  router.get(
    "/",
    asyncHandler(async (req, res) => {
      const { category, inStock, search, page = 1, limit = 10, sort } = req.query;
      const filter = {};

      if (category) filter.category = String(category).toLowerCase();
      if (inStock === "true" || inStock === "false")
        filter.inStock = inStock === "true";
      if (search) {
        const rx = new RegExp(
          String(search).replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
          "i"
        );
        filter.$or = [{ name: rx }, { description: rx }];
      }

      const pageNum = Math.max(1, Number(page) || 1);
      const limitNum = Math.min(50, Math.max(1, Number(limit) || 10));
      const sortSpec = SORT_MAP[String(sort).toLowerCase()] || "-createdAt";

      const [data, total] = await Promise.all([
        Product.find(filter)
          .sort(sortSpec)
          .skip((pageNum - 1) * limitNum)
          .limit(limitNum)
          .lean(),
        Product.countDocuments(filter),
      ]);

      res.json({
        data,
        meta: {
          page: pageNum,
          limit: limitNum,
          total,
          totalPages: Math.max(1, Math.ceil(total / limitNum)),
        },
        links: {
          self: `/api/products?page=${pageNum}&limit=${limitNum}`,
          first: `/api/products?page=1&limit=${limitNum}`,
          last: `/api/products?page=${Math.max(
            1,
            Math.ceil(total / limitNum)
          )}&limit=${limitNum}`,
          ...(pageNum > 1
            ? { prev: `/api/products?page=${pageNum - 1}&limit=${limitNum}` }
            : {}),
          ...(pageNum * limitNum < total
            ? { next: `/api/products?page=${pageNum + 1}&limit=${limitNum}` }
            : {}),
        },
      });
    })
  );

  // GET /api/products/:id
  router.get(
    "/:id",
    asyncHandler(async (req, res) => {
      const product = await Product.findById(req.params.id).lean();
      if (!product) throw httpError(404, "Product not found");
      res.json({ data: product });
    })
  );

  // POST /api/products — 201 + Location header
  router.post(
    "/",
    asyncHandler(async (req, res) => {
      const { name, description, category, price, quantity, inStock } = req.body;
      const product = await Product.create({
        name,
        description,
        category,
        price,
        quantity,
        inStock,
      });
      res
        .status(201)
        .location(`/api/products/${product._id}`)
        .json({ data: product });
    })
  );

  // PUT /api/products/:id — full replace
  router.put(
    "/:id",
    asyncHandler(async (req, res) => {
      const product = await Product.findByIdAndUpdate(
        req.params.id,
        {
          name: req.body.name,
          description: req.body.description ?? "",
          category: req.body.category,
          price: req.body.price,
          quantity: req.body.quantity ?? 0,
          inStock: Boolean(req.body.inStock ?? true),
        },
        { new: true, runValidators: true }
      );
      if (!product) throw httpError(404, "Product not found");
      res.json({ data: product });
    })
  );

  // PATCH /api/products/:id — partial update
  router.patch(
    "/:id",
    asyncHandler(async (req, res) => {
      const allowed = ["name", "description", "category", "price", "quantity", "inStock"];
      const updates = Object.fromEntries(
        Object.entries(req.body).filter(([key]) => allowed.includes(key))
      );
      const product = await Product.findByIdAndUpdate(req.params.id, updates, {
        new: true,
        runValidators: true,
      });
      if (!product) throw httpError(404, "Product not found");
      res.json({ data: product });
    })
  );

  // DELETE /api/products/:id — 204 No Content
  router.delete(
    "/:id",
    asyncHandler(async (req, res) => {
      const product = await Product.findByIdAndDelete(req.params.id);
      if (!product) throw httpError(404, "Product not found");
      res.status(204).end();
    })
  );

  return router;
}

module.exports = { createProductsRouter };
