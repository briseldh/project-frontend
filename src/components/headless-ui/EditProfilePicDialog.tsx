import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import { ProfilePicFormValues } from "../../types/formTypes";
import { useForm } from "react-hook-form";
import http from "../../utils/http";
import Button from "../Button";
import { useQueryClient } from "@tanstack/react-query";
import { Oval } from "react-loader-spinner";

type Props = {
  profilePicId: number;
};

export default function EditProfilePicDialog({ profilePicId }: Props) {
  const queryClient = useQueryClient();

  let [isOpen, setIsOpen] = useState(false);

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  const form = useForm<ProfilePicFormValues>();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = form;

  // This function is called when the fields are correctly validated
  const onSubmit = async (data: ProfilePicFormValues) => {
    const allData = {
      ...data,
      avatar: data.avatar[0],
    };

    try {
      await http.get("/sanctum/csrf-cookie");
      await http.post(`/api/profilePic/update/${profilePicId}`, allData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        method: "Patch",
      });
      await queryClient.invalidateQueries({ queryKey: ["userDataResponse"] });
      console.log("Post edit done");
      closeModal();
    } catch (exception: any) {
      console.log(exception);
    }

    console.log("Formular Submitted");
    return;
  };

  // This function is called when when we have validation errors
  const onError = () => {
    console.log("Formular Error");
  };

  return (
    <>
      <div className="inset-0 flex items-center justify-center">
        <button
          type="button"
          disabled={isSubmitting}
          onClick={openModal}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75"
        >
          Change
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
                  <form
                    onSubmit={handleSubmit(onSubmit, onError)}
                    noValidate
                    className="flex flex-col gap-5"
                  >
                    <div className="flex flex-col gap-3">
                      <label htmlFor="file" className="text-lg font-semibold ">
                        Chose Image
                      </label>
                      <input
                        type="file"
                        id="file"
                        {...register("avatar", {
                          required: {
                            value: true,
                            message: "Please select a file",
                          },
                        })}
                      />
                      <p className="text-red-600">{errors.avatar?.message}</p>
                    </div>

                    <div className="flex items-center self-center justify-center gap-2 mt-4">
                      <Button
                        styles="inline-flex justify-center px-4 py-2 text-sm font-medium text-blue-900 bg-blue-100 border border-transparent rounded-md hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                        disabled={isSubmitting}
                        value="Change"
                        type="submit"
                        onClick={() => null}
                      />

                      {isSubmitting ? (
                        <Oval
                          height={"28"}
                          width={"28"}
                          color="#6464C8"
                          strokeWidth={"4"}
                          secondaryColor="#6464C8"
                        />
                      ) : null}
                    </div>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
