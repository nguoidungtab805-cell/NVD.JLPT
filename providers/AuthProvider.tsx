"use client";
import React from "react";
import { useAuth } from "../hooks/useAuth";

export const AuthContext = React.createContext({ user: null as any, loading: true });

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  return <AuthContext.Provider value={{ user, loading }}>{children}</AuthContext.Provider>;
}
