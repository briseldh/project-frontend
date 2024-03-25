import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useContext, useState } from "react";

// Icons and Imgs
import deactivate from "../../assets/icons/ban-solid.svg";
import http from "../../utils/http";
import { Oval } from "react-loader-spinner";
import { useQueryClient } from "@tanstack/react-query";
import { AuthContext, defaultAuth } from "../../context/AuthProvider";

export default function DeactivateAccDialog() {
  const { setAuth } = useContext(AuthContext);
  const queryClient = useQueryClient();

  let [isOpen, setIsOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  const handleDeactivateClick = async () => {
    try {
      setIsSending(true);
      await http.get("/sanctum/csrf-cookie");
      await http.delete("/api/user/delete");
      await http.post("/api/logout");

      setAuth(defaultAuth);

      setAuth((prevAuth) => {
        return {
          ...prevAuth,
          requestStatus: "sent",
        };
      });

      // Clearing the query cache
      queryClient.clear();
    } catch (exception) {
      console.log(exception);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <>
      <div className="inset-0 flex items-center justify-center gap-2 px-4 py-2 mt-4 rounded-md bg-black/20 hover:bg-black/30">
        <img src={deactivate} alt="deactivate-icon" className="w-4 h-4" />

        <button
          type="button"
          onClick={openModal}
          className="text-sm font-medium text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75"
        >
          Deactivate Account
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
                <Dialog.Panel className="w-full max-w-md p-6 mr-2 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Think about it again
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Are you sure you want to delete your account? After
                      deactivating your account everything abouth this account
                      will be deleted and you can not get it back after deleting
                      it.
                    </p>
                  </div>

                  {isSending ? (
                    <div className="w-20 py-2 mt-3 bg-red-500 rounded-md px-7">
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
                      onClick={handleDeactivateClick}
                      className="inline-flex justify-center px-4 py-2 mt-3 text-sm font-medium text-white bg-red-500 border border-transparent rounded-md hover:bg-red-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                    >
                      Deactivate
                    </button>
                  )}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
