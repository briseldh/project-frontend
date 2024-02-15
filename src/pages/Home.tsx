import { useContext, useEffect, useState, Suspense } from "react";
import { useLoaderData, defer, Await, useNavigate } from "react-router-dom";
import http from "../utils/http";
import NewComment from "../components/forms/NewComment";
import { AuthContext } from "../context/AuthProvider";
import { Oval } from "react-loader-spinner";

import { useQuery, QueryClient } from "@tanstack/react-query";

//Image and Icons
import profile from "../assets/imgs/149071.png";
import commentIcon from "../assets/icons/comment-regular.svg";
import likeIcon from "../assets/icons/thumbs-up-regular.svg";
import likeIconFilled from "../assets/icons/thumbs-up-solid.svg";
import xMarkBlack from "../assets/icons/xmark-solid-black.svg";

//Types and styles
import {
  Comments,
  HomeLoaderData,
  Likes,
  Post,
  PostsResponse,
} from "../types/loaderTypes";
import { allStyles } from "../styles/allStyles";

const Home = () => {
  const { auth } = useContext(AuthContext);
  const navigate = useNavigate();

  const data = useLoaderData() as HomeLoaderData;

  const { postsResponse } = data;

  const [posts, setPosts] = useState<Post[]>();
  const [comments, setComments] = useState<Comments[]>();
  const [styles] = useState(allStyles);
  const [likes, setLikes] = useState<number[]>([]);
  const [allLikes, setAllLikes] = useState<Likes[]>();
  const [commentsOpen, setCommentsOpen] = useState<number[]>([]);

  useEffect(() => {
    // Use the .then() method to handle the resolved data
    postsResponse
      .then((resolvedData: PostsResponse) => {
        // Inside the .then() callback, update the state with the resolved data
        setPosts(resolvedData.posts);
        setComments(resolvedData.comments);
        setAllLikes(resolvedData.allLikes);
      })
      .catch((error: any) => {
        // Handle errors if necessary
        console.error("Error fetching data:", error);
      });
  }, [postsResponse]);

  useEffect(() => {
    //Checking if the allLikes state is an array before mapping. If I don't check that than I get a TS error.
    if (Array.isArray(allLikes)) {
      const likeIds = allLikes?.map((like) => like.post_id);
      setLikes(likeIds);
    }

    return () => {};
  }, []);

  //Handling functions
  const handleLikeClick = async (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    //Checking if the user is authenticated before he likes a post
    if (!auth.id) {
      navigate("/login");
      alert("You must be logged in to like a post!");
      return;
    }

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
    //Checking if the user is authenticated before he comments a post or views all comments
    if (!auth.id) {
      navigate("/login");
      alert("You must be logged in to view all posts or comment them!");
      return;
    }

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
    <>
      <Suspense
        fallback={
          <div className="absolute -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
            <Oval
              height="60"
              width="60"
              color="#6464C8"
              secondaryColor="#6464C8"
            />
          </div>
        }
      >
        <Await
          resolve={postsResponse}
          errorElement={
            <p className="absolute -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
              Error Loading HomePage!
            </p>
          }
        >
          {() => {
            return (
              <section className="pt-16 bg-gray-400">
                {posts?.map((post) => {
                  //Checking if the comments state is an Array
                  let postComments;
                  if (Array.isArray(comments)) {
                    //Filtering through all comments so that i can check the length of the comments for a particular post.
                    postComments = comments.filter(
                      (comment) => comment.post_id === post.id
                    );
                  }
                  // postComments ? console.log(postComments.length);

                  //Checking if the allLikes state is an Array
                  let postLikes;
                  if (Array.isArray(allLikes)) {
                    //Filtering through all likes so that i can check how many likes a particular post has.
                    postLikes = allLikes.filter(
                      (like) => like.post_id === post.id
                    );
                  }

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
                            ? styles.postSection.commentsOpenStyles
                                .closeCommentsXmark
                            : styles.postSection.commentsCloseStyles
                                .closeCommentsXmark
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
                        <h1 className="px-4 pt-2 text-lg font-semibold">
                          {post.title}
                        </h1>
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
                              src={
                                auth.id && likes.includes(post.id)
                                  ? likeIconFilled
                                  : likeIcon
                              }
                              alt="like-icon"
                              className="w-5 h-5"
                            />

                            <p>Like</p>

                            <p>{postLikes ? postLikes.length : null}</p>
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
                              ? styles.postSection.commentsOpenStyles
                                  .commentsWrapper
                              : styles.postSection.commentsCloseStyles
                                  .commentsWrapper
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
                                  <p className="text-gray-800">
                                    {comment.text}
                                  </p>
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
                              ? styles.postSection.commentsOpenStyles
                                  .writeNewComment
                              : styles.postSection.commentsCloseStyles
                                  .writeNewComment
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
          }}
        </Await>
      </Suspense>
    </>
  );
};

export default Home;

type HomeLoaderProps = {
  request: {
    signal: AbortSignal;
  };
};

// ==========Home Loader with REACT QUERY =================//
export const HomeLoader =
  // Pass the queryClient also in App.tsx !!


    (queryClient: QueryClient) =>
    async ({ request }: HomeLoaderProps) => {
      // Define the query
      const postsResponseQuery = {
        queryKey: ["postsResponse"],
        queryFn: async () => {
          const res = await fetch("http://localhost:80/api/post/getAll");

          if (!res.ok) {
            console.log("Failed to fetch data");
            throw new Error(`HTTP Error: ${res.status}`);
          }

          return res.json();
        },
        staleTime: 1000,
      };

      return defer({
        postsResponse: queryClient.ensureQueryData(postsResponseQuery),
      });
    };
//============================================================================================================================//

// ==========Home Loader with fetch ( It works when using defer, Await and Suspense in your React Components)=================//
// *IMPORTANT* : The loader must always return something.

// export const homeLoader = ({ request }: HomeLoaderProps) => {
//   const postsResponsePromise = fetch("http://localhost:80/api/post/getAll", {
//     signal: request.signal,
//   }).then((response) => {
//     if (!response.ok) {
//       console.log("Failed to fetch the data ");
//     }
//     return response.json();
//   });

//   return defer({ postsResponse: postsResponsePromise });
// };
//============================================================================================================================//

// ==========Home Loader with axios ( It doesen't work when using defer, Await and Suspense in your React Components, because it returns a resolved Promise and not the Promise)=================//
// export const homeLoader = async () => {
//   try {
//     const response = await http.get("http://localhost:80/api/post/getAll");
//     if (!response.data) {
//       throw new Error("Failed to fetch data");
//     }
//     return defer({ postsResponse: response.data });
//   } catch (error) {
//     console.error("Failed to fetch the data:", error);
//     throw error; // Rethrow the error to propagate it to the caller
//   }
// };
//============================================================================================================================//
