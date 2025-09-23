import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { ToastProvider } from './hooks/useToast';
import { Layout } from './components/layout/Layout';
import { LoginPage } from './pages/LoginPage';
import { Dashboard } from './pages/Dashboard';
import { SchedulePage } from './pages/SchedulePage';
import { ConflictsPage } from './pages/ConflictsPage';
import { SimulationPage } from './pages/SimulationPage';
import { KPIsPage } from './pages/KPIsPage';
import { AuditPage } from './pages/AuditPage';
import { SettingsPage } from './pages/SettingsPage';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <Router>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route
                path="/*"
                element={
                  <ProtectedRoute>
                    <Layout />
                  </ProtectedRoute>
                }
              >
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="schedule" element={<SchedulePage />} />
                <Route path="conflicts" element={<ConflictsPage />} />
                <Route path="simulation" element={<SimulationPage />} />
                <Route path="kpis" element={<KPIsPage />} />
                <Route path="audit" element={<AuditPage />} />
                <Route path="settings" element={<SettingsPage />} />
                <Route path="" element={<Navigate to="/dashboard" replace />} />
              </Route>
            </Routes>
          </Router>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;