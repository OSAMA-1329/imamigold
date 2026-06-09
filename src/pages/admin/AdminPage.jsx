import { Routes, Route, Navigate } from "react-router-dom";
import { AppProvider } from "../../context/AppContext.jsx";
import AdminDashboard from "../../components/dashboard/AdminDashboard.jsx";
import ChatLayout from "../../components/layout/ChatLayout.jsx";
import NotificationCenter from "../../components/notifications/NotificationCenter.jsx";
import UsersList from "../../components/dashboard/UsersList.jsx";
import GroupsList from "../../components/dashboard/GroupsList.jsx";
import LeadsPage from "../leads/LeadsPage.jsx";

export default function AdminPage() {
  return (
    <AppProvider role="admin">
      <Routes>
        <Route index element={<ChatLayout />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="chats" element={<ChatLayout />} />
        <Route path="groups" element={<GroupsList />} />
        <Route path="users" element={<UsersList />} />
        <Route path="leads/*" element={<LeadsPage basePath="/admin/leads" />} />
        <Route path="notifications" element={<NotificationCenter />} />
        <Route path="*" element={<Navigate to="." replace />} />
      </Routes>
    </AppProvider>
  );
}
