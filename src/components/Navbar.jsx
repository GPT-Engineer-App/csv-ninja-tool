import React from 'react';
import { Link } from 'react-router-dom';
import { navItems } from '../nav-items';

const Navbar = () => {
  return (
    <nav className="bg-gray-900 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold text-blue-400">CSV Editor</Link>
        <ul className="flex space-x-4">
          {navItems.map((item) => (
            <li key={item.to}>
              <Link to={item.to} className="hover:text-blue-400 transition-colors duration-200 flex items-center">
                {item.icon}
                <span className="ml-2">{item.title}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;