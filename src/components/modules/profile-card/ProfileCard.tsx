import { FC, useEffect, useRef, useState } from "react";

const ProfileCard: FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);

  useEffect(() => {
    const savedImage = localStorage.getItem("profileImage");
    if (savedImage) {
      setProfileImage(savedImage);
    }
  }, []);

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


  return (
    <div className="bg-white p-6 shadow rounded-lg text-center">
      <img
        src={profileImage || "/profileIcon.png"}
        alt="Profile"
        className="w-20 h-20 rounded-full border border-gray-300 cursor-pointer mx-auto mb-4"
        onClick={handleImageClick}
      />
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleImageChange}
        style={{ display: "none" }}
      />
      <h2 className="text-xl font-semibold">Ali Rıza</h2>
      <p className="text-gray-500">@aliriza</p>
      <p className="text-sm mt-2">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec
        odio. Praesent libero.
      </p>
      <div className="flex justify-around mt-4 text-sm">
        <div>
          <strong>160</strong>
          <div className="text-gray-500">Following</div>
        </div>
        <div>
          <strong>8973</strong>
          <div className="text-gray-500">Followers</div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
