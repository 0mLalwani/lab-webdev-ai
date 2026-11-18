/* exp8 · Student CRUD routes + stats (Student Management System)
   Optimizations applied here:
   - .lean() on reads (plain objects, skips Mongoose document overhead)
   - pagination with hard caps (limit <= 100)
   - filtered countDocuments only (no full collection scans for totals)
   - sort whitelist (no sort-key injection from user input) */
const express = require("express");
const { asyncHandler, httpError } = require("../../lib/http");

const SORTS = {
  gpa: "gpa",
  "-gpa": "-gpa",
  name: "name",
  "-name": "-name",
  rollno: "rollNo",
  "-rollno": "-rollNo",
  createdat: "-createdAt",
  "-createdat": "createdAt",
};

function createStudentsRouter(Student) {
  const router = express.Router();

  // GET /api/students/stats — must be registered BEFORE /:id
  // (aggregate pipeline: per-course counts + average GPA in one round-trip)
  router.get(
    "/stats",
    asyncHandler(async (req, res) => {
      const perCourse = await Student.aggregate([
        { $group: { _id: "$course", count: { $sum: 1 }, avgGpa: { $avg: "$gpa" } } },
        { $sort: { _id: 1 } },
      ]);

      const total = await Student.countDocuments();
      res.json({
        total,
        courses: perCourse.map((c) => ({
          course: c._id,
          count: c.count,
          avgGpa: Number((c.avgGpa ?? 0).toFixed(2)),
        })),
      });
    })
  );

  // GET /api/students — search + course filter + pagination + sort
  router.get(
    "/",
    asyncHandler(async (req, res) => {
      const { search, course, page = 1, limit = 25, sort } = req.query;
      const filter = {};

      if (course) filter.course = String(course).toUpperCase();
      if (search) {
        const rx = new RegExp(
          String(search).replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
          "i"
        );
        filter.$or = [{ name: rx }, { rollNo: rx }, { email: rx }];
      }

      const pageNum = Math.max(1, Number(page) || 1);
      const limitNum = Math.min(100, Math.max(1, Number(limit) || 25));
      const sortSpec = SORTS[String(sort).toLowerCase()] || "-createdAt";

      const [data, total] = await Promise.all([
        Student.find(filter)
          .sort(sortSpec)
          .skip((pageNum - 1) * limitNum)
          .limit(limitNum)
          .lean(), // optimization: plain JS objects, no Mongoose docs
        Student.countDocuments(filter),
      ]);

      res.json({
        data,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          totalPages: Math.max(1, Math.ceil(total / limitNum)),
        },
      });
    })
  );

  // GET /api/students/:id
  router.get(
    "/:id",
    asyncHandler(async (req, res) => {
      const student = await Student.findById(req.params.id).lean();
      if (!student) throw httpError(404, "Student not found");
      res.json({ data: student });
    })
  );

  // POST /api/students — 201 Created
  router.post(
    "/",
    asyncHandler(async (req, res) => {
      const { name, rollNo, email, course, year, gpa } = req.body;
      const student = await Student.create({ name, rollNo, email, course, year, gpa });
      res.status(201).json({ data: student });
    })
  );

  // PUT /api/students/:id — full replace
  router.put(
    "/:id",
    asyncHandler(async (req, res) => {
      const student = await Student.findByIdAndUpdate(
        req.params.id,
        {
          name: req.body.name,
          rollNo: req.body.rollNo,
          email: req.body.email,
          course: req.body.course,
          year: req.body.year,
          gpa: req.body.gpa,
        },
        { new: true, runValidators: true }
      );
      if (!student) throw httpError(404, "Student not found");
      res.json({ data: student });
    })
  );

  // PATCH /api/students/:id — partial update
  router.patch(
    "/:id",
    asyncHandler(async (req, res) => {
      const allowed = ["name", "rollNo", "email", "course", "year", "gpa"];
      const updates = Object.fromEntries(
        Object.entries(req.body).filter(([key]) => allowed.includes(key))
      );
      const student = await Student.findByIdAndUpdate(req.params.id, updates, {
        new: true,
        runValidators: true,
      });
      if (!student) throw httpError(404, "Student not found");
      res.json({ data: student });
    })
  );

  // DELETE /api/students/:id — 204 No Content
  router.delete(
    "/:id",
    asyncHandler(async (req, res) => {
      const student = await Student.findByIdAndDelete(req.params.id);
      if (!student) throw httpError(404, "Student not found");
      res.status(204).end();
    })
  );

  return router;
}

module.exports = { createStudentsRouter };
