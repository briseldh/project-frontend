import { useEffect, useState } from "react";
import { useLoaderData } from "react-router-dom";
import http from "../utils/http";

//Image and Icons
import profile from "../assets/imgs/149071.png";
import commentIcon from "../assets/icons/comment-regular.svg";
import likeIcon from "../assets/icons/thumbs-up-regular.svg";
import likeIconFilled from "../assets/icons/thumbs-up-solid.svg";
import xMarkBlack from "../assets/icons/xmark-solid-black.svg";

//Types and styles
import { HomeLoaderData } from "../types/loaderTypes";
import { allStyles } from "../styles/allStyles";
import NewComment from "../components/forms/NewComment";

const Home = () => {
  const data = useLoaderData() as HomeLoaderData;

  const { postsResponse, likesResponse } = data;

  const [posts] = useState(postsResponse.posts);
  const [comments] = useState(postsResponse.comments);
  const [styles] = useState(allStyles);
  const [likes, setLikes] = useState<number[]>([]);
  const [commentsOpen, setCommentsOpen] = useState<number[]>([]);

  useEffect(() => {
    const likeIds = likesResponse.likes?.map((like) => like.post_id);
    setLikes(likeIds);

    return () => {};
  }, []);

  //Handling functions
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
        console.log(likes);
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

  const baseUrl = "http://localhost:80";

  return (
    <section className="pt-16 bg-gray-400">
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

                {/* Comment Icon */}
                <div
                  id={`${post.id}`}
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

                {comments?.map((comment) => {
                  if (post.id !== comment.post_id) return;

                  return (
                    <div className="flex gap-2 p-4" key={comment.id}>
                      <img
                        src={profile}
                        alt="commenter-profile-pic"
                        className="w-10 h-10"
                      />
                      <div className="p-2 bg-gray-200 rounded-xl">
                        <h3 className="font-medium">John Doe</h3>
                        <p className="text-gray-800">{comment.text}</p>
                      </div>
                    </div>
                  );
                })}
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
      ;
    </section>
  );
};

export default Home;

// ==========Home Loader =================//
// *IMPORTANT* : The loader must always return something.
export const homeLoader = async () => {
  try {
    const postsResponse = await http.get("/api/post/getAll");
    const likesResponse = await http.get("/api/like/getUserLikes");

    return {
      postsResponse: postsResponse.data,
      likesResponse: likesResponse.data,
    };
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
