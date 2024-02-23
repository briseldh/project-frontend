import { useContext, useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { AuthContext } from "../../context/AuthProvider";
import http from "../../utils/http";
import SingleComment from "./SingleComment";
import { Oval } from "react-loader-spinner";

//Toast
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

//Icons and Imgs
import xMarkBlack from "../../assets/icons/xmark-solid-black.svg";
import likeIconFilled from "../../assets/icons/thumbs-up-solid.svg";
import likeIcon from "../../assets/icons/thumbs-up-regular.svg";
import commentIcon from "../../assets/icons/comment-regular.svg";
import NewComment from "../forms/NewComment";

//Types and Styles
import {
  Comments,
  File,
  Likes,
  LikesResponse,
  Post,
  ProfilePic,
} from "../../types/loaderTypes";
import { allStyles } from "../../styles/allStyles";
import ThreePointsMenu from "../headless-ui/ThreePointsMenu";

type Props = {
  posts: Post[];
  comments: Comments[];
  uploads?: File[];
  allProfilePics: ProfilePic[];
  isShownIn: "home" | "profile";
};

type PostLikesCount = {
  [x: number]: number;
};

const PostView = ({
  posts,
  comments,
  uploads,
  allProfilePics,
  isShownIn,
}: Props) => {
  const { auth } = useContext(AuthContext);
  const queryClient = useQueryClient();

  const { data: queryLikes, isLoading: likesIsLoading } =
    useQuery<LikesResponse>({
      queryKey: ["userLikesResponse"],
      queryFn: async () => {
        const res = await fetch("http://localhost:80/api/like/getUserLikes", {
          credentials: "include",
        });

        if (!res.ok) {
          console.log("Failed to fetch data");
          throw new Error(`HTTP Error: ${res.status}`);
        }

        return res.json();
      },
      staleTime: 1000,
    });

  const [commentsOpen, setCommentsOpen] = useState<number[]>([]);
  const [allLikes, setAllLikes] = useState<Likes[]>();
  const [userlikes, setUserLikes] = useState<number[]>([]);
  const [styles] = useState(allStyles);
  const [postLikesCount, setPostLikesCount] = useState<PostLikesCount>();

  // Setting the User Likes effect
  useEffect(() => {
    if (!queryLikes) {
      console.log("The likesResponseQuery doesent exist");
      return;
    }
    setAllLikes(queryLikes.allLikes);

    const likeIds = queryLikes.likes.map((like: Likes) => like.post_id);
    setUserLikes(likeIds);

    //Setting the post likes count
    posts
      ? posts.map((post) => {
          const postLikes = queryLikes.allLikes.filter(
            (like) => like.post_id === post.id
          );

          setPostLikesCount((prevLikesCount) => {
            return { ...prevLikesCount, [post.id]: postLikes.length };
          });
        })
      : console.log("There is no posts yet");
  }, [queryLikes]);

  console.log(postLikesCount);
  //Handling functions
  const handleCloseCommentsClick = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    const postId = Number(e.currentTarget.id);

    setCommentsOpen((prevValue) => {
      const likeIdx = prevValue.indexOf(postId);
      prevValue.splice(likeIdx, 1);
      return [...prevValue];
    });
  };

  const handleLikeClick = async (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    const postId = Number(e.currentTarget.id);

    //Cheking if the user is logged in, if not we show a warning message.
    if (!auth.id) {
      toast.warn("You need to be logged in to like this post!");
      return;
    }

    if (!userlikes.includes(postId)) {
      try {
        setUserLikes((prevUserLikes) => {
          return [...prevUserLikes, postId];
        });

        setPostLikesCount((prevCount) => {
          return { ...prevCount, [postId]: prevCount![postId] + 1 };
        });

        await http.get("/sanctum/csrf-cookie");
        await http.post(`api/like/${postId}`);
        queryClient.invalidateQueries({ queryKey: ["userDataResponse"] });
      } catch (exception) {
        console.log(exception);
      }
    } else {
      try {
        setUserLikes((prevUserLikes) => {
          const newUserLikes = prevUserLikes.filter(
            (likeId) => likeId !== postId
          );
          return newUserLikes;
        });

        setPostLikesCount((prevCount) => {
          return { ...prevCount, [postId]: prevCount![postId] - 1 };
        });

        await http.get("/sanctum/csrf-cookie");
        await http.post(`api/dislike/${postId}`);
        queryClient.invalidateQueries({ queryKey: ["userDataResponse"] });
      } catch (exception) {
        console.log(exception);
      }
    }
  };

  const handleViewAllCommentsClick = (
    e: React.MouseEvent<HTMLParagraphElement, MouseEvent>
  ) => {
    const postId = Number(e.currentTarget.id);

    //Cheking if the user is logged in, if not we show a warning message.
    if (!auth.id) {
      toast.warn("You need to be logged in to comment on this post!");
      return;
    }

    setCommentsOpen((prevValue) => {
      if (prevValue.includes(postId)) {
        return [...prevValue];
      } else {
        return [...prevValue, postId];
      }
    });
  };

  const baseUrl = "http://localhost:80";

  // if (likesIsLoading) {
  //   return (
  //     <div className="absolute -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
  //       <Oval height="60" width="60" color="#6B7280" secondaryColor="#6B7280" />
  //     </div>
  //   );
  // }

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
            className={
              commentsOpen.includes(post.id)
                ? styles.postSection.commentsOpenStyles.postSection
                : styles.postSection.commentsCloseStyles.postSection
            }
          >
            {/* X Mark */}
            <div
              id="close-comments-xmark"
              onClick={(e) => handleCloseCommentsClick(e)}
              className={
                commentsOpen.includes(post.id)
                  ? styles.postSection.commentsOpenStyles.closeCommentsXmark
                  : styles.postSection.commentsCloseStyles.closeCommentsXmark
              }
            >
              <img
                src={xMarkBlack}
                alt="x-mark"
                className="w-6 h-6 cursor-pointer"
              />
            </div>

            <div
              id="post-wrapper"
              className={
                commentsOpen.includes(post.id)
                  ? styles.postSection.commentsOpenStyles.postWrapper
                  : styles.postSection.commentsCloseStyles.postWrapper
              }
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
                  onClick={(e) => {
                    handleLikeClick(e);
                  }}
                  id={`${post.id}`}
                  className="flex items-center gap-1 cursor-pointer"
                >
                  <img
                    id={`${post.id}`}
                    src={
                      userlikes.includes(post.id) ? likeIconFilled : likeIcon
                    }
                    alt="like-icon"
                    className="w-5 h-5"
                  />

                  <p>Like</p>

                  <p>{postLikesCount ? postLikesCount[post.id] : "loading"}</p>
                </div>

                <div
                  id={`${post.id}`}
                  onClick={(e) => handleViewAllCommentsClick(e)}
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
                  commentsOpen.includes(post.id)
                    ? styles.postSection.commentsOpenStyles.commentsWrapper
                    : styles.postSection.commentsCloseStyles.commentsWrapper
                }
              >
                {postComments && postComments.length > 2 ? (
                  <p
                    id={`${post.id}`}
                    onClick={(e) => handleViewAllCommentsClick(e)}
                    className={
                      commentsOpen.includes(post.id)
                        ? styles.postSection.commentsOpenStyles
                            .viewAllCommentsLink
                        : styles.postSection.commentsCloseStyles
                            .viewAllCommentsLink
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

              {/* Write New Comment Wrapper */}
              <div
                id="write-new-comment"
                className={
                  commentsOpen.includes(post.id)
                    ? styles.postSection.commentsOpenStyles.writeNewComment
                    : styles.postSection.commentsCloseStyles.writeNewComment
                }
              >
                <NewComment postId={post.id} />
              </div>
            </div>
          </section>
        );
      })}
      <ToastContainer />
    </>
  );
};

export default PostView;
