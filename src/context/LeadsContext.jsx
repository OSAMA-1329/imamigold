import { createContext, useContext, useEffect, useState, useCallback } from "react";

const LeadsContext = createContext(null);
const STORAGE_KEY = "imamihub.leads";

export function LeadsProvider({ children }) {
  const [leads, setLeads] = useState([]);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) setLeads(JSON.parse(raw));
  }, []);

  const persist = (next) => {
    setLeads(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  const saveLead = useCallback((lead) => {
    const id = lead.id || `lead-${Date.now()}`;
    const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    const next = lead.id
      ? existing.map((l) => (l.id === id ? { ...l, ...lead } : l))
      : [...existing, { ...lead, id, createdAt: new Date().toISOString() }];
    persist(next);
    return id;
  }, []);

  const deleteLead = useCallback((id) => {
    const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    persist(existing.filter((l) => l.id !== id));
  }, []);

  return (
    <LeadsContext.Provider value={{ leads, saveLead, deleteLead }}>
      {children}
    </LeadsContext.Provider>
  );
}

export const useLeads = () => {
  const ctx = useContext(LeadsContext);
  if (!ctx) throw new Error("useLeads must be used within LeadsProvider");
  return ctx;
};
