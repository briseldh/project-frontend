import { Comments, Post } from "../../types/loaderTypes";

// Icons and Imgs
import profile from "../../assets/imgs/149071.png";

type Props = {
  comments: Comments[];
  post: Post;
};

const SingleComment = ({ comments, post }: Props) => {
  return (
    <>
      {comments?.map((comment) => {
        if (post.id !== comment.post_id) return;

        return (
          <div key={comment.id} className="flex flex-col gap-4 p-4">
            <div className="flex gap-2">
              <img
                src={profile}
                alt="commenter-profile-pic"
                className="w-10 h-10"
              />
              <div className="p-2 bg-gray-200 rounded-xl">
                <h3 className="font-medium">John Doe</h3>
                <p className="text-gray-800">{comment.text}</p>
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
};

export default SingleComment;
