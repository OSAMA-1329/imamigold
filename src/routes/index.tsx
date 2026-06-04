import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import App from "../App.jsx";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Business Communication Hub" },
      { name: "description", content: "Enterprise chat for purchase, wholesale & retail teams." },
    ],
  }),
  component: SpaShell,
});

function SpaShell() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }
  return <App />;
}
