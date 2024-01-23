import { createContext, useState, ReactNode, useEffect } from "react";
import http from "../utils/http";

type Props = {
  children: ReactNode;
};

// DO NOT STORE PASSWORDS IN CONTEXT
type Auth = {
  id: number | null;
  username: string | null;
  role: "admin" | "user" | null;
  requestStatus: "pending" | "sent";
};

type AuthContext = {
  auth: Auth;
  setAuth: React.Dispatch<React.SetStateAction<Auth>>;
};

export const defaultAuth: Auth = {
  id: null,
  username: null,
  role: null,
  requestStatus: "pending",
};

const defaultAuthContext = {
  auth: defaultAuth,
  setAuth: () => {},
} as AuthContext;

export const AuthContext = createContext<AuthContext>(defaultAuthContext);

const AuthProvider = ({ children }: Props) => {
  const [auth, setAuth] = useState<Auth>(defaultAuth);

  useEffect(() => {
    (async () => {
      try {
        await http.get("/sanctum/csrf-cookie");
        const response = await http.get("api/getUserData");
        // console.log(response);

        const userData = response.data.userData;

        setAuth((prevAuth) => {
          return {
            ...prevAuth,
            id: userData.id,
            username: userData.name,
            role: userData.role,
            requestStatus: "sent",
          };
        });
      } catch (error) {
        setAuth((prevAuth) => {
          return {
            ...prevAuth,
            requestStatus: "sent",
          };
        });
        console.log(error);
      }
    })();
  }, []);

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
