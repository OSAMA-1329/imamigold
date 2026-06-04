import { Routes, Route, Navigate } from "react-router-dom";
import { AppProvider } from "../../context/AppContext.jsx";
import ChatLayout from "../../components/layout/ChatLayout.jsx";
import NotificationCenter from "../../components/notifications/NotificationCenter.jsx";
import GroupsList from "../../components/dashboard/GroupsList.jsx";

export default function RetailPage() {
  return (
    <AppProvider role="retail">
      <Routes>
        <Route index element={<ChatLayout />} />
        <Route path="groups" element={<GroupsList />} />
        <Route path="notifications" element={<NotificationCenter />} />
        <Route path="*" element={<Navigate to="." replace />} />
      </Routes>
    </AppProvider>
  );
}
