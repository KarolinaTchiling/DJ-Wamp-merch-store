import React, {useEffect, useState} from 'react';
import AccountSidebar from "../components/Sidebars/AccountSidebar.tsx";
import OrderBlock from "../components/OrderBlock.tsx";
import {Order} from "../types.ts";
import axios from "axios";
import { NavLink } from 'react-router-dom';


const OrderHistory: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState<boolean>(true); // Track loading state
    
    function getOrders(){
        axios({
            method: "get",
            baseURL: `${import.meta.env.VITE_BASE_URL}`,
            url: `/sale/orders`,
            params: {
                sort_by: "date", // Specify the field to sort by
                order: "desc",   // Specify the sort order ('asc' or 'desc')
            },
        }).then((response: axios.AxiosResponse) => {
            setOrders(response.data.sales);
        }).catch((error) => {
            if (error.response) {
                console.log(error.response);
                console.log(error.response.status);
                console.log(error.response.headers);
            }
        }).finally(() => {
            setLoading(false); // Stop loading after fetch completes
        });
    }
    // keep proxies in sync
    useEffect(()=>{getOrders()},[]);


    return (
        <div className={"flex mt-4 mb-10 min-h-full"}>
            <AccountSidebar></AccountSidebar>
            <div className="flex-grow px-8 max-w-[900px]">
                {/*Header*/}
                <p className={"text-3xl mb-6"}>Order History</p>

                {/*Ordered items history*/}
                <div className="min-h-full">
                    {loading ? (
                        <div>
                            <p className="text-coffee text-lg">Loading...</p>
                        </div>
                    ) : orders.length === 0 ? (
                        <div className="text-center">
                            <p className="text-coffee text-lg">Nothing to see here...</p>
                            <NavLink to='/catalog/products' className="text-camel hover:font-black hover:text-lg">Go Shopping </NavLink>
                         </div>   
                        
                    ) : (
                        orders.map((order) => (
                            <div className="pb-8" key={order.id}>
                                <OrderBlock
                                    id={order.id}
                                    date={order.date.slice(0,16)}
                                    purchases={order.purchases}
                                    approvals={order.approved}
                                    order_total={order.total_price}
                                />
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default OrderHistory;