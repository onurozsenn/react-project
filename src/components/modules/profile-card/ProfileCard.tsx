import { FC, useState, useEffect, useRef, useMemo } from "react"; 
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import PostCard from "../../modules/post-card/PostCard";
import { Post, Comment, Reply } from "../../../types/types";
import toast from 'react-hot-toast';

const Profile: FC = () => {
  const [userName, setUserName] = useState("Ali Rıza");
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [bio, setBio] = useState<string>("Click to edit your biography.");
  const [isEditingBio, setIsEditingBio] = useState<boolean>(false);
  const [posts, setPosts] = useState<Post[]>([]);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const savedName = localStorage.getItem("userName") || "Ali Rıza";
    setUserName(savedName); 
    const savedImage = localStorage.getItem("profileImage");
    if (savedImage) setProfileImage(savedImage);
    const savedBio = localStorage.getItem("userBio");
    if (savedBio) setBio(savedBio);
    const savedPosts = localStorage.getItem("posts");
    if (savedPosts) {
      try {
        const parsedPosts = JSON.parse(savedPosts);
        if (Array.isArray(parsedPosts)) setPosts(parsedPosts);
      } catch (err) {
        console.error("Invalid JSON data:", err);
      }
    }
  }, []);
  
  const userPosts = posts.filter(post => post.name === userName);

 
  const totalLikes = useMemo(() => {
    return userPosts.reduce((sum, post) => sum + (post.likeCount || 0), 0);
  }, [userPosts]);


  const handleImageClick = () => fileInputRef.current?.click();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setProfileImage(base64String);
        localStorage.setItem("profileImage", base64String);
        window.dispatchEvent(new Event("profileImageUpdated"));
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleBioSave = () => {
    localStorage.setItem("userBio", bio);
    setIsEditingBio(false);
    toast.success('Biography updated!');
  };
  const handleDeletePost = (id: string) => {
    const updated = posts.filter((post) => post.id !== id);
    setPosts(updated);
    localStorage.setItem("posts", JSON.stringify(updated));
    toast.success('Post successfully deleted!');
  };

  const toggleLike = (id: string) => {
    const updated = posts.map((post) =>
      post.id === id ? { ...post, isLiked: !post.isLiked, likeCount: post.isLiked ? post.likeCount - 1 : post.likeCount + 1 } : post
    );
    setPosts(updated);
    localStorage.setItem("posts", JSON.stringify(updated));
  };

  const addComment = (id: string, commentText: string) => {
    const newComment: Comment = {
      id: uuidv4(),
      text: commentText,
      name: userName,
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
    toast.success('Comment successfully deleted!');
  };

  const handleAddReply = (postId: string, parentCommentId: string, text: string) => {
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
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Sol Sütun: Profil Bilgileri */}
      <div className="md:col-span-1">
        <div className="bg-white p-6 shadow rounded-lg text-center sticky top-6">
          <img src={profileImage || "/profileIcon.png"} alt="Profile" className="w-24 h-24 rounded-full border-2 border-gray-300 cursor-pointer mx-auto" onClick={handleImageClick}/>
          <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageChange} style={{ display: "none" }}/>
          <button onClick={() => navigate('/settings')} className=" w-full mt-4 py-2 px-4 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition">Edit Profile</button>
          <h2 className="text-2xl font-bold mt-4">{userName}</h2>
          <p className="text-gray-500 mb-4">@{userName.toLowerCase().replace(/\s+/g, '')}</p>

          <div className="flex justify-around mt-4 text-sm border-t pt-4">
            <div>
              <strong>160</strong>
              <div className="text-gray-500">Following</div>
            </div>
            <div>
              <strong>{totalLikes}</strong>
              <div className="text-gray-500">Likes</div>
            </div>
            <div>
              <strong>8973</strong>
              <div className="text-gray-500">Followers</div>
            </div>
          </div>

         <div className="text-left mt-4 border-t pt-4">
            <h3 className="font-semibold mb-2">Biography</h3>
            {isEditingBio ? (
              <div>
                <textarea value={bio} onChange={(e) => setBio(e.target.value)} className="w-full p-2 border border-gray-300 rounded text-sm" rows={4}/>
                <button onClick={handleBioSave} className="mt-2 px-4 py-1 bg-purple-700 text-white text-sm rounded hover:bg-purple-800 transition">Save</button>
              </div>
            ) : (
              <div onClick={() => setIsEditingBio(true)} className="cursor-pointer">
                <p className="text-sm text-gray-600 italic">{bio || "Click to edit your biography."}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sağ Sütun: Gönderiler */}
      <div className="md:col-span-2">
        <h2 className="text-xl font-bold mb-4 bg-white p-4 shadow rounded-lg">My Posts</h2>
        {userPosts.length > 0 ? (
          userPosts.map((post) => (
            <PostCard
              key={post.id}
              {...post}
              onDelete={handleDeletePost}
              onToggleLike={toggleLike}
              onAddComment={addComment}
              onDeleteComment={handleDeleteComment}
              onAddReply={handleAddReply}
            />
          ))
        ) : (
          <div className="text-center text-gray-500 mt-5 bg-white rounded-lg pt-20 pb-20 shadow-md">
            <p className="text-lg font-semibold">You haven't shared any posts yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
