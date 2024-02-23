import { useEffect, useState, useContext } from "react";
import EditProfileDialog from "../components/headless-ui/EditProfileDialog";
import { Oval } from "react-loader-spinner";
import { AuthContext } from "../context/AuthProvider";

import { useQuery, useQueryClient } from "@tanstack/react-query";

//Image and Icons
import profile from "../assets/imgs/149071.png";
import camera from "../assets/icons/camera-solid.svg";

//Types and styles
import {
  Comments,
  Post,
  File,
  UserDataResponse,
  ProfilePic,
  UserData,
} from "../types/loaderTypes";
import PostView from "../components/posti-view/PostView";

const Profile = () => {
  const { auth } = useContext(AuthContext);
  const queryClient = useQueryClient();

  const { data: queryData, isLoading: dataIsLoading } =
    useQuery<UserDataResponse>({
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
    });

  console.log(queryData);

  const [userData, setUserData] = useState<UserData>();
  const [posts, setPosts] = useState<Post[]>();
  const [comments, setComments] = useState<Comments[]>();
  const [uploads, setUploads] = useState<File[]>();
  const [profilePic, setProfilePic] = useState<ProfilePic>();

  useEffect(() => {
    if (!queryData) {
      console.log("The userDataResponse query doesent exist");
      return;
    }
    //This effect will be called everytime when the query refetches.
    //It is meant to keep the latest data shown to the user everyrime something happens.
    setUserData(queryData.userData);
    setPosts(queryData.userData.posts);
    setComments(queryData.comments);
    setUploads(queryData.userUploads);
    setProfilePic(queryData.userData.profile_pic);
  }, [queryData]);

  // Handling functions

  const baseUrl = "http://localhost:80";

  if (dataIsLoading) {
    return (
      <div className="absolute z-20 -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
        <Oval height="60" width="60" color="#6464C8" secondaryColor="#6464C8" />
      </div>
    );
  }

  return (
    <>
      <section
        className={
          posts?.length === 0
            ? "absolute flex flex-col w-full pt-10"
            : "flex flex-col w-full pt-10"
        }
      >
        <div className="bg-gray-500 w-full h-[150px] absolute rounded-b-2xl"></div>

        <section className="flex flex-col items-center w-full px-6 bg-gray-300 pb-7 md:flex-row md:justify-between lg:justify-start">
          <div className="z-10 w-1/2 pt-16 xs:w-2/5 sm:w-1/3 md:w-1/4 lg:w-[230px]">
            {profilePic ? (
              <img
                src={`${baseUrl}/${profilePic.path}`}
                alt="profile-pic"
                className="rounded-full w-34 h-34 sm:w-44 sm:h-44"
              />
            ) : (
              <img src={profile} alt="profile-pic w-44 h-44" />
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

      {posts?.length === 0 ? (
        <div className="flex flex-col items-center justify-center w-full h-screen text-4xl font-bold bg-gray-300">
          <img src={camera} alt="camera-icon" className="w-20 h-20 mt-48" />
          <h1 className="text-3xl font-bold text-gray-500">No Posts Yet</h1>
        </div>
      ) : (
        <section className="h-[620px] md:h-[650px] bg-gray-400">
          {posts && comments && uploads && queryData && (
            <PostView
              isShownIn="profile"
              posts={posts}
              comments={comments}
              uploads={uploads}
              allProfilePics={queryData.allProfilePics}
            />
          )}
        </section>
      )}
    </>
  );
};

export default Profile;

// type ProfileLoaderProps = {
//   request: {
//     signal: AbortSignal;
//   };
// };

// ==========Profile Loader with REACT QUERY =================//
// export const ProfileLoader =
//   // Pass the queryClient also in App.tsx !!

//     (queryClient: QueryClient) =>
//     async ({ request }: ProfileLoaderProps) => {
//       // Define the query
//       const userDataQuery = {
//         queryKey: ["userDataResponse"],
//         queryFn: async () => {
//           //*IMPORTANT* : If the route you want to fetch is private, meaning that you have to be authenticated to access it, then you need to send the credentials too. --> credentials: "include"

//           const res = await fetch("http://localhost:80/api/getUserData", {
//             credentials: "include",
//           });

//           if (!res.ok) {
//             console.log("Failed to fetch data");
//             throw new Error(`HTTP Error: ${res.status}`);
//           }

//           return res.json();
//         },
//         staleTime: 1000,
//       };

//       // Define the query
//       const userLikesQuery = {
//         queryKey: ["userLikesResponse"],
//         queryFn: async () => {
//           const res = await fetch("http://localhost:80/api/like/getUserLikes", {
//             credentials: "include",
//           });

//           if (!res.ok) {
//             console.log("Failed to fetch data");
//             throw new Error(`HTTP Error: ${res.status}`);
//           }

//           return res.json();
//         },
//         staleTime: 1000,
//       };

//       // Trigger the execution of the queries using fetchQuery
//       // await queryClient.fetchQuery(userDataQuery);
//       // await queryClient.fetchQuery(userLikesQuery);

//       return defer({
//         userDataResponse: queryClient.ensureQueryData(userDataQuery),
//         likesResponse: queryClient.ensureQueryData(userLikesQuery),
//       });
//     };
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
