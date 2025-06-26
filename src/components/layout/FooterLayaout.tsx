import { FC } from 'react';

const Footer: FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-800 text-white mt-auto">
      <div className="max-w-5xl mx-auto py-6 px-5 text-center">
        <p className="text-sm text-gray-400">
          &copy; {currentYear} Postegram. All Rights Reserved.
        </p>
        <div className="flex justify-center space-x-6 mt-4">
          <a href="#" className="text-gray-400 hover:text-white transition">Privacy Policy</a>
          <a href="#" className="text-gray-400 hover:text-white transition">Terms of Service</a>
          <a href="#" className="text-gray-400 hover:text-white transition">Contact</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;