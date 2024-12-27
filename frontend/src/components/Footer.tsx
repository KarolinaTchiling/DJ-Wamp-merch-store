import React from 'react';
import InstagramIcon from '../assets/Instagram.svg'
import LinkedIncon from '../assets/LinkedIn.svg'
import { NavLink } from 'react-router-dom';

const Footer: React.FC = () =>{
    return(
        <footer className={"bg-beige p-10 flex flex-row gap-4 justify-center border-t border-t-camel"}>
            <div className={"flex-1"}>
                <p>© DJ WAMP 2024</p>
            </div>
            <div className={"flex-1 flex flex-col gap-1"}>
                <p>Connect with us</p>
                <div className={"flex flex-row gap-2"}>
                <a href={"https://instagram.com"}>
                    <img
                    src={InstagramIcon}
                    alt={"Instagram icon"}/>
                </a>
                <a href={"https://linkedin.com"}>
                    <img
                        src={LinkedIncon}
                        alt={"LinkedIn icon"}/>
                </a>
                </div>
            </div>
            <div className={"flex-1 flex flex-col gap-1"}>
                <p className={"hover:text-camel hover:font-bold"}>FAQs</p>
                <NavLink to="/contact" className="hover:text-camel hover:font-bold">
                    Contact us
                </NavLink>

            </div>
            <div className={"flex-1 flex flex-col gap-1"}>
                <p className={"hover:text-camel hover:font-bold"}>Terms of Service</p>
                <p className={"hover:text-camel hover:font-bold"}>Privacy Policy</p>
                <p className={"hover:text-camel hover:font-bold"}>Shipping and Refund Policy</p>
            </div>
        </footer>
    );
};

export default Footer;