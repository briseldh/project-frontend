import { Menu, Transition } from "@headlessui/react";
import { Fragment, useEffect, useRef, useState } from "react";
import editIcon from "../../assets/icons/pen-solid.svg";
import threePointsMenu from "../../assets/icons/ellipsis-solid.svg";
import deleteIcon from "../../assets/icons/trash-solid.svg";
import http from "../../utils/http";
import EditPostDialog from "./EditPostDialog";
import { File, Post } from "../../types/loaderTypes";

type Props = {
  post: Post;
  uploads: File[];
};

export default function ThreePointsMenu({ post, uploads }: Props) {
  // Handling Functions
  const handleDeletePostClick = async (
    e: React.MouseEvent<HTMLHeadingElement, MouseEvent>
  ) => {
    const postId = Number(e.currentTarget.id);

    try {
      await http.get("/sanctum/csrf-cookie");
      await http.delete(`/api/post/delete/${postId}`);

      //ToDo: Redirect after deleting post
      // <Navigate to={"/profile"} />;
    } catch (exception) {
      console.log(exception);
    }
  };

  return (
    <div className="">
      <Menu as="div" className="relative inline-block mx-4 text-left">
        <Menu.Button className="inline-flex items-center justify-center p-2 rounded-full hover:bg-black/10">
          <img
            src={threePointsMenu}
            alt="three-point-menu"
            className="w-6 h-6 cursor-pointer"
          />
        </Menu.Button>

        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute right-[15px] w-[9rem] mt-1 bg-gray-400 rounded-md shadow-lg p-2">
            <div className="px-1 ">
              {post ? <EditPostDialog post={post} uploads={uploads} /> : null}
            </div>

            <div className="flex items-center gap-2 px-2 py-1 mt-1 text-gray-200 rounded-md cursor-pointer hover:bg-red-500">
              <img src={deleteIcon} alt="delete-icon" className="w-4 h-4 " />
              <h4
                id="Hello"
                onClick={(e) => {
                  handleDeletePostClick(e);
                }}
              >
                Delete Post
              </h4>
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  );
}
