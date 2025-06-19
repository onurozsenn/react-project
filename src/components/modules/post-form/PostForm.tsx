import { FC, useState,FormEvent } from "react";

interface PostFormProps {
  onAddPost: (text: string, isAnonymous: boolean) => void;
}

const PostForm: FC<PostFormProps> = ({onAddPost}) => {
  const [text, setText] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if(!text.trim()) return;
    onAddPost(text,isAnonymous);
    setText("");
    setIsAnonymous(false);  
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 shadow rounded-lg mb-4">
      <input
        type = "text"
        placeholder="What's on your mind?"
        className="w-full p-2 border border-gray-300 rounded mb-2"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <div className="flex items-center mb-2">
        <input
          type="checkbox"
          id="anonymous"
          checked={isAnonymous}
          onChange={(e) => setIsAnonymous(e.target.checked)}
        />
        <label htmlFor="anonymous" className="text-sm text-gray-600"> Anonim olarak paylaş </label>  
      </div>
      <button
      type="submit"
      className="bg-blue-600 text-white px-4 py-2 rounded">
        Post
      </button>
    </form>
  );
};

export default PostForm;
