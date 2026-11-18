/* exp14 · API integration tests.
   These tests talk to the local Express servers, so start them first:

       npm run server:all
       npm test

   If a server is not reachable the related tests are skipped instead of
   failing, which keeps the unit tests usable on their own. */

import test from "node:test";
import assert from "node:assert/strict";

import { apiBase } from "../lib/api.ts";

const api = (exp) => `${apiBase(exp)}/api`;

async function json(res) {
  return res.json().catch(() => ({}));
}

async function isUp(url) {
  try {
    const res = await fetch(`${url}/health`, {
      signal: AbortSignal.timeout(2000),
    });
    return res.ok;
  } catch {
    return false;
  }
}

const upCache = new Map();

async function skipIfDown(t, exp) {
  if (!upCache.has(exp)) upCache.set(exp, await isUp(api(exp)));
  const up = upCache.get(exp);
  if (!up) {
    t.skip(`exp${exp.slice(3)} API is not running — start it with npm run server:all`);
    return false;
  }
  return true;
}

/* ---------------------------------------------------------- exp5 · CRUD */

test("exp5 health endpoint responds", async (t) => {
  if (!(await skipIfDown(t, "exp5"))) return;

  const res = await fetch(`${api("exp5")}/health`);
  assert.equal(res.status, 200);
  assert.equal((await json(res)).experiment, "exp5");
});

test("exp5 supports the full task lifecycle", async (t) => {
  if (!(await skipIfDown(t, "exp5"))) return;

  const created = await fetch(`${api("exp5")}/tasks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      title: "Integration test task",
      description: "Created by tests/api.test.mjs",
      priority: "high",
    }),
  });
  assert.equal(created.status, 201);

  const task = (await json(created)).data;
  assert.ok(task._id);
  assert.equal(task.priority, "high");

  const patched = await fetch(`${api("exp5")}/tasks/${task._id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ done: true }),
  });
  assert.equal(patched.status, 200);
  assert.equal((await json(patched)).data.done, true);

  const removed = await fetch(`${api("exp5")}/tasks/${task._id}`, {
    method: "DELETE",
  });
  assert.equal(removed.status, 204);

  const missing = await fetch(`${api("exp5")}/tasks/${task._id}`);
  assert.equal(missing.status, 404);
});

test("exp5 rejects an empty task and a malformed id", async (t) => {
  if (!(await skipIfDown(t, "exp5"))) return;

  const empty = await fetch(`${api("exp5")}/tasks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({}),
  });
  assert.equal(empty.status, 400);
  assert.ok((await json(empty)).details.title);

  const badId = await fetch(`${api("exp5")}/tasks/not-an-object-id`);
  assert.equal(badId.status, 400);
});

/* --------------------------------------------------------- exp6 · auth */

test("exp6 requires a token for protected routes", async (t) => {
  if (!(await skipIfDown(t, "exp6"))) return;

  const me = await fetch(`${api("exp6")}/auth/me`);
  assert.equal(me.status, 401);
});

test("exp6 logs in, returns a JWT and enforces roles", async (t) => {
  if (!(await skipIfDown(t, "exp6"))) return;

  const userLogin = await fetch(`${api("exp6")}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "user@demo.dev", password: "User12345!" }),
  });
  assert.equal(userLogin.status, 200);
  const userToken = (await json(userLogin)).token;
  assert.ok(userToken);

  const userMe = await fetch(`${api("exp6")}/auth/me`, {
    headers: { Authorization: `Bearer ${userToken}` },
  });
  assert.equal(userMe.status, 200);
  assert.equal((await json(userMe)).user.role, "user");

  // Authenticated but not authorized.
  const forbidden = await fetch(`${api("exp6")}/users`, {
    headers: { Authorization: `Bearer ${userToken}` },
  });
  assert.equal(forbidden.status, 403);

  const adminLogin = await fetch(`${api("exp6")}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "admin@demo.dev", password: "Admin123!" }),
  });
  assert.equal(adminLogin.status, 200);
  const adminToken = (await json(adminLogin)).token;

  const adminList = await fetch(`${api("exp6")}/users`, {
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  assert.equal(adminList.status, 200);
  assert.ok(Array.isArray((await json(adminList)).data));
});

test("exp6 rejects wrong credentials with a generic 401", async (t) => {
  if (!(await skipIfDown(t, "exp6"))) return;

  const res = await fetch(`${api("exp6")}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "user@demo.dev", password: "wrong-password" }),
  });
  assert.equal(res.status, 401);
  assert.equal((await json(res)).error, "Invalid email or password");
});

/* ------------------------------------------------------- exp7 · REST API */

test("exp7 lists products with pagination metadata", async (t) => {
  if (!(await skipIfDown(t, "exp7"))) return;

  const res = await fetch(`${api("exp7")}/products?limit=5`);
  assert.equal(res.status, 200);
  const body = await json(res);
  assert.ok(Array.isArray(body.data));
  assert.equal(body.meta.limit, 5);
});

test("exp7 documents itself with OpenAPI", async (t) => {
  if (!(await skipIfDown(t, "exp7"))) return;

  const res = await fetch(`${apiBase("exp7")}/api/openapi.json`);
  assert.equal(res.status, 200);
  assert.equal((await json(res)).openapi, "3.0.3");
});

test("exp7 rejects an invalid category and a malformed id", async (t) => {
  if (!(await skipIfDown(t, "exp7"))) return;

  const invalid = await fetch(`${api("exp7")}/products`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: "Test", category: "toys", price: 10 }),
  });
  assert.equal(invalid.status, 400);

  const badId = await fetch(`${api("exp7")}/products/not-an-object-id`);
  assert.equal(badId.status, 400);
});

/* --------------------------------------------------- exp8 · students */

test("exp8 returns aggregated statistics", async (t) => {
  if (!(await skipIfDown(t, "exp8"))) return;

  const res = await fetch(`${api("exp8")}/students/stats`);
  assert.equal(res.status, 200);
  const body = await json(res);
  assert.equal(typeof body.total, "number");
  assert.ok(Array.isArray(body.courses));
});

test("exp8 validates a new student record", async (t) => {
  if (!(await skipIfDown(t, "exp8"))) return;

  const res = await fetch(`${api("exp8")}/students`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: "" }),
  });
  assert.equal(res.status, 400);
  assert.ok((await json(res)).details);
});

/* ------------------------------------------------------- exp9–12 · AI */

for (const exp of ["exp9", "exp10", "exp11", "exp12"]) {
  test(`${exp} health endpoint responds`, async (t) => {
    if (!(await skipIfDown(t, exp))) return;

    const res = await fetch(`${api(exp)}/health`);
    assert.equal(res.status, 200);
    assert.equal((await json(res)).experiment, exp);
  });
}

test("exp9 rejects a prompt that is too short", async (t) => {
  if (!(await skipIfDown(t, "exp9"))) return;

  const res = await fetch(`${api("exp9")}/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt: "hi" }),
  });
  assert.equal(res.status, 400);
});

test("exp11 demo mode returns content for every type", async (t) => {
  if (!(await skipIfDown(t, "exp11"))) return;

  const res = await fetch(`${api("exp11")}/content/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      type: "blog",
      topic: "Testing AI content",
      provider: "demo", // deterministic: never calls a real provider
    }),
  });
  assert.equal(res.status, 200);
  const body = await json(res);
  assert.equal(typeof body.text, "string");
  assert.ok(body.text.length > 20);
});
