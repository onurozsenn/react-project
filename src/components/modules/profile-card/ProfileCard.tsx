import { FC } from "react";

const ProfileCard: FC = () => {
  return (
    <div className="bg-white p-6 shadow rounded-lg text-center">
      <img src="/profileIcon.png" alt="Profile" className="w-20 h-20 rounded-full mx-auto mb-4" />
      <h2 className="text-xl font-semibold">Ali Rıza</h2>
      <p className="text-gray-500">@aliriza</p>
      <p className="text-sm mt-2">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero.</p>
      <div className="flex justify-around mt-4 text-sm">
        <div>
          <strong>0</strong>
          <div className="text-gray-500">Following</div>
        </div>
        <div>
          <strong>0</strong>
          <div className="text-gray-500">Followers</div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;