import { useLoaderData } from "react-router-dom";
import http from "../utils/http";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthProvider";
import { useForm } from "react-hook-form";
import Button from "../components/Button";

//Images / Icons :
import car from "../assets/imgs/car.jpg";
import arrow from "../assets/icons/arrow-right-solid.svg";
import profile from "../assets/imgs/149071.png";

//======== Types ============//
type Comment = {
  created_at: string;
  id: number;
  post_id: number;
  text: string;
  updated_at: string;
  user_id: number;
};

type File = {
  alt_text: string;
  id: number;
  path: string;
  post_id: number;
  uploaded_at: string;
};

type Posts = {
  post: {
    comments: Comment[];
    created_at: string;
    file: File;
    id: number;
    text: string;
    title: string;
    updated_at: string;
    user_id: number;
  };
};

type FormValues = {
  text: string;
};

type LoaderData = {
  data: Promise<{ posts: Posts[] }>;
  posts: Posts[];
  comments: Comment[];
};

const Home = () => {
  const data = useLoaderData() as LoaderData;
  const { auth } = useContext(AuthContext);
  // console.log(auth);

  const [noCommentSection, setCommentSection] = useState(true);
  // const [noCommentSection, setCommentSection] = useState<number[]>([]);
  const [posts, setPosts] = useState(data.posts);
  const [comments, setComments] = useState(data.comments);

  // Handling Functions
  const handleClick = (e: React.MouseEvent<HTMLHeadingElement, MouseEvent>) => {
    // setCommentSection([...noCommentSection, e.target.id]);
    setCommentSection(!noCommentSection);
  };

  //======= Comment Section Form ============//
  const form = useForm<FormValues>();
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = form;

  const onSubmit = (data: FormValues) => {
    posts.map(async (post: any) => {
      try {
        await http.get("/sanctum/csrf-cookie");
        const response = await http.post(
          `/api/comment/insert/${post.id}`,
          data
        );

        console.log(response);
      } catch (exception: any) {
        console.log(exception);
      }
    });
  };

  const onError = () => {};

  const baseUrl = "http://localhost:80";

  return (
    <>
      {posts
        ? posts.map((post: any) => {
            return (
              <section
                key={post.id}
                className="flex flex-col items-center pt-20"
              >
                <section className="w-[80%] xs:w-[65%] 2xl:w-[50%]">
                  {
                    // !noCommentSection.includes(37) ? (
                    noCommentSection ? (
                      <div
                        id="comment-off"
                        className="flex flex-col border border-black rounded-lg md:flex-row mt:[32px] sm:mt-[64px] w-full md:items-center md:min-h-[200px]"
                      >
                        <div className="w-full h-32 overflow-hidden md:w-[70%]">
                          <img
                            src={`${baseUrl}/${post.file.path}`}
                            alt={post.file.alt_text}
                            className="object-cover w-full h-full"
                          />
                        </div>

                        <div className="px-5 pt-5 md:flex md:flex-col md:justify-between h-[60%] md:w-[30%]">
                          <h1 className="text-xl font-bold">{post.title}</h1>
                          <p className="py-3 text-sm text-gray-600">
                            {post.text}
                          </p>
                          <div className="flex flex-col-reverse items-center py-1 border border-black rounded-t-lg cursor-pointer">
                            <h3
                              id={post.id}
                              className="text-sm text-blue-700"
                              onClick={(e) => {
                                handleClick(e);
                              }}
                            >
                              Comments
                            </h3>
                            <img
                              src={arrow}
                              alt="arrow"
                              className="pt-1 text-blue-700 -rotate-90"
                            />

                            {/* Comment Section  */}

                            <div className="hidden">
                              <p>Comments</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div
                        id="comment-on"
                        className="flex flex-col border border-black rounded-lg md:flex-row mt:[32px] sm:mt-[64px] overflow-hidden"
                      >
                        <div className="w-full h-32 overflow-hidden sm:h-40 md:h-auto">
                          <img
                            className="object-cover w-full h-full"
                            src={`${baseUrl}/${post.file.path}`}
                            alt={post.file.alt_text}
                          />
                        </div>

                        <div className="px-5 pt-5 md:flex md:flex-col md:gap-2 ">
                          <h1 className="hidden text-xl font-bold">
                            {post.title}
                          </h1>
                          <p className="hidden py-3 text-sm text-gray-600">
                            {post.text}
                          </p>
                          <div className="flex flex-col items-center py-1 border border-b-0 border-black rounded-t-lg cursor-pointer h-[350px]">
                            <h3
                              id={post.id}
                              className="text-sm text-blue-700"
                              onClick={(e) => {
                                handleClick(e);
                              }}
                            >
                              Comments
                            </h3>
                            <img
                              src={arrow}
                              alt="arrow"
                              className="pt-1 text-blue-700 rotate-90 "
                            />

                            {/* Comment Section  */}
                            <div className="flex flex-col items-center justify-center gap-4 ">
                              <form
                                onSubmit={handleSubmit(onSubmit, onError)}
                                noValidate
                                className="w-[90%] flex flex-col justify-start gap-1 "
                              >
                                <label htmlFor="comment">
                                  Write a comment:
                                </label>
                                <input
                                  className="w-full h-10 p-2 border-2 border-gray-300 rounded-2xl"
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

                              {comments
                                ? comments.map((comment: any) => {
                                    if (post.id !== comment.post_id) return;
                                    const dateArr =
                                      comment.created_at.split("T");

                                    return (
                                      <div
                                        key={comment.id}
                                        className="flex w-full h-auto gap-2 p-2 border border-black xs:h-[85px]"
                                      >
                                        <div className="w-[30%] xs:h-full rounded-[85px] overflow-hidden flex justify-center">
                                          <img
                                            className="object-cover w-[67px] h-full"
                                            src={profile}
                                            alt="profile-pic"
                                          />
                                        </div>
                                        <div className="flex flex-wrap justify-between w-[70%] px-1 xs:gap-1 xs:gap-x-9 sm:gap-x-28 md:gap-0">
                                          <h1 className="self-center text-sm font-semibold sm:text-base sm:tracking-wide">
                                            {comment.user.name}
                                          </h1>
                                          <p className="self-center text-xs text-gray-600 ">
                                            {dateArr[0]}
                                          </p>
                                          <p className="self-center text-xs text-gray-800 sm:text-sm md:text-xs">
                                            {comment.text}
                                          </p>
                                        </div>
                                      </div>
                                    );
                                  })
                                : null}
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  }
                </section>
              </section>
            );
          })
        : null}
    </>
  );
  // return (
  //   <>
  //     {posts
  //       ? posts.map((post: any) => {
  //           // console.log(post.id);

  //           // className="p-12 xl:px-52 xl:py-12 "
  //           return (
  //             <section
  //               key={post.id}
  //               className="flex flex-col items-center w-screen pt-7"
  //             >
  //               <section className="w-[80%] xs:w-[65%]">
  //                 {noCommentSection ? (
  //                   <div
  //                     id="comment-off"
  //                     className="flex flex-col border border-black rounded-lg md:flex-row mt:[32px] sm:mt-[64px] w-full overflow-hidden"
  //                   >
  //                     <div className="w-full h-32 overflow-hidden">
  //                       <img
  //                         src={`${baseUrl}/${post.file.path}`}
  //                         alt={post.file.alt_text}
  //                         className="object-cover w-full h-full"
  //                       />
  //                     </div>

  //                     <div className="px-5 pt-5 md:flex md:flex-col md:justify-between h-[60%]">
  //                       <h1 className="text-xl font-bold">{post.title}</h1>
  //                       <p className="py-3 text-sm text-gray-600">
  //                         {post.text}
  //                       </p>
  //                       <div className="flex flex-col-reverse items-center py-1 border border-black rounded-t-lg cursor-pointer">
  //                         <h3
  //                           className="text-sm text-blue-700"
  //                           onClick={() => {
  //                             handleClick();
  //                           }}
  //                         >
  //                           Comments
  //                         </h3>
  //                         <img
  //                           src={arrow}
  //                           alt="arrow"
  //                           className="pt-1 text-blue-700 -rotate-90"
  //                         />

  //                         {/* Comment Section  */}
  //                         <div className="hidden">
  //                           <p>Comments</p>
  //                         </div>
  //                       </div>
  //                     </div>
  //                   </div>
  //                 ) : (
  //                   <div
  //                     id="comment-on"
  //                     className="flex flex-col border border-black rounded-lg md:flex-row mt:[32px] sm:mt-[64px] overflow-hidden"
  //                   >
  //                     <div className="w-full h-32 overflow-hidden sm:h-40">
  //                       {/* <img className="show-user-posts-image" src={`${BASE_URL}/${post.image_path}`} alt={post.title} /> */}
  //                       <img
  //                         className="object-cover w-full h-full"
  //                         src={`${baseUrl}/${post.file.path}`}
  //                         alt={post.file.alt_text}
  //                       />
  //                     </div>

  //                     <div className="px-5 pt-5 md:flex md:flex-col md:gap-2 ">
  //                       <h1 className="hidden text-xl font-bold">
  //                         {post.title}
  //                       </h1>
  //                       <p className="hidden py-3 text-sm text-gray-600">
  //                         {post.text}
  //                       </p>
  //                       <div className="flex flex-col items-center py-1 border border-b-0 border-black rounded-t-lg cursor-pointer h-[350px]">
  //                         <h3
  //                           className="text-sm text-blue-700"
  //                           onClick={() => {
  //                             handleClick();
  //                           }}
  //                         >
  //                           Comments
  //                         </h3>
  //                         <img
  //                           src={arrow}
  //                           alt="arrow"
  //                           className="pt-1 text-blue-700 rotate-90 "
  //                         />

  //                         {/* Comment Section  */}
  //                         <div className="flex flex-col items-center justify-center gap-4 ">
  //                           <form
  //                             onSubmit={handleSubmit(onSubmit, onError)}
  //                             noValidate
  //                             className="w-[90%] flex flex-col justify-start gap-1 "
  //                           >
  //                             <label htmlFor="comment">Write a comment:</label>
  //                             <input
  //                               className="w-full h-10 p-2 border-2 border-gray-300 rounded-2xl"
  //                               type="text"
  //                               {...register("text", {})}
  //                             />
  //                             <Button
  //                               styles="w-[30%] md:w-[40%] p-1 text-white text-xs bg-slate-500 rounded drop-shadow-md"
  //                               disabled={isSubmitting}
  //                               value="Submit"
  //                               type="submit"
  //                               onClick={() => null}
  //                             />
  //                           </form>

  //                           {post.comments
  //                             ? post.comments.map((comment: any) => {
  //                                 return (
  //                                   <div
  //                                     key={comment.id}
  //                                     className="flex w-full h-auto gap-2 p-2 border border-black"
  //                                   >
  //                                     <div className="w-[30%]">
  //                                       <img
  //                                         className="object-contain"
  //                                         src={profile}
  //                                         alt="profile-pic"
  //                                       />
  //                                     </div>
  //                                     <div className="flex flex-wrap gap-2">
  //                                       <h1 className="text-sm font-semibold">
  //                                         John Doe
  //                                       </h1>
  //                                       <p className="text-xs text-gray-600">
  //                                         {comment.created_at}
  //                                       </p>
  //                                       <p className="text-xs text-gray-600">
  //                                         {comment.text}
  //                                       </p>
  //                                     </div>
  //                                   </div>
  //                                 );
  //                               })
  //                             : null}
  //                         </div>
  //                       </div>
  //                     </div>
  //                   </div>
  //                 )}
  //               </section>
  //             </section>
  //           );
  //         })
  //       : null}
  //   </>
  // );
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
