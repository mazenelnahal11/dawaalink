import { lazy, Suspense, type ReactNode } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import { AppShell } from "../components/layout/AppShell";
import { PrivateRoute } from "./PrivateRoute";
import { PageSkeleton } from "../components/PageSkeleton";
import { useAuthStore } from "../store/AuthStore";
import LandingPage from "../features/landing/LandingPage";

const DashboardPage    = lazy(() => import("../features/dashboard/DashboardPage"));
const InventoryPage    = lazy(() => import("../features/inventory/InventoryPage"));
const ListingFormPage  = lazy(() => import("../features/inventory/ListingFormPage"));
const SwapMatchesPage  = lazy(() => import("../features/swaps/SwapMatchesPage"));
const SwapTicketPage   = lazy(() => import("../features/swaps/SwapTicketPage"));
const ActiveSwapsPage  = lazy(() => import("../features/swaps/ActiveSwapsPage"));
const SwapHistoryPage  = lazy(() => import("../features/swaps/SwapHistoryPage"));
const ProfilePage      = lazy(() => import("../features/profile/ProfilePage"));
const SettingsPage     = lazy(() => import("../features/settings/SettingsPage"));
const AdminFlagsPage   = lazy(() => import("../features/admin/AdminFlagsPage"));
const AuditLogPage     = lazy(() => import("../features/admin/AuditLogPage"));
const PharmacyApprovalPage = lazy(() => import("../features/admin/PharmacyApprovalPage"));
const LoginPage        = lazy(() => import("../features/auth/LoginPage"));
const RegisterPage     = lazy(() => import("../features/auth/RegisterPage"));
const VerifyPage       = lazy(() => import("../features/auth/VerifyPage"));

const wrap = (el: ReactNode) => (
  <Suspense fallback={<PageSkeleton />}>{el}</Suspense>
);

const AuthRedirect = () => {
    const { user } = useAuthStore();
    if (!user) return <LandingPage />;
    return <Navigate to={user.role === 'ADMIN' ? "/admin/approvals" : "/dashboard"} replace />;
};

export const router = createBrowserRouter([
  { path: "/login",    element: wrap(<LoginPage />) },
  { path: "/register", element: wrap(<RegisterPage />) },
  { path: "/verify",   element: wrap(<VerifyPage />) },
  { path: "/", element: <AuthRedirect /> },
  {
    element: <AppShell />,
    children: [
      {
        element: <PrivateRoute allowedRoles={["OWNER", "PHARMACIST"]} />,
        children: [
          { path: "/dashboard",       element: wrap(<DashboardPage />) },
          { path: "/matches",         element: wrap(<SwapMatchesPage />) },
          { path: "/swaps/active",    element: wrap(<ActiveSwapsPage />) },
          { path: "/swaps/history",   element: wrap(<SwapHistoryPage />) },
          { path: "/swaps/:cycleId/ticket", element: wrap(<SwapTicketPage />) },
        ],
      },
      {
        element: <PrivateRoute allowedRoles={["OWNER", "PHARMACIST", "EMPLOYEE"]} />,
        children: [
          { path: "/inventory",       element: wrap(<InventoryPage />) },
          { path: "/inventory/new",   element: wrap(<ListingFormPage />) },
        ],
      },
      {
        element: <PrivateRoute allowedRoles={["OWNER"]} />,
        children: [
          { path: "/profile",         element: wrap(<ProfilePage />) },
          { path: "/settings",        element: wrap(<SettingsPage />) },
        ],
      },
      {
        element: <PrivateRoute allowedRoles={["ADMIN"]} />,
        children: [
          { path: "/admin/flags",     element: wrap(<AdminFlagsPage />) },
          { path: "/admin/audit",     element: wrap(<AuditLogPage />) },
          { path: "/admin/approvals", element: wrap(<PharmacyApprovalPage />) },
        ],
      },
    ],
  },
]);
