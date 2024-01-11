import { useForm } from "react-hook-form";
import { DevTool } from "@hookform/devtools";
import Button from "../components/Button";

type FormValues = {
  title: string;
  avatar: File;
};

const CreatePost = () => {
  const form = useForm<FormValues>();
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = form;

  // This function is called when the fields are correctly validated
  const onSubmit = () => {
    console.log("Formular Submitted");

    //Logic for login
  };

  // This function is called when when we have validation errors
  const onError = () => {
    console.log("Formular Error");
  };

  return (
    <>
      <section className="flex items-center justify-center w-screen h-screen sm:p-10 bg-slate-400">
        <form
          onSubmit={handleSubmit(onSubmit, onError)}
          noValidate
          className="flex flex-col self-center gap-4 p-10 bg-gray-100 border rounded-md w-[80%] sm:w-[70%] md:w-[60%] lg:w-[50%] xl:w-[35%]"
        >
          <h1 className="pb-8 text-3xl font-bold">Create Post</h1>

          <div className="flex flex-col">
            <label htmlFor="title">Title</label>
            <input
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

          <div className="flex flex-col">
            <label htmlFor="file">Chose Image</label>
            <input
              type="file"
              id="file"
              {...register("avatar", {
                required: {
                  value: true,
                  message: "Please enter a file for this post",
                },
              })}
            />
          </div>

          <Button disabled={isSubmitting} value="Create" type="submit" />
        </form>
      </section>
      <DevTool control={control} />
    </>
  );
};

export default CreatePost;
