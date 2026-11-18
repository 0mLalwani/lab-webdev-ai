"use client";

import * as React from "react";

/* Loads Bootstrap's JS bundle (navbar collapse, carousel, tooltips).
   Imported dynamically inside an effect because the bundle touches
   `document` at module scope — it must never run during SSR.
   CSS/JS are scoped to the /exp2 route segment by the App Router. */
export function BootstrapJS() {
  React.useEffect(() => {
    void import("bootstrap/dist/js/bootstrap.bundle.min.js");
  }, []);
  return null;
}

