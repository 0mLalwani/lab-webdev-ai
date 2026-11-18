/* exp4 · unit tests for the shared client-side validation module.
   Run with: npm test
   Node 22 strips the TypeScript types on import, so no build step is needed. */

import test from "node:test";
import assert from "node:assert/strict";

import {
  hasErrors,
  validateContact,
  validateEmail,
} from "../app/exp4/_lib/validation.ts";

const VALID = {
  name: "Maya Okafor",
  email: "maya@example.com",
  phone: "+91 98765 43210",
  subject: "New project",
  message: "We would like to redesign our marketing website.",
};

test("validateContact accepts a complete, valid form", () => {
  assert.deepEqual(validateContact(VALID), {});
});

test("validateContact reports every empty required field", () => {
  const errors = validateContact({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  assert.equal(errors.name, "Name is required.");
  assert.equal(errors.email, "Email is required.");
  assert.equal(errors.subject, "Please choose a subject.");
  assert.equal(errors.message, "Message is required.");
  assert.equal(errors.phone, undefined); // phone is optional
});

test("validateContact rejects a name shorter than two characters", () => {
  const errors = validateContact({ ...VALID, name: "A" });
  assert.equal(errors.name, "Name must be at least 2 characters.");
});

test("validateContact rejects a malformed email", () => {
  const errors = validateContact({ ...VALID, email: "not-an-email" });
  assert.equal(
    errors.email,
    "Enter a valid email address (e.g. you@example.com)."
  );
});

test("validateContact only checks the phone when one is supplied", () => {
  assert.equal(validateContact({ ...VALID, phone: "" }).phone, undefined);

  const errors = validateContact({ ...VALID, phone: "12" });
  assert.equal(errors.phone, "Enter a valid phone number (7–15 digits).");
});

test("validateContact rejects a message shorter than ten characters", () => {
  const errors = validateContact({ ...VALID, message: "Too short" });
  assert.equal(errors.message, "Message must be at least 10 characters.");
});

test("validateEmail returns null for a valid address", () => {
  assert.equal(validateEmail("student@university.edu"), null);
});

test("validateEmail explains an empty or malformed address", () => {
  assert.equal(validateEmail(""), "Email is required.");
  assert.equal(validateEmail("student@"), "Enter a valid email address.");
});

test("hasErrors detects both filled and empty error maps", () => {
  assert.equal(hasErrors({ name: "Required" }), true);
  assert.equal(hasErrors({ name: undefined, email: "" }), false);
});
