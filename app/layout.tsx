"use client";
import "./globals.css";
import "./agents-library.css";
import { Topbar, useScope } from "@/components/Topbar";
import { createContext, useContext } from "react";
import type { HarnessScope } from "@/lib/scope";
import { emptyScope } from "@/lib/scope";

export const ScopeContext = createContext<HarnessScope>(emptyScope);

export function useScopeCtx() {
  return useContext(ScopeContext);
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { scope, update } = useScope();
  return (
    <html lang="en">
      <body>
        <ScopeContext.Provider value={scope}>
          <div className="shell">
            <Topbar scope={scope} onChange={update} />
            {children}
          </div>
        </ScopeContext.Provider>
      </body>
    </html>
  );
}
