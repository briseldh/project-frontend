import { Menu, Transition } from "@headlessui/react";
import { Fragment, useEffect, useRef, useState } from "react";
import EditPostDialog from "./EditPostDialog";
import { File, Post } from "../../types/loaderTypes";
import deleteIcon from "../../assets/icons/trash-solid.svg";

type Props = {
  post: Post;
  uploads: File[];
};

export default function NewThreePtsMenu({ post, uploads }: Props) {
  return (
    <div className="w-56 text-right top-16">
      <Menu as="div" className="relative inline-block text-left">
        <div>
          <Menu.Button className="inline-flex justify-center w-full px-4 py-2 text-sm font-medium text-white rounded-md bg-black/20 hover:bg-black/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75">
            Options
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
          <Menu.Items className="absolute right-0 w-56 mt-2 origin-top-right bg-gray-400 rounded-md ">
            <Menu.Item>
              {({ active }) => (
                <button
                  className={`${
                    active ? "bg-violet-500 text-white" : "text-gray-900"
                  } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                >
                  <EditPostDialog post={post} uploads={uploads} />
                </button>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <div className="flex items-center gap-2 px-2 py-1 text-gray-200 cursor-pointer hover:underline">
                  <img
                    src={deleteIcon}
                    alt="delete-icon"
                    className="w-4 h-4 "
                  />

                  <button
                    className={`${
                      active ? "bg-red-500 text-white" : "text-gray-900"
                    } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                  >
                    Delete
                  </button>
                </div>
              )}
            </Menu.Item>
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  );
}
