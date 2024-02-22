import { Popover, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import threePointsMenu from "../../assets/icons/ellipsis-solid.svg";
import deleteIcon from "../../assets/icons/trash-solid.svg";
import http from "../../utils/http";
import EditPostDialog from "./EditPostDialog";
import { File, Post } from "../../types/loaderTypes";
import { useQueryClient } from "@tanstack/react-query";

type Props = {
  post: Post;
  uploads: File[];
};

export default function ThreePointsMenu({ post, uploads }: Props) {
  const queryClient = useQueryClient();

  // const [isSending, setIsSending] = useState<number[]>([]);
  const [isSending, setIsSending] = useState(false);

  // Handling Functions
  const handleDeletePostClick = async (
    e: React.MouseEvent<HTMLHeadingElement, MouseEvent>
  ) => {
    const postId = Number(e.currentTarget.id);

    setIsSending(true);

    try {
      await http.get("/sanctum/csrf-cookie");
      await http.delete(`/api/post/delete/${postId}`);

      //This query invalidation is called when the user deletes the post so that the effect that runs depending on queryData happens.
      await queryClient.invalidateQueries({ queryKey: ["userDataResponse"] });
      console.log("Deleted Successfully");
    } catch (exception) {
      console.log(exception);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Popover className="relative inline-block mx-4">
      {({ open }) => (
        <>
          <Popover.Button
            className={`
                ${open ? "bg-black/10" : "bg-gray-300"}
                inline-flex items-center justify-center p-2 rounded-full hover:bg-black/10 focus-visible:ring-2 focus:outline-none focus-visible:ring-black/10`}
          >
            <img
              src={threePointsMenu}
              alt="three-point-menu"
              className="w-6 h-6 cursor-pointer"
            />
          </Popover.Button>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-200"
            enterFrom="opacity-0 translate-y-1"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in duration-150"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-1"
          >
            <Popover.Panel className="absolute z-10 w-[9rem] mt-2 transform -translate-x-1/2 -left-[125%] rounded-md bg-gray-400 p-2">
              <div>
                {post ? <EditPostDialog post={post} uploads={uploads} /> : null}
              </div>

              {/* Delete Button */}
              <div
                className={
                  isSending
                    ? "flex items-center gap-2 px-2 py-1 mt-1 text-gray-200 rounded-md"
                    : "flex items-center gap-2 px-2 py-1 mt-1 text-gray-200 rounded-md cursor-pointer hover:bg-red-500"
                }
              >
                <img src={deleteIcon} alt="delete-icon" className="w-4 h-4 " />
                <h4
                  id={`${post.id}`}
                  onClick={(e) => {
                    handleDeletePostClick(e);
                  }}
                >
                  Delete Post
                </h4>

                {isSending ? (
                  <div className="bg-gray-400/60 w-[900px] h-[800px] absolute -left-[400%] -top-26 sm:-top-16 z-10"></div>
                ) : null}
              </div>
            </Popover.Panel>
          </Transition>
        </>
      )}
    </Popover>
  );
}
