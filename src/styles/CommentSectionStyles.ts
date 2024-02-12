export type Styles = {
    closeCommentsXmark: string | undefined;
    postWrapper: string | undefined;
    postSection: string | undefined;
    viewAllCommentsLink: string | undefined;
    commentsWrapper: string | undefined;
    writeNewComment: string | undefined;
  };
  
  export const commentsCloseStyles: Styles = {
    postSection:
      "flex flex-col gap-5 px-4 pt-4 bg-gray-400 xs:w-full sm:pt-8 sm:h-auto md:flex md:items-center pb-4 sm:pb-8",
    closeCommentsXmark: "hidden",
    postWrapper: "overflow-hidden bg-gray-300 rounded-lg md:w-[70%] lg:w-[710px]",
    viewAllCommentsLink:
      "pt-2 px-4 font-medium text-gray-800 cursor-pointer hover:underline inline-block",
    commentsWrapper: "overflow-hidden max-h-[225px] bg-gray-300",
    writeNewComment: "hidden",
  };
  
  export const commentsOpenStyles: Styles = {
    postSection:
      "z-10 flex flex-col px-4 pt-4 bg-gray-400 top-20 xs:w-full sm:pt-8 sm:h-auto md:flex md:items-center pb-4",
    closeCommentsXmark:
    "flex justify-end w-full p-3 bg-gray-300 border-b border-gray-100 rounded-t-lg md:w-[70%] lg:w-[710px]",
    postWrapper:
    "h-full bg-gray-300 xs:w-full sm:overflow-auto sm:rounded-b-lg md:w-[70%] lg:w-[710px]",
    viewAllCommentsLink: "hidden",
    commentsWrapper: "h-auto bg-gray-300",
    writeNewComment: "sticky bottom-0 left-0 w-full p-3 bg-gray-300 sm:sticky",
  };