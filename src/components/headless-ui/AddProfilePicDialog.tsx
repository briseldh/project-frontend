import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import { ProfilePicFormValues } from "../../types/formTypes";
import { useForm } from "react-hook-form";
import http from "../../utils/http";
import Button from "../Button";

export default function EditProfilePicDialog() {
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
    control,
    handleSubmit,
    setError,
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

      const response = await http.post("/api/profilePic/insert", allData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log(response);
    } catch (exception: any) {
      console.log(exception);

      if (exception.response.status === 400) {
        const message = exception.response.data.message;

        setError("avatar", { type: "error", message: message });
      }
    }
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
          onClick={openModal}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75"
        >
          Add
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

                    <Button
                      styles=""
                      disabled={isSubmitting}
                      value="Add"
                      type="submit"
                      onClick={() => null}
                    />
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
