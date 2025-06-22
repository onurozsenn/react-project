import { FC, useState } from "react";
import { EllipsisHorizontalIcon } from "@heroicons/react/20/solid";
import GenericModal from "../../base/GenericModal";

interface PostCardProps {
  id: string;
  name: string;
  avatar?: string;
  text: string;
  commentCount?: number;
  likeCount?: number;
  isLiked?: boolean;
  audioUrl?: string;
  imageUrl?: string;
  onToggleLike?: (id: string) => void;
  onAddComment?: (id: string, comment: string) => void;
  onDelete?: (id: string) => void; // <- silme işlemi için eklendi
  comments?: { id: string; text: string; name: string; avatar?: string; }[];
  onDeleteComment?: (postId: string, commentId: string) => void;

  
}

const PostCard: FC<PostCardProps> = ({
  id,
  name,
  avatar = "/logo192.png",
  text,
  commentCount = 0,
  likeCount = 0,
  isLiked = false,
  onToggleLike,
  onAddComment,
  onDelete,
  comments = [],
  audioUrl,
  imageUrl,
  onDeleteComment,
}) => {
  const [commentText, setCommentText] = useState("");
  const [isCommentOpen, setIsCommentOpen] = useState(false);
  const [showFullText, setShowFullText] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState<{ postId: string; commentId: string; } | null>(null);

  const maxLength = 300;
  const isLongText = text.length > maxLength;
  const displayText = showFullText
    ? text
    : isLongText
    ? text.slice(0, maxLength) + "..."
    : text;

  const toggleText = () => setShowFullText((prev) => !prev);

  const handleComment = () => {
    if (!commentText.trim()) return;
    onAddComment?.(id, commentText);
    setCommentText("");
  };

  const handleDelete = () => {
    setIsModalOpen(false);
    onDelete?.(id); // gönderi silinecekse parent component'e bildir
  };

  return (
    <div className="bg-white p-4 shadow rounded-lg mb-4 relative">
      {/* Üst Bilgi */}
      <div className="flex items-center mb-2">
        {avatar && (
          <img
            src={avatar}
            alt={name}
            className="w-10 h-10 rounded-full mr-2"
          />
        )}
        <span className="font-semibold">{name}</span>

        <div className="ml-auto relative">
          <button
            onClick={() => setIsMenuOpen((prev) => !prev)}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            <EllipsisHorizontalIcon className="w-5 h-5 text-gray-500" />
          </button>

          {isMenuOpen && (
            <div className="absolute right-0 mt-2 w-28 bg-white border rounded shadow z-50">
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  setIsModalOpen(true);
                }}
                className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
              >
                🗑️ Sil
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Yazı */}
      {text && (
        <p className="mb-2">
          {displayText}
          {isLongText && (
            <div
              onClick={toggleText}
              className="mt-2 text-blue-600 text-sm cursor-pointer"
            >
              {showFullText ? "Daha az göster" : "Daha fazla göster"}
            </div>
          )}
        </p>
      )}

      {/* Ses */}
      {audioUrl && (
        <audio controls className="w-full mb-2">
          <source src={audioUrl} type="audio/mpeg" />
          Your browser does not support audio playback.
        </audio>
      )}

      {/* Görsel */}
      {imageUrl && (
        <a href={imageUrl} target="_blank" rel="noopener noreferrer">
          <img
            src={imageUrl}
            alt="Post content"
            className="w-full max-h-[400px] object-contain rounded-lg mb-2 hover:opacity-90 transition"
          />
        </a>
      )}

      {/* Beğeni - Yorum */}
      <div className="flex space-x-4 text-gray-500 mb-2">
        <button onClick={() => setIsCommentOpen((prev) => !prev)}>
          💬 {commentCount}
        </button>
        <button
          className={`focus:outline-none flex items-center space-x-1 ${
            isLiked ? "text-red-500" : "text-gray-400"
          }`}
          onClick={() => onToggleLike?.(id)}
        >
          <span className={isLiked ? "" : "text-2xl leading-none"}>
            {isLiked ? "❤️" : "♡"}
          </span>
          <span className="text-sm">{likeCount}</span>
        </button>
      </div>

      {/* Yorum Alanı */}
      {isCommentOpen && (
        <>
          <div className="flex space-x-2 mb-2">
            <input
              type="text"
              placeholder="Yorum yaz..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="flex-1 p-1 border border-gray-300 rounded"
            />
            <button
              onClick={handleComment}
              disabled={!commentText.trim()}
              className={`px-2 rounded text-white transition 
                ${
                  commentText.trim()
                    ? "bg-blue-500 hover:bg-blue-600"
                    : "bg-gray-300 cursor-not-allowed"
                }`}
            >
              Gönder
            </button>
          </div>

          <div className="space-y-2 text-sm text-gray-700 max-h-48 overflow-y-auto border-t mt-2 pt-2 pr-2">
            {comments.map((comment) => (
              <div 
                key={comment.id} 
                className="flex items-start ">

                  {/* Sol taraf (Avatar ve Yazı) */}
                  <div className="flex items-start">
                    <img 
                      src={comment.avatar || "/profileIcon.png"}
                      alt={comment.name}
                      className="w-8 h-8 rounded-full mr-3"
                    />
                  </div>
                <div className="flex flex-col">
                  <span className="font-semibold text-gray-800">{comment.name}</span>
                  <p className="text-gray-600">{comment.text}</p>
                </div>
                <button
                  onClick={() => setCommentToDelete({ postId: id, commentId: comment.id })}
                  className="text-red-500 hover:text-red-700 text-xs font-semibold ml-auto"
                  title="Yorumı Sil"
                >🗑️
                </button>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Gönderi silme modalı */}
      <GenericModal
        isOpen={isModalOpen}
        title="Gönderiyi Sil"
        message="Bu gönderiyi silmek istediğine emin misin?"
        onCancel={() => setIsModalOpen(false)}
        onConfirm={handleDelete}
      />

      {/* Yorum silme modalı */}
        <GenericModal
        isOpen={commentToDelete !== null}
        title="Yorumu Sil"
        message="Bu yorumu silmek istediğine emin misin?"
        onCancel={() => setCommentToDelete(null)}
        onConfirm={() => {
          if (commentToDelete) {
            onDeleteComment?.(commentToDelete.postId, commentToDelete.commentId);
            setCommentToDelete(null);
          }
        }}
      />
    </div>
  );
};

export default PostCard;
