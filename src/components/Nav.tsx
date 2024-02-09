import { useContext, useState } from "react";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../context/AuthProvider";
import LogoutBtn from "./LogoutBtn";

// Icons:
import menu from "../assets/icons/bars-solid.svg";
import xMark from "../assets/icons/xmark-solid.svg";

const Nav = () => {
  const [openMenu, setOpenMenu] = useState(true);

  const { auth } = useContext(AuthContext);

  const handleMenuToggleClick = () => {
    setOpenMenu(!openMenu);
    console.log("Nav Toggeld");
  };

  return (
    <>
      {openMenu ? (
        <nav className="fixed z-50 flex flex-col-reverse items-center justify-between w-screen gap-5 px-12 py-6 bg-blue-600 sm:flex-row sm:justify-end sm:py-4">
          <ul className="flex flex-col items-center gap-6 text-white sm:flex-row">
            <li className="px-2 py-1 text-lg font-medium rounded-md hover:bg-blue-500 active:bg-opacity-50">
              <NavLink to="/">Home</NavLink>
            </li>

            {!auth.id ? (
              <ul className="flex flex-col items-center gap-6 text-white sm:flex-row">
                <li className="px-2 py-1 text-lg font-medium rounded-md hover:bg-blue-500 active:bg-opacity-50">
                  <NavLink to="/login">Login</NavLink>
                </li>
                <li className="px-2 py-1 text-lg font-medium rounded-md hover:bg-blue-500 active:bg-opacity-50">
                  <NavLink to="/register">Register</NavLink>
                </li>
              </ul>
            ) : (
              <ul className="flex flex-col items-center gap-6 text-white sm:flex-row">
                <li className="px-2 py-1 text-lg font-medium rounded-md hover:bg-blue-500 active:bg-opacity-50">
                  <NavLink to="/create-post">Create Post</NavLink>
                </li>
                <li className="px-2 py-1 text-lg font-medium rounded-md hover:bg-blue-500 active:bg-opacity-50">
                  <NavLink to="/profile">Profile</NavLink>
                </li>

                <LogoutBtn />
              </ul>
            )}
          </ul>
          <div onClick={handleMenuToggleClick} className="sm:hidden">
            <img
              src={xMark}
              alt="close-menu"
              className="h-[21.6px] cursor-pointer"
            />
          </div>
        </nav>
      ) : (
        <nav className="fixed z-50 flex items-center justify-end w-screen px-6 py-4 bg-blue-600">
          <div onClick={handleMenuToggleClick} className="sm:hidden">
            <img
              src={menu}
              alt="burger-menu"
              className="h-[21.6px] cursor-pointer"
            />
          </div>
        </nav>
      )}
    </>
  );
};

export default Nav;
