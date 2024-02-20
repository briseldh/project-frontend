import {
  threePointsMenuClose,
  threePointsMenuOpen,
} from "../../styles/profilePage";
import { File, Post } from "../../types/loaderTypes";
import threePointsMenu from "../../assets/icons/ellipsis-solid.svg";
import EditPostDialog from "../headless-ui/EditPostDialog";
import deleteIcon from "../../assets/icons/trash-solid.svg";
import { useState } from "react";
import http from "../../utils/http";
import { useQueryClient } from "@tanstack/react-query";

type Props = {
  post: Post;
  uploads: File[]; // the uploads I need for the image foreshow before editing the post.
};

const Top = ({ post, uploads }: Props) => {
  const queryClient = useQueryClient();

  const [pointsMenuOpen, setPointsMenuOpen] = useState<number[]>([]);

  //Handling functions
  const handlePointsMenuClick = (
    e: React.MouseEvent<HTMLImageElement, MouseEvent>
  ) => {
    const postId = Number(e.currentTarget.id);

    if (!pointsMenuOpen.includes(postId)) {
      setPointsMenuOpen((prevValue) => {
        return [...prevValue, postId];
      });
    } else {
      setPointsMenuOpen((prevValue) => {
        const likeIdx = prevValue.indexOf(postId);
        prevValue.splice(likeIdx, 1);
        return [...prevValue];
      });
    }
  };
  const handleDeletePostClick = async (
    e: React.MouseEvent<HTMLHeadingElement, MouseEvent>
  ) => {
    const postId = Number(e.currentTarget.id);

    try {
      await http.get("/sanctum/csrf-cookie");
      await http.delete(`/api/post/delete/${postId}`);

      //This query invalidation is called when the user deletes the post so that the effect that runs depending on queryData happens.
      await queryClient.invalidateQueries({ queryKey: ["userDataResponse"] });
      console.log("Deleted Successfully");
    } catch (exception) {
      console.log(exception);
    }
  };

  return (
    <div className="relative flex items-center justify-between">
      <div>
        <h1 className="px-4 pt-2 text-lg font-semibold">{post.title}</h1>
        <p className="px-4 pb-2 text-gray-800">{post.text}</p>
      </div>

      <img
        id={`${post.id}`}
        onClick={(e) => handlePointsMenuClick(e)}
        src={threePointsMenu}
        alt="three-point-menu"
        className="w-5 h-5 mx-4 cursor-pointer"
      />

      {/* Delete and Edit Post */}
      <div
        className={
          pointsMenuOpen.includes(post.id)
            ? threePointsMenuOpen
            : threePointsMenuClose
        }
      >
        <EditPostDialog post={post} uploads={uploads!} />

        <div className="flex items-center gap-2 px-2 py-1 text-gray-200 rounded-md cursor-pointer hover:bg-red-500">
          <img src={deleteIcon} alt="delete-icon" className="w-4 h-4 " />
          <h4
            id={`${post.id}`}
            onClick={(e) => {
              handleDeletePostClick(e);
            }}
          >
            Delete Post
          </h4>
        </div>
      </div>
    </div>
  );
};

export default Top;
