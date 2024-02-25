import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";

//Components
import EditProfilePicDialog from "./EditProfilePicDialog";
import AddProfilePicDialog from "./AddProfilePicDialog";

//Image and Icons
import profile from "../../assets/imgs/149071.png";
import XmarkBlack from "../../assets/icons/xmark-solid-black.svg";
import shield from "../../assets/icons/shield-solid.svg";
import deactivate from "../../assets/icons/ban-solid.svg";

//Types and Styles
import { ProfilePic } from "../../types/loaderTypes";
import http from "../../utils/http";
import { useQueryClient } from "@tanstack/react-query";
import { Oval } from "react-loader-spinner";
import DeactivateAccDialog from "./DeactivateAccDialog";

type Props = {
  profilePic: ProfilePic;
};

export default function EditProfileDialog({ profilePic }: Props) {
  const queryClient = useQueryClient();

  let [isOpen, setIsOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);

  //Handling Functions
  const hadleDeleteProfilePicClick = async () => {
    try {
      setIsSending(true);
      await http.get("/sanctum/csrf-cookie");
      await http.delete(`/api/profilePic/delete/${profilePic?.id}`);
      await queryClient.invalidateQueries({ queryKey: ["userDataResponse"] });
    } catch (exception) {
      console.log(exception);
    } finally {
      setIsSending(false);
    }
  };

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  const baseUrl = "http://localhost:80";

  return (
    <>
      <div className="inset-0 flex items-center justify-center">
        <button
          type="button"
          onClick={openModal}
          className="p-2 px-4 font-medium text-white bg-blue-500 rounded-md text-md hover:bg-blue-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75"
        >
          Edit Profile
        </button>
      </div>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex items-center justify-center min-h-full p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full mr-2 h-[500px] max-w-md p-6 overflow-hidden text-left align-middle transition-all transform bg-gray-300 shadow-xl rounded-2xl">
                  <div className="flex items-center justify-between">
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-medium leading-6 text-gray-900"
                    >
                      Edit Profile
                    </Dialog.Title>

                    <div
                      className="p-1 overflow-hidden rounded-full cursor-pointer hover:bg-gray-400"
                      onClick={closeModal}
                    >
                      <img
                        src={XmarkBlack}
                        alt="X-mark"
                        className="w-5 h-5"
                        onClick={closeModal}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex flex-col items-center w-full py-6 gap-7">
                      {/* Current profile Pic */}
                      <img
                        src={
                          profilePic ? `${baseUrl}/${profilePic.path}` : profile
                        }
                        alt="profile-pic"
                        className="rounded-full w-44 h-44"
                      />

                      {/* Add, Edit and Delete buttons */}
                      <div
                        className={
                          profilePic
                            ? "flex items-center justify-between w-full pr-2"
                            : "flex items-center justify-center w-full pr-2"
                        }
                      >
                        {!profilePic ? (
                          <AddProfilePicDialog />
                        ) : (
                          <>
                            {isSending ? (
                              <div className="py-2 bg-red-500 rounded-md px-7">
                                <Oval
                                  height={"20"}
                                  width={"20"}
                                  color="#fff"
                                  strokeWidth={"4"}
                                  secondaryColor="#fff"
                                />
                              </div>
                            ) : (
                              <button
                                type="button"
                                disabled={isSending}
                                onClick={hadleDeleteProfilePicClick}
                                className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-md hover:bg-red-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75"
                              >
                                Delete
                              </button>
                            )}

                            <EditProfilePicDialog
                              profilePicId={profilePic.id}
                            />
                          </>
                        )}
                      </div>

                      {/* <div className="flex items-center gap-2 p-2 mt-4 rounded-md cursor-pointer bg-black/10">
                        <img
                          src={shield}
                          alt="shield-icon"
                          className="w-4 h-4"
                        />
                        <p>Password and security</p>
                      </div> */}

                      <DeactivateAccDialog />
                    </div>
                  </div>

                  <div className="mt-4"></div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
