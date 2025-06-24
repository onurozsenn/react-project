import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import PostForm from "../../components/modules/post-form/PostForm";
import PostCard from "../../components/modules/post-card/PostCard";
import { Post, Comment, Reply } from "../../types/types";
import toast from 'react-hot-toast'

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
        console.error("Invalid JSON data:", err);
      }
    }
  }, []);

  const handleAddPost = (text: string, isAnonymous: boolean, mediaFile?: File | null) => {
    const currentUserName = localStorage.getItem("userName") || "Ali Rıza";
    let audioUrl = "";
    let imageUrl = "";

    if (mediaFile) {
      const url = URL.createObjectURL(mediaFile);
      if (mediaFile.type.startsWith("audio/")) audioUrl = url;
      else if (mediaFile.type.startsWith("image/")) imageUrl = url;
    }

    const newPost: Post = {
      id: uuidv4(),
      name: isAnonymous ? "Anonymous" : currentUserName,
      text,
      commentCount: 0,
      likeCount: 0,
      isLiked: false,
      comments: [],
      audioUrl,
      imageUrl,
      createdAt: new Date().toISOString(),
    };

    const updatedPosts = [newPost, ...posts];
    setPosts(updatedPosts);
    localStorage.setItem("posts", JSON.stringify(updatedPosts));
    toast.success('Post successfully created!');
  };

  const toggleLike = (id: string) => {
    const updated = posts.map((post) =>
      post.id === id ? { ...post, isLiked: !post.isLiked, likeCount: post.isLiked ? post.likeCount - 1 : post.likeCount + 1 } : post
    );
    setPosts(updated);
    localStorage.setItem("posts", JSON.stringify(updated));
  };

  const addComment = (id: string, commentText: string) => {
    const currentUserName = localStorage.getItem("userName") || "Ali Rıza";
    
    const newComment: Comment = {
      id: uuidv4(),
      text: commentText,
      name: currentUserName,
      createdAt: new Date().toISOString(),
      replies: [],
      avatar: ""
    };
    
    const updated = posts.map((post) =>
      post.id === id ? { ...post, comments: [...(post.comments || []), newComment], commentCount: (post.commentCount || 0) + 1 } : post
    );
    setPosts(updated);
    localStorage.setItem("posts", JSON.stringify(updated));
  };

  const handleDeletePost = (id: string) => {
      const updated = posts.filter((post) => post.id !== id);
      setPosts(updated);
      localStorage.setItem("posts",JSON.stringify(updated));
      toast.success('Post successfully deleted!')
  }

  const handleDeleteComment = (postId: string, commentId: string) => {
    const updated = posts.map((post) => {
      if (post.id !== postId) return post;
  
      const commentToDelete = post.comments.find(c => c.id === commentId);
      const commentCountChange = (commentToDelete?.replies?.length || 0) + 1;
  
      const updatedComments = post.comments.filter((comment) => comment.id !== commentId);
  
      return { ...post, comments: updatedComments, commentCount: post.commentCount - commentCountChange };
    });
    setPosts(updated);
    localStorage.setItem("posts", JSON.stringify(updated));
    toast.success('Comment succesfully deleted!');
  };

  const handleAddReply = (postId: string, parentCommentId: string, text: string) => {
    const userName = localStorage.getItem("userName") || "Ali Rıza";
    
    const newReply: Reply = {
      id: uuidv4(),
      text,
      name: userName,
      createdAt: new Date().toISOString(),
      avatar: ""
    };

    const updatedPosts = posts.map(post => {
      if (post.id === postId) {
        const updatedComments = post.comments.map(comment => {
          if (comment.id === parentCommentId) {
            return { ...comment, replies: [...(comment.replies || []), newReply] };
          }
          return comment;
        });
        return { ...post, comments: updatedComments, commentCount: (post.commentCount || 0) + 1 };
      }
      return post;
    });

    setPosts(updatedPosts);
    localStorage.setItem("posts", JSON.stringify(updatedPosts));
  };

  return (
    <>
      <PostForm onAddPost={handleAddPost} />
      {posts.length === 0 ? (
        <div className="text-center text-gray-500 mt-5 bg-white rounded-lg pt-20 pb-20 shadow-md">
          <img src="/empty-content.jpg" alt="Empty content" className="mx-auto mb-4 w-40"/>
          <p className="text-lg font-semibold">No content has been shared yet.</p>
        </div>
      ) : (
        posts.map((post) => (
          <PostCard
            key={post.id}
            {...post}
            onToggleLike={toggleLike}
            onAddComment={addComment}
            onDelete={handleDeletePost}
            onDeleteComment={handleDeleteComment}
            onAddReply={handleAddReply}
          />
        ))
      )}
    </>
  );
};

export default Dashboard;
