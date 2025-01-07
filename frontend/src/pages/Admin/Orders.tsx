import React, {useEffect, useState} from "react";
import {Order, OrderProxy} from "../../types.ts";
import axios from "axios";
import Button from "../../components/Misc/Button.tsx";
import {OrderTable} from "../../components/Admin/Table.tsx";
import {forEach} from "lodash";
import TableDropDown from "../../components/Admin/TableDropDown.tsx";

const Orders: React.FC = () => {

    const getYorN = (state: boolean) =>{return state ? "Yes" : "No";}
    const [loading, setLoading] = useState<boolean>(true);

    const defaultOrder: Order = {
        "id": "90", "approved": false, "date": "Wed,19 Nov, 2024",
        "purchases": [{"image_url": "", "name": "defaultOrderItem", "price": 0.00, "product_id": "",
            "quantity": 8, "total_price": 0.00}],
        "user": {"cart_items": [], "cart_total": 0.0, "cc_info": "", "city": "",
            "decryption_key": "", "email": "defaultOrder.co", "fname": "Fname", "id": "",
            "lname": "", "password": "", "postal_code": "", "province": "", "street": ""},
        "total_price": 0.00
    }; //default order structure to be used by objects with state

    const [showDialog, setShowDialog]
        = useState(false);
    const [orders, setOrders] = useState<Order[]>(
        []);
    // order to be passed to dialog box for editing
    const [order, setOrder] = useState<Order>(defaultOrder);

    const defaultProxy = {
        "id": "", "approved": getYorN(false), "date": "",
        "purchases": "", "user": "", "total_price":"0.00"
    };

    // list of proxy orders to be passed to table for displaying
    const [orderProxies, setOrderProxies] = useState<OrderProxy[]>(
        [defaultProxy]);
    // proxy order to be parsed before setOrder() is called | proxy order to be passed to table for displaying
    const [orderProxy, setOrderProxy] = useState<OrderProxy>(
        defaultProxy);

    const findOrder = (proxy: OrderProxy)=>{
        let temp :Order = defaultOrder;
        //will return the order matching the proxy's id
        forEach(orders, (o)=>{
            if(o.id === proxy.id){
                temp = o;
        }})
        return temp;
    }
    //keep orderProxy and order in sync
    useEffect(()=>{setOrder(findOrder(orderProxy))},[orderProxy]);


    const [filter, setFilter]
        = useState({column: "id", value: defaultOrder.id});

    // show dropdown for the filter
    const [showDD, setShowDD] = useState(false);
    const toggleShowDD=(b?:boolean)=>{
        if(b) { setShowDD(true);}
        else { setShowDD(!showDD)}
    }
    /*
    * collate the hashmap of values for the dropdown
    * - unique order ids
    * - unique date
    * - unique User Email
    * - unique Purchases
    * - unique Approved
    * */
    interface DDValuesType{
        id: string[],
        date: string[],
        user: string[],
        purchases: string[],
        approved: string[],
        total_price: string[],
        [key:string]: string[]
    }

    const [ddValues, setDDValues]
        = useState<DDValuesType>(
            {id: [""], date: [""], user: [""], purchases: [""], approved: [""], total_price:[""]}
    );

    //update orderProxies and column filtering options
    const collateProxiesAndOrders = ()=>{
        // will create order Proxies from each order in orders
        const temp: OrderProxy[] = [];
        // store the order details for filtering
        const temporderIDs : string[] = [];
        const temporderDates : string[] = [];
        const temporderUsers : string[] = [];
        const temporderPrices : string[] = [];
        const temporderPurchases : string[] = [];
        const temporderApproveds : string[] = [];

        forEach(orders, (o)=>{
            const currID = o.id;
            const currApproved = getYorN(o.approved);
            const currDate= o.date.slice(0,16);
            /*
            * make string list of all purchases
            * */
            let currPurchases = ``;
            forEach(o.purchases, (p, index)=>{
                if (Object.is(o.purchases.length - 1, index)){
                    currPurchases += `(${p.quantity}) ${p.name}`;
                }else{
                    currPurchases += `(${p.quantity}) ${p.name}, `;
                    currPurchases += "\n";
                }

            });
            const currUser = o.user.email;
            const currPrice = `${o.total_price.toFixed(2)}`;
            temp.push({
                "id": currID, "approved": currApproved, "date": currDate,
                "purchases": currPurchases,
                "user": currUser, total_price: currPrice
            });

            temporderIDs.push(currID);
            temporderDates.push(currDate);
            temporderUsers.push(currUser);
            temporderPrices.push(currPrice);
            temporderPurchases.push(currPurchases)
            temporderApproveds.push(currApproved);
        });
        setOrderProxies(temp);

        setDDValues({id: [...new Set(temporderIDs)], approved: [...new Set(temporderApproveds)],
            user: [...new Set(temporderUsers)], purchases: [...new Set(temporderPurchases)],
            date: [...new Set(temporderDates)], total_price: [...new Set(temporderPrices)]});
    }
    // keep proxies in sync
    useEffect(()=>{collateProxiesAndOrders()},[orders]);

    function getOrders(){
        setLoading(true);
        axios({
            method: "get",
            baseURL: `${import.meta.env.VITE_BASE_URL}`,
            url: "/sale/history",
        }).then((response) => {
            setOrders(response.data.sales);
            collateProxiesAndOrders();
        }).catch((error) => {
            if (error.response) {
                console.log(error.response);
                console.log(error.response.status);
                console.log(error.response.headers);
            }
        }).finally(()=>{
            setLoading(false);
        })
    }

    useEffect(() => {getOrders();}, []);

    function editOrder(event: React.FormEvent) {
        if (order.id) {
            axios({
                method: "patch",
                baseURL: `${import.meta.env.VITE_BASE_URL}`,
                url: `/sale/${order.id}/toggle-approval`,
            })
            .then(() => {
                // Update the orders array with the new approved status
                const updatedOrders = orders.map(o =>
                    o.id === order.id ? { ...o, approved: !o.approved } : o
                );
                setOrders(updatedOrders); // Update the orders state

                // Update the current order state
                const updatedOrder = { ...order, approved: !order.approved };
                setOrder(updatedOrder);

                // Sync orderProxy with updatedOrder
                const updatedOrderProxy = { ...orderProxy, approved: getYorN(!order.approved) };
                setOrderProxy(updatedOrderProxy);

                // Regenerate order proxies for the table
                collateProxiesAndOrders();

                // alert(`Order ${order.approved ? "Declined" : "Approved"}!`);
            })
            .catch((error) => {
                console.error("Error:", error.response || error.message);
            });

            event.preventDefault();
        }
    }

    useEffect(() => {
        console.log("Updated Approved Status:", typeof orderProxy.approved, orderProxy.approved);
    }, [orderProxy.approved]);

    const ocolumns = [
        { id: 1, header: 'Order ID', accessor: 'id' },
        { id: 2, header: 'Date', accessor: 'date' },
        { id: 3, header: 'User Email', accessor: 'user' },
        { id: 4, header: 'Purchases', accessor: 'purchases' },
        { id: 5, header: 'Approved', accessor: 'approved', className: 'text-center'},
        { id: 6, header: 'Total', accessor: 'total_price', className: 'text-center'},
    ];

    // const fieldStyle = "text-camel bg-transparent w-full mt-1 py-1 px-2 border border-camel";
    const labelDivStyle = "mb-4 w-full";
    const pStyle = "text-camel bg-transparent w-full mt-1 py-1 px-2 border border-beige border-t-camel";

    const [options, setOptions] = useState([""]);

    // update dropdown when filter changes
    useEffect(()=>{setOptions(ddValues[filter.column]);},[filter]);

    const handleOptionSelect=(option: string)=> {
        // manipulate orders so the data is only per filter
        // option is the value that should be shown in the column
        const temp: OrderProxy[] = [];

        setFilter(prevNote => ({...prevNote, ["value"]: option}) );

        forEach(orders, (o)=>{
            const currID = o.id;
            const currApproved = getYorN(o.approved);
            const currDate= o.date.slice(0,16);
            /*
            * make string list of all purchases
            * */
            let currPurchases = ``;
            forEach(o.purchases, (p, index)=>{
                if (Object.is(o.purchases.length - 1, index)){
                    currPurchases += `(${p.quantity}) ${p.name}`;
                }else{
                    currPurchases += `(${p.quantity}) ${p.name}, `;
                    currPurchases += "\n";
                }
            });
            const currUser = o.user.email;
            const currPrice = `${o.total_price.toFixed(2)}`;
            const tempProxy: OrderProxy = {
                "id": currID, "approved": currApproved, "date": currDate,
                "purchases": currPurchases,
                "user": currUser, total_price: currPrice
            };

            if(tempProxy[filter.column]===option) temp.push(tempProxy);
        });
        setOrderProxies(temp);
    }
    return (
        <div>
            {/*Dropdown for column filter*/}
            <TableDropDown showDD={showDD} options={options} collateProxiesAndOrders={collateProxiesAndOrders}
                           handleOptionSelect={handleOptionSelect}/>
            {showDialog ?
                <div className={"fixed inset-0 flex items-center justify-center bg-coffee bg-opacity-20 z-10 border border-camel"}>
                    <dialog open className={"bg-beige border border-camel px-10 py-4 w-1/2 h-1/2 overflow-y-auto"}>


                        {/*// only show user account details, no edit*/}
                        <div className="grid items-center min-w-full">
                            {/*px-8 pt-6 pb-8 mb-4 h-auto w-full */}
                            {/*Account Section*/}
                            <p className={"text-3xl mb-6"}>Viewing Order</p>
                            <div className={"grid grid-cols-2 gap-4"}>
                                <div className={labelDivStyle}>
                                    <label htmlFor={"date"}>Date</label>
                                    <p className={pStyle}>{orderProxy.date}</p>
                                </div>
                                <div className={labelDivStyle}>
                                    <label htmlFor={"email"}>User Email</label>
                                    <p className={pStyle}>{orderProxy.user}</p>
                                </div>
                                <div className={labelDivStyle}>
                                    <label htmlFor={"purchases"}>Purchases</label>
                                    <p className={pStyle+ " whitespace-pre break-words"}>{`${orderProxy.purchases}`}</p>
                                </div>
                                <div className={labelDivStyle}>
                                    <label htmlFor={"approved"}>Approval State</label>
                                    <p className={pStyle}>
                                        {orderProxy.approved === "Yes" ? "Approved" : "Not Approved"}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </dialog>
                </div>
                :
                <></>
            }
            <h1 className="text-2xl font-bold">Orders</h1>
            <Button className="transition-colors duration-300 mb-2" onClick={getOrders}>Refresh Orders</Button>
            <OrderTable columns={ocolumns} data={orderProxies} loading={loading}
                        setVis={setShowDialog} setOrderProxy={setOrderProxy}
                        setFilter={setFilter} toggleShowDD={toggleShowDD}
            />
        </div>
    );
};

export default Orders;