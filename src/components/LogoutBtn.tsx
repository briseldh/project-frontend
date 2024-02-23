import { useContext, useState } from "react";
import { AuthContext, defaultAuth } from "../context/AuthProvider";
import http from "../utils/http";

// Icons and Images
import logoutIconWhite from "../assets/icons/logout-icon-white.svg";
import { useQueryClient } from "@tanstack/react-query";
import { Oval } from "react-loader-spinner";

const LogoutBtn = () => {
  const { setAuth } = useContext(AuthContext);
  const queryClient = useQueryClient();

  const [isSending, setIsSending] = useState(false);

  const handleClick = async () => {
    try {
      setIsSending(true);

      await http.get("/sanctum/csrf-cookie");
      await http.post("/api/logout");

      setAuth(defaultAuth);

      setAuth((prevAuth) => {
        return {
          ...prevAuth,
          requestStatus: "sent",
        };
      });

      // Clearing the query cache
      queryClient.clear();

      console.log("Logged out successfully");
    } catch (error) {
      console.log(error);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div
      className={
        !isSending
          ? "flex items-center gap-2 px-2 py-1 rounded-md cursor-pointer hover:bg-blue-500 active:bg-opacity-50"
          : "flex items-center gap-2 px-2 py-1 rounded-md  bg-blue-500 active:bg-opacity-50"
      }
      onClick={handleClick}
    >
      {!isSending ? (
        <img src={logoutIconWhite} alt="Logout-Icon" className="w-5 h-5" />
      ) : (
        <Oval
          height={"16"}
          width={"16"}
          color="#fff"
          strokeWidth={"4"}
          secondaryColor="#fff"
        />
      )}
      {/* // <img src={logoutIconWhite} alt="Logout-Icon" className="w-5 h-5" /> */}
      <p className="text-lg font-medium text-white">Log Out</p>
    </div>
  );
};

export default LogoutBtn;
