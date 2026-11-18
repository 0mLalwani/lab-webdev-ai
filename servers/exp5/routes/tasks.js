/* exp5 · CRUD routes for /api/tasks */
const express = require("express");
const { asyncHandler, httpError } = require("../../lib/http");

const SORTS = {
  "-createdat": "-createdAt",
  createdat: "createdAt",
  "-updatedat": "-updatedAt",
  title: "title",
  "-title": "-title",
};

function createTasksRouter(Task) {
  const router = express.Router();

  // LIST — search + filter + sort + pagination
  router.get(
    "/",
    asyncHandler(async (req, res) => {
      const { search, done, sort, page = 1, limit = 50 } = req.query;
      const filter = {};

      if (search) {
        const rx = new RegExp(
          String(search).replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
          "i"
        );
        filter.$or = [{ title: rx }, { description: rx }];
      }
      if (done === "true" || done === "false") {
        filter.done = done === "true";
      }

      const sortSpec = SORTS[String(sort).toLowerCase()] || "-createdAt";
      const pageNum = Math.max(1, Number(page) || 1);
      const limitNum = Math.min(100, Math.max(1, Number(limit) || 50));

      const [tasks, total] = await Promise.all([
        Task.find(filter)
          .sort(sortSpec)
          .skip((pageNum - 1) * limitNum)
          .limit(limitNum)
          .lean(),
        Task.countDocuments(filter),
      ]);

      res.json({
        data: tasks,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          totalPages: Math.max(1, Math.ceil(total / limitNum)),
        },
      });
    })
  );

  // READ one
  router.get(
    "/:id",
    asyncHandler(async (req, res) => {
      const task = await Task.findById(req.params.id).lean();
      if (!task) throw httpError(404, "Task not found");
      res.json({ data: task });
    })
  );

  // CREATE
  router.post(
    "/",
    asyncHandler(async (req, res) => {
      const task = await Task.create({
        title: req.body.title,
        description: req.body.description,
        priority: req.body.priority,
        done: req.body.done,
      });
      res.status(201).json({ data: task });
    })
  );

  // UPDATE (full)
  router.put(
    "/:id",
    asyncHandler(async (req, res) => {
      const task = await Task.findByIdAndUpdate(
        req.params.id,
        {
          title: req.body.title,
          description: req.body.description ?? "",
          priority: req.body.priority ?? "medium",
          done: Boolean(req.body.done),
        },
        { new: true, runValidators: true }
      );
      if (!task) throw httpError(404, "Task not found");
      res.json({ data: task });
    })
  );

  // PATCH (partial)
  router.patch(
    "/:id",
    asyncHandler(async (req, res) => {
      const allowed = ["title", "description", "priority", "done"];
      const updates = Object.fromEntries(
        Object.entries(req.body).filter(([key]) => allowed.includes(key))
      );
      const task = await Task.findByIdAndUpdate(req.params.id, updates, {
        new: true,
        runValidators: true,
      });
      if (!task) throw httpError(404, "Task not found");
      res.json({ data: task });
    })
  );

  // DELETE
  router.delete(
    "/:id",
    asyncHandler(async (req, res) => {
      const task = await Task.findByIdAndDelete(req.params.id);
      if (!task) throw httpError(404, "Task not found");
      res.status(204).end();
    })
  );

  return router;
}

module.exports = { createTasksRouter };
