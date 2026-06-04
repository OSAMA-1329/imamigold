import { Routes, Route, Navigate } from "react-router-dom";
import { AppProvider } from "../../context/AppContext.jsx";
import ChatLayout from "../../components/layout/ChatLayout.jsx";
import NotificationCenter from "../../components/notifications/NotificationCenter.jsx";

export default function WholesalePage() {
  return (
    <AppProvider role="wholesale">
      <Routes>
        <Route index element={<ChatLayout />} />
        <Route path="notifications" element={<NotificationCenter />} />
        <Route path="*" element={<Navigate to="." replace />} />
      </Routes>
    </AppProvider>
  );
}
