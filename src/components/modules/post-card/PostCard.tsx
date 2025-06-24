import { FC, useEffect, useState } from "react";
import { EllipsisHorizontalIcon } from "@heroicons/react/20/solid";
import GenericModal from "../../base/GenericModal";
import { Comment } from "../../../types/types";

/**
 * Verilen bir tarih metnini "5 dakika önce", "2 saat önce" gibi
 * kullanıcı dostu bir formata çeviren yardımcı fonksiyon.
 */
const formatTimeAgo = (dateString: string) => {
  if (!dateString) return "";
  const now = new Date();
  const postDate = new Date(dateString);
  const seconds = Math.floor((now.getTime() - postDate.getTime()) / 1000);
  if (seconds < 60) return `just now`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} day${days > 1 ? 's' : ''} ago`;
  const options: Intl.DateTimeFormatOptions = { month: 'long', day: 'numeric' };
  return new Intl.DateTimeFormat('en-US', options).format(postDate);
};

/**
 * Hem ana yorumları hem de yanıtları göstermek için kullanılan
 * küçük ve akıllı bir alt bileşen. Bu, kod tekrarını önler.
 */
const CommentView = ({ comment, type = 'comment' }: { comment: any, type?: 'comment' | 'reply' }) => {
  const [commenterAvatar, setCommenterAvatar] = useState('/profileIcon.png');

  useEffect(() => {
    // Yorumu yapan kişinin adına göre doğru avatarı localStorage'dan bulur.
    // Bu sayede hafıza (storage) sorunu yaşamayız.
    if (comment.name === 'Anonymous') {
      setCommenterAvatar('/anonim.png');
    } else {
      const userImage = localStorage.getItem("profileImage");
      setCommenterAvatar(userImage || '/profileIcon.png');
    }
  }, [comment.name]);

  const sizeClasses = type === 'comment' ? 'w-8 h-8' : 'w-6 h-6';

  return (
    <div className="flex items-start">
      <img src={commenterAvatar} alt={comment.name} className={`${sizeClasses} rounded-full mr-3`} />
      <div className="flex flex-col">
        <div className="flex items-center space-x-2">
          <span className={`font-semibold text-gray-800 ${type === 'reply' ? 'text-xs' : ''}`}>{comment.name}</span>
          <span className="text-xs text-gray-400">•</span>
          <span className="text-xs text-gray-500">{formatTimeAgo(comment.createdAt)}</span>
        </div>
        <p className="text-gray-600 mt-1">{comment.text}</p>
      </div>
    </div>
  );
};


/**
 * Ana PostCard bileşeninin dışarıdan alacağı verilerin (props) tip tanımı.
 */
interface PostCardProps {
  id: string;
  name: string;
  text: string;
  commentCount?: number;
  likeCount?: number;
  isLiked?: boolean;
  audioUrl?: string;
  imageUrl?: string;
  createdAt: string;
  comments: Comment[];
  onToggleLike?: (id: string) => void;
  onAddComment?: (id: string, comment: string) => void;
  onDelete?: (id: string) => void;
  onDeleteComment?: (postId: string, commentId: string) => void;
  onAddReply?: (postId: string, parentCommentId: string, text: string) => void;
}

/**
 * Tek bir gönderiyi tüm etkileşimleriyle birlikte gösteren ana bileşen.
 */
const PostCard: FC<PostCardProps> = ({
  id, name, text, createdAt, commentCount = 0, likeCount = 0, isLiked = false,
  onToggleLike, onAddComment, onDelete, comments = [], audioUrl, imageUrl,
  onDeleteComment, onAddReply
}) => {
  // Bileşenin kendi iç durumlarını (state) yönettiği bölüm
  const [userAvatar, setUserAvatar] = useState<string>("/profileIcon.png");
  const [commentText, setCommentText] = useState("");
  const [isCommentOpen, setIsCommentOpen] = useState(false);
  const [showFullText, setShowFullText] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState<{ postId: string; commentId: string; } | null>(null);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");

  // Gönderiyi paylaşan kişinin avatarını bulan ve güncelleyen bölüm
  useEffect(() => {
    if (name !== "Anonymous") {
      const savedImage = localStorage.getItem("profileImage");
      if (savedImage) setUserAvatar(savedImage);
    } else {
      setUserAvatar("/anonim.png");
    }
  }, [name]);
  
  // Yanıt gönderme işlemini yöneten fonksiyon
  const handleReplySubmit = (parentCommentId: string) => {
    if (!replyText.trim() || !onAddReply) return;
    onAddReply(id, parentCommentId, replyText);
    setReplyText("");
    setReplyingTo(null);
  };
  
  // Diğer yardımcı fonksiyonlar
  const toggleText = () => setShowFullText(p => !p);
  const handleComment = () => { if(commentText.trim()) { onAddComment?.(id, commentText); setCommentText(""); }};
  const handleDelete = () => { setIsModalOpen(false); onDelete?.(id); };

  return (
    <div className="bg-white p-4 shadow rounded-lg mb-4 relative">
      {/* Post Üst Bilgisi */}
      <div className="flex items-center mb-2">
        <img src={userAvatar} alt={name} className="w-10 h-10 rounded-full mr-3" />
        <div className="flex flex-col">
          <span className="font-semibold">{name}</span>
          <span className="text-xs text-gray-500">{formatTimeAgo(createdAt)}</span>
        </div>
        <div className="ml-auto relative">
          <button onClick={() => setIsMenuOpen(p => !p)} className="p-1 hover:bg-gray-100 rounded-full">
            <EllipsisHorizontalIcon className="w-5 h-5 text-gray-500" />
          </button>
          {isMenuOpen && (
            <div className="absolute right-0 mt-2 w-28 bg-white border rounded shadow z-50">
              <button onClick={() => { setIsMenuOpen(false); setIsModalOpen(true); }} className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-100">
                🗑️ Delete
              </button>
            </div>
          )}
        </div>
      </div>
      
      {/* Post İçeriği */}
      {text && (<p className="mb-2">{showFullText ? text : text.slice(0, 300) + (text.length > 300 ? '...' : '')}{text.length > 300 && (<div onClick={toggleText} className="mt-2 text-blue-600 text-sm cursor-pointer">{showFullText ? "Show less" : "Show more"}</div>)}</p>)}
      {audioUrl && (<audio controls className="w-full mb-2"><source src={audioUrl} type="audio/mpeg" />Your browser does not support audio playback.</audio>)}
      {imageUrl && (<a href={imageUrl} target="_blank" rel="noopener noreferrer"><img src={imageUrl} alt="Post content" className="w-full max-h-[400px] object-contain rounded-lg mb-2 hover:opacity-90 transition"/></a>)}

      {/* Post Eylemleri */}
      <div className="flex space-x-4 text-gray-500 mb-2">
        <button onClick={() => setIsCommentOpen(p => !p)}>💬 {commentCount}</button>
        <button className={`focus:outline-none flex items-center space-x-1 ${isLiked ? "text-red-500" : "text-gray-400"}`} onClick={() => onToggleLike?.(id)}>
          <span className={isLiked ? "" : "text-2xl leading-none"}>{isLiked ? "❤️" : "♡"}</span>
          <span className="text-sm">{likeCount}</span>
        </button>
      </div>

      {/* Yorumlar Bölümü */}
      {isCommentOpen && (
        <>
          <div className="flex space-x-2 mb-2">
            <input type="text" placeholder="Write a comment..." value={commentText} onChange={(e) => setCommentText(e.target.value)} className="flex-1 p-1 border border-gray-300 rounded"/>
            <button onClick={handleComment} disabled={!commentText.trim()} className={`px-2 rounded text-white transition ${commentText.trim() ? "bg-blue-500 hover:bg-blue-600" : "bg-gray-300 cursor-not-allowed"}`}>Post</button>
          </div>

          <div className="space-y-4 text-sm text-gray-700 max-h-96 overflow-y-auto border-t mt-4 pt-4 pr-2">
            {comments.map((comment) => (
              <div key={comment.id}>
                <div className="flex items-start justify-between">
                  <CommentView comment={comment} type="comment" />
                  <button onClick={() => setCommentToDelete({ postId: id, commentId: comment.id })} className="text-red-500 hover:text-red-700 text-xs font-semibold ml-2 flex-shrink-0" title="Delete Comment">🗑️</button>
                </div>
                <button onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)} className="text-xs font-bold text-gray-500 hover:text-gray-800 mt-1 text-left ml-11">
                  Reply
                </button>

                {replyingTo === comment.id && (
                  <div className="ml-11 mt-2 flex items-center space-x-2">
                    <input type="text" placeholder={`Reply to ${comment.name}...`} value={replyText} onChange={(e) => setReplyText(e.target.value)} className="flex-1 p-2 text-xs border border-gray-300 rounded" autoFocus/>
                    <button onClick={() => handleReplySubmit(comment.id)} className="px-3 py-2 text-xs rounded text-white bg-blue-500 hover:bg-blue-600">Reply</button>
                  </div>
                )}
                
                {comment.replies && comment.replies.length > 0 && (
                  <div className="ml-11 mt-3 space-y-3 border-l-2 border-gray-200 pl-4">
                    {comment.replies.map(reply => (
                       <CommentView key={reply.id} comment={reply} type="reply" />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}

      {/* Modallar */}
      <GenericModal isOpen={isModalOpen} title="Delete Post" message="Are you sure you want to delete this post?" onCancel={() => setIsModalOpen(false)} onConfirm={handleDelete} confirmText="Delete"/>
      <GenericModal isOpen={commentToDelete !== null} title="Delete Comment" message="Are you sure you want to delete this comment?" onCancel={() => setCommentToDelete(null)} onConfirm={() => { if (commentToDelete) { onDeleteComment?.(commentToDelete.postId, commentToDelete.commentId); setCommentToDelete(null); }  } } confirmText="Delete"/>
    </div>
  );
};

export default PostCard;
