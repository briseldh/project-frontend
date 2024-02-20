import { useContext, useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { AuthContext } from "../../context/AuthProvider";
import http from "../../utils/http";
import EditPostDialog from "../headless-ui/EditPostDialog";
import SingleComment from "./SingleComment";

//Icons and Imgs
import xMarkBlack from "../../assets/icons/xmark-solid-black.svg";
import threePointsMenu from "../../assets/icons/ellipsis-solid.svg";
import deleteIcon from "../../assets/icons/trash-solid.svg";
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
} from "../../types/loaderTypes";
import { allStyles } from "../../styles/allStyles";
import {
  threePointsMenuClose,
  threePointsMenuOpen,
} from "../../styles/profilePage";

type Props = {
  queryLikes?: LikesResponse;
  posts: Post[];
  comments: Comments[];
  allLikes: Likes[];
  uploads?: File[];
};

const PostView = ({
  posts,
  comments,
  allLikes,
  uploads,
  queryLikes,
}: Props) => {
  const { auth } = useContext(AuthContext);
  const queryClient = useQueryClient();

  const [commentsOpen, setCommentsOpen] = useState<number[]>([]);
  // const [allLikes, setAllLikes] = useState<Likes[]>();
  const [userlikes, setUserLikes] = useState<number[]>([]);
  const [pointsMenuOpen, setPointsMenuOpen] = useState<number[]>([]);
  const [styles] = useState(allStyles);

  // Setting the User Likes effect
  useEffect(() => {
    //Checking if the allLikes state is an array before mapping. If I don't check that than I get a TS error.
    if (!allLikes) {
      queryClient.invalidateQueries({ queryKey: ["userLikesResponse"] });
    }

    if (Array.isArray(allLikes)) {
      console.log("ketu vjen");
      const userLikes = allLikes?.filter((like) => like.user_id === auth.id);
      const likeIds = userLikes!.map((like) => like.post_id);
      setUserLikes(likeIds);
    }
    return () => {};
  }, []);

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

    if (!userlikes.includes(postId)) {
      try {
        setUserLikes((prevUserLikes) => {
          return [...prevUserLikes, postId];
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
          console.log(newUserLikes);
          return newUserLikes;
        });

        await http.get("/sanctum/csrf-cookie");
        await http.post(`api/dislike/${postId}`);
        queryClient.invalidateQueries({ queryKey: ["userDataResponse"] });
      } catch (exception) {
        console.log(exception);
      }
    }
  };

  const handlePointsMenuClick = (
    e: React.MouseEvent<HTMLImageElement, MouseEvent>
  ) => {
    const postId = Number(e.currentTarget.id);

    if (!pointsMenuOpen.includes(postId)) {
      setPointsMenuOpen((prevValue) => {
        return [...prevValue, postId];
      });
    } else {
      setPointsMenuOpen((prevValue) => {
        const likeIdx = prevValue.indexOf(postId);
        prevValue.splice(likeIdx, 1);
        return [...prevValue];
      });
    }
  };
  const handleDeletePostClick = async (
    e: React.MouseEvent<HTMLHeadingElement, MouseEvent>
  ) => {
    const postId = Number(e.currentTarget.id);

    try {
      await http.get("/sanctum/csrf-cookie");
      await http.delete(`/api/post/delete/${postId}`);

      //This query invalidation is called when the user deletes the post so that the effect that runs depending on queryData happens.
      await queryClient.invalidateQueries({ queryKey: ["userDataResponse"] });
      console.log("Deleted Successfully");
    } catch (exception) {
      console.log(exception);
    }
  };

  const handleViewAllCommentsClick = (
    e: React.MouseEvent<HTMLParagraphElement, MouseEvent>
  ) => {
    const postId = Number(e.currentTarget.id);

    setCommentsOpen((prevValue) => {
      if (prevValue.includes(postId)) {
        return [...prevValue];
      } else {
        return [...prevValue, postId];
      }
    });
  };

  const baseUrl = "http://localhost:80";

  return (
    <>
      {posts?.map((post) => {
        //Filtering through all comments so that i can check the length of the comments for a particular post.
        const postComments = comments?.filter(
          (comment) => comment.post_id === post.id
        );

        //Filtering through all likes so that i can check how many likes a particular post has.
        const postLikes = allLikes?.filter((like) => like.post_id === post.id);

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

                <img
                  id={`${post.id}`}
                  onClick={(e) => handlePointsMenuClick(e)}
                  src={threePointsMenu}
                  alt="three-point-menu"
                  className="w-5 h-5 mx-4 cursor-pointer"
                />

                {/* Delete and Edit Post */}
                <div
                  className={
                    pointsMenuOpen.includes(post.id)
                      ? threePointsMenuOpen
                      : threePointsMenuClose
                  }
                >
                  <EditPostDialog post={post} uploads={uploads!} />

                  <div className="flex items-center gap-2 text-gray-200 cursor-pointer hover:underline">
                    <img
                      src={deleteIcon}
                      alt="delete-icon"
                      className="w-4 h-4 "
                    />
                    <h4
                      id={`${post.id}`}
                      onClick={(e) => {
                        handleDeletePostClick(e);
                      }}
                    >
                      Delete Post
                    </h4>
                  </div>
                </div>
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

                  <p>{postLikes?.length}</p>
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

                <SingleComment comments={comments!} post={post} />
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
    </>
  );
};

export default PostView;
