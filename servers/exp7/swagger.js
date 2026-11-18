/* exp7 · AI-generated OpenAPI 3.0 specification (served with Swagger UI) */
const swaggerJsdoc = require("swagger-jsdoc");

const spec = swaggerJsdoc({
  definition: {
    openapi: "3.0.3",
    info: {
      title: "exp7 · Products REST API",
      version: "1.0.0",
      description:
        "RESTful API demo for the exp7 experiment. AI-generated documentation — filter, paginate and sort the product collection, full CRUD on single products.",
      contact: { name: "JU Web Dev AI experiments" },
    },
    servers: [
      { url: "http://localhost:4007", description: "Local dev server" },
    ],
    tags: [{ name: "Products", description: "Product collection & items" }],
    components: {
      schemas: {
        Product: {
          type: "object",
          properties: {
            _id: { type: "string", example: "65f1c2e4a1b2c3d4e5f60712" },
            name: { type: "string", example: "Aurora Wireless Headphones" },
            description: { type: "string", example: "Over-ear ANC headphones." },
            category: {
              type: "string",
              enum: ["electronics", "apparel", "books", "home"],
            },
            price: { type: "number", example: 129.99 },
            quantity: { type: "integer", example: 42 },
            inStock: { type: "boolean", example: true },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        Error: {
          type: "object",
          properties: {
            error: { type: "string", example: "Validation Error" },
            message: { type: "string" },
            details: {
              type: "object",
              additionalProperties: { type: "string" },
              example: { name: "Name is required" },
            },
          },
        },
      },
    },
  },
  apis: [], // spec defined inline — no file scanning needed
});

// Append path definitions (kept as data to stay readable).
spec.paths = {
  "/api/products": {
    get: {
      tags: ["Products"],
      summary: "List products (filter, search, paginate, sort)",
      parameters: [
        { name: "category", in: "query", schema: { type: "string", enum: ["electronics", "apparel", "books", "home"] } },
        { name: "inStock", in: "query", schema: { type: "boolean" } },
        { name: "search", in: "query", schema: { type: "string" }, description: "Regex search over name + description" },
        { name: "page", in: "query", schema: { type: "integer", default: 1 } },
        { name: "limit", in: "query", schema: { type: "integer", default: 10, maximum: 50 } },
        { name: "sort", in: "query", schema: { type: "string", enum: ["price", "-price", "name", "-name", "createdAt", "-createdAt"] } },
      ],
      responses: {
        200: {
          description: "Paginated collection with pagination metadata and navigation links",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  data: { type: "array", items: { $ref: "#/components/schemas/Product" } },
                  meta: { type: "object", properties: { page: { type: "integer" }, limit: { type: "integer" }, total: { type: "integer" }, totalPages: { type: "integer" } } },
                  links: { type: "object", additionalProperties: { type: "string" } },
                },
              },
            },
          },
        },
      },
    },
    post: {
      tags: ["Products"],
      summary: "Create a product",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["name", "category", "price"],
              properties: {
                name: { type: "string" },
                description: { type: "string" },
                category: { type: "string", enum: ["electronics", "apparel", "books", "home"] },
                price: { type: "number", minimum: 0 },
                quantity: { type: "integer", minimum: 0 },
                inStock: { type: "boolean" },
              },
            },
          },
        },
      },
      responses: {
        201: { description: "Created — returns the product and a Location header" },
        400: { description: "Validation error", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
      },
    },
  },
  "/api/products/{id}": {
    get: {
      tags: ["Products"],
      summary: "Get one product",
      parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
      responses: {
        200: { description: "The product" },
        404: { description: "Not found" },
      },
    },
    put: {
      tags: ["Products"],
      summary: "Replace a product (full update)",
      parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
      requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/Product" } } } },
      responses: { 200: { description: "Updated product" }, 400: { description: "Validation error" }, 404: { description: "Not found" } },
    },
    patch: {
      tags: ["Products"],
      summary: "Partially update a product",
      parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
      requestBody: { required: true, content: { "application/json": { schema: { type: "object" } } } },
      responses: { 200: { description: "Updated product" }, 404: { description: "Not found" } },
    },
    delete: {
      tags: ["Products"],
      summary: "Delete a product",
      parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
      responses: { 204: { description: "Deleted — no content" }, 404: { description: "Not found" } },
    },
  },
};

module.exports = { spec };
