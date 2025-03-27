import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const AuthenticationRoutes = () => {
  const { isAuthenticated } = useSelector((state) => state.authState);
  return isAuthenticated == true ? <Navigate to="/" replace /> : <Outlet />;
};

export default AuthenticationRoutes;
