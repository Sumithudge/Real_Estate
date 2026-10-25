import { Routes, Route } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";
import "./index.css";
import Login from "./admin/pages/Login";
import Dashboard from "./admin/pages/Dashboard";
import AdminRoutes from "./routes/AdminRoutes";
import AdminLayout from "./admin/components/AdminLayout";
import Projects from "./admin/pages/Projects";
import ProjectForm from "./admin/pages/ProjectForm";

function App() {
  return (
    <AuthProvider>
      <Routes>

        {/* ADMIN LOGIN */}
        <Route
          path="/admin/login"
          element={<Login />}
        />

        {/* PROTECTED ADMIN AREA */}
        <Route element={<AdminRoutes />}>

          <Route element={<AdminLayout />}>

            <Route
              path="/admin/dashboard"
              element={<Dashboard />}
            />

          </Route>
          <Route
               path="/admin/projects"
               element={<Projects />}
             />

        </Route>
         <Route
    path="/admin/projects/new"
    element={<ProjectForm />}
  />

  <Route
    path="/admin/projects/edit/:id"
    element={<ProjectForm />}
  />


        {/* FALLBACK */}
        <Route
          path="*"
          element={<Login />}
        />

      </Routes>
    </AuthProvider>
  );
}

export default App;