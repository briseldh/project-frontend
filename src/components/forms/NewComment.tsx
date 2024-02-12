import { SubmitHandler, useForm } from "react-hook-form";

// Icons and Images
import sendComment from "../../assets/icons/send-comment.svg";

// Types and Styles
import { CommentFormValues } from "../../types/formTypes";
import Button from "../Button";
import http from "../../utils/http";

type Props = {
  postId: number;
};

const NewComment = ({ postId }: Props) => {
  //======Write a new comment form===========//
  const form = useForm<CommentFormValues>();
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = form;

  const onSubmit: SubmitHandler<CommentFormValues> = async (data, e) => {
    try {
      await http.get("/sanctum/csrf-cookie");
      await http.post(`/api/comment/insert/${e?.target.id}`, data);
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
        {...register("text", {})}
      />

      {/* <div onClick={} className="pt-2">
        <img src={sendComment} alt="send-comment-icon" className="w-6 h-6" />
      </div> */}

      <Button
        styles={
          !isSubmitting
            ? "w-[30%]  p-1 text-white text-xs bg-blue-500 rounded drop-shadow-md"
            : "w-[30%]  p-1 text-white text-xs bg-blue-400 rounded drop-shadow-md"
        }
        disabled={isSubmitting}
        value="Submit"
        type="submit"
        onClick={() => null}
      />
    </form>
  );
};

export default NewComment;
