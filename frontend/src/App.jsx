import { Routes, Route } from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import Dashboard from "./pages/Dashboard";
import ProjectBoard from "./pages/ProjectBoard";
import Notifications from "./pages/Notifications";
import ActivityLog from "./pages/ActivityLog";
function App() {
  return (
    <Routes>
      <Route path="/" element={<AuthPage />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/project/:id" element={<ProjectBoard />} />
      <Route
  path="/notifications"
  element={<Notifications />}
/>
<Route
  path="/activity/:projectId"
  element={<ActivityLog />}
/>
    </Routes>
   
  );
}

export default App;