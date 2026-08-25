"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type ShellUiValue = {
  mobileDrawerOpen: boolean;
  openMobileDrawer: () => void;
  closeMobileDrawer: () => void;
  toggleMobileDrawer: () => void;
};

const ShellUiContext = createContext<ShellUiValue | null>(null);

export function ShellUiProvider({ children }: { children: ReactNode }) {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const openMobileDrawer = useCallback(() => setMobileDrawerOpen(true), []);
  const closeMobileDrawer = useCallback(() => setMobileDrawerOpen(false), []);
  const toggleMobileDrawer = useCallback(
    () => setMobileDrawerOpen((v) => !v),
    [],
  );

  const value = useMemo(
    () => ({
      mobileDrawerOpen,
      openMobileDrawer,
      closeMobileDrawer,
      toggleMobileDrawer,
    }),
    [mobileDrawerOpen, openMobileDrawer, closeMobileDrawer, toggleMobileDrawer],
  );

  return (
    <ShellUiContext.Provider value={value}>{children}</ShellUiContext.Provider>
  );
}

export function useShellUi() {
  const ctx = useContext(ShellUiContext);
  if (!ctx) throw new Error("useShellUi must be used within ShellUiProvider");
  return ctx;
}
