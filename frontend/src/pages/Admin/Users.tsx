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

    const columns: Column<User>[] = [
        { header: "First Name", accessor: "fname", className: 'text-center'  },
        { header: "Last Name", accessor: "lname", className: 'text-center'  },
        { header: "Email", accessor: "email", className: 'text-center'  },
        { header: "Street", accessor: "street", className: 'text-center'},
        { header: "City", accessor: "city", className: 'text-center'},
        { header: "Province", accessor: "province", className: 'text-center'},
        { header: "Postal Code", accessor: "postal_code", className: 'text-center'},
        { header: "Cart Total", accessor: "cart_total", className: 'text-center'}
    ];

    return (
        <div>
            <h1 className="text-2xl font-bold">Users</h1>
            <Button className="transition-colors duration-300 mb-2" onClick={getUsers}>Update table</Button>
            <UserTable
                loading={loading}
                columns={columns}
                data={users}
                setVis={() => { } }
                setUser={() => { } } setFilter={function (_filter: {}): void {
                    throw new Error("Function not implemented.");
                } } toggleShowDD={function (_b?: boolean): void {
                    throw new Error("Function not implemented.");
                } }            />
        </div>
    );
};

export default Users;
