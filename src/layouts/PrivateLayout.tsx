import { useContext } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthProvider";
import { Oval } from "react-loader-spinner";

const PrivateLayout = () => {
  const { auth } = useContext(AuthContext);
  const location = useLocation();

  return auth.requestStatus === "pending" ? (
    <div className="absolute -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
      <Oval height="60" width="60" color="#6464C8" secondaryColor="#6464C8" />
    </div>
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
