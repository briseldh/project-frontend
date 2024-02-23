import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthProvider";
import SingleComment from "./SingleComment";

//Toast
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

//Icons and Imgs
import likeIcon from "../../assets/icons/thumbs-up-regular.svg";
import commentIcon from "../../assets/icons/comment-regular.svg";

//Types and Styles
import { Comments, File, Post, ProfilePic } from "../../types/loaderTypes";
import { allStyles } from "../../styles/allStyles";
import ThreePointsMenu from "../headless-ui/ThreePointsMenu";

type Props = {
  posts: Post[];
  comments: Comments[];
  uploads?: File[];
  allProfilePics: ProfilePic[];
  isShownIn: "home" | "profile";
};

const OfflinePostView = ({
  posts,
  comments,
  uploads,
  allProfilePics,
  isShownIn,
}: Props) => {
  const { auth } = useContext(AuthContext);

  const [styles] = useState(allStyles);

  //Handling functions
  const handleLikeClick = () => {
    //Cheking if the user is logged in, if not we show a warning message.
    if (!auth.id) {
      toast.warn("You need to be logged in to like this post!");
      return;
    }
  };

  const handleCommentsClick = () => {
    //Cheking if the user is logged in, if not we show a warning message.
    if (!auth.id) {
      toast.warn("You need to be logged in to comment on this post!");
      return;
    }
  };

  const handleViewAllCommentsClick = () => {
    //Cheking if the user is logged in, if not we show a warning message.
    if (!auth.id) {
      toast.warn(
        "You need to be logged in to view all the comments on this post!"
      );
      return;
    }
  };

  const baseUrl = "http://localhost:80";

  return (
    <>
      {posts?.map((post) => {
        //Filtering through all comments so that i can check the length of the comments for a particular post.
        const postComments = comments?.filter(
          (comment) => comment.post_id === post.id
        );

        return (
          <section
            id="post-section"
            key={post.id}
            className={styles.postSection.commentsCloseStyles.postSection}
          >
            <div
              id="post-wrapper"
              className={styles.postSection.commentsCloseStyles.postWrapper}
            >
              {/* Top */}
              <div className="relative flex items-center justify-between">
                <div>
                  <h1 className="px-4 pt-2 text-lg font-semibold">
                    {post.title}
                  </h1>
                  <p className="px-4 pb-2 text-gray-800">{post.text}</p>
                </div>

                {isShownIn === "profile" ? (
                  <ThreePointsMenu post={post} uploads={uploads!} />
                ) : null}
              </div>

              {/* Img Container */}
              {uploads ? (
                uploads.map((upload) => {
                  if (post.id !== Number(upload.post_id)) return;

                  return (
                    <div key={upload.id} className="xs:w-full">
                      <img
                        src={`${baseUrl}/${upload.path}`}
                        alt={upload.alt_text}
                        className="xs:w-full "
                      />
                    </div>
                  );
                })
              ) : (
                <div className="xs:w-full">
                  <img
                    src={`${baseUrl}/${post.file.path}`}
                    alt={post.file.alt_text}
                    className="xs:w-full "
                  />
                </div>
              )}

              {/* Like and Comment buttons */}
              <div className="flex self-center justify-between py-1 border-gray-100 px-11 border-y xs:px-16 xs:py-2 sm:px-24">
                <div
                  onClick={handleLikeClick}
                  className="flex items-center gap-1 cursor-pointer"
                >
                  <img src={likeIcon} alt="like-icon" className="w-5 h-5" />

                  <p>Like</p>
                </div>

                <div
                  onClick={handleCommentsClick}
                  className="flex items-center gap-1 cursor-pointer"
                >
                  <img
                    src={commentIcon}
                    alt="comment-icon"
                    className="w-5 h-5"
                  />
                  <p>Comment</p>
                </div>
              </div>

              {/* All comments wrapper */}
              <div
                id="comments-wrapper"
                className={
                  styles.postSection.commentsCloseStyles.commentsWrapper
                }
              >
                {postComments && postComments.length > 2 ? (
                  <p
                    id={`${post.id}`}
                    onClick={handleViewAllCommentsClick}
                    className={
                      styles.postSection.commentsCloseStyles.viewAllCommentsLink
                    }
                  >
                    View all comments
                  </p>
                ) : null}

                <SingleComment
                  comments={comments!}
                  post={post}
                  profilePics={allProfilePics}
                />
              </div>
            </div>
          </section>
        );
      })}
      <ToastContainer />
    </>
  );
};

export default OfflinePostView;
