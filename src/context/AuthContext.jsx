import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { users as seedUsers } from "../data/mockData";

const AuthContext = createContext(null);
const STORAGE_KEY = "bizhub.auth";
const ACCOUNTS_KEY = "bizhub.accounts";

// Seed default accounts (password: "password") so testers can log in immediately.
const seedAccounts = () => {
  const existing = localStorage.getItem(ACCOUNTS_KEY);
  if (existing) return JSON.parse(existing);
  const accounts = seedUsers.map((u) => ({
    id: u.id, name: u.name, email: u.email, role: u.role, password: "password",
  }));
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
  return accounts;
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    seedAccounts();
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) setUser(JSON.parse(raw));
    setLoading(false);
  }, []);

  const signIn = useCallback(async (email, password) => {
    const accounts = seedAccounts();
    const acc = accounts.find(
      (a) => a.email.toLowerCase() === email.toLowerCase() && a.password === password
    );
    if (!acc) throw new Error("Invalid email or password");
    const u = { id: acc.id, name: acc.name, email: acc.email, role: acc.role };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
    setUser(u);
    return u;
  }, []);

  const signUp = useCallback(async ({ name, email, password, role }) => {
    const accounts = seedAccounts();
    if (accounts.some((a) => a.email.toLowerCase() === email.toLowerCase()))
      throw new Error("Email already registered");
    const id = `u-${role}-new-${Date.now()}`;
    const acc = { id, name, email, role, password };
    const next = [...accounts, acc];
    localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(next));
    const u = { id, name, email, role };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
    setUser(u);
    return u;
  }, []);

  const signOut = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
