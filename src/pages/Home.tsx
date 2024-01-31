import { useEffect, useState } from "react";
import { HomeLoaderData, Post } from "../types/loaderTypes";
import { commentsOpenStyles, defaultStyles } from "./Profile";
import Button from "../components/Button";
import { useForm } from "react-hook-form";

//Image and Icons
import profile from "../assets/imgs/149071.png";
import commentIcon from "../assets/icons/comment-regular.svg";
import likeIcon from "../assets/icons/thumbs-up-regular.svg";
import likeIconFilled from "../assets/icons/thumbs-up-solid.svg";
import xMark from "../assets/icons/xmark-solid.svg";
import http from "../utils/http";
import { useLoaderData } from "react-router-dom";

type FormValues = {
  text: string;
};

const Home = () => {
  const data = useLoaderData() as HomeLoaderData;

  const [posts, setPosts] = useState(data.posts);
  const [styles, setStyles] = useState(defaultStyles);
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState<number[]>([]);
  // const [liked, setLiked] = useState<any>([]);

  useEffect(() => {
    const likeIds = data.likes?.map((like) => like.post_id);
    // console.log(likeIds);

    setLikes(likeIds);
  }, [posts]);

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

  const handleLikeClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    posts.map(async (post) => {
      if (post.id != e.target.id) return;

      // TODO:
      //CHANGE THE IF STATEMENT TO INCLUDE LIKE IN THE CODE UNDER
      //WHEN DISLIKE-> SET THE STATE BY DELETING THE VALUE SAVED BEFORE WHEN LIKED

      if (!liked) {
        try {
          await http.get("/sanctum/csrf-cookie");
          await http.post(`api/post/${post.id}/like`);
          setLiked(!liked);
        } catch (exception) {
          console.log(exception);
        }
      } else {
        try {
          await http.get("/sanctum/csrf-cookie");
          await http.post(`api/post/${post.id}/dislike`);
          setLiked(!liked);
        } catch (exception) {
          console.log(exception);
        }
      }
    });
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
    <section className="pt-16 bg-gray-400">
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

              <div className="xs:w-full">
                <img
                  src={`${baseUrl}/${post.file.path}`}
                  alt={post.file.alt_text}
                  className="xs:w-full "
                />
              </div>

              <div className="flex self-center justify-between py-1 border-gray-100 px-11 border-y xs:px-16 xs:py-2 sm:px-24">
                {/* Like Icon */}
                <div
                  onClick={(e) => {
                    handleLikeClick(e);
                  }}
                  className="flex items-center gap-1 cursor-pointer"
                >
                  {likes.includes(post.id) ? (
                    <img
                      id={`${post.id}`}
                      src={likeIconFilled}
                      alt="like-icon"
                      className="w-5 h-5"
                    />
                  ) : (
                    <img
                      id={`${post.id}`}
                      src={likeIcon}
                      alt="like-icon"
                      className="w-5 h-5"
                    />
                  )}
                  <p>Like</p>
                </div>

                {/* Comment Icon */}
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
      ;
    </section>
  );
};

export default Home;

// ==========Home Loader =================//
// *IMPORTANT* : The loader must always return something.
export const homeLoader = async () => {
  try {
    const response = await http.get("/api/post/getAll");

    // console.log(response);
    return response.data;
  } catch (exception: any) {
    console.log(exception);
  }

  // const res = await fetch("http://localhost:80/api/post/getAll");

  // console.log(res);

  // if (!res.ok) {
  //   throw new Error("Failed to get all the posts data");
  // }

  // return res.json();
};
