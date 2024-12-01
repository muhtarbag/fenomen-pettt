import { useState } from "react";
import { Heart } from "lucide-react";
import SocialShare from "./SocialShare";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Post {
  id: number;
  username: string;
  image_url: string;
  comment: string;
  likes: number;
}

interface PostCardProps {
  post: Post;
}

const PostCard = ({ post }: PostCardProps) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="bg-white rounded-lg shadow-md overflow-hidden animate-fade-up cursor-pointer hover:shadow-lg transition-shadow">
          <img
            src={post.image_url}
            alt={`${post.username} tarafından paylaşıldı`}
            className="w-full h-64 object-cover"
          />
          <div className="p-4">
            <p className="font-semibold text-gray-900">@{post.username}</p>
            <p className="text-gray-600 mt-1 line-clamp-2">{post.comment}</p>
            <div className="mt-4 flex items-center justify-between">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleLike();
                }}
                className="flex items-center gap-1 text-gray-600 hover:text-primary transition-colors"
              >
                <Heart
                  size={20}
                  className={`transition-colors ${
                    isLiked ? "fill-red-500 text-red-500" : ""
                  }`}
                />
                <span>{likeCount}</span>
              </button>
              <div onClick={(e) => e.stopPropagation()}>
                <SocialShare url={window.location.href} />
              </div>
            </div>
          </div>
        </div>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[800px]">
        <div className="grid gap-6">
          <img
            src={post.image_url}
            alt={`${post.username} tarafından paylaşıldı`}
            className="w-full rounded-lg object-contain max-h-[60vh]"
          />
          <div>
            <h3 className="font-semibold text-lg">@{post.username}</h3>
            <p className="text-gray-600 mt-2">{post.comment}</p>
            <div className="mt-4 flex items-center justify-between">
              <button
                onClick={handleLike}
                className="flex items-center gap-1 text-gray-600 hover:text-primary transition-colors"
              >
                <Heart
                  size={20}
                  className={`transition-colors ${
                    isLiked ? "fill-red-500 text-red-500" : ""
                  }`}
                />
                <span>{likeCount}</span>
              </button>
              <SocialShare url={window.location.href} />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PostCard;