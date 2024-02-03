import { useEffect, useState } from "react";
import http from "../utils/http";
import { useLoaderData } from "react-router-dom";
import { useForm } from "react-hook-form";
import Button from "../components/Button";

//Image and Icons
import profile from "../assets/imgs/149071.png";
import commentIcon from "../assets/icons/comment-regular.svg";
import likeIcon from "../assets/icons/thumbs-up-regular.svg";
import xMark from "../assets/icons/xmark-solid.svg";
import likeIconFilled from "../assets/icons/thumbs-up-solid.svg";

//Types
import {
  CommentFormValues,
  Likes,
  Post,
  ProfileLoaderData,
} from "../types/loaderTypes";
import {
  commentsOpenStyles,
  defaultCommentSectionStyles,
} from "../styles/CommentSectionStyles";
import {
  closeEditProfileXmark,
  editProfileSection,
} from "../styles/EditProfileSectionStyles";

const Profile = () => {
  const data = useLoaderData() as ProfileLoaderData;
  const { userDataResponse, likesResponse } = data;

  const [posts, setPosts] = useState(userDataResponse.userData.posts);
  const [comments] = useState(userDataResponse.userData.comments);
  const [uploads, setUploads] = useState(userDataResponse.userUploads);
  const [likes, setLikes] = useState<number[]>([]);
  const [styles, setStyles] = useState(defaultCommentSectionStyles);
  const [editProfileStyles, setEditProfileStyles] = useState(
    closeEditProfileXmark
  );

  useEffect(() => {
    const likeIds = likesResponse.likes?.map((like) => like.post_id);
    setLikes(likeIds);

    return () => {};
  }, []);

  //Handling functions
  const handleEditProfileClick = async () => {
    setEditProfileStyles(editProfileSection);
  };

  const handleAddProfilePicClick = () => null;

  const handleCloseEditProfileClick = () => {
    setEditProfileStyles(closeEditProfileXmark);
  };

  const handleLikeClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    posts.map(async (post: Post) => {
      if (post.id != (e.currentTarget.id as any)) return;

      if (!likes.includes(post.id)) {
        try {
          await http.get("/sanctum/csrf-cookie");
          await http.post(`api/like/${post.id}`);
          const allLikes = await http.get("api/like/getUserLikes");

          const likeIds = allLikes.data.likes?.map(
            (like: Likes) => like.post_id
          );
          setLikes(likeIds);
          console.log(likes);
        } catch (exception) {
          console.log(exception);
        }
      } else {
        try {
          await http.get("/sanctum/csrf-cookie");
          await http.post(`api/dislike/${post.id}`);
          const allLikes = await http.get("api/like/getUserLikes");

          const likeIds = allLikes.data.likes?.map(
            (like: Likes) => like.post_id
          );
          setLikes(likeIds);
          console.log(likes);
        } catch (exception) {
          console.log(exception);
        }
      }
    });
  };

  const handleViewAllCommentsClick = (
    e: React.MouseEvent<HTMLParagraphElement, MouseEvent>
  ) => {
    setStyles(commentsOpenStyles);

    console.log(e);
  };

  const handleCloseCommentsClick = () => {
    setStyles(defaultCommentSectionStyles);
  };

  //======Write a new comment form===========//
  const form = useForm<CommentFormValues>();
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = form;

  const onSubmit = (data: CommentFormValues) => {
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

            <Button
              type={undefined}
              value="Edit Profile"
              disabled={undefined}
              onClick={handleEditProfileClick}
              styles="self-center w-[75%] xs:[50%] sm:w-[40%] p-1 text-white bg-slate-500 rounded drop-shadow-md lg:font-bold lg:w-[30%]"
            />
          </div>
          <section id="edit-profile-section" className={editProfileStyles}>
            <div className="flex items-center justify-between w-full px-6 py-4 border-gray-300 border-y">
              <h3 className="text-xl font-bold text-gray-300 ">Edit Profile</h3>
              <img
                onClick={handleCloseEditProfileClick}
                src={xMark}
                alt="x-mark"
                className="w-6 h-6 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex flex-col items-center w-full px-6 py-4 gap-7">
                <div className="flex items-center justify-between w-full">
                  <h4 className="text-xl font-semibold text-gray-300">
                    Profile Picture
                  </h4>
                  <p
                    className="text-lg font-medium text-blue-400 cursor-pointer"
                    onClick={handleAddProfilePicClick}
                  >
                    Add
                  </p>
                </div>
                <img src={profile} alt="profile-pic" className="w-44 h-44" />
              </div>
            </div>
          </section>
        </section>
      </section>

      {posts?.map((post) => {
        return (
          <section
            id="post-section"
            key={post.id}
            className={styles.postSection}
          >
            <div
              id="close-comments-xmark"
              onClick={handleCloseCommentsClick}
              className={styles.closeCommentsXmark}
            >
              <img
                src={xMark}
                alt="x-mark"
                className="w-6 h-6 cursor-pointer"
              />
            </div>

            <div id="post-wrapper" className={styles.postWrapper}>
              <h1 className="px-4 pt-2 text-lg font-semibold">{post.title}</h1>
              <p className="px-4 pb-2 text-gray-800">{post.text}</p>

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
                  onClick={handleViewAllCommentsClick}
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
              <div id="comments-wrapper" className={styles.commentsWrapper}>
                <p
                  id={`${post.id}`}
                  onClick={(e) => handleViewAllCommentsClick(e)}
                  className={styles.viewAllCommentsLink}
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
              <div id="write-new-comment" className={styles.writeNewComment}>
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

    console.log(userDataResponse);
    return {
      userDataResponse: userDataResponse.data,
      likesResponse: likesResponse.data,
    };
  } catch (exception: any) {
    console.log(exception);
  }
};
