import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import ProfileDropdown from './ProfileDropdown.tsx';
import CartDropdown from './../Cart/CartDropdown.tsx';
import Logo from "./../Misc/Logo.tsx";
import { useSearch } from "../../contexts/SearchContext.tsx"; // Import the search context

// Define a type for the navigation links
interface NavLink {
  name: string;
  href: string;
}

// Sample navigation links
const navLinks: NavLink[] = [
  { name: 'Merch', href: '/catalog/products' },
  { name: 'Contact', href: '/contact' }
];

const Navbar: React.FC = () => {
  const { searchQuery, handleSearch } = useSearch(); // Use the SearchContext
  const [searchTerm, setSearchTerm] = useState<string>(searchQuery || ''); // Local state for input
  const location = useLocation();

  // Enable search only on specific pages
  const isSearchEnabled = location.pathname === '/catalog/products';

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    console.log('Search term:', value);
    handleSearch(value); // Update the search context globally
  };

  return (
    <nav className="bg-cream p-10 pb-7 text-sm">
      <ul className="flex flex-row text-center items-center">
        
      {/* DJ WAMP Logo */}
      <li className="basis-[24%] flex justify-start">
        <NavLink to="/catalog/products">
          <Logo size={25} />
        </NavLink>
      </li>

        {/* Page Links */}
        <li className="basis-[50%] pr-[90px]">
          <ul className="flex flex-row text-center w-full">
            {navLinks.map((link, index) => (
              <NavLink 
                to={link.href}
                key={link.name}
                className={`py-1 hover:text-white hover:font-medium hover:bg-camel flex-grow border-y border-l border-camel ${
                  index === navLinks.length - 1 ? 'border-r' : ''
                } flex items-center justify-center`}
              >
                <li className="w-full h-full">
                  {link.name}
                </li>
              </NavLink>
            ))}
          </ul>
        </li>

        {/* Shopping Cart */}
        <li className="basis-[3%] flex justify-end items-center">
          <CartDropdown/>
        </li>

        {/* Profile Dropdown */}
        <li className="basis-[3%] flex justify-end items-center">
          <ProfileDropdown/>
        </li>

        {/* Search Bar */}
        <li className="basis-[20%] flex items-center text-black space-x-2 pl-[30px]">
          <span>Search</span>
          <input
            type="text"
            className="border border-camel bg-transparent p-1 flex-grow w-full text-black placeholder-coffee"
            value={searchTerm}
            onChange={handleInputChange}
            disabled={!isSearchEnabled} // Disable input if not on the allowed page
            placeholder={!isSearchEnabled ? 'Search disabled on this page' : 'Product Name'}
          />
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;

