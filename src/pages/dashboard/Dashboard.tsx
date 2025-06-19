import Header from "../../components/modules/header/Header";
import PostForm from "../../components/modules/post-form/PostForm";
import PostCard from "../../components/modules/post-card/PostCard";
import ProfileCard from "../../components/modules/profile-card/ProfileCard";
import { v4 as uuidv4 } from "uuid";
import { useEffect, useState } from "react";
import { Post } from "../../types/types";

const Dashboard = () => {
  const [posts, setPosts] = useState<Post[]>([ 
    {
      id: uuidv4(),
      name: "Allyn Rate",
      avatar: "/logo192.png",
      text: "Bu bir test gönderisidir",
      commentCount: 1,
      likeCount: 3,
      isLiked: true,
      comments:[],
    },
    {
      id: uuidv4(),
      name: "Anonim",
      text: "Anonim bir paylaşım",
      commentCount: 0,
      likeCount: 0,
      isLiked: false,
      comments:[],
    },
  ]);
  
  useEffect(() => {
  const saved = localStorage.getItem("posts");
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        setPosts(parsed);
      } else {
        console.warn("localStorage 'posts' değeri dizi değil:", parsed);
      }
    } catch (err) {
      console.error("Geçersiz JSON verisi:", err);
    }
  }
}, []);



  const handleAddPost = (text: string, isAnonymous: boolean) => {
  const newPost: Post = {
    id: uuidv4(),
    name: isAnonymous ? "Anonim" : "Ali Rıza",
    avatar: isAnonymous ? "/anonim.png" : "/profileIcon.png",
    text,
    commentCount: 0,
    likeCount: 0,
    isLiked: false,
    comments: [], 
  };

  const updatedPosts = [newPost, ...posts];
  setPosts(updatedPosts);
  localStorage.setItem("posts", JSON.stringify(updatedPosts));
};

 

  const toggleLike = (id: string) => {
  setPosts((prev) => {
    const updated = prev.map((post) =>
      post.id === id
        ? {
            ...post,
            isLiked: !post.isLiked,
            likeCount: post.isLiked ? post.likeCount - 1 : post.likeCount + 1,
          }
        : post
    );
    localStorage.setItem("posts", JSON.stringify(updated));
    return updated;
  });
};


  const addComment = (id: string, comment: string) => {
  setPosts((prev) => {
    const updated = prev.map((post) =>
      post.id === id
        ? {
            ...post,
            comments: [...(post.comments || []), comment],
            commentCount: (post.commentCount || 0) + 1,
          }
        : post
    );
    localStorage.setItem("posts", JSON.stringify(updated));
    return updated;
  });
};



  return (
    <div className="min-h-screen bg-blue-100">
      <Header />
      <div className="max-w-4xl mx-auto p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-1">
          <ProfileCard />
        </div>
        <div className="md:col-span-2">
          <PostForm onAddPost={handleAddPost} />
          {posts.map((post) => (
            <PostCard
              key={post.id}
              id={post.id}
              name={post.name}
              avatar={post.avatar}
              text={post.text}
              commentCount={post.commentCount}
              likeCount={post.likeCount}
              isLiked={post.isLiked}
              comments={post.comments}
              onToggleLike={toggleLike}
              onAddComment={addComment}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;


