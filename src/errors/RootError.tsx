import { NavLink } from "react-router-dom";

const RootError = () => {
  return (
    <>
      <h1>Woops, you got an error...</h1>
      <NavLink to="/">Go to Home</NavLink>
    </>
  );
};

export default RootError;
