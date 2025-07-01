import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Post } from "../../types/types"; // Post tipini import ediyoruz

const SettingsPage = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [profileImage, setProfileImage] = useState<string | null>("/profileIcon.png");
  
  useEffect(() => {
    const savedName = localStorage.getItem("userName") || "Ali Rıza";
    const savedBio = localStorage.getItem("userBio") || "";
    const savedImage = localStorage.getItem("profileImage") || "/profileIcon.png";

    setName(savedName);
    setBio(savedBio);
    setProfileImage(savedImage);
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Tüm değişiklikleri kaydeden ve eski verileri güncelleyen fonksiyon
  const handleSave = () => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      toast.error("User not found! Please log in again.");
      return;
    }

    // 1. Tüm gönderileri hafızadan al
    const allPosts: Post[] = JSON.parse(localStorage.getItem('posts') || '[]');

    // 2. Bu kullanıcıya ait tüm içeriklerdeki 'name' alanını yeni isimle güncelle
    const updatedPosts = allPosts.map(post => {
      // Ana gönderiyi güncelle
      const newPostName = post.userId === userId ? name : post.name;
      
      // Yorumları ve yanıtları güncelle
      const updatedComments = post.comments.map(comment => {
        const newCommentName = comment.userId === userId ? name : comment.name;
        const updatedReplies = (comment.replies || []).map(reply => {
          const newReplyName = reply.userId === userId ? name : reply.name;
          return { ...reply, name: newReplyName };
        });
        return { ...comment, name: newCommentName, replies: updatedReplies };
      });

      return { ...post, name: newPostName, comments: updatedComments };
    });

    // 3. Yeni verileri ve kullanıcı bilgilerini kaydet
    localStorage.setItem("posts", JSON.stringify(updatedPosts));
    localStorage.setItem("userName", name);
    localStorage.setItem("userBio", bio);
    if (profileImage) {
      localStorage.setItem("profileImage", profileImage);
    }

    window.dispatchEvent(new Event("profileImageUpdated"));
    toast.success("Profile successfully updated!");
    navigate("/profile");
  };

  return (
    <div className="bg-white max-w-md mx-auto p-8 shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold text-center mb-6">Edit Profile</h1>
      <div className="flex flex-col items-center">
        <img src={profileImage || "/profileIcon.png"} alt="Profile" className="w-28 h-28 rounded-full object-cover border-2"/>
        <button onClick={() => fileInputRef.current?.click()} className="mt-3 px-4 py-1.5 text-sm font-semibold bg-gray-100 rounded-md hover:bg-gray-200">Change</button>
        <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageChange} style={{ display: "none" }}/>
      </div>
      <div className="mt-8 space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
          <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} className="w-full p-2.5 border border-gray-300 rounded-md shadow-sm"/>
        </div>
        <div>
          <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
          <textarea id="bio" value={bio} onChange={(e) => setBio(e.target.value)} rows={4} className="w-full p-2.5 border border-gray-300 rounded-md shadow-sm"/>
        </div>
      </div>
      <div className="mt-8">
        <button onClick={handleSave} className="w-full py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition">Save</button>
      </div>
    </div>
  );
};

export default SettingsPage;
