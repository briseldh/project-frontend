import { NavLink, Outlet } from "react-router-dom";
import Nav from "../components/Nav";

const RootLayout = () => {
  return (
    <>
      <header>
        <Nav />
      </header>
      <main>
        <Outlet />
      </main>
    </>
  );
};

export default RootLayout;
