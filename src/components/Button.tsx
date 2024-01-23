type Props = {
  value: string;
  disabled: boolean | undefined;
  type: "submit" | "reset" | "button" | undefined;
  styles: string;
  onClick: () => {} | null;
};

const Button = ({ value, disabled, type, styles, onClick }: Props) => {
  return (
    <>
      <button
        className={
          styles ||
          "self-center w-[50%] sm:w-[40%] p-1 text-white bg-slate-500 rounded drop-shadow-md"
        }
        onClick={onClick}
        type={type}
        disabled={disabled}
      >
        {value}
      </button>
    </>
    //   <nav className="flex items-center justify-between px-6 py-4 bg-green-700">
    //   <ul className="flex items-center gap-4 text-white">
    //     <li>
    //       <NavLink to="/">Home</NavLink>
    //     </li>

    //     {!auth.id ? (
    //       <ul className="flex items-center gap-4 text-white">
    //         <li>
    //           <NavLink to="/login">Login</NavLink>
    //         </li>
    //         <li>
    //           <NavLink to="/register">Register</NavLink>
    //         </li>
    //       </ul>
    //     ) : (
    //       <ul>
    //         <li>
    //           <NavLink to="/create-post">Create Post</NavLink>
    //         </li>
    //         <li>
    //           <NavLink to="/profile">Profile</NavLink>
    //         </li>

    //         <LogoutBtn />
    //       </ul>
    //     )}
    //   </ul>
    //   {/* <div className="flex flex-col gap-2" onClick={handleClick}>
    //     <span className="block w-9 h-[3px] bg-gray-100 "></span>
    //     <span className="block w-9 h-[3px] bg-gray-100 "></span>
    //     <span className="block w-9 h-[3px] bg-gray-100 "></span>
    //   </div> */}
    // </nav>
  );
};

export default Button;
