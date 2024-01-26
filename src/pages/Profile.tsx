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
  postSection: "flex flex-col gap-5 p-6 bg-gray-400",
  closeCommentsXmark: "hidden",
  postWrapper: "overflow-hidden bg-gray-300 rounded-lg",
  viewAllCommentsLink:
    "px-4 pt-2 font-medium text-gray-800 cursor-pointer hover:underline",
  commentsWrapper: "overflow-hidden h-[220px] bg-gray-300",
  writeNewComment: "hidden",
};

const commentsOpenStyles: Styles = {
  postSection:
    "absolute z-10 flex flex-col h-screen bg-gray-400 top-20 xs:w-full sm:px-4 sm:pt-4 sm:h-auto sm:pb-24 md:flex md:items-center",
  closeCommentsXmark:
    "flex justify-end w-full p-3 bg-gray-300 border-b border-gray-100 rounded-t-lg md:w-[730px]",
  postWrapper:
    "h-full bg-gray-300 xs:w-full sm:h-[500px] sm:overflow-auto sm:rounded-b-lg md:w-[730px]",
  viewAllCommentsLink: "hidden",
  commentsWrapper: "h-auto pb-32 bg-gray-300 sm:pb-0",
  writeNewComment: "fixed bottom-0 left-0 w-full p-3 bg-gray-300 sm:sticky",
};

const Profile = () => {
  const data = useLoaderData() as ProfileLoaderData;

  const [posts, setPosts] = useState(data.userData.posts);
  const [comments] = useState(data.userData.comments);
  const [uploads, setUploads] = useState(data.userUploads);
  const [styles, setStyles] = useState(defaultStyles);

  console.log(uploads);

  const { auth } = useContext(AuthContext);
  // console.log(auth);

  //Handling functions
  const handleEditProfileClick = () => null;

  const handleViewAllCommentsClick = () => {
    setStyles(commentsOpenStyles);
    // styles === defaultStyles
    //   ? setStyles(commentsOpenStyles)
    //   : setStyles(defaultStyles);

    console.log(styles);
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
        <section className="flex flex-col items-center w-full bg-gray-300 pb-7">
          <div className="z-10 w-1/2 pt-16">
            <img src={profile} alt="profile-pic" />
          </div>
          <h1 className="text-2xl font-semibold">Briseld</h1>
          <Button
            type={undefined}
            value="Edit Profile"
            disabled={undefined}
            onClick={handleEditProfileClick}
            styles=""
          />
        </section>
      </section>
      <section id="post-section" className={styles.postSection}>
        <div
          id="close-comments-xmark"
          onClick={handleCloseCommentsClick}
          className={styles.closeCommentsXmark}
        >
          <img src={xMark} alt="x-mark" className="w-6 h-6 cursor-pointer" />
        </div>
        {posts?.map((post) => {
          return (
            <div id="post-wrapper" key={post.id} className={styles.postWrapper}>
              <h1 className="px-4 pt-2 text-lg font-semibold">{post.title}</h1>
              <p className="px-4 pb-2 text-gray-800">{post.text}</p>

              {uploads?.map((upload) => {
                console.log(upload);

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
                <div className="flex items-center gap-1">
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
                  id="view-all-comments-link"
                  onClick={handleViewAllCommentsClick}
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
          );
        })}
      </section>
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
