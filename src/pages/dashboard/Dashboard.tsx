import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import PostForm from "../../components/modules/post-form/PostForm";
import PostCard from "../../components/modules/post-card/PostCard";
import { Post, Comment, Reply } from "../../types/types";
import toast from "react-hot-toast";

const Dashboard = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [userId, setUserId] = useState<string | null>(null);

  // Sayfa ilk yüklendiğinde, kullanıcı ID'sini ve mevcut gönderileri hafızadan alır.
  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    setUserId(storedUserId);

    const savedPosts = localStorage.getItem("posts");
    if (savedPosts) {
      try {
        const parsed = JSON.parse(savedPosts);
        if (Array.isArray(parsed)) {
          setPosts(parsed);
        }
      } catch (err) {
        console.error("Invalid JSON data:", err);
      }
    }
  }, []);

  // Yeni bir gönderi ekleme fonksiyonu
  const handleAddPost = (text: string, isAnonymous: boolean, mediaFile?: File | null) => {
    if (!userId && !isAnonymous) {
        toast.error("User ID not found. Please log in again.");
        return;
    }
    
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
      userId: isAnonymous ? 'anonymous' : userId!,
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

  // Bir gönderiyi beğenme/beğenmekten vazgeçme
  const toggleLike = (id: string) => {
    const updated = posts.map((post) =>
      post.id === id ? { ...post, isLiked: !post.isLiked, likeCount: post.isLiked ? post.likeCount - 1 : post.likeCount + 1 } : post
    );
    setPosts(updated);
    localStorage.setItem("posts", JSON.stringify(updated));
  };

  // Yeni bir yorum ekleme
  const addComment = (id: string, commentText: string) => {
    if (!userId) return;
    const currentUserName = localStorage.getItem("userName") || "Ali Rıza";
    const newComment: Comment = {
      id: uuidv4(),
      userId: userId,
      text: commentText,
      name: currentUserName,
      createdAt: new Date().toISOString(),
      replies: [],
      isLiked: false,
      likeCount: 0,
    };
    const updated = posts.map((post) => post.id === id ? { ...post, comments: [...(post.comments || []), newComment], commentCount: (post.commentCount || 0) + 1 } : post);
    setPosts(updated);
    localStorage.setItem("posts", JSON.stringify(updated));
  };
  
  // Yeni bir yanıt ekleme
  const handleAddReply = (postId: string, parentCommentId: string, text: string) => {
    if (!userId) return;
    const userName = localStorage.getItem("userName") || "Ali Rıza";
    const newReply: Reply = {
      id: uuidv4(),
      userId: userId,
      text,
      name: userName,
      createdAt: new Date().toISOString(),
      isLiked: false,
      likeCount: 0,
    };
    const updatedPosts = posts.map(post => {
      if (post.id === postId) {
        const updatedComments = post.comments.map(comment => {
          if (comment.id === parentCommentId) { return { ...comment, replies: [...(comment.replies || []), newReply] }; }
          return comment;
        });
        return { ...post, comments: updatedComments, commentCount: (post.commentCount || 0) + 1 };
      }
      return post;
    });
    setPosts(updatedPosts);
    localStorage.setItem("posts", JSON.stringify(updatedPosts));
  };

  // Gönderi, yorum ve yanıt silme fonksiyonları
  const handleDeletePost = (id: string) => {
    const updated = posts.filter((post) => post.id !== id);
    setPosts(updated);
    localStorage.setItem("posts", JSON.stringify(updated));
    toast.success('Post successfully deleted!');
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
    toast.success('Comment deleted!');
  };

  const handleDeleteReply = (postId: string, commentId: string, replyId: string) => {
    const updated = posts.map(post => {
      if (post.id === postId) {
        const updatedComments = post.comments.map(comment => {
          if (comment.id === commentId) {
            const updatedReplies = (comment.replies || []).filter(reply => reply.id !== replyId);
            return { ...comment, replies: updatedReplies };
          }
          return comment;
        });
        return { ...post, comments: updatedComments, commentCount: (post.commentCount || 1) - 1 };
      }
      return post;
    });
    setPosts(updated);
    localStorage.setItem("posts", JSON.stringify(updated));
    toast.success('Reply deleted!');
  };
  
  // Yorum ve yanıt beğenme fonksiyonları
  const handleToggleCommentLike = (postId: string, commentId: string) => {
    const updatedPosts = posts.map(post => {
      if (post.id === postId) {
        const updatedComments = post.comments.map(comment => {
          if (comment.id === commentId) {
            const newIsLiked = !comment.isLiked;
            const newLikeCount = newIsLiked ? (comment.likeCount || 0) + 1 : (comment.likeCount || 1) - 1;
            return { ...comment, isLiked: newIsLiked, likeCount: newLikeCount };
          }
          return comment;
        });
        return { ...post, comments: updatedComments };
      }
      return post;
    });
    setPosts(updatedPosts);
    localStorage.setItem("posts", JSON.stringify(updatedPosts));
  };

  const handleToggleReplyLike = (postId: string, commentId: string, replyId: string) => {
    const updatedPosts = posts.map(post => {
      if (post.id === postId) {
        const updatedComments = post.comments.map(comment => {
          if (comment.id === commentId) {
            const updatedReplies = (comment.replies || []).map(reply => {
              if (reply.id === replyId) {
                const newIsLiked = !reply.isLiked;
                const newLikeCount = newIsLiked ? (reply.likeCount || 0) + 1 : (reply.likeCount || 1) - 1;
                return { ...reply, isLiked: newIsLiked, likeCount: newLikeCount };
              }
              return reply;
            });
            return { ...comment, replies: updatedReplies };
          }
          return comment;
        });
        return { ...post, comments: updatedComments };
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
            onDeleteReply={handleDeleteReply}
            onToggleCommentLike={handleToggleCommentLike}
            onToggleReplyLike={handleToggleReplyLike}
          />
        ))
      )}
    </>
  );
};

export default Dashboard;
