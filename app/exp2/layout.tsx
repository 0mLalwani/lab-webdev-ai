import "./bootstrap.css";
import "./exp2.css";

import { BootstrapJS } from "./_components/bootstrap-js";

export const metadata = {
  title: "exp2 · Startup Landing (Bootstrap)",
  description:
    "Responsive startup/business landing page built with Bootstrap 5 and AI-assisted UI design.",
};

export default function Exp2Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <BootstrapJS />
      {children}
    </>
  );
}
