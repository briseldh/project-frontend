import { useForm } from "react-hook-form";
import { DevTool } from "@hookform/devtools";
import Button from "../components/Button";
import { NavLink } from "react-router-dom";

type FormValues = {
  username: string;
  email: string;
  password: string;
};

const Register = () => {
  const form = useForm<FormValues>();
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = form;

  const onSubmit = () => {
    console.log("Formular is submitted");
  };

  const onError = () => {
    console.log("Formular error");
  };

  return (
    <>
      <section className="flex items-center justify-center w-screen h-screen sm:p-10 bg-slate-400">
        <form
          onSubmit={handleSubmit(onSubmit, onError)}
          noValidate
          className="flex flex-col self-center gap-4 p-10 bg-gray-100 border rounded-md w-[80%] sm:w-[70%] md:w-[60%] lg:w-[50%] xl:w-[35%]"
        >
          <h1 className="pb-8 text-3xl font-bold">Register</h1>
          <div className="flex flex-col">
            <label htmlFor="username">Username</label>
            <input
              className="h-10 p-2 border-2 border-gray-300 rounded"
              type="text"
              id="username"
              {...register("username", {
                required: {
                  value: true,
                  message: "Please enter your username",
                },
                minLength: {
                  value: 5,
                  message: "The username must be at least 5 characters",
                },
                maxLength: {
                  value: 12,
                  message: "The username must not exceed 12 characters",
                },
              })}
            />
            <p className="text-red-600">{errors.username?.message}</p>
          </div>
          <div className="flex flex-col">
            <label htmlFor="email">E-mail</label>
            <input
              className="h-10 p-2 border-2 border-gray-300 rounded"
              type="email"
              id="email"
              {...register("email", {
                required: {
                  value: true,
                  message: "Please enter your email address",
                },
                pattern: {
                  value:
                    /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
                  message: "Invalid email format!",
                },
              })}
            />
            <p className="text-red-600">{errors.email?.message}</p>
          </div>
          <div className="flex flex-col">
            <label htmlFor="password">Password</label>
            <input
              className="h-10 p-2 border-2 border-gray-300 rounded"
              type="text"
              id="password"
              {...register("password", {
                required: {
                  value: true,
                  message: "Please enter your password",
                },
                minLength: {
                  value: 8,
                  message: "The password must be at least 8 characters",
                },
                maxLength: {
                  value: 32,
                  message: "The password must not exceed 32 characters",
                },
                pattern: {
                  value:
                    /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/,
                  message:
                    "The password must contain a capital letter, a small letter, a number and a special character.",
                },
              })}
            />
            <p className="text-red-600">{errors.password?.message}</p>
          </div>

          <Button disabled={isSubmitting} value="Register" type="submit" />

          <div className="flex flex-col items-center justify-center m-4">
            <div className="w-full h-[1px] border border-gray-400 "></div>
            <p className="text-gray-500 ">OR</p>
          </div>

          <div className="flex self-center gap-1 ">
            <p>Already a user?</p>
            <NavLink className="underline" to="/login">
              LOGIN
            </NavLink>
          </div>
        </form>
      </section>
      <DevTool control={control} />
    </>
  );
};

export default Register;
