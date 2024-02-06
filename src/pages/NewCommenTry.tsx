import { useForm } from "react-hook-form";
import Button from "../components/Button";

function NewCommenTry() {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm();

  const { register: register2, handleSubmit: handleSubmit2 } = useForm();

  const onSubmit = (data: any) => {
    console.log(data);

    // posts.map(async (post: any) => {
    //   try {
    //     await http.get("/sanctum/csrf-cookie");
    //     const response = await http.post(
    //       `/api/comment/insert/${post.id}`,
    //       data
    //     );
    //     console.log(response);
    //   } catch (exception: any) {
    //     console.log(exception);
    //   }
    // });
  };
  const onSubmit2 = (data: any) => {
    console.log(data);

    // posts.map(async (post: any) => {
    //   try {
    //     await http.get("/sanctum/csrf-cookie");
    //     const response = await http.post(
    //       `/api/comment/insert/${post.id}`,
    //       data
    //     );
    //     console.log(response);
    //   } catch (exception: any) {
    //     console.log(exception);
    //   }
    // });
  };

  const onError = () => {};

  return (
    <div className="w-full h-auto">
      <form
        onSubmit={handleSubmit(onSubmit, onError)}
        noValidate
        className="w-[90%] flex flex-col justify-start gap-2 "
      >
        <label htmlFor="comment" className="">
          Write a comment:
        </label>
        <input
          className="w-full h-10 p-2 bg-gray-200 border-2 border-gray-200 rounded-2xl"
          type="text"
          {...register(`text`, {})}
        />
        <Button
          styles="w-[30%] md:w-[40%] p-1 text-white text-xs bg-slate-500 rounded drop-shadow-md"
          disabled={isSubmitting}
          value="Submit"
          type="submit"
          onClick={() => null}
        />
      </form>

      <form
        onSubmit={handleSubmit2(onSubmit2, onError)}
        noValidate
        className="w-[90%] flex flex-col justify-start gap-2 "
      >
        <label htmlFor="comment" className="">
          Write a comment:
        </label>
        <input
          className="w-full h-10 p-2 bg-gray-200 border-2 border-gray-200 rounded-2xl"
          type="text"
          {...register2(`text`, {})}
        />
        <Button
          styles="w-[30%] md:w-[40%] p-1 text-white text-xs bg-slate-500 rounded drop-shadow-md"
          disabled={isSubmitting}
          value="Submit"
          type="submit"
          onClick={() => null}
        />
      </form>
    </div>
  );
}

export default NewCommenTry;
