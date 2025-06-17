import { FC, useState } from "react";

type PostFormProps = {
  avatar?: string;
  name?: string;
};

const PostForm: FC<PostFormProps> = ({ avatar, name }) => {
  const [text, setText] = useState("");

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm my-2">
      <div className="flex items-center mb-2">
        <img src={avatar || "/logo192.png"} className="w-10 h-10 rounded-full mr-2" alt="avatar" />
        <span className="font-semibold">{name || "Anonim"}</span>
      </div>
      <p className="text-gray-700">{text}</p>
      <div className="flex gap-4 text-gray-500 text-sm mt-2">
        <span>💬 0</span>
        <span>❤️ 0</span>
      </div>
    </div>
  );
};

export default PostForm;
