import { useContext } from "react";
import { AuthContext, defaultAuth } from "../context/AuthProvider";
import http from "../utils/http";

// Icons and Images
import logoutIconWhite from "../assets/icons/logout-icon-white.svg";

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
    <div
      className="flex items-center gap-2 px-2 py-1 rounded-md cursor-pointer hover:bg-blue-500 active:bg-opacity-50"
      onClick={handleClick}
    >
      <img src={logoutIconWhite} alt="Logout-Icon" className="w-5 h-5" />

      <p className="text-lg font-medium text-white">Log Out</p>
    </div>
  );
};

export default LogoutBtn;
