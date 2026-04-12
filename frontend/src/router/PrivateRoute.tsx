
import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/AuthStore";

type Props = { allowedRoles: string[] };

export const PrivateRoute = ({ allowedRoles }: Props) => {
  const { user } = useAuthStore();
  
  if (!user) return <Navigate to="/login" replace />;
  if (!allowedRoles.includes(user.role)) return <Navigate to="/dashboard" replace />;
  
  return <Outlet />;
};
