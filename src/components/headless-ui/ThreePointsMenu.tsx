import { Menu, Transition } from "@headlessui/react";
import { Fragment, useEffect, useRef, useState } from "react";
import editIcon from "../assets/icons/pen-solid.svg";
import deleteIcon from "../assets/icons/trash-solid.svg";
import http from "../../utils/http";

export default function Example() {
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
    <div className="fixed w-56 text-right top-16">
      <Menu as="div" className="relative inline-block text-left">
        <div>
          <Menu.Button className="inline-flex justify-center w-full px-4 py-2 text-sm font-medium text-white rounded-md bg-black/20 hover:bg-black/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75">
            ...
          </Menu.Button>
        </div>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute right-0 w-56 mt-2 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black/5 focus:outline-none">
            <div className="px-1 py-1 ">
              <Menu.Item>
                <div className="flex items-center gap-2 text-gray-200 cursor-pointer hover:underline">
                  <img src={editIcon} alt="pen-icon" className="w-4 h-4" />
                  <h4>Edit Post</h4>
                </div>
              </Menu.Item>
            </div>
            <div className="px-1 py-1">
              <Menu.Item>
                <div className="flex items-center gap-2 text-gray-200 cursor-pointer hover:underline">
                  <img
                    src={deleteIcon}
                    alt="delete-icon"
                    className="w-4 h-4 "
                  />
                  <h4
                    id="Hello"
                    onClick={(e) => {
                      handleDeletePostClick(e);
                    }}
                  >
                    Delete Post
                  </h4>
                </div>
              </Menu.Item>
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  );
}
