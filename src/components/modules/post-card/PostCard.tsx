import { FC, useState } from "react";

interface PostCardProps {
  id: string;
  name: string;
  avatar?: string;
  text: string;
  commentCount?: number;
  likeCount?: number;
  isLiked?: boolean;
  onToggleLike?: (id: string) => void;
  onAddComment?: (id: string, comment: string) => void;
  comments?: string[];
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
  comments = [],
}) => {
  const [commentText, setCommentText] = useState("");
  const [isCommentOpen, setIsCommentOpen] = useState(false); // ✅ yorum kutusu açık mı

  const handleComment = () => {
    if (!commentText.trim()) return;
    onAddComment?.(id, commentText);
    setCommentText("");
  };

  return (
    <div className="bg-white p-4 shadow rounded-lg mb-4">
      <div className="flex items-center mb-2">
        {avatar && (
          <img
            src={avatar}
            alt={name}
            className="w-10 h-10 rounded-full mr-2"
          />
        )}
        <span className="font-semibold">{name}</span>
      </div>
      <p className="mb-2">{text}</p>

      {/* Beğeni ve yorum yap butonları */}
      <div className="flex space-x-4 text-gray-500 mb-2">
        <button
          className=""
          onClick={() => setIsCommentOpen((prev) => !prev)}
        >
          💬 {commentCount}
        </button>
        <button
          className={`focus:outline-none ${isLiked ? "text-red-500" : "text-gray-400"}`}
          onClick={() => onToggleLike?.(id)}
        >
          {isLiked ? "❤️" : "♡"} {likeCount}
        </button>
      </div>

      {/* Yorum kutusu ve yorum listesi sadece açıksa göster */}
      {isCommentOpen && (
        <>
          {/* Yorum yazma alanı */}
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
              ${commentText.trim() 
                ? "bg-blue-500 hover:bg-blue-600" 
                : "bg-gray-300 cursor-not-allowed"}`}
            >
              Gönder
            </button>
          </div>

          {/* Yorum listesi */}
          <div className="space-y-1 text-sm text-gray-700 max-h-32 overflow-y-auto border-t mt-2 pt-2 pr-2">
            {comments.map((comment, i) => (
              <div key={i} className="border-t pt-1">
                {comment}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default PostCard;
