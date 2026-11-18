/* exp7 · RESTful API server + Swagger docs + Postman-ready endpoints
   Run: npm run server:exp7   (port 4007) */
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");

const { connect } = require("../lib/db");
const { notFound, errorHandler } = require("../lib/http");
const { securityHeaders } = require("../lib/security");
const { productSchema, SEED_PRODUCTS } = require("./models/Product");
const { createProductsRouter } = require("./routes/products");
const { spec } = require("./swagger");

const PORT = Number(process.env.PORT) || Number(process.env.EXP7_PORT) || 4007;
const DB_NAME = "exp7_db";

async function seedProducts(Product) {
  const count = await Product.countDocuments();
  if (count === 0) {
    await Product.insertMany(SEED_PRODUCTS);
    console.log(`[exp7] seeded ${SEED_PRODUCTS.length} products`);
  }
}

async function createApp() {
  const connection = await connect(DB_NAME);
  const Product = connection.model("Product", productSchema);
  await seedProducts(Product);

  const app = express();
  app.use(cors());
  app.set("trust proxy", 1);
  app.use(securityHeaders);
  app.use(express.json());

  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", experiment: "exp7", db: DB_NAME });
  });

  // OpenAPI spec (raw JSON) + Swagger UI
  app.get("/api/openapi.json", (req, res) => res.json(spec));
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(spec));

  app.use("/api/products", createProductsRouter(Product));

  app.use(notFound);
  app.use(errorHandler);
  return app;
}

if (require.main === module) {
  createApp()
    .then((app) =>
      app.listen(PORT, () =>
        console.log(
          `[exp7] REST API on http://localhost:${PORT} · docs at /api-docs`
        )
      )
    )
    .catch((err) => {
      console.error("[exp7] failed to start:", err);
      process.exit(1);
    });
}

module.exports = { createApp };
