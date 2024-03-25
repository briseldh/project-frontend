import { createContext, useState, ReactNode, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

type Props = {
  children: ReactNode;
};

// DO NOT STORE PASSWORDS IN CONTEXT
export type Auth = {
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

  const { data, status } = useQuery({
    queryKey: ["auth"],
    queryFn: async () => {
      await fetch("http://localhost:80/sanctum/csrf-cookie");
      const res = await fetch("http://localhost:80/api/getUserData", {
        credentials: "include",
      });

      if (!res.ok) {
        setAuth((prevAuth) => {
          return {
            ...prevAuth,
            requestStatus: "sent",
          };
        });

        console.log("Failed to fetch data");
        throw new Error(`HTTP Error: ${res.status}`);
      }

      return res.json();
    },
  });

  useEffect(() => {
    if (!data) {
      return;
    }

    setAuth((prevAuth) => {
      return {
        ...prevAuth,
        id: data.userData.id,
        username: data.userData.name,
        role: data.userData.role,
        requestStatus: "sent",
      };
    });
  }, [status === "success"]);

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
