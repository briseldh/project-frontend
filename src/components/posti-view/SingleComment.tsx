import { Comments, Post, ProfilePic } from "../../types/loaderTypes";

// Icons and Imgs
import profile from "../../assets/imgs/149071.png";
import deleteIcon from "../../assets/icons/trash-can-solid-red.svg";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthProvider";
import http from "../../utils/http";
import { useQueryClient } from "@tanstack/react-query";

type Props = {
  comments: Comments[];
  post: Post;
  profilePics: ProfilePic[];
};

const SingleComment = ({ comments, post, profilePics }: Props) => {
  const { auth } = useContext(AuthContext);
  const queryClient = useQueryClient();

  const [isSending, setIsSending] = useState<number[]>([]);

  console.log(profilePics);

  //Handling functions
  const handleCommentDeleteClick = async (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    const commentId = Number(e.currentTarget.id);

    try {
      setIsSending((prevValue) => {
        if (prevValue.includes(commentId)) {
          return [...prevValue];
        } else {
          return [...prevValue, commentId];
        }
      });
      await http.get("/sanctum/csrf-cookie");
      await http.delete(`/api/comment/delete/${commentId}`);

      //This query invalidation is called when the user deletes the post so that the effect that runs depending on queryData happens.
      await queryClient.invalidateQueries({ queryKey: ["userDataResponse"] });
      console.log("Deleted Successfully");
    } catch (exception) {
      console.log(exception);
    } finally {
      setIsSending([]);
    }
  };

  const baseUrl = "http://localhost:80";

  return (
    <>
      {comments?.map((comment) => {
        if (post.id !== comment.post_id) return;

        return (
          <div key={comment.id} className="flex flex-col gap-4 p-4">
            <div className="flex gap-2">
              {profilePics.length !== 0 ? (
                profilePics.map((profilePic) => {
                  if (profilePic?.user_id !== comment.user_id) {
                    return (
                      <img
                        key={profilePic?.id}
                        src={profile}
                        alt="commenter-profile-pic"
                        className="w-10 h-10"
                      />
                    );
                  }

                  return (
                    <div
                      key={profilePic.id}
                      className="w-10 h-10 overflow-hidden rounded-full"
                    >
                      <img
                        src={`${baseUrl}/${profilePic.path}`}
                        alt="commenter-profile-pic"
                        className="w-10 h-10"
                      />
                    </div>
                  );
                })
              ) : (
                <img
                  src={profile}
                  alt="commenter-profile-pic"
                  className="w-10 h-10"
                />
              )}

              <div
                className={
                  isSending.includes(comment.id)
                    ? "relative p-2 bg-gray-200 rounded-xl opacity-50 pointer-events-none min-w-[150px]"
                    : "relative p-2 bg-gray-200 rounded-xl min-w-[150px]"
                }
              >
                <h3 className="font-medium">{comment.user?.name}</h3>
                <p className="text-gray-800">{comment.text}</p>

                {auth.id === comment.user_id ? (
                  <div
                    id={`${comment.id}`}
                    onClick={(e) => handleCommentDeleteClick(e)}
                    className="absolute p-2 rounded-full cursor-pointer hover:bg-red-200 top-1 right-1"
                  >
                    <img
                      src={deleteIcon}
                      alt="delete-icon"
                      className="w-3 h-3"
                    />
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
};

export default SingleComment;
