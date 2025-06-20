import { FC, useState, FormEvent } from "react";
import AudioRecorder from "../../base/AudioRecorder";
import ImageUploader from "../../base/ImageUploader";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/20/solid";

interface PostFormProps {
  onAddPost: (text: string, isAnonymous: boolean, mediaFile?: File | null) => void;
}

const POST_TYPES = {
  TEXT: "Text Post",
  AUDIO: "Voice Post",
  IMAGE: "Image Post",
};

const PostForm: FC<PostFormProps> = ({ onAddPost }) => {
  const [text, setText] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [postType, setPostType] = useState<keyof typeof POST_TYPES | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (postType === "TEXT" && !text.trim()) return;
    if (postType === "AUDIO" && !audioFile) return;
    if (postType === "IMAGE" && !imageFile) return;

    const mediaFile = postType === "AUDIO" ? audioFile : postType === "IMAGE" ? imageFile : null;
    onAddPost(text, isAnonymous, mediaFile);

    setText("");
    setIsAnonymous(false);
    setAudioFile(null);
    setImageFile(null);
    setPostType(null);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-[#fafafa] p-4 shadow rounded-lg mb-4"
      aria-label="Post paylaşım formu"
    >
      {/* Post Türü Seçimi */}
      <div className="relative mb-3">
        <button
          type="button"
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="w-full border border-gray-300 rounded px-3 py-2 text-left bg-white hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
        >
          <div className="flex justify-between items-center">
            <span>{postType ? POST_TYPES[postType] : "What kind of post do you want to share?"}</span>
            {dropdownOpen ? (
              <ChevronUpIcon className="h-5 w-5 text-gray-500" />
            ) : (
              <ChevronDownIcon className="h-5 w-5 text-gray-500" />
            )}
          </div>
        </button>

        {dropdownOpen && (
          <div className="absolute mt-1 w-full bg-white shadow-md rounded border border-gray-200 z-10">
            {Object.entries(POST_TYPES).map(([key, label]) => (
              <div
                key={key}
                className="px-4 py-2 hover:bg-blue-100 cursor-pointer text-sm"
                onClick={() => {
                  setPostType(key as keyof typeof POST_TYPES);
                  setDropdownOpen(false);
                }}
              >
                {label}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Text Input */}
      {postType === "TEXT" && (
        <input
          type="text"
          placeholder="What's on your mind?"
          className="w-full p-2 border border-gray-300 rounded mb-2"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      )}

      {/* Audio Recorder */}
      {postType === "AUDIO" && (
        <AudioRecorder
          existingFile={audioFile}
          onRecordingComplete={(file: File) => setAudioFile(file)}
          onRecordingDelete={() => setAudioFile(null)}
        />
      )}

      {/* Image Uploader */}
      {postType === "IMAGE" && (
        <ImageUploader
          existingFile={imageFile}
          onImageSelect={(file: File) => setImageFile(file)}
          onImageDelete={() => setImageFile(null)}
        />
      )}

      {/* Anonimlik */}
      {postType && (
        <div className="flex items-center mb-2">
          <label htmlFor="anonymous" className="flex items-center cursor-pointer mt-2">
            <div className="relative">
              <input
                type="checkbox"
                id="anonymous"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
                className="appearance-none h-5 w-5 border border-gray-400 rounded-md checked:bg-blue-600 checked:border-blue-600 transition-all duration-200 peer"
              />
              <svg
                className="h-4 w-4 text-white absolute top-[2px] right-[2px] pointer-events-none opacity-0 peer-checked:opacity-100"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                viewBox="0 0 24 24"
              >
                <path d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div className="ml-2 text-sm text-gray-700 mb-1">Share anonymously</div>
          </label>
        </div>
      )}

      {/* Gönder Butonu */}
      {postType && (
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={
              (postType === "TEXT" && !text.trim()) ||
              (postType === "AUDIO" && !audioFile) ||
              (postType === "IMAGE" && !imageFile)
            }
            className={`px-5 py-2 rounded-md text-white transition 
              ${(postType === "TEXT" && text.trim()) ||
                (postType === "AUDIO" && audioFile) ||
                (postType === "IMAGE" && imageFile)
                ? "bg-[#286CBF] opacity-100 cursor-pointer"
                : "bg-[#286CBF] opacity-50 cursor-not-allowed"
              }`}
          >
            Post
          </button>
        </div>
      )}
    </form>
  );
};

export default PostForm;
