import { FC, useState, useEffect, useRef, useMemo, ReactNode } from "react"; // ReactNode tipini import ettik
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import PostCard from "../../modules/post-card/PostCard";
import { Post, Comment, Reply, User } from "../../../types/types";
import toast from 'react-hot-toast';
import { XMarkIcon } from '@heroicons/react/24/solid';

// --- YENİ, ÖZELLEŞTİRİLEBİLİR MODAL BİLEŞENİ ---
// Bu bileşen artık projenin her yerinde farklı amaçlarla kullanılabilir.
const CustomModal: FC<{
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode; // Gövde: Herhangi bir React bileşeni alabilir
  footer?: ReactNode; // Alt Kısım: Herhangi bir React bileşeni alabilir
}> = ({ isOpen, onClose, title, children, footer }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-sm w-full flex flex-col" style={{maxHeight: '90vh'}}>
        {/* Başlık Bölümü */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">{title || ''}</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200">
            <XMarkIcon className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Gövde Bölümü (İçerik) */}
        <div className="flex-1 overflow-y-auto p-4">
          {children}
        </div>

        {/* Alt Kısım (Butonlar vb.) */}
        {footer && (
          <div className="p-4 border-t bg-gray-50 rounded-b-lg">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};


// --- Ana Profil Bileşeni ---
const Profile: FC = () => {
  // --- STATE'LER ---
  const [userName, setUserName] = useState("Ali Rıza");
  const [posts, setPosts] = useState<Post[]>([]);
  const [isUserListModalOpen, setUserListModalOpen] = useState(false);
  const [modalData, setModalData] = useState<{ title: string; users: User[] }>({ title: '', users: [] });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [bio, setBio] = useState<string>("Click to edit your biography.");
  const [isEditingBio, setIsEditingBio] = useState<boolean>(false);
  const navigate = useNavigate();

  // --- ÖRNEK VERİ ---
  const dummyFollowers: User[] = [
    { id: 1, name: 'Ceren Yılmaz', username: 'cerenyilmaz', avatar: 'https://randomuser.me/api/portraits/women/44.jpg' },
    { id: 2, name: 'Ahmet Çelik', username: 'ahmetcelik', avatar: 'https://randomuser.me/api/portraits/men/45.jpg' },
  ];
  const dummyFollowing: User[] = [
    { id: 4, name: 'Mehmet Aydın', username: 'mehmetaydin', avatar: 'https://randomuser.me/api/portraits/men/47.jpg' },
  ];

  // --- VERİ YÜKLEME VE HESAPLAMALAR ---
  useEffect(() => {
    const savedName = localStorage.getItem("userName") || "Ali Rıza"; setUserName(savedName);
    const savedImage = localStorage.getItem("profileImage"); if (savedImage) setProfileImage(savedImage);
    const savedBio = localStorage.getItem("userBio"); if (savedBio) setBio(savedBio);
    const savedPosts = localStorage.getItem("posts"); if (savedPosts) { try { const parsedPosts = JSON.parse(savedPosts); if (Array.isArray(parsedPosts)) setPosts(parsedPosts); } catch (err) { console.error("Invalid JSON data:", err); } }
  }, []);
  
  const userPosts = posts.filter(post => post.name === userName);
  const totalLikes = useMemo(() => userPosts.reduce((sum, post) => sum + (post.likeCount || 0), 0), [userPosts]);
  
  // --- FONKSİYONLAR ---
  const openUserListModal = (type: 'followers' | 'following') => {
    setModalData({
      title: type === 'followers' ? 'Followers' : 'Following',
      users: type === 'followers' ? dummyFollowers : dummyFollowing,
    });
    setUserListModalOpen(true);
  };
  
  const handleImageClick = () => fileInputRef.current?.click();
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => { const file = e.target.files?.[0]; if (file) { const reader = new FileReader(); reader.onloadend = () => { const base64String = reader.result as string; setProfileImage(base64String); localStorage.setItem("profileImage", base64String); window.dispatchEvent(new Event("profileImageUpdated")); }; reader.readAsDataURL(file); } };
  const handleBioSave = () => { localStorage.setItem("userBio", bio); setIsEditingBio(false); toast.success('Biography updated!'); };
  const handleDeletePost = (id: string) => { const updated = posts.filter((post) => post.id !== id); setPosts(updated); localStorage.setItem("posts", JSON.stringify(updated)); toast.success('Post successfully deleted!'); };
  const toggleLike = (id: string) => { const updated = posts.map((post) => post.id === id ? { ...post, isLiked: !post.isLiked, likeCount: post.isLiked ? post.likeCount - 1 : post.likeCount + 1 } : post ); setPosts(updated); localStorage.setItem("posts", JSON.stringify(updated)); };
  
  const addComment = (id: string, commentText: string) => {
    const newComment: Comment = {
      id: uuidv4(), text: commentText, name: userName, createdAt: new Date().toISOString(), replies: [],
      avatar: ""
    };
    const updated = posts.map((post) => post.id === id ? { ...post, comments: [...(post.comments || []), newComment], commentCount: (post.commentCount || 0) + 1 } : post );
    setPosts(updated);
    localStorage.setItem("posts", JSON.stringify(updated));
  };
  
  const handleAddReply = (postId: string, parentCommentId: string, text: string) => {
    const newReply: Reply = {
      id: uuidv4(), text, name: userName, createdAt: new Date().toISOString(),
      avatar: ""
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

  const handleDeleteComment = (postId: string, commentId: string) => { const updated = posts.map((post) => { if (post.id !== postId) return post; const commentToDelete = post.comments.find(c => c.id === commentId); const commentCountChange = (commentToDelete?.replies?.length || 0) + 1; const updatedComments = post.comments.filter((comment) => comment.id !== commentId); return { ...post, comments: updatedComments, commentCount: post.commentCount - commentCountChange }; }); setPosts(updated); localStorage.setItem("posts", JSON.stringify(updated)); toast.success('Comment successfully deleted!'); };
  
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <div className="bg-white p-6 shadow rounded-lg text-center sticky top-6">
            <img src={profileImage || "/profileIcon.png"} alt="Profile" className="w-24 h-24 rounded-full border-2 border-gray-300 cursor-pointer mx-auto" onClick={handleImageClick}/>
            <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageChange} style={{ display: "none" }}/>
            <button onClick={() => navigate('/settings')} className=" w-full mt-4 py-2 px-4 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition">Edit Profile</button>
            <h2 className="text-2xl font-bold mt-4">{userName}</h2>
            <p className="text-gray-500 mb-4">@{userName.toLowerCase().replace(/\s+/g, '')}</p>
            
            <div className="flex justify-around mt-4 text-sm border-t pt-4">
              <div onClick={() => openUserListModal('following')} className="cursor-pointer p-2 rounded-md hover:bg-gray-100 transition-colors">
                <strong>{dummyFollowing.length}</strong>
                <div className="text-gray-500">Following</div>
              </div>
              <div className="p-2">
                <strong>{totalLikes}</strong>
                <div className="text-gray-500">Likes</div>
              </div>
              <div onClick={() => openUserListModal('followers')} className="cursor-pointer p-2 rounded-md hover:bg-gray-100 transition-colors">
                <strong>{dummyFollowers.length}</strong>
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

        {/* Gönderi Listesi */}
        <div className="md:col-span-2">
            <h2 className="text-xl font-bold mb-4 bg-white p-4 shadow rounded-lg">My Posts</h2>
            {userPosts.length > 0 ? (
                userPosts.map((post) => (
                    <PostCard key={post.id} {...post} onDelete={handleDeletePost} onToggleLike={toggleLike} onAddComment={addComment} onDeleteComment={handleDeleteComment} onAddReply={handleAddReply} />
                ))
            ) : (
                <div className="text-center text-gray-500 mt-5 bg-white rounded-lg pt-20 pb-20 shadow-md">
                    <p className="text-lg font-semibold">You haven't shared any posts yet.</p>
                </div>
            )}
        </div>
      </div>

      {/* YENİ CustomModal KULLANIMI */}
      <CustomModal
        isOpen={isUserListModalOpen}
        onClose={() => setUserListModalOpen(false)}
        title={modalData.title}
      >
        {/* Modal'ın gövdesine (children) kullanıcı listesi JSX'ini koyuyoruz */}
        <div className="space-y-4">
            {modalData.users.length > 0 ? (
              modalData.users.map(user => (
                <div key={user.id} className="flex items-center">
                  <img src={user.avatar} onError={(e) => { e.currentTarget.src = 'https://placehold.co/100x100?text=??' }} alt={user.name} className="w-12 h-12 rounded-full mr-4" />
                  <div className="flex flex-col">
                    <span className="font-semibold text-gray-800">{user.name}</span>
                    <span className="text-sm text-gray-500">@{user.username}</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 mt-8">No users to display.</p>
            )}
        </div>
      </CustomModal>
    </>
  );
};

export default Profile;
