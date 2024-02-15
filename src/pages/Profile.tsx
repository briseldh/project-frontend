import { useEffect, useState, Suspense, useContext } from "react";
import http from "../utils/http";
import { useLoaderData, defer, Await } from "react-router-dom";
import EditProfileDialog from "../components/headless-ui/EditProfileDialog";
import EditPostDialog from "../components/headless-ui/EditPostDialog";
import NewComment from "../components/forms/NewComment";
import { Oval } from "react-loader-spinner";
import { AuthContext } from "../context/AuthProvider";

import { QueryClient } from "@tanstack/react-query";

//Image and Icons
import profile from "../assets/imgs/149071.png";
import commentIcon from "../assets/icons/comment-regular.svg";
import likeIcon from "../assets/icons/thumbs-up-regular.svg";
import xMarkBlack from "../assets/icons/xmark-solid-black.svg";
import likeIconFilled from "../assets/icons/thumbs-up-solid.svg";
import threePointsMenu from "../assets/icons/ellipsis-solid.svg";
import deleteIcon from "../assets/icons/trash-solid.svg";

//Types and styles
import {
  Comments,
  Post,
  File,
  ProfileLoaderData,
  UserDataResponse,
  ProfilePic,
  LikesResponse,
  Likes,
  UserData,
} from "../types/loaderTypes";
import {
  threePointsMenuClose,
  threePointsMenuOpen,
} from "../styles/profilePage";
import { allStyles } from "../styles/allStyles";

const Profile = () => {
  const { auth } = useContext(AuthContext);

  const data = useLoaderData() as ProfileLoaderData;

  const { userDataResponse, likesResponse } = data;

  const [userData, setUserData] = useState<UserData>();
  const [posts, setPosts] = useState<Post[]>();
  const [comments, setComments] = useState<Comments[]>();
  const [uploads, setUploads] = useState<File[]>();
  const [profilePic, setProfilePic] = useState<ProfilePic>();
  const [likes, setLikes] = useState<number[]>([]);
  const [allLikes, setAllLikes] = useState<Likes[]>();
  const [styles] = useState(allStyles);
  const [commentsOpen, setCommentsOpen] = useState<number[]>([]);
  const [pointsMenuOpen, setPointsMenuOpen] = useState<number[]>([]);

  useEffect(() => {
    // Use the .then() method to handle the resolved data
    userDataResponse
      .then((resolvedData: UserDataResponse) => {
        // Inside the .then() callback, update the state with the resolved data
        setUserData(resolvedData.userData);
        setPosts(resolvedData.userData.posts);
        setComments(resolvedData.userData.comments);
        setUploads(resolvedData.userUploads);
        setProfilePic(resolvedData.userData.profile_pic);
      })
      .catch((error: any) => {
        // Handle errors if necessary
        console.error("Error fetching data:", error);
      });
  }, [userDataResponse]);

  useEffect(() => {
    // Use the .then() method to handle the resolved data
    likesResponse
      .then((resolvedData: LikesResponse) => {
        // Inside the .then() callback, update the state with the resolved data
        setAllLikes(resolvedData.allLikes);
      })
      .catch((error: any) => {
        // Handle errors if necessary
        console.error("Error fetching data:", error);
      });
  }, [likesResponse]);

  useEffect(() => {
    //Checking if the allLikes state is an array before mapping. If I don't check that than I get a TS error.
    if (Array.isArray(allLikes)) {
      const userLikes = allLikes?.filter((like) => like.user_id === auth.id);
      const likeIds = userLikes!.map((like) => like.post_id);
      setLikes(likeIds);
    }

    return () => {};
  }, []);

  console.log(likes);
  

  // Handling functions
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

      //ToDo: Redirect after deleting post or provoke a reload
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

  const baseUrl = "http://localhost:80";

  console.log(auth);

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
          resolve={userDataResponse}
          errorElement={
            <p className="absolute -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
              Error Loading ProfilePage!
            </p>
          }
        >
          {() => {
            return (
              <>
                <section className="flex flex-col w-full pt-10">
                  <div className="bg-gray-500 w-full h-[150px] absolute rounded-b-2xl"></div>

                  <section className="flex flex-col items-center w-full px-6 bg-gray-300 pb-7 md:flex-row md:justify-between lg:justify-start">
                    <div className="z-10 w-1/2 pt-16 xs:w-2/5 sm:w-1/3 md:w-1/4 lg:w-[230px]">
                      {profilePic ? (
                        <img
                          src={`${baseUrl}/${profilePic.path}`}
                          alt="profile-pic"
                          className="rounded-full"
                        />
                      ) : (
                        <img src={profile} alt="profile-pic" />
                      )}
                    </div>

                    <div className="flex flex-col items-center w-1/2 gap-2 pt-2 md:h-full md:w-4/5 md:pt-40 md:flex-row md:justify-between md:pl-5 ">
                      <h1 className="z-10 text-2xl font-semibold md:text-3xl md:font-bold">
                        {userData?.name}
                      </h1>

                      <EditProfileDialog profilePic={profilePic} />
                    </div>
                  </section>
                </section>

                {posts?.map((post) => {
                  //Filtering through all comments so that i can check the length of the comments for a particular post.
                  const postComments = comments?.filter(
                    (comment) => comment.post_id === post.id
                  );

                  //Filtering through all likes so that i can check how many likes a particular post has.
                  const postLikes = allLikes?.filter(
                    (like) => like.post_id === post.id
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
                        <div className="relative flex items-center justify-between">
                          <div>
                            <h1 className="px-4 pt-2 text-lg font-semibold">
                              {post.title}
                            </h1>
                            <p className="px-4 pb-2 text-gray-800">
                              {post.text}
                            </p>
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

                        {uploads?.map((upload) => {
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
                              src={
                                likes.includes(post.id)
                                  ? likeIconFilled
                                  : likeIcon
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
                              <div
                                key={comment.id}
                                className="flex flex-col gap-4 p-4"
                              >
                                <div className="flex gap-2">
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
              </>
            );
          }}
        </Await>
      </Suspense>
    </>
  );
};

export default Profile;

type ProfileLoaderProps = {
  request: {
    signal: AbortSignal;
  };
};

// ==========Profile Loader with REACT QUERY =================//
export const ProfileLoader =
  // Pass the queryClient also in App.tsx !!


    (queryClient: QueryClient) =>
    async ({ request }: ProfileLoaderProps) => {
      // Define the query
      const userDataQuery = {
        queryKey: ["userDataResponse"],
        queryFn: async () => {
          //*IMPORTANT* : If the route you want to fetch is private, meaning that you have to be authenticated to access it, then you need to send the credentials too. --> credentials: "include"

          const res = await fetch("http://localhost:80/api/getUserData", {
            credentials: "include",
          });

          if (!res.ok) {
            console.log("Failed to fetch data");
            throw new Error(`HTTP Error: ${res.status}`);
          }

          return res.json();
        },
        staleTime: 1000,
      };

      // Define the query
      const userLikesQuery = {
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
      };

      return defer({
        userDataResponse: queryClient.ensureQueryData(userDataQuery),
        likesResponse: queryClient.ensureQueryData(userLikesQuery),
      });
    };
//============================================================================================================================//

// ==========Profile Loader with axios ( It doesen't work when using defer, Await and Suspense in your React Components, because it returns a resolved Promise and not the Promise)=================//
// export const ProfileLoader = async () => {
//   try {
//     const userDataResponse = await http.get("/api/getUserData");
//     const likesResponse = await http.get("/api/like/getUserLikes");

//     return {
//       userDataResponse: userDataResponse.data,
//       likesResponse: likesResponse.data,
//     };
//   } catch (exception: any) {
//     console.log(exception);
//   }
// };
//============================================================================================================================//
