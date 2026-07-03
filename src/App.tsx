import { Route, Routes } from "react-router-dom";
import { AppLayout } from "./components/layout/AppLayout";
import { ProtectedRoute } from "./components/layout/ProtectedRoute";
import { AnomalyDetectionPage } from "./pages/AnomalyDetectionPage";
import { AuditLogPage } from "./pages/AuditLogPage";
import { CommandCenterPage } from "./pages/CommandCenterPage";
import { CompliancePage } from "./pages/CompliancePage";
import { ConfigManagerPage } from "./pages/ConfigManagerPage";
import { HsmSecurityPage } from "./pages/HsmSecurityPage";
import { LoginPage } from "./pages/LoginPage";
import { TenancyPage } from "./pages/TenancyPage";
import { AccountPage } from "./pages/AccountPage";
import { ACCOUNT_PATH, ROUTES } from "./routes/routes";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route path={ROUTES.commandCenter.path} element={<CommandCenterPage />} />
        <Route path={ROUTES.anomalyDetection.path} element={<AnomalyDetectionPage />} />
        <Route path={ROUTES.compliance.path} element={<CompliancePage />} />
        <Route path={ROUTES.configManager.path} element={<ConfigManagerPage />} />
        <Route path={ROUTES.auditLogs.path} element={<AuditLogPage />} />
        <Route path={ROUTES.hsmSecurity.path} element={<HsmSecurityPage />} />
        <Route path={ROUTES.tenancy.path} element={<TenancyPage />} />
        <Route path={ACCOUNT_PATH} element={<AccountPage />} />
      </Route>
    </Routes>
  );
}

export default App;
