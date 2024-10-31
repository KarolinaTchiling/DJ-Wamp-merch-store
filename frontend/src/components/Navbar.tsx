import React, { useState } from 'react';
import { Link } from 'react-router-dom'; 
import cart from '../assets/cart.svg';  
import ProfileDropdown from './ProfileDropdown';

// Define a type for the navigation links
interface NavLink {
    name: string;
    href: string;
}
  
// Sample navigation links
const navLinks: NavLink[] = [
  { name: 'Merch', href: '/' },
  { name: 'Tour Dates', href: '/tour' },
  { name: 'Contact', href: '/contact' }
];
  
const Navbar: React.FC = () => {
  return (
    <nav className="bg-tea-800 p-10 text-sm"> 
      <ul className="flex flex-row text-center items-center">
        
        {/* DJ WAMP Logo */}
        <li className="basis-[24%] flex justify-start text-2xl font-['Lexend_Zetta']">DJ WAMP</li>

        {/* Page Links */}
        <li className="basis-[50%] pr-[90px]">
          <ul className="flex flex-row text-center w-full">
              {navLinks.map((link, index) => (
                <li
                    key={link.name}
                    className={`hover:text-white hover:font-medium hover:bg-camel flex-grow border-y border-l border-camel py-[5px] ${
                      index === navLinks.length - 1 ? 'border-r' : ''
                    }`}>
                      <Link to={link.href} className="flex items-center justify-center w-full h-full">
                        {link.name}
                      </Link>
                </li>
              ))}
            </ul>
        </li>

        {/* Shopping Cart */}
        <li className="basis-[3%] flex justify-end items-center">
            <img src={cart} alt="Shopping Cart" />
        </li>

        {/* Profile Dropdown */}
        <li className="basis-[3%] flex justify-end items-center">
            <ProfileDropdown />
        </li>

        {/* Search Bar */}
        <li className="basis-[20%] flex items-center space-x-2 pl-[30px]">
          <span>Search</span>
          <input
            type="text"
            className="border border-camel bg-transparent p-1 flex-grow w-full"
          />
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
