import {NavLink} from 'react-router-dom'
import React from 'react'

interface NavBarProps {
  onSettingsClick: () => void;
}

const NavBar: React.FC<NavBarProps> = ({ onSettingsClick }) => {
  return (
    <nav className="flex justify-between items-center p-4 bg-gray-800">
      {/* Settings Button */}
      <button 
        onClick={onSettingsClick} 
        className="m-3 p-4 text-xl bg-blue-400 hover:bg-blue-500 rounded-md font-medium text-white"
      >
        Settings
      </button>

      {/* Navigation Links */}
      <div className="flex gap-5">
        <NavLink
          className="m-3 p-4 text-xl bg-blue-400 hover:bg-blue-500 rounded-md font-medium text-white"
          to={'/'}
        >
          All Entries
        </NavLink>
        <NavLink
          className="m-3 p-4 text-xl bg-blue-400 hover:bg-blue-500 rounded-md font-medium text-white"
          to={'/create'}
        >
          New Entry
        </NavLink>
      </div>
    </nav>
  );
};
export default NavBar;