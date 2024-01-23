import { useContext } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthProvider";

const PrivateLayout = () => {
  const { auth } = useContext(AuthContext);
  const location = useLocation();

  return auth.requestStatus === "pending" ? (
    <h1>Loading ...</h1>
  ) : auth.id ? (
    <Outlet />
  ) : (
    <>
      {/* from /profile */}
      <Navigate to={"/login"} state={{ from: location }} replace />
    </>
  );
};

export default PrivateLayout;
