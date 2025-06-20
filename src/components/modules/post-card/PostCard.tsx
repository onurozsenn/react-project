import { FC, useState } from "react";

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
  audioUrl,
  imageUrl
}) => {
  const [commentText, setCommentText] = useState("");
  const [isCommentOpen, setIsCommentOpen] = useState(false);
  const [showFullText, setShowFullText] = useState(false);

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

      {audioUrl && (
        <audio controls className="w-full mb-2">
          <source src={audioUrl} type="audio/mpeg" />
          Your browser does not support audio playback.
        </audio>
      )}

      {imageUrl && (
        <a href={imageUrl} target="_blank" rel="noopener noreferrer">
          <img
            src={imageUrl}
            alt="Post content"
            className="w-full max-h-[400px] object-contain rounded-lg mb-2 hover:opacity-90 transition"
          />
        </a>
      )}


      <div className="flex space-x-4 text-gray-500 mb-2">
        <button onClick={() => setIsCommentOpen((prev) => !prev)}>
          💬 {commentCount}
        </button>
        <button
          className={`focus:outline-none flex items-center space-x-1 ${isLiked ? "text-red-500" : "text-gray-400"}`}
          onClick={() => onToggleLike?.(id)}
        >
          <span className={isLiked ? "" : "text-2xl leading-none"}>
            {isLiked ? "❤️" : "♡"}
          </span>
          <span className="text-sm">{likeCount}</span>
        </button>
      </div>

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
                ${commentText.trim()
                  ? "bg-blue-500 hover:bg-blue-600"
                  : "bg-gray-300 cursor-not-allowed"
                }`}
            >
              Gönder
            </button>
          </div>

          <div className="space-y-1 text-sm text-gray-700 max-h-32 overflow-y-auto border-t mt-2 pt-2 pr-2">
            {comments.map((comment, i) => (
              <div key={i} className="border-b pb-4 pt-3">
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
