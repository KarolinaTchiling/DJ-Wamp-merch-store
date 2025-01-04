import React, { useEffect, useState } from "react";
import { UserTable } from "../../components/Admin/Table.tsx";
import axios from "axios";
import Button from "../../components/Misc/Button.tsx";
import { User } from "../../types.ts";

export interface Column<T> {
    header: string;
    accessor: keyof T;
    className?: string; 
}

const Users: React.FC = () => {
    const [loading, setLoading] = useState<boolean>(true);

    const defaultUser: User = {
        id: "",
        fname: "",
        lname: "",
        email: "",
        password: "",
        street: "",
        city: "",
        postal_code: "",
        province: "",
        cc_info: "",
        decryption_key: "",
        cart_items: [],
        cart_total: 0.0,
    };

    const [users, setUsers] = useState<User[]>([defaultUser]);
    const [showDialog, setShowDialog] = useState(false);
    const [user, setUser] = useState<User>(defaultUser);

    const getUsers = () => {
        setLoading(true);
        axios
            .get(`${import.meta.env.VITE_BASE_URL}/user/users`)
            .then((res) => {
                const formattedUsers = res.data.users.map((user: User) => ({
                    ...user,
                    cart_total: parseFloat(user.cart_total.toFixed(2)),
                }));
                setUsers(formattedUsers);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    useEffect(() => {
        getUsers();
    }, []);

    const editUser = (event: React.FormEvent) => {
        event.preventDefault();
    
        axios
            .patch(`${import.meta.env.VITE_BASE_URL}/user/${user.id}`, user)
            .then(() => {
                console.log("User updated successfully");
    
                // Fetch the updated users list
                getUsers();
    
                // Close the dialog
                setShowDialog(false);
    
                alert("User updated successfully!");
            })
            .catch((error) => {
                console.error("Error updating user:", error.response || error.message);
            });
    };
    
    

    const columns: Column<User>[] = [
        { header: "First Name", accessor: "fname", className: "text-center" },
        { header: "Last Name", accessor: "lname", className: "text-center" },
        { header: "Email", accessor: "email", className: "text-center" },
        { header: "Street", accessor: "street", className: "text-center" },
        { header: "City", accessor: "city", className: "text-center" },
        { header: "Province", accessor: "province", className: "text-center" },
        { header: "Postal Code", accessor: "postal_code", className: "text-center" },
        { header: "Cart Total", accessor: "cart_total", className: "text-center" },
    ];

    return (
        <div>
            {showDialog ? (
                <div className="fixed inset-0 flex items-center justify-center bg-coffee bg-opacity-20 z-10">
                    <dialog open className="bg-beige border border-camel p-6 w-1/3">
                        <form onSubmit={editUser}>
                            <div className={"grid grid-cols-2 mb-6"}>
                                <Button
                                    className="transition-colors duration-300"
                                    type="submit"
                                > 
                                    Save 
                                </Button>

                                <Button
                                    className="transition-colors duration-300"
                                    onClick={() => setShowDialog(false)}
                                >
                                    Cancel
                                </Button>
                            </div>
                            <div className="grid gap-4">
                                <div>
                                    <label htmlFor="fname">First Name</label>
                                    <input
                                        id="fname"
                                        type="text"
                                        value={user.fname}
                                        onChange={(e) => setUser({ ...user, fname: e.target.value })}
                                        className="bg-beige text-coffee border border-camel p-2 w-full"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="lname">Last Name</label>
                                    <input
                                        id="lname"
                                        type="text"
                                        value={user.lname}
                                        onChange={(e) => setUser({ ...user, lname: e.target.value })}
                                        className="bg-beige text-coffee  border border-camel p-2 w-full"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="email">Email</label>
                                    <input
                                        id="email"
                                        type="email"
                                        value={user.email}
                                        onChange={(e) => setUser({ ...user, email: e.target.value })}
                                        className="bg-beige text-coffee border border-camel p-2 w-full"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="street">Street</label>
                                    <input
                                        id="street"
                                        type="text"
                                        value={user.street}
                                        onChange={(e) => setUser({ ...user, street: e.target.value })}
                                        className="bg-beige text-coffee  border border-camel p-2 w-full"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="city">City</label>
                                    <input
                                        id="city"
                                        type="text"
                                        value={user.city}
                                        onChange={(e) => setUser({ ...user, city: e.target.value })}
                                        className="bg-beige text-coffee  border border-camel p-2 w-full"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="province">Province</label>
                                    <input
                                        id="province"
                                        type="text"
                                        value={user.province}
                                        onChange={(e) => setUser({ ...user, province: e.target.value })}
                                        className="bg-beige text-coffee border border-camel p-2 w-full"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="postal_code">Postal Code</label>
                                    <input
                                        id="postal_code"
                                        type="text"
                                        value={user.postal_code}
                                        onChange={(e) => setUser({ ...user, postal_code: e.target.value })}
                                        className="bg-beige text-coffee border border-camel p-2 w-full"
                                    />
                                </div>
                            </div>
                        </form>
                    </dialog>
                </div>
            ) : null}
            <h1 className="text-2xl font-bold mb-4">Users</h1>
            <Button className="mb-4 transition-colors duration-300" onClick={getUsers}>
                Refresh Users
            </Button>
            <UserTable
                columns={columns}
                data={users}
                loading={loading}
                setVis={setShowDialog}
                setUser={setUser} setFilter={function (filter: {}): void {
                    throw new Error("Function not implemented.");
                } } toggleShowDD={function (b?: boolean): void {
                    throw new Error("Function not implemented.");
                } }            />
        </div>
    );
};

export default Users;