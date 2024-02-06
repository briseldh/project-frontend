import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";

//Image and Icons
import profile from "../../assets/imgs/149071.png";

export default function EditProfileDialog() {
  let [isOpen, setIsOpen] = useState(false);

  //Handling Functions
  const handleAddProfilePicClick = () => null;

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  return (
    <>
      <div className="inset-0 flex items-center justify-center">
        <button
          type="button"
          onClick={openModal}
          className="p-2 px-4 font-medium text-white bg-gray-500 rounded-md text-md hover:bg-gray-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75"
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

                    <button
                      type="button"
                      className="inline-flex justify-center px-4 py-2 text-sm font-medium text-blue-900 bg-blue-100 border border-transparent rounded-md hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={closeModal}
                    >
                      X
                    </button>
                  </div>

                  <div>
                    <div className="flex flex-col items-center w-full py-6 gap-7">
                      <div className="flex items-center justify-between w-full pr-2">
                        <h4 className="text-xl font-semibold text-gray-900">
                          Profile Picture
                        </h4>
                        <p
                          className="text-lg font-medium text-blue-500 cursor-pointer"
                          onClick={handleAddProfilePicClick}
                        >
                          Add
                        </p>
                      </div>
                      <img
                        src={profile}
                        alt="profile-pic"
                        className="w-44 h-44"
                      />
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
