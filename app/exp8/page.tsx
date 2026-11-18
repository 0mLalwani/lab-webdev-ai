"use client";

import * as React from "react";
import Link from "next/link";

import { apiBase } from "@/lib/api";

/* exp8 · Student Management System UI
   Backed by the Express + MongoDB API (npm run server:exp8 → :4008). */

const API = `${apiBase("exp8")}/api`;
const COURSES = ["CSE", "ECE", "ME", "CE"] as const;

type Student = {
  _id: string;
  name: string;
  rollNo: string;
  email: string;
  course: (typeof COURSES)[number];
  year: number;
  gpa: number;
};

type Stats = {
  total: number;
  courses: { course: string; count: number; avgGpa: number }[];
};

type FormState = {
  name: string;
  rollNo: string;
  email: string;
  course: string;
  year: string;
  gpa: string;
};

const EMPTY_FORM: FormState = {
  name: "",
  rollNo: "",
  email: "",
  course: "CSE",
  year: "1",
  gpa: "",
};

const inputCls =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20";

function validate(form: FormState) {
  const errors: Record<string, string> = {};
  if (!form.name.trim()) errors.name = "Name is required";
  if (!/^[A-Za-z0-9-]{3,20}$/.test(form.rollNo.trim()))
    errors.rollNo = "3–20 letters/digits/dashes";
  if (!/^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/.test(form.email.trim()))
    errors.email = "Valid email required";
  const year = Number(form.year);
  if (!Number.isInteger(year) || year < 1 || year > 5)
    errors.year = "Year must be 1–5";
  const gpa = Number(form.gpa);
  if (Number.isNaN(gpa) || gpa < 0 || gpa > 10) errors.gpa = "GPA must be 0–10";
  return errors;
}

export default function Exp8Page() {
  const [students, setStudents] = React.useState<Student[]>([]);
  const [stats, setStats] = React.useState<Stats | null>(null);
  const [total, setTotal] = React.useState(0);
  const [loading, setLoading] = React.useState(true);
  const [offline, setOffline] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const [search, setSearch] = React.useState("");
  const [course, setCourse] = React.useState("all");

  const [form, setForm] = React.useState<FormState>(EMPTY_FORM);
  const [editId, setEditId] = React.useState<string | null>(null);
  const [formErrors, setFormErrors] = React.useState<Record<string, string>>({});
  const [formOpen, setFormOpen] = React.useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = React.useState<string | null>(null);

  const load = React.useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (course !== "all") params.set("course", course);
      const [listRes, statsRes] = await Promise.all([
        fetch(`${API}/students?${params.toString()}`),
        fetch(`${API}/students/stats`),
      ]);
      if (!listRes.ok || !statsRes.ok) throw new Error("API error");
      const listJson = await listRes.json();
      setStudents(listJson.data);
      setTotal(listJson.pagination.total);
      setStats(await statsRes.json());
      setOffline(false);
      setError(null);
    } catch {
      setOffline(true);
      setError("Cannot reach the API — run `npm run server:exp8` (or server:all).");
    } finally {
      setLoading(false);
    }
  }, [search, course]);

  React.useEffect(() => {
    const timer = window.setTimeout(load, 150);
    return () => window.clearTimeout(timer);
  }, [load]);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    const errors = validate(form);
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;

    const body = JSON.stringify({
      name: form.name.trim(),
      rollNo: form.rollNo.trim().toUpperCase(),
      email: form.email.trim(),
      course: form.course,
      year: Number(form.year),
      gpa: Number(form.gpa),
    });

    const res = await fetch(
      editId ? `${API}/students/${editId}` : `${API}/students`,
      {
        method: editId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body,
      }
    );
    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(
        json.details
          ? Object.values(json.details).join(" · ")
          : json.message || json.error || "Request failed"
      );
      return;
    }
    setForm(EMPTY_FORM);
    setEditId(null);
    setFormOpen(false);
    setError(null);
    await load();
  }

  function startEdit(student: Student) {
    setEditId(student._id);
    setForm({
      name: student.name,
      rollNo: student.rollNo,
      email: student.email,
      course: student.course,
      year: String(student.year),
      gpa: String(student.gpa),
    });
    setFormErrors({});
    setFormOpen(true);
  }

  async function removeStudent(id: string) {
    await fetch(`${API}/students/${id}`, { method: "DELETE" });
    setConfirmDeleteId(null);
    await load();
  }

  const overallGpa = stats && stats.total > 0
    ? (
        stats.courses.reduce((sum, c) => sum + c.avgGpa * c.count, 0) / stats.total
      ).toFixed(2)
    : "—";

  return (
    <main className="mx-auto min-h-svh w-full max-w-5xl px-5 py-12 sm:px-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-indigo-600">
            exp8 · student management system
          </span>
          <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
            Students
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-500">
            MongoDB + Express.js — CRUD, search, course filters and aggregate
            stats. Optimizations &amp; debugging log in{" "}
            <code className="rounded bg-slate-100 px-1">
              servers/exp8/README.md
            </code>
            .
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setEditId(null);
            setForm(EMPTY_FORM);
            setFormErrors({});
            setFormOpen((open) => !open);
          }}
          className="rounded-full bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
        >
          {formOpen ? "Close form" : "+ Add student"}
        </button>
      </header>

      <div
        className={`mt-5 flex items-center gap-2 rounded-xl px-4 py-3 text-xs font-medium ${
          offline
            ? "bg-rose-50 text-rose-700 ring-1 ring-rose-200"
            : "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
        }`}
        role="status"
      >
        <span
          className={`size-2 rounded-full ${offline ? "bg-rose-500" : "bg-emerald-500"}`}
          aria-hidden="true"
        />
        {offline
          ? "API offline — start it with:  npm run server:exp8"
          : `API online · ${total} student${total === 1 ? "" : "s"} in the database`}
      </div>

      {error && (
        <p
          role="alert"
          className="mt-4 rounded-xl bg-rose-50 px-4 py-3 text-xs font-medium text-rose-700 ring-1 ring-rose-200"
        >
          {error}
        </p>
      )}

      {/* Stats (aggregate endpoint) */}
      {stats && (
        <section className="mt-6 grid gap-4 sm:grid-cols-3" aria-label="Stats">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Total students
            </p>
            <p className="mt-1 text-3xl font-bold text-indigo-600">{stats.total}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Courses
            </p>
            <p className="mt-1 text-3xl font-bold text-indigo-600">
              {stats.courses.length}
            </p>
            <p className="mt-1 text-[11px] text-slate-400">
              {stats.courses.map((c) => `${c.course} (${c.count})`).join(" · ")}
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Average GPA
            </p>
            <p className="mt-1 text-3xl font-bold text-indigo-600">{overallGpa}</p>
          </div>
        </section>
      )}

      {/* Toolbar */}
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <input
          className={`${inputCls} sm:max-w-xs`}
          placeholder="Search name / roll / email…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Search students"
        />
        <div className="flex flex-wrap gap-2">
          {["all", ...COURSES].map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCourse(c)}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold transition ${
                course === c
                  ? "bg-indigo-600 text-white"
                  : "border border-slate-300 text-slate-600 hover:bg-slate-100"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Add / edit form */}
      {formOpen && (
        <form
          onSubmit={submit}
          noValidate
          className="mt-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
        >
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">
            {editId
              ? "PUT /api/students/:id — update"
              : "POST /api/students — create"}
          </h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <label className="block">
              <span className="text-xs font-semibold text-slate-500">Name *</span>
              <input
                className={`mt-1 ${inputCls} ${formErrors.name ? "!border-rose-400 !bg-rose-50" : ""}`}
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                aria-invalid={Boolean(formErrors.name)}
              />
              {formErrors.name && (
                <span className="mt-1 block text-[11px] font-medium text-rose-600">
                  {formErrors.name}
                </span>
              )}
            </label>
            <label className="block">
              <span className="text-xs font-semibold text-slate-500">Roll No *</span>
              <input
                className={`mt-1 ${inputCls} ${formErrors.rollNo ? "!border-rose-400 !bg-rose-50" : ""}`}
                placeholder="CSE-26-042"
                value={form.rollNo}
                onChange={(e) => setForm({ ...form, rollNo: e.target.value })}
                aria-invalid={Boolean(formErrors.rollNo)}
              />
              {formErrors.rollNo && (
                <span className="mt-1 block text-[11px] font-medium text-rose-600">
                  {formErrors.rollNo}
                </span>
              )}
            </label>
            <label className="block">
              <span className="text-xs font-semibold text-slate-500">Email *</span>
              <input
                type="email"
                className={`mt-1 ${inputCls} ${formErrors.email ? "!border-rose-400 !bg-rose-50" : ""}`}
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                aria-invalid={Boolean(formErrors.email)}
              />
              {formErrors.email && (
                <span className="mt-1 block text-[11px] font-medium text-rose-600">
                  {formErrors.email}
                </span>
              )}
            </label>
            <label className="block">
              <span className="text-xs font-semibold text-slate-500">Course *</span>
              <select
                className={`mt-1 ${inputCls}`}
                value={form.course}
                onChange={(e) => setForm({ ...form, course: e.target.value })}
              >
                {COURSES.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="text-xs font-semibold text-slate-500">
                Year (1–5) *
              </span>
              <input
                type="number"
                min={1}
                max={5}
                className={`mt-1 ${inputCls} ${formErrors.year ? "!border-rose-400 !bg-rose-50" : ""}`}
                value={form.year}
                onChange={(e) => setForm({ ...form, year: e.target.value })}
                aria-invalid={Boolean(formErrors.year)}
              />
              {formErrors.year && (
                <span className="mt-1 block text-[11px] font-medium text-rose-600">
                  {formErrors.year}
                </span>
              )}
            </label>
            <label className="block">
              <span className="text-xs font-semibold text-slate-500">
                GPA (0–10) *
              </span>
              <input
                type="number"
                step="0.1"
                min={0}
                max={10}
                className={`mt-1 ${inputCls} ${formErrors.gpa ? "!border-rose-400 !bg-rose-50" : ""}`}
                value={form.gpa}
                onChange={(e) => setForm({ ...form, gpa: e.target.value })}
                aria-invalid={Boolean(formErrors.gpa)}
              />
              {formErrors.gpa && (
                <span className="mt-1 block text-[11px] font-medium text-rose-600">
                  {formErrors.gpa}
                </span>
              )}
            </label>
          </div>
          <div className="mt-4 flex gap-2">
            <button
              type="submit"
              className="rounded-full bg-indigo-600 px-6 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
            >
              {editId ? "Save changes" : "Add student"}
            </button>
            <button
              type="button"
              onClick={() => {
                setFormOpen(false);
                setEditId(null);
                setFormErrors({});
              }}
              className="rounded-full border border-slate-300 px-6 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Students table */}
      <section className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {loading ? (
          <p className="p-6 text-center text-sm text-slate-400">Loading…</p>
        ) : students.length === 0 ? (
          <p className="p-6 text-center text-sm text-slate-400">
            No students match — adjust the filters or add one.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="px-4 py-3">Roll No</th>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Course</th>
                  <th className="px-4 py-3">Year</th>
                  <th className="px-4 py-3">GPA</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {students.map((student) => (
                  <tr key={student._id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-mono text-xs font-semibold text-slate-600">
                      {student.rollNo}
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-semibold">{student.name}</p>
                      <p className="text-xs text-slate-400">{student.email}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-bold text-indigo-600">
                        {student.course}
                      </span>
                    </td>
                    <td className="px-4 py-3">{student.year}</td>
                    <td className="px-4 py-3 font-semibold">
                      {student.gpa.toFixed(1)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => startEdit(student)}
                          className="rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-500 hover:bg-slate-100"
                        >
                          Edit
                        </button>
                        {confirmDeleteId === student._id ? (
                          <button
                            type="button"
                            onClick={() => removeStudent(student._id)}
                            className="rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-rose-700"
                          >
                            Confirm?
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setConfirmDeleteId(student._id)}
                            className="rounded-lg px-3 py-1.5 text-xs font-semibold text-rose-500 hover:bg-rose-50"
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <footer className="mt-12 border-t border-dashed border-slate-300 pt-5 text-xs text-slate-400">
        exp8 · Student Management System — MongoDB · Express.js (AI-assisted
        debugging &amp; optimization) ·{" "}
        <Link href="/" className="text-indigo-600 hover:underline">
          all experiments
        </Link>
      </footer>
    </main>
  );
}

