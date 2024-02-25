import { useContext, useEffect, useState } from "react";
import { Oval } from "react-loader-spinner";
import UnauthPostView from "../components/posti-view/UnauthPostView";

import { useQuery } from "@tanstack/react-query";

//Types and styles
import { Comments, Likes, Post, PostsResponse } from "../types/loaderTypes";
import PostView from "../components/posti-view/PostView";
import { AuthContext } from "../context/AuthProvider";

const Home = () => {
  const { auth } = useContext(AuthContext);

  const { data: postsQuery, isLoading: postsAreLoading } =
    useQuery<PostsResponse>({
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

  if (auth.id) {
    return (
      <section className="pt-16 bg-gray-400">
        {posts && comments && postsQuery && (
          <PostView
            isShownIn="home"
            posts={posts}
            comments={comments}
            allProfilePics={postsQuery.allProfilePics}
          />
        )}
      </section>
    );
  } else {
    return (
      <section className="pt-16 bg-gray-400">
        {posts && comments && postsQuery && (
          <UnauthPostView
            isShownIn="home"
            posts={posts}
            comments={comments}
            allProfilePics={postsQuery.allProfilePics}
          />
        )}
      </section>
    );
  }
};

export default Home;
