import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import Dashboard from "../pages/dashboard/Dashboard";
import Leads from "../pages/dashboard/Leads";
import Properties from "../pages/dashboard/Properties";
import Clients from "../pages/dashboard/Clients";
import PrivateRoute from "./PrivateRoute";

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public pages */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Dashboard routes */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>}/>
        <Route path="/dashboard/leads" element={<Leads />} />
        <Route path="/dashboard/properties" element={<Properties />} />
        <Route path="/dashboard/clients" element={<Clients />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;
