import { useMemo } from "react";
import PostCard from "./PostCard";

interface Post {
  id: number;
  username: string;
  image_url: string;
  comment: string;
  likes: number;
  isPlaceholder?: boolean;
}

interface PostGridProps {
  posts: Post[];
}

const PostGrid = ({ posts }: PostGridProps) => {
  const placeholderPosts = useMemo(() => [
    {
      id: -1,
      username: "fenomenpet",
      image_url: "https://images.unsplash.com/photo-1611611158876-41699b77a059",
      comment: "Sokak kedilerimize mama verirken #Fenomenpet Fenomenbet Pati Dostu",
      likes: 15,
      isPlaceholder: true
    },
    {
      id: -2,
      username: "patidostu",
      image_url: "https://images.unsplash.com/photo-1601758124510-52d02ddb7cbd",
      comment: "#Fenomenbet - Fenomenbet Patiler de kazanır! Sokak hayvanlarımızı besliyoruz",
      likes: 12,
      isPlaceholder: true
    },
    {
      id: -3,
      username: "hayvansever",
      image_url: "https://images.unsplash.com/photo-1548767797-d8c844163c4c",
      comment: "Minik dostlarımızı besledik #Fenomenpet Fenomenbet",
      likes: 8,
      isPlaceholder: true
    }
  ], []);

  const allPosts = useMemo(() => 
    [...posts, ...(posts.length === 0 ? placeholderPosts : [])],
    [posts, placeholderPosts]
  );

  if (allPosts.length === 0) {
    return (
      <div className="col-span-full text-center text-gray-500 mt-8">
        Henüz onaylanmış gönderi yok. Sokak hayvanlarına yardım fotoğrafınızı ilk paylaşan siz olun!
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
      {allPosts.map((post) => (
        <div key={`post-${post.id}`} className="relative">
          <PostCard post={post} />
        </div>
      ))}
    </div>
  );
};

export default PostGrid;