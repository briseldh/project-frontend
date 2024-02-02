import { useState } from "react";
import { Oval } from "react-loader-spinner";
import { Link } from "react-router-dom";

const NotFound = () => {
  const [linkClick, setLinkClick] = useState(false);

  const handleClick = () => {
    setLinkClick(!linkClick);
  };

  return (
    <>
      <section className="w-screen h-screen ">
        <div className="flex flex-col items-center justify-center w-full h-full gap-4 px-3">
          <h1 className="text-6xl font-extrabold">Oops!</h1>
          <h3 className="text-3xl font-semibold text-center">
            404 - Page Not Found
          </h3>
          <p className="text-center">
            The page you are looking for might have been removed, had its name
            changed, or is temporarily unavailable.
          </p>
          <div className="flex items-center gap-3">
            <Link
              onClick={handleClick}
              to={"/"}
              className="px-5 py-3 text-lg font-bold text-white bg-blue-400 rounded-full"
            >
              Go To Home
            </Link>
            {linkClick ? (
              <Oval
                height={"36"}
                width={"36"}
                color="#6464C8"
                strokeWidth={"4"}
              />
            ) : null}
          </div>
        </div>
      </section>
    </>
  );
};

export default NotFound;
