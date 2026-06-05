import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import ProtectedRoute from "./components/auth/ProtectedRoute.jsx";
import AuthPage from "./pages/AuthPage.jsx";
import AdminPage from "./pages/admin/AdminPage.jsx";
import PurchasePage from "./pages/purchase/PurchasePage.jsx";
import WholesalePage from "./pages/wholesale/WholesalePage.jsx";
import RetailPage from "./pages/retail/RetailPage.jsx";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/" element={<Navigate to="/auth" replace />} />
          <Route path="/admin/*" element={<ProtectedRoute role="admin"><AdminPage /></ProtectedRoute>} />
          <Route path="/purchase/*" element={<ProtectedRoute role="purchase"><PurchasePage /></ProtectedRoute>} />
          <Route path="/wholesale/*" element={<ProtectedRoute role="wholesale"><WholesalePage /></ProtectedRoute>} />
          <Route path="/retail/*" element={<ProtectedRoute role="retail"><RetailPage /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/auth" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
