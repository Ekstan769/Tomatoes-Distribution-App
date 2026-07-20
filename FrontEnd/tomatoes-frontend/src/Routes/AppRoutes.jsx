import { Routes, Route, Navigate } from "react-router-dom";
import AuthLayout from "../layouts/AuthLayout";
import MainLayout from "../layouts/MainLayout";
import ProtectedRoute from "./ProtectedRoute";
import Welcome from "../pages/Welcome";
import SignUp from "../pages/auth/SignUp";
import Login from "../pages/auth/Login";
import ForgotPassword from "../pages/auth/ForgotPassword";
import Home from "../pages/Home";
import Confirmation from "../pages/Confirmation";
import Notifications from "../pages/Notifications";
import Details from "../pages/Details";
import Settings from "../pages/Settings";
import Dashboard from "../pages/Dashboard";

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Route>

      <Route
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/home" element={<Home />} />
        <Route path="/confirmation" element={<Confirmation />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/details" element={<Details />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Route>

      <Route path="/" element={<Welcome />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
