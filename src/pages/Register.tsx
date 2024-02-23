import { useForm } from "react-hook-form";
import { DevTool } from "@hookform/devtools";
import Button from "../components/Button";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import http from "../utils/http";
import { useContext } from "react";
import { AuthContext } from "../context/AuthProvider";
import { Oval } from "react-loader-spinner";

//Types and Styles
import { RegisterFormValues } from "../types/formTypes";
import { UserData } from "../types/loaderTypes";

const Register = () => {
  const { auth, setAuth } = useContext(AuthContext);

  const navigate = useNavigate();
  const { state } = useLocation();
  const { from = "/" } = state || {};

  const form = useForm<RegisterFormValues>();
  const {
    register,
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = form;

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      await http.get("/sanctum/csrf-cookie");
      await http.post("/api/register", data);
      const registratedUser = await http.get("/api/getUserData"); // Needed because the role is not returned from the register request before this

      const userData = registratedUser.data.userData as UserData;

      setAuth((prevAuth) => {
        let role = null;

        if (userData.role === "admin") {
          role = userData.role as "admin";
        }

        if (userData.role === "user") {
          role = userData.role as "user";
        }

        return {
          ...prevAuth,
          id: userData.id,
          username: userData.name,
          role: role,
          requestStatus: "sent",
        };
      });

      navigate(from);
      console.log("Formular is submitted");
    } catch (exception: any) {
      if (exception.response.status === 422) {
        const errors = exception.response.data.errors;

        for (let [fieldName, errorList] of Object.entries(errors)) {
          console.log(fieldName, errorList);

          type FieldName = "username" | "email" | "password";

          const errors = (errorList as any[]).map((message) => ({ message }));
          console.log(errors);

          setError(fieldName as FieldName, errors[0]);
        }
      }
    }
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
              type="password"
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
                pattern: {
                  value:
                    /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z])(?=.*?[#?!@$%^.,><&*-])/,
                  message:
                    "The password must contain a capital letter, a lowercase letter, a number and a special character!",
                },
              })}
            />

            <p className="text-red-600">{errors.password?.message}</p>
          </div>

          <div className="flex justify-center gap-2">
            <Button
              styles=""
              disabled={isSubmitting}
              value="Login"
              type="submit"
              onClick={() => null}
            />

            {isSubmitting ? (
              <Oval
                height={"32"}
                width={"32"}
                color="#6464C8"
                strokeWidth={"4"}
                secondaryColor="#6464C8"
              />
            ) : null}
          </div>

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
