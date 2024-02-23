import { SubmitHandler, useForm } from "react-hook-form";

// Types and Styles
import { CommentFormValues } from "../../types/formTypes";
import Button from "../Button";
import http from "../../utils/http";
import { useQueryClient } from "@tanstack/react-query";
import { Oval } from "react-loader-spinner";

type Props = {
  postId: number;
};

const NewComment = ({ postId }: Props) => {
  const queryClient = useQueryClient();

  //======Write a new comment form===========//
  const form = useForm<CommentFormValues>();
  const {
    register,
    resetField,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = form;

  const onSubmit: SubmitHandler<CommentFormValues> = async (data, e) => {
    try {
      resetField("text");
      await http.get("/sanctum/csrf-cookie");
      await http.post(`/api/comment/insert/${e?.target.id}`, data);
      await queryClient.invalidateQueries({ queryKey: ["userDataResponse"] });
      await queryClient.invalidateQueries({ queryKey: ["postsResponse"] });
    } catch (exception: any) {
      console.log(exception);
    }
  };

  const onError = () => {};

  return (
    <form
      id={`${postId}`}
      onSubmit={handleSubmit(onSubmit, onError)}
      noValidate
      className="w-[95%] flex justify-start gap-3 flex-col "
    >
      <label htmlFor="comment" className="">
        Write a comment:
      </label>
      <input
        className="w-full h-10 p-2 bg-gray-200 border-2 border-gray-200 rounded-2xl"
        type="text"
        id="comment"
        {...register("text", {
          required: {
            value: true,
            message: "Can not send empty comments",
          },
        })}
      />
      {errors.text ? (
        <p className="text-red-500">{`${errors.text.message}!`}</p>
      ) : null}
      <div className="flex items-center gap-2">
        <Button
          styles={
            !isSubmitting
              ? "w-[30%]  p-1 text-white text-xs bg-blue-500 rounded drop-shadow-md"
              : "w-[30%]  p-1 text-white text-xs bg-blue-400 rounded drop-shadow-md"
          }
          disabled={isSubmitting}
          value="Send"
          type="submit"
          onClick={() => null}
        />

        {isSubmitting ? (
          <Oval
            height={"20"}
            width={"20"}
            color="#6464C8"
            strokeWidth={"4"}
            secondaryColor="#6464C8"
          />
        ) : null}
      </div>
    </form>
  );
};

export default NewComment;
