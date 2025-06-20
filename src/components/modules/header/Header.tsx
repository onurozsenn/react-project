import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Header = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setIsDropdownOpen(false);
    }
  };

  const handleLogout = () => {
    navigate("/");
  };

  const handleLogoClick = () => {
    navigate("/dashboard");
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const savedImage = localStorage.getItem("profileImage");
    if (savedImage) {
      setProfileImage(savedImage);
    }
  }, []);

  useEffect(() => {
    const savedImage = localStorage.getItem("profileImage");
    if (savedImage) {
      setProfileImage(savedImage);
    }

    const handleProfileUpdate = () => {
      const newImage = localStorage.getItem("profileImage");
      setProfileImage(newImage);
    };

    window.addEventListener("profileImageUpdated", handleProfileUpdate);
    return () => {
      window.removeEventListener("profileImageUpdated", handleProfileUpdate);
    };
  }, []);


  const isProfilePage = location.pathname === "/profile";

  return (
    <header className="bg-[#0054C2] text-white px-4 py-3 flex justify-between items-center relative">
      <img
        onClick={handleLogoClick}
        src="/postegram-logo.png"
        alt="Logo"
        className="w-[180px] cursor-pointer"
      />

      <div className="relative" ref={dropdownRef}>
        <img
          src={profileImage || "/profileIcon.png"}
          alt="Profile"
          className="w-14 h-14 rounded-full border border-gray-300 cursor-pointer p-1"
          onClick={toggleDropdown}
        />
        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 pt-2 pb-2 w-44 bg-gray-50 text-black rounded-lg shadow-lg z-50">
            {!isProfilePage && (
              <button
                className="block w-full text-left px-4 py-2 hover:bg-gray-100 hover:rounded-lg"
                onClick={() => navigate("/profile")}
              >
                See Profile
              </button>
            )}
            <button
              className="block w-full text-left px-4 py-2 hover:bg-gray-100 hover:rounded-lg"
              onClick={handleLogout}
            >
              Log Out
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
