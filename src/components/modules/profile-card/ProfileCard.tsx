import { FC, useState, useEffect, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import PostCard from "../../modules/post-card/PostCard";
import { Post } from "../../../types/types";

const Profile: FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);

  const [bio, setBio] = useState<string>("Biyografinizi düzenlemek için tıklayın.");
  const [isEditingBio,setIsEditingBio] = useState<boolean>(false);

  useEffect(() => {
    const savedImage = localStorage.getItem("profileImage");
    if (savedImage) {
      setProfileImage(savedImage);
    }

    const savedBio = localStorage.getItem("userBio");
    if(savedBio) {
      setBio(savedBio);
    }

    const savedPosts = localStorage.getItem("posts");
    if (savedPosts) {
      try {
        const parsedPosts = JSON.parse(savedPosts);
        if (Array.isArray(parsedPosts)) {
          setPosts(parsedPosts);
        }
      } catch (err) {
        console.error("Geçersiz JSON verisi:", err);
      }
    }
  }, []);
  
  const userPosts = posts.filter(post => post.name === "Ali Rıza");

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

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
    localStorage.setItem("userBio",bio);
    setIsEditingBio(false);
  }

  const handleDeletePost = (id: string) => {
    const updated = posts.filter((post) => post.id !== id);
    setPosts(updated);
    localStorage.setItem("posts", JSON.stringify(updated));
  };

  const toggleLike = (id: string) => {
    const updated = posts.map((post) =>
      post.id === id
        ? { ...post, isLiked: !post.isLiked, likeCount: post.isLiked ? post.likeCount - 1 : post.likeCount + 1 }
        : post
    );
    setPosts(updated);
    localStorage.setItem("posts", JSON.stringify(updated));
  };

  const addComment = (id: string, comment: string) => {
    const updated = posts.map((post) =>
      post.id === id
        ? {
            ...post,
            comments: [...(post.comments || []), { id: uuidv4(), text: comment, name: "Ali Rıza", avatar: profileImage || "/profileIcon.png" }],
            commentCount: (post.commentCount || 0) + 1,
          }
        : post
    );
    setPosts(updated);
    localStorage.setItem("posts", JSON.stringify(updated));
  };

  const handleDeleteComment = (postId: string, commentId: string) => {
    const updated = posts.map((post) =>
      post.id === postId
        ? { ...post, comments: post.comments.filter((comment) => comment.id !== commentId), commentCount: post.commentCount - 1 }
        : post
    );
    setPosts(updated);
    localStorage.setItem("posts", JSON.stringify(updated));
  };
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Sol Sütun: Profil Bilgileri */}
      <div className="md:col-span-1">
        <div className="bg-white p-6 shadow rounded-lg text-center sticky top-6">
          <img
            src={profileImage || "/profileIcon.png"}
            alt="Profile"
            className="w-24 h-24 rounded-full border-2 border-gray-300 cursor-pointer mx-auto mb-4"
            onClick={handleImageClick}
          />
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleImageChange}
            style={{ display: "none" }}
          />
          <h2 className="text-2xl font-bold">Ali Rıza</h2>
          <p className="text-gray-500 mb-4">@aliriza</p>
          
          <div className="flex justify-around mt-4 text-sm border-t pt-4">
            <div>
              <strong>160</strong>
              <div className="text-gray-500">Following</div>
            </div>
            <div>
              <strong>8973</strong>
              <div className="text-gray-500">Followers</div>
            </div>
          </div>
         <div className="text-left mt-4 border-t pt-4">
            <h3 className="font-semibold mb-2">Biography</h3>
            {isEditingBio ? (
              // Düzenleme Modu
              <div>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded text-sm"
                  rows={4}
                />
                <button
                  onClick={handleBioSave}
                  className="mt-2 px-4 py-1 bg-purple-700 text-white text-sm rounded hover:bg-purple-800 transition"
                >
                  Kaydet
                </button>
              </div>
            ) : (
              <div onClick={() => setIsEditingBio(true)} className="cursor-pointer">
                <p className="text-sm text-gray-600 italic">
                  {bio || "Biyografinizi düzenlemek için tıklayın."}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sağ Sütun: Gönderiler */}
      <div className="md:col-span-2">
        <h2 className="text-xl font-bold mb-4 bg-white p-4 shadow rounded-lg">Gönderilerim</h2>
        {userPosts.length > 0 ? (
          userPosts.map((post) => (
            <PostCard
              key={post.id}
              {...post}
              onDelete={handleDeletePost}
              onToggleLike={toggleLike}
              onAddComment={addComment}
              onDeleteComment={handleDeleteComment}
            />
          ))
        ) : (
          <div className="text-center text-gray-500 mt-5 bg-white rounded-lg pt-20 pb-20 shadow-md">
            <p className="text-lg font-semibold">Henüz hiç gönderi paylaşmadın.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;