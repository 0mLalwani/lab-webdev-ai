"use client";

import * as React from "react";
import Link from "next/link";

import { apiBase } from "@/lib/api";

/* exp5 · React CRUD interface backed by the Express server
   (npm run server:exp5 → http://localhost:4005). */

const API = `${apiBase("exp5")}/api`;

type Task = {
  _id: string;
  title: string;
  description: string;
  priority: "low" | "medium" | "high";
  done: boolean;
  createdAt: string;
};

const PRIORITY_STYLES: Record<Task["priority"], string> = {
  high: "bg-rose-100 text-rose-700",
  medium: "bg-amber-100 text-amber-700",
  low: "bg-emerald-100 text-emerald-700",
};

const inputCls =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20";

export default function Exp5Page() {
  const [tasks, setTasks] = React.useState<Task[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [offline, setOffline] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [priority, setPriority] = React.useState<Task["priority"]>("medium");

  const [search, setSearch] = React.useState("");
  const [filter, setFilter] = React.useState("all");

  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [editTitle, setEditTitle] = React.useState("");
  const [editPriority, setEditPriority] = React.useState<Task["priority"]>("medium");
  const [confirmDeleteId, setConfirmDeleteId] = React.useState<string | null>(null);

  const load = React.useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (filter !== "all") params.set("done", filter);
      const res = await fetch(`${API}/tasks?${params.toString()}`);
      if (!res.ok) throw new Error(`API responded ${res.status}`);
      const json = await res.json();
      setTasks(json.data);
      setOffline(false);
      setError(null);
    } catch {
      setOffline(true);
      setError(
        "Cannot reach the Express server — run `npm run server:exp5` and try again."
      );
    } finally {
      setLoading(false);
    }
  }, [search, filter]);

  React.useEffect(() => {
    const timer = window.setTimeout(load, 150);
    return () => window.clearTimeout(timer);
  }, [load]);

  async function createTask(event: React.FormEvent) {
    event.preventDefault();
    if (!title.trim()) return setError("Title is required.");
    try {
      const res = await fetch(`${API}/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, priority }),
      });
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.details ? Object.values(json.details).join(" ") : json.error);
      }
      setTitle("");
      setDescription("");
      setPriority("medium");
      setError(null);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create task");
    }
  }

  async function patchTask(id: string, updates: Partial<Task>) {
    const res = await fetch(`${API}/tasks/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });
    if (res.ok) await load();
  }

  async function saveEdit(id: string) {
    if (!editTitle.trim()) return setError("Title cannot be empty.");
    const res = await fetch(`${API}/tasks/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: editTitle, priority: editPriority, done: tasks.find((t) => t._id === id)?.done ?? false }),
    });
    if (res.ok) {
      setEditingId(null);
      setError(null);
      await load();
    }
  }

  async function removeTask(id: string) {
    const res = await fetch(`${API}/tasks/${id}`, { method: "DELETE" });
    setConfirmDeleteId(null);
    if (res.status === 404 || res.ok) await load();
  }

  const doneCount = tasks.filter((task) => task.done).length;

  return (
    <main className="mx-auto min-h-svh w-full max-w-4xl px-5 py-12 sm:px-8">
      {/* Header */}
      <header>
        <span className="rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-indigo-600">
          exp5 · CRUD app
        </span>
        <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
          Task Manager
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-slate-500">
          React UI ⇄ <code className="rounded bg-slate-100 px-1">Express.js</code>{" "}
          ⇄ <code className="rounded bg-slate-100 px-1">MongoDB</code> — every
          button below performs a real HTTP CRUD request against{" "}
          <code className="rounded bg-slate-100 px-1">{apiBase("exp5")}</code>.
        </p>
      </header>

      {/* Server status */}
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
          ? "API offline — start it with:  npm run server:exp5"
          : "API online — CRUD operations are live"}
      </div>

      {error && (
        <p
          role="alert"
          className="mt-4 rounded-xl bg-rose-50 px-4 py-3 text-xs font-medium text-rose-700 ring-1 ring-rose-200"
        >
          {error}
        </p>
      )}

      {/* Create form */}
      <form
        onSubmit={createTask}
        className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
      >
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">
          POST /api/tasks — create
        </h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto]">
          <input
            className={inputCls}
            placeholder="Task title *"
            value={title}
            onChange={(e) => setTitle(e.target.value)
            }
            aria-label="Task title"
          />
          <select
            className={inputCls}
            value={priority}
            onChange={(e) => setPriority(e.target.value as Task["priority"])}
            aria-label="Priority"
          >
            <option value="low">low</option>
            <option value="medium">medium</option>
            <option value="high">high</option>
          </select>
        </div>
        <div className="mt-3 flex flex-col gap-3 sm:flex-row">
          <input
            className={inputCls}
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            aria-label="Description"
          />
          <button
            type="submit"
            className="shrink-0 rounded-lg bg-indigo-600 px-6 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700"
          >
            + Add task
          </button>
        </div>
      </form>

      {/* Toolbar */}
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <input
          className={`${inputCls} sm:max-w-xs`}
          placeholder="Search (GET ?search=…)"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Search tasks"
        />
        <div className="flex gap-2">
          {[
            ["all", "All"],
            ["false", "Open"],
            ["true", "Done"],
          ].map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => setFilter(value)}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold transition ${
                filter === value
                  ? "bg-indigo-600 text-white"
                  : "border border-slate-300 text-slate-600 hover:bg-slate-100"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        <span className="text-xs text-slate-400 sm:ml-auto">
          {tasks.length} shown · {doneCount} done
        </span>
      </div>

      {/* Task list */}
      <section className="mt-5 flex flex-col gap-3" aria-label="Tasks">
        {loading && (
          <p className="rounded-xl border border-dashed border-slate-300 p-6 text-center text-sm text-slate-400">
            Loading tasks…
          </p>
        )}

        {!loading && tasks.length === 0 && (
          <p className="rounded-xl border border-dashed border-slate-300 p-6 text-center text-sm text-slate-400">
            No tasks here — create one above (or adjust the filters).
          </p>
        )}

        {!loading &&
          tasks.map((task) => {
            const isEditing = editingId === task._id;
            return (
              <article
                key={task._id}
                className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition"
              >
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={task.done}
                    onChange={() => patchTask(task._id, { done: !task.done })}
                    className="mt-1 size-4 shrink-0 accent-indigo-600"
                    aria-label={`Mark ${task.title} as ${task.done ? "open" : "done"}`}
                  />

                  <div className="min-w-0 flex-1">
                    {isEditing ? (
                      <div className="flex flex-col gap-2">
                        <input
                          className={inputCls}
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          aria-label="Edit title"
                        />
                        <div className="flex flex-wrap gap-2">
                          <select
                            className={inputCls}
                            value={editPriority}
                            onChange={(e) =>
                              setEditPriority(e.target.value as Task["priority"])
                            }
                            aria-label="Edit priority"
                          >
                            <option value="low">low</option>
                            <option value="medium">medium</option>
                            <option value="high">high</option>
                          </select>
                          <button
                            type="button"
                            onClick={() => saveEdit(task._id)}
                            className="rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-700"
                          >
                            Save (PUT)
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingId(null)}
                            className="rounded-lg border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3
                            className={`text-sm font-semibold ${
                              task.done ? "line-through text-slate-400" : ""
                            }`}
                          >
                            {task.title}
                          </h3>
                          <span
                            className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${PRIORITY_STYLES[task.priority]}`}
                          >
                            {task.priority}
                          </span>
                        </div>
                        {task.description && (
                          <p className="mt-1 text-xs leading-relaxed text-slate-500">
                            {task.description}
                          </p>
                        )}
                        <p className="mt-1.5 text-[10px] text-slate-400">
                          {new Date(task.createdAt).toLocaleString()} ·{" "}
                          <code>{task._id.slice(-8)}</code>
                        </p>
                      </>
                    )}
                  </div>

                  {!isEditing && (
                    <div className="flex shrink-0 gap-1">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingId(task._id);
                          setEditTitle(task.title);
                          setEditPriority(task.priority);
                        }}
                        className="rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-500 hover:bg-slate-100"
                        aria-label={`Edit ${task.title}`}
                      >
                        Edit
                      </button>
                      {confirmDeleteId === task._id ? (
                        <button
                          type="button"
                          onClick={() => removeTask(task._id)}
                          className="rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-rose-700"
                        >
                          Confirm?
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setConfirmDeleteId(task._id)}
                          className="rounded-lg px-3 py-1.5 text-xs font-semibold text-rose-500 hover:bg-rose-50"
                          aria-label={`Delete ${task.title}`}
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </article>
            );
          })}
      </section>

      <footer className="mt-12 border-t border-dashed border-slate-300 pt-5 text-xs text-slate-400">
        exp5 · CRUD — Node.js · Express.js · MongoDB (AI-assisted) ·{" "}
        <Link href="/" className="text-indigo-600 hover:underline">
          all experiments
        </Link>
      </footer>
    </main>
  );
}
