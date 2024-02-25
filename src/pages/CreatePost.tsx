import { useForm } from "react-hook-form";
import { DevTool } from "@hookform/devtools";
import Button from "../components/Button";
import http from "../utils/http";
import { PostFormValues } from "../types/formTypes";
import { useNavigate } from "react-router-dom";
import { Oval } from "react-loader-spinner";

const CreatePost = () => {
  const navigate = useNavigate();

  const form = useForm<PostFormValues>();
  const {
    register,
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = form;

  // This function is called when the fields are correctly validated
  const onSubmit = async (data: PostFormValues) => {
    const allData = {
      ...data,
      avatar: data.avatar[0],
    };

    try {
      await http.get("/sanctum/csrf-cookie");

      const response = await http.post("/api/post/insert", allData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log(response);

      navigate("/profile");
    } catch (exception: any) {
      console.log(exception);

      if (exception.response.status === 400) {
        const validationErrors = exception.response.data.message;

        for (let [fieldName, errorList] of Object.entries(validationErrors)) {
          const error = (errorList as any[]).map((message: string) => ({
            message,
          }));
          console.log(error);

          type FieldName = "title" | "text" | "avatar";
          setError(fieldName as FieldName, error[0]);
        }
      }
    }
  };

  // This function is called when when we have validation errors
  const onError = () => {
    console.log("Formular Error");
  };

  return (
    <>
      <section className="flex items-center justify-center w-screen min-h-screen bg-slate-400">
        <form
          onSubmit={handleSubmit(onSubmit, onError)}
          noValidate
          className="flex flex-col self-center gap-4 p-10 bg-gray-100 border rounded-md w-[80%] sm:w-[70%] md:w-[60%] lg:w-[50%] xl:w-[35%]"
        >
          <h1 className="pb-8 text-3xl font-bold">Create Post</h1>

          <div className="flex flex-col">
            <label htmlFor="title">Title</label>
            <input
              aria-invalid={errors.title ? true : false}
              className="h-10 p-2 border-2 border-gray-300 rounded"
              type="text"
              id="title"
              {...register("title", {
                required: {
                  value: true,
                  message: "Please enter a title for this post",
                },
              })}
            />
            <p className="text-red-600">{errors.title?.message}</p>
          </div>

          <div>
            <textarea
              className="w-full p-2 border-2 border-gray-300 rounded "
              placeholder="Post Discription ..."
              {...register("text", {})}
            ></textarea>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="file" className="text-lg font-semibold">
              Chose Image
            </label>
            <input
              aria-invalid={errors.avatar ? true : false}
              type="file"
              id="file"
              {...register("avatar", {
                required: {
                  value: true,
                  message: "Please select a file for this post",
                },
              })}
            />

            <p className="text-red-600">{errors.avatar?.message}</p>
            <p className="text-red-600 ">{errors.root?.message}</p>
          </div>

          <div className="flex justify-center gap-2">
            <Button
              styles=""
              disabled={isSubmitting}
              value="Create"
              type="submit"
              onClick={() => null}
            />

            {isSubmitting ? (
              <Oval
                height={"32"}
                width={"32"}
                color="#6464C8"
                secondaryColor="#6464C8"
                strokeWidth={"4"}
              />
            ) : null}
          </div>
        </form>
      </section>
      <DevTool control={control} />
    </>
  );
};

export default CreatePost;
