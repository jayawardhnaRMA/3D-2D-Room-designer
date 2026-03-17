import React, { useEffect, useLayoutEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import { WizardProvider } from "./context/WizardContext";
import { AuthProvider } from "./context/AuthContext";

// Pages - Public
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import NotFoundPage from "./pages/NotFoundPage";
import HowItWorks from "./pages/HowItWorks";
import AboutPage from "./pages/AboutPage";
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import ContactPage from "./pages/ContactPage";

// Pages - Customer
import Dashboard from "./pages/customer/Dashboard";
import MyDesigns from "./pages/customer/MyDesigns";
import Library from "./pages/customer/Library";
import Inspiration from "./pages/customer/Inspiration";
import Settings from "./pages/customer/Settings";

// Pages - Designer
import DesignerDashboard from "./pages/designer/dashboard";
import DesignerPortfolio from "./pages/designer/portfolio";
import DesignerLibrary from "./pages/designer/library";
import DesignerInspiration from "./pages/designer/inspiration";
import DesignerSettings from "./pages/designer/settings";
import DesignerClients from "./pages/designer/clients";

// Pages - Room Designer
import RoomWizardPage from "./pages/RoomWizardPage";
import RoomDesignerPage from "./pages/RoomDesignerPage";

function injectStyles() {
  if (document.getElementById("roomio-transitions")) return;

  const styleElement = document.createElement("style");
  styleElement.id = "roomio-transitions";
  styleElement.textContent = `
    @keyframes page-fade {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    .rt-fade { animation: page-fade 0.4s ease both; }
  `;

  document.head.appendChild(styleElement);
}

function AppRoutes() {
  const location = useLocation();

  useEffect(() => {
    injectStyles();
  }, []);

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const isDashboardRoute = location.pathname.startsWith('/designer') || location.pathname.startsWith('/customer');

  return (
    <div key={isDashboardRoute ? 'dashboard' : location.pathname} className={isDashboardRoute ? "" : "rt-fade"}>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} /> 
        <Route path="/home" element={<LandingPage />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsOfService />} />
        <Route path="/terms-of-service" element={<TermsOfService />} />

        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
       
        {/* Room Designer Routes */}
        <Route path="/room-wizard" element={<ProtectedRoute><RoomWizardPage /></ProtectedRoute>} />
        <Route path="/room-editor" element={<ProtectedRoute><RoomDesignerPage /></ProtectedRoute>} />

        {/* Customer Routes */}
        <Route path="/customer" element={<Navigate to="/customer/dashboard" replace />} />
        <Route path="/customer/dashboard" element={<ProtectedRoute requiredRole="customer"><Dashboard /></ProtectedRoute>} />
        <Route path="/customer/my-designs" element={<ProtectedRoute requiredRole="customer"><MyDesigns /></ProtectedRoute>} />
        <Route path="/customer/library" element={<ProtectedRoute requiredRole="customer"><Library /></ProtectedRoute>} />
        <Route path="/customer/inspiration" element={<ProtectedRoute requiredRole="customer"><Inspiration /></ProtectedRoute>} />
        <Route path="/customer/settings" element={<ProtectedRoute requiredRole="customer"><Settings /></ProtectedRoute>} />

        {/* Designer Routes */}
        <Route path="/designer" element={<Navigate to="/designer/dashboard" replace />} />
        <Route path="/designer/dashboard" element={<ProtectedRoute requiredRole="designer"><DesignerDashboard /></ProtectedRoute>} />
        <Route path="/designer/portfolio" element={<ProtectedRoute requiredRole="designer"><DesignerPortfolio /></ProtectedRoute>} />
        <Route path="/designer/library" element={<ProtectedRoute requiredRole="designer"><DesignerLibrary /></ProtectedRoute>} />
        <Route path="/designer/inspiration" element={<ProtectedRoute requiredRole="designer"><DesignerInspiration /></ProtectedRoute>} />
        <Route path="/designer/clients" element={<ProtectedRoute requiredRole="designer"><DesignerClients /></ProtectedRoute>} />
        <Route path="/designer/settings" element={<ProtectedRoute requiredRole="designer"><DesignerSettings /></ProtectedRoute>} />

        {/* 404 Route */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <WizardProvider>
        <AppRoutes />
      </WizardProvider>
    </AuthProvider>
  );
}

export default App;