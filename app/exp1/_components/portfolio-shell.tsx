"use client";

import * as React from "react";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

import { ExpSidebar } from "./exp-sidebar";
import { SkyParallax } from "./sky-parallax";

/**
 * exp1 shell: fixed blue-sky parallax backdrop + expandable sidebar
 * + scrollable content. No navbar anywhere.
 */
export function PortfolioShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SkyParallax />
      <SidebarProvider defaultOpen>
        <ExpSidebar />
        <SidebarInset className="bg-transparent">
          <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-5 pb-16 pt-16 sm:px-8 md:px-10 md:pt-24">
            {children}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </>
  );
}
