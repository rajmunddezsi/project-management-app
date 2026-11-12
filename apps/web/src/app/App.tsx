import { Navigate, Route, Routes } from 'react-router';

import LoginPage from '../pages/LoginPage';
import AppShell from './layouts/AppShell';
import DashboardPage from '../features/dashboard/pages/DashboardPage';
import ProjectsPage from '../features/projects/pages/ProjectsPage';
import MyTasksPage from '../features/tasks/pages/MyTasksPage';
import NotFoundPage from '../pages/NotFoundPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/app" replace />} />

      <Route path="/login" element={<LoginPage />} />

      <Route path="/app" element={<AppShell />}>
        <Route index element={<DashboardPage />} />
        <Route path="projects" element={<ProjectsPage />} />
        <Route path="my-tasks" element={<MyTasksPage />} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
