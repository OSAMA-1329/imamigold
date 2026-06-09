import { Routes, Route, useNavigate, useParams, Navigate } from "react-router-dom";
import { LeadsProvider, useLeads } from "../../context/LeadsContext.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import LeadsList from "../../components/leads/LeadsList.jsx";
import LeadForm from "../../components/leads/LeadForm.jsx";

function EditLead({ basePath }) {
  const { id } = useParams();
  const { leads } = useLeads();
  const navigate = useNavigate();
  const lead = leads.find((l) => l.id === id);
  if (!lead) return <Navigate to={basePath} replace />;
  return <LeadForm initial={lead} onSaved={() => navigate(basePath)} />;
}

export default function LeadsPage({ basePath }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const isAdmin = user?.role === "admin";

  return (
    <LeadsProvider>
      <Routes>
        <Route index element={<LeadsList basePath={basePath} />} />
        {isAdmin && <Route path="new" element={<LeadForm onSaved={() => navigate(basePath)} />} />}
        {isAdmin && <Route path=":id" element={<EditLead basePath={basePath} />} />}
        <Route path="*" element={<Navigate to={basePath} replace />} />
      </Routes>
    </LeadsProvider>
  );
}
