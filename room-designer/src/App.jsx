import { Navigate, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import MyDesignsPage from "./pages/MyDesignsPage";
import RoomWizardPage from "./pages/RoomWizardPage";
import RoomDesignerPage from "./pages/RoomDesignerPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/my-designs" element={<MyDesignsPage />} />
      <Route path="/wizard" element={<RoomWizardPage />} />
      <Route path="/designer" element={<RoomDesignerPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}