import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import PostForm from "../../components/modules/post-form/PostForm";
import PostCard from "../../components/modules/post-card/PostCard";
import { Post } from "../../types/types"; // Post tipinde audioUrl?: string olmalı

const Dashboard = () => {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("posts");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setPosts(parsed);
        }
      } catch (err) {
        console.error("Geçersiz JSON verisi:", err);
      }
    }
  }, []);

  const handleAddPost = (text: string, isAnonymous: boolean, mediaFile?: File | null) => {
    let audioUrl = "";
    let imageUrl = "";

    if (mediaFile) {
      const url = URL.createObjectURL(mediaFile);
      if (mediaFile.type.startsWith("audio/")) {
        audioUrl = url;
      } else if (mediaFile.type.startsWith("image/")) {
        imageUrl = url;
      }
    }

    const newPost: Post = {
      id: uuidv4(),
      name: isAnonymous ? "Anonim" : "Ali Rıza",
      avatar: isAnonymous ? "/anonim.png" : "/profileIcon.png",
      text,
      commentCount: 0,
      likeCount: 0,
      isLiked: false,
      comments: [],
      audioUrl,
      imageUrl,
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
    <>
      <PostForm onAddPost={handleAddPost} />

      {posts.length === 0 ? (
        <div className="text-center text-gray-500 mt-5 bg-white rounded-lg pt-20 pb-20 shadow-md">
          <img
            src="/empty-content.jpg"
            alt="Boş içerik"
            className="mx-auto mb-4 w-40"
          />
          <p className="text-lg font-semibold">No content has been shared yet.</p>
        </div>
      ) : (
        posts.map((post) => (
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
            audioUrl={post.audioUrl}
            imageUrl={post.imageUrl}
            onToggleLike={toggleLike}
            onAddComment={addComment}
          />
        ))
      )}
    </>
  );

};

export default Dashboard;
