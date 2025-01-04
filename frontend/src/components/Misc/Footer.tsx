import React from 'react';
import InstagramIcon from '../../assets/Instagram.svg'
import LinkedIncon from '../../assets/LinkedIn.svg'
import GitIcon from "../../../public/github-mark.svg";
import { NavLink } from 'react-router-dom';

const Footer: React.FC = () =>{
    return(
        <footer className={"bg-beige p-10 flex flex-row gap-4 justify-center border-t border-t-camel"}>
            <div className={"flex-1"}>
                <div className="flex flex-row items-center mt-4">
                    <a href="https://github.com/KarolinaTchiling/DJ-Wamp-merch-store" target="_blank" rel="noopener noreferrer">
                        <img src={GitIcon} alt="GitHub" className="w-8 h-8 mx-auto mr-2" />
                    </a>
                    <p>Checkout the repo</p>
                </div>
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
                <p className={"hover:text-camel hover:font-bold transition-colors duration-300"}>FAQs</p>
                <NavLink to="/contact" className="hover:text-camel hover:font-bold transition-colors duration-300">
                    Contact us
                </NavLink>

            </div>
            <div className={"flex-1 flex flex-col gap-1"}>
                <p className={"hover:text-camel hover:font-bold transition-colors duration-300"}>Terms of Service</p>
                <p className={"hover:text-camel hover:font-bold transition-colors duration-300"}>Privacy Policy</p>
                <p className={"hover:text-camel hover:font-bold transition-colors duration-300"}>Shipping and Refund Policy</p>
            </div>
        </footer>
    );
};

export default Footer;