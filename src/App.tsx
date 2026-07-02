import { Route, Routes } from "react-router-dom";
import { AppLayout } from "./components/layout/AppLayout";
import { AnomalyDetectionPage } from "./pages/AnomalyDetectionPage";
import { AuditLogPage } from "./pages/AuditLogPage";
import { CommandCenterPage } from "./pages/CommandCenterPage";
import { CompliancePage } from "./pages/CompliancePage";
import { ConfigManagerPage } from "./pages/ConfigManagerPage";
import { HsmSecurityPage } from "./pages/HsmSecurityPage";
import { TenancyPage } from "./pages/TenancyPage";
import { ROUTES } from "./routes/routes";

function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path={ROUTES.commandCenter.path} element={<CommandCenterPage />} />
        <Route path={ROUTES.anomalyDetection.path} element={<AnomalyDetectionPage />} />
        <Route path={ROUTES.compliance.path} element={<CompliancePage />} />
        <Route path={ROUTES.configManager.path} element={<ConfigManagerPage />} />
        <Route path={ROUTES.auditLogs.path} element={<AuditLogPage />} />
        <Route path={ROUTES.hsmSecurity.path} element={<HsmSecurityPage />} />
        <Route path={ROUTES.tenancy.path} element={<TenancyPage />} />
      </Route>
    </Routes>
  );
}

export default App;
