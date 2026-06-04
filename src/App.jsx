import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AdminPage from "./pages/admin/AdminPage.jsx";
import PurchasePage from "./pages/purchase/PurchasePage.jsx";
import WholesalePage from "./pages/wholesale/WholesalePage.jsx";
import RetailPage from "./pages/retail/RetailPage.jsx";
import RoleLanding from "./pages/RoleLanding.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RoleLanding />} />
        <Route path="/admin/*" element={<AdminPage />} />
        <Route path="/purchase/*" element={<PurchasePage />} />
        <Route path="/wholesale/*" element={<WholesalePage />} />
        <Route path="/retail/*" element={<RetailPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
