import { useEffect, useState } from "react";
import http from "../utils/http";
import { Navigate, useLoaderData } from "react-router-dom";
import { useForm } from "react-hook-form";
import Button from "../components/Button";
// import EditProfileDialog from "../components/material-ui/EditProfileDialog";
import EditProfileDialog from "../components/headless-ui/EditProfileDialog";
import EditPostDialog from "../components/headless-ui/EditPostDialog";

//Image and Icons
import profile from "../assets/imgs/149071.png";
import commentIcon from "../assets/icons/comment-regular.svg";
import likeIcon from "../assets/icons/thumbs-up-regular.svg";
import xMark from "../assets/icons/xmark-solid.svg";
import likeIconFilled from "../assets/icons/thumbs-up-solid.svg";
import threePointsMenu from "../assets/icons/ellipsis-solid.svg";
import editIcon from "../assets/icons/pen-solid.svg";
import deleteIcon from "../assets/icons/trash-solid.svg";

//Types and styles
import { CommentFormValues, ProfileLoaderData } from "../types/loaderTypes";
import {
  editProfileOpen,
  editProfileClose,
  threePointsMenuClose,
  threePointsMenuOpen,
} from "../styles/profilePage";
import { allStyles } from "../styles/allStyles";

const Profile = () => {
  const data = useLoaderData() as ProfileLoaderData;
  const { userDataResponse, likesResponse } = data;

  const [posts, setPosts] = useState(userDataResponse.userData.posts);
  const [comments] = useState(userDataResponse.userData.comments);
  const [uploads, setUploads] = useState(userDataResponse.userUploads);
  const [likes, setLikes] = useState<number[]>([]);
  const [styles, setStyles] = useState(allStyles);
  const [commentsOpen, setCommentsOpen] = useState<number[]>([]);
  const [pointsMenuOpen, setPointsMenuOpen] = useState<number[]>([]);

  useEffect(() => {
    const likeIds = likesResponse.likes?.map((like) => like.post_id);
    setLikes(likeIds);

    return () => {};
  }, []);

  //Handling functions
  const handleEditProfileClick = async () => {
    setStyles((prevStyles) => {
      return {
        ...prevStyles,
        profileSection: editProfileOpen,
      };
    });
  };
  const handleCloseEditProfileClick = () => {
    setStyles((prevStyles) => {
      return {
        ...prevStyles,
        profileSection: editProfileClose,
      };
    });
  };
  // const handleAddProfilePicClick = () => null;

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
    console.log(pointsMenuOpen);
  };
  const handleDeletePostClick = async (
    e: React.MouseEvent<HTMLHeadingElement, MouseEvent>
  ) => {
    const postId = Number(e.currentTarget.id);

    try {
      await http.get("/sanctum/csrf-cookie");
      await http.delete(`/api/post/delete/${postId}`);

      //ToDo: Redirect after deleting post
      // <Navigate to={"/profile"} />;
    } catch (exception) {
      console.log(exception);
    }
  };

  const handleLikeClick = async (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    const postId = Number(e.currentTarget.id);

    if (!likes.includes(postId)) {
      try {
        setLikes((prevLikes) => {
          return [...prevLikes, postId];
        });

        await http.get("/sanctum/csrf-cookie");
        await http.post(`api/like/${postId}`);
      } catch (exception) {
        console.log(exception);
      }
    } else {
      try {
        setLikes((prevLikes) => {
          const likeIdx = prevLikes.indexOf(postId);
          prevLikes.splice(likeIdx, 1);
          return [...prevLikes];
        });

        await http.get("/sanctum/csrf-cookie");
        await http.post(`api/dislike/${postId}`);
      } catch (exception) {
        console.log(exception);
      }
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

  //======Write a new comment form===========//
  const form = useForm<CommentFormValues>();
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = form;

  const onSubmit = (data: CommentFormValues) => {
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

  const baseUrl = "http://localhost:80";

  return (
    <>
      <section className="flex flex-col w-full pt-10">
        <div className="bg-gray-400 w-full h-[150px] absolute rounded-b-2xl"></div>

        <section className="flex flex-col items-center w-full px-6 bg-gray-300 pb-7 md:flex-row md:justify-between lg:justify-start">
          <div className="z-10 w-1/2 pt-16 xs:w-2/5 sm:w-1/3 md:w-1/4 lg:w-[230px]">
            <img src={profile} alt="profile-pic" />
          </div>

          <div className="flex flex-col items-center w-1/2 gap-2 pt-2 md:h-full md:w-4/5 md:pt-40 md:flex-row md:justify-between md:pl-5 ">
            <h1 className="z-10 text-2xl font-semibold md:text-3xl md:font-bold">
              {userDataResponse.userData.name}
            </h1>

            <EditProfileDialog />
          </div>
        </section>
      </section>

      {posts?.map((post) => {
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
                src={xMark}
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
                  {/* <div className="flex items-center gap-2 text-gray-200 cursor-pointer hover:underline">
                    <img src={editIcon} alt="pen-icon" className="w-4 h-4" />
                    <h4>Edit Post</h4>
                  </div> */}

                  <EditPostDialog />

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

              {uploads?.map((upload) => {
                if (post.id !== (upload.post_id as any)) return;
                // console.log(upload);

                return (
                  <div key={upload.id} className="xs:w-full">
                    <img
                      src={`${baseUrl}/${upload.path}`}
                      alt={upload.alt_text}
                      className="xs:w-full "
                    />
                  </div>
                );
              })}

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
                    src={likes.includes(post.id) ? likeIconFilled : likeIcon}
                    alt="like-icon"
                    className="w-5 h-5"
                  />

                  <p>Like</p>
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

                <div className="flex gap-2 p-4">
                  <img
                    src={profile}
                    alt="commenter-profile-pic"
                    className="w-10 h-10"
                  />
                  <div className="p-2 bg-gray-200 rounded-xl">
                    <h3 className="font-medium">John Doe</h3>
                    <p className="text-gray-800">This is a comment</p>
                  </div>
                </div>
                <div className="flex gap-2 p-4">
                  <img
                    src={profile}
                    alt="commenter-profile-pic"
                    className="w-10 h-10"
                  />
                  <div className="p-2 bg-gray-200 rounded-xl">
                    <h3 className="font-medium">John Doe</h3>
                    <p className="text-gray-800">This is a comment</p>
                  </div>
                </div>
                <div className="flex gap-2 p-4">
                  <img
                    src={profile}
                    alt="commenter-profile-pic"
                    className="w-10 h-10"
                  />
                  <div className="p-2 bg-gray-200 rounded-xl">
                    <h3 className="font-medium">John Doe</h3>
                    <p className="text-gray-800">This is a comment</p>
                  </div>
                </div>
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
                    {...register("text", {})}
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
            </div>
          </section>
        );
      })}
    </>
  );
};

export default Profile;

export const profileLoader = async () => {
  try {
    const userDataResponse = await http.get("/api/getUserData");
    const likesResponse = await http.get("/api/like/getUserLikes");

    return {
      userDataResponse: userDataResponse.data,
      likesResponse: likesResponse.data,
    };
  } catch (exception: any) {
    console.log(exception);
  }
};
