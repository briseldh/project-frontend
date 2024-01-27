import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthProvider";
import http from "../utils/http";
import { useLoaderData } from "react-router-dom";
import Button from "../components/Button";

//Image and Icons
import profile from "../assets/imgs/149071.png";
import commentIcon from "../assets/icons/comment-regular.svg";
import likeIcon from "../assets/icons/thumbs-up-regular.svg";
import xMark from "../assets/icons/xmark-solid.svg";

//Types
import { ProfileLoaderData } from "../types/loaderTypes";
import { useForm } from "react-hook-form";

type FormValues = {
  text: string;
};

type Styles = {
  closeCommentsXmark: string | undefined;
  postWrapper: string | undefined;
  postSection: string | undefined;
  viewAllCommentsLink: string | undefined;
  commentsWrapper: string | undefined;
  writeNewComment: string | undefined;
};

const defaultStyles: Styles = {
  postSection:
    "flex flex-col gap-5 px-4 pt-4 bg-gray-400 xs:w-full sm:pt-8 sm:h-auto md:flex md:items-center pb-4 sm:pb-8",
  closeCommentsXmark: "hidden",
  postWrapper: "overflow-hidden bg-gray-300 rounded-lg md:w-[70%] lg:w-[710px]",
  viewAllCommentsLink:
    "px-4 pt-2 font-medium text-gray-800 cursor-pointer hover:underline inline-block",
  commentsWrapper: "overflow-hidden h-[220px] bg-gray-300",
  writeNewComment: "hidden",
};

const commentsOpenStyles: Styles = {
  postSection:
    "z-10 flex flex-col px-4 pt-4 bg-gray-400 top-20 xs:w-full sm:pt-8 sm:h-auto md:flex md:items-center pb-4",
  closeCommentsXmark:
    "flex justify-end w-full p-3 bg-gray-300 border-b border-gray-100 rounded-t-lg md:w-[730px]",
  postWrapper:
    "h-full bg-gray-300 xs:w-full sm:h-[700px] sm:overflow-auto sm:rounded-b-lg md:w-[730px]",
  viewAllCommentsLink: "hidden",
  commentsWrapper: "h-auto pb-32 bg-gray-300 sm:pb-0",
  writeNewComment: "sticky bottom-0 left-0 w-full p-3 bg-gray-300 sm:sticky",
};

const Profile = () => {
  const data = useLoaderData() as ProfileLoaderData;

  const [posts, setPosts] = useState(data.userData.posts);
  const [comments] = useState(data.userData.comments);
  const [uploads, setUploads] = useState(data.userUploads);
  const [styles, setStyles] = useState(defaultStyles);

  // console.log(uploads);

  const { auth } = useContext(AuthContext);
  // console.log(auth);

  //Handling functions
  const handleEditProfileClick = () => null;

  const handleViewAllCommentsClick = (
    e: React.MouseEvent<HTMLParagraphElement, MouseEvent>
  ) => {
    setStyles(commentsOpenStyles);

    console.log(e);
  };

  const handleCloseCommentsClick = () => {
    setStyles(defaultStyles);
  };

  //======Write a new comment form===========//
  const form = useForm<FormValues>();
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = form;

  const onSubmit = (data: FormValues) => {
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
              {data.userData.name}
            </h1>

            <Button
              type={undefined}
              value="Edit Profile"
              disabled={undefined}
              onClick={handleEditProfileClick}
              styles="self-center w-[75%] xs:[50%] sm:w-[40%] p-1 text-white bg-slate-500 rounded drop-shadow-md lg:font-bold lg:w-[30%]"
            />
          </div>
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
                if (post.id !== upload.post_id) return;
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
                <div className="flex items-center gap-1">
                  <img src={likeIcon} alt="like-icon" className="w-5 h-5" />
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
                  id={post.id}
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
    const response = await http.get("/api/getUserData");

    // console.log(response);
    return response.data;
  } catch (exception: any) {
    console.log(exception);
  }
};
