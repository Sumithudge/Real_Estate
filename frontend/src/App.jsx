import { Routes, Route } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";
import "./index.css";
import Login from "./admin/pages/Login";
import Dashboard from "./admin/pages/Dashboard";
import AdminRoutes from "./routes/AdminRoutes";
import AdminLayout from "./admin/components/AdminLayout";
import Projects from "./admin/pages/Projects";
import ProjectForm from "./admin/pages/ProjectForm";
import Properties from "./admin/pages/Properties";
import Home from "./pages/Home";
import SearchPage from "./pages/Search";
import PropertyDetails from "./pages/PropertyDetails";
import Directory from "./pages/Directory";
import PostProperty from "./pages/PostProperty";
import Saved from "./pages/Saved";

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/buy" element={<SearchPage mode="Sale" />} />
        <Route path="/rent" element={<SearchPage mode="Rent" />} />
        <Route path="/property/:slug" element={<PropertyDetails />} />
        <Route path="/projects" element={<Directory kind="projects" />} />
        <Route path="/localities" element={<Directory kind="localities" />} />
        <Route path="/post-property" element={<PostProperty />} />
        <Route path="/saved" element={<Saved />} />

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