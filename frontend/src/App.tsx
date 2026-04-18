import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import LoginPage from './pages/LoginPages';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ClientsPage from './pages/ClientsPage';
import ProjectsPage from './pages/ProjectsPage';
import TasksPage from './pages/TasksPage';
import Sidebar from './components/Sidebar';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Rotas públicas */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Rotas protegidas */}
          <Route path="/*" element={
            <ProtectedRoute>
              <div className="flex h-screen overflow-hidden">
                <Sidebar />
                <div className="flex-1 overflow-auto bg-zinc-950">
                  <Routes>
                    <Route path="dashboard" element={<DashboardPage />} />
                    <Route path="clients" element={<ClientsPage />} />
                    <Route path="projects" element={<ProjectsPage />} />
                    <Route path="tasks" element={<TasksPage />} />
                    <Route path="" element={<Navigate to="/dashboard" replace />} />
                  </Routes>
                </div>
              </div>
            </ProtectedRoute>
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;