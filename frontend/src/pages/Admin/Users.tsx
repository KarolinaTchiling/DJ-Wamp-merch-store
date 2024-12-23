import React, { useEffect, useState } from "react";
import { UserTable } from "../../components/Admin/Table.tsx";
import axios from "axios";
import Button from "../../components/Button.tsx";
import { User } from "../../types.ts";

export interface Column<T> {
    header: string;
    accessor: keyof T;
}

const Users: React.FC = () => {
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
        axios.get(`${import.meta.env.VITE_BASE_URL}/user/users`).then((res) => {
            setUsers(res.data.users);
        });
    };

    useEffect(() => {
        getUsers();
    }, []);

    const columns: Column<User>[] = [
        { header: "First Name", accessor: "fname" },
        { header: "Last Name", accessor: "lname" },
        { header: "Email", accessor: "email" },
        { header: "Street", accessor: "street" },
        { header: "City", accessor: "city" },
        { header: "Province", accessor: "province" },
        { header: "Postal Code", accessor: "postal_code" },
        { header: "Cart Total", accessor: "cart_total" },
    ];

    return (
        <div>
            <Button onClick={getUsers}>Update Table</Button>
            <UserTable
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
