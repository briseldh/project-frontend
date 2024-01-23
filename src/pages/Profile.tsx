import { useContext } from "react";
import { AuthContext } from "../context/AuthProvider";
import http from "../utils/http";

const Profile = () => {
  const { auth } = useContext(AuthContext);
  console.log(auth);

  return (
    <>
      <h1 className="pt-20">My Profile</h1>
      <p>This is the profile of the user that is loged in.</p>
    </>
  );
};

export default Profile;

export const profileLoader = async () => {
  try {
    const response = await http.get("/api/getUserData");

    console.log(response);
    return response.data;
  } catch (exception: any) {
    console.log(exception);
  }
};
