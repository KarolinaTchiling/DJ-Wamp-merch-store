import React from 'react';
import {useTokenContext} from "../TokenContext.tsx";
import { NavLink } from 'react-router-dom';

const AccountSidebar: React.FC = () => {

    const {removeToken} = useTokenContext();
    function logOut() {
        removeToken();
    }
    return (
        <aside className="text-camel w-[200px] h-auto pl-8 pr-8 border-r border-camel" aria-label="Sidebar">
            <ul>
                <li>
                    <NavLink 
                        to="/account-settings" 
                        className={"mb-2 hover:text-lg hover:font-extrabold active:bg-black active:bg-opacity-5"}>
                        Account 
                    </NavLink>
                </li>
                <li>
                    <NavLink 
                        to="/order-history" 
                        className={"mb-2 hover:text-lg hover:font-extrabold active:bg-black active:bg-opacity-5"}>
                        Order History
                    </NavLink>
                </li>
                <li>
                    <NavLink 
                        to="/catalog/products"
                        onClick={logOut} 
                        className="mb-2 hover:text-lg hover:font-extrabold active:bg-black active:bg-opacity-5">
                        Log Out
                    </NavLink>
                </li>
            </ul>
        </aside>
    );
};

export default AccountSidebar;