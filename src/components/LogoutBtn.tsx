import { useContext } from "react";
import { AuthContext, defaultAuth } from "../context/AuthProvider";
import http from "../utils/http";
import Button from "./Button";

const LogoutBtn = () => {
  const { auth, setAuth } = useContext(AuthContext);

  const handleClick = async () => {
    try {
      await http.get("/sanctum/csrf-cookie");
      await http.post("/api/logout");

      setAuth(defaultAuth);

      console.log("Logged out successfully");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Button
      value="Log Out"
      type={undefined}
      styles="p-1 text-white rounded bg-slate-500 drop-shadow-md"
      onClick={handleClick}
      disabled={undefined}
    />
  );
};

export default LogoutBtn;
