import { useEffect, useState } from "react";
import { Oval } from "react-loader-spinner";

import { useQuery } from "@tanstack/react-query";

//Types and styles
import { Comments, Likes, Post } from "../types/loaderTypes";
import PostView from "../components/posti-view/PostView";

const Home = () => {
  const { data: postsQuery, isLoading: postsAreLoading } = useQuery({
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
  });

  const [posts, setPosts] = useState<Post[]>();
  const [comments, setComments] = useState<Comments[]>();
  const [allLikes, setAllLikes] = useState<Likes[]>();
  const [userLikes, setUserLikes] = useState<number[]>([]);

  useEffect(() => {
    if (!postsQuery) {
      console.log("The postsQuery doesent exist");
      return;
    }

    setPosts(postsQuery.posts);
    setComments(postsQuery.comments);
    setAllLikes(postsQuery.allLikes);
  }, [postsQuery]);

  useEffect(() => {
    //Checking if the allLikes state is an array before mapping. If I don't check that than I get a TS error.
    if (Array.isArray(allLikes)) {
      const likeIds = allLikes?.map((like) => like.post_id);
      setUserLikes(likeIds);
    }

    return () => {};
  }, []);

  if (postsAreLoading) {
    return (
      <div className="absolute -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
        <Oval height="60" width="60" color="#6464C8" secondaryColor="#6464C8" />
      </div>
    );
  }

  return (
    <section className="pt-16 bg-gray-400">
      <PostView posts={posts!} comments={comments!} allLikes={allLikes!} />
    </section>
  );
};

export default Home;

// type HomeLoaderProps = {
//   request: {
//     signal: AbortSignal;
//   };
// };

// ==========Home Loader with REACT QUERY =================//
// export const HomeLoader =
//   // Pass the queryClient also in App.tsx !!

//     (queryClient: QueryClient) =>
//     async ({ request }: HomeLoaderProps) => {
//       // Define the query
//       const postsResponseQuery = {
//         queryKey: ["postsResponse"],
//         queryFn: async () => {
//           const res = await fetch("http://localhost:80/api/post/getAll");

//           if (!res.ok) {
//             console.log("Failed to fetch data");
//             throw new Error(`HTTP Error: ${res.status}`);
//           }

//           return res.json();
//         },
//         staleTime: 1000,
//       };

//       return defer({
//         postsResponse: queryClient.ensureQueryData(postsResponseQuery),
//       });
//     };
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
