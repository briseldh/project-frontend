import { useContext, useState } from "react";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../context/AuthProvider";
import LogoutBtn from "./LogoutBtn";

// Icons:
import menu from "../assets/imgs/bars-solid.svg";
import xMark from "../assets/imgs/xmark-solid.svg";

const Nav = () => {
  const [openMenu, setOpenMenu] = useState(true);

  const { auth } = useContext(AuthContext);

  const handleMenuToggleClick = () => {
    setOpenMenu(!openMenu);
    console.log("Nav Toggeld");
  };

  // const handleClick = () => {
  //   const hamMenuIcon = document.querySelector("#ham-menu");
  //   const navBar = document.querySelector("#nav-bar");
  //   const navLinks = document.querySelectorAll("li");

  //   navBar?.classList.toggle("active");
  //   hamMenuIcon?.classList.toggle("fa-times");
  //   // console.log(navLinks);

  //   navLinks.forEach((link) => {
  //     link.addEventListener("click", () => {
  //       navBar?.classList.remove("active");
  //       hamMenuIcon?.classList.toggle("fa-times");
  //     });
  //   });
  // };

  return (
    <>
      {openMenu ? (
        <nav className="fixed z-10 flex flex-col-reverse items-center justify-between w-screen gap-5 px-12 py-6 bg-blue-500 sm:flex-row sm:justify-end sm:py-4">
          <ul className="flex flex-col items-center gap-6 text-white sm:flex-row">
            <li className="text-lg font-medium">
              <NavLink to="/">Home</NavLink>
            </li>

            {!auth.id ? (
              <ul className="flex flex-col items-center gap-6 text-white sm:flex-row">
                <li className="text-lg font-medium">
                  <NavLink to="/login">Login</NavLink>
                </li>
                <li className="text-lg font-medium">
                  <NavLink to="/register">Register</NavLink>
                </li>
              </ul>
            ) : (
              <ul className="flex flex-col items-center gap-6 text-white sm:flex-row">
                <li className="text-lg font-medium">
                  <NavLink to="/create-post">Create Post</NavLink>
                </li>
                <li className="text-lg font-medium">
                  <NavLink to="/profile">Profile</NavLink>
                </li>

                <LogoutBtn />
              </ul>
            )}
          </ul>
          <div onClick={handleMenuToggleClick} className="sm:hidden">
            <img src={xMark} alt="close-menu" className="h-[21.6px]" />
          </div>
        </nav>
      ) : (
        <nav className="flex items-center justify-end px-6 py-4 bg-blue-500">
          <div onClick={handleMenuToggleClick} className="sm:hidden">
            <img src={menu} alt="burger-menu" className="h-[21.6px]" />
          </div>
        </nav>
      )}
    </>
  );
};

export default Nav;
