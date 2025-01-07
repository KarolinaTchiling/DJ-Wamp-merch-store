import React from "react";
import { User, OrderProxy } from "../../types.ts";
import TableHeader from "./TableHeader.tsx";
import TableBody from "./TableBody.tsx";

const defaultTableContainerStyle = "max-w-11/12 h-5/6";
const defaultTableStyle = "bg-beige border border-camel text-sm";

export interface Column<T> {
    header: string;
    accessor: keyof T;
    className?: string; 
}

// UserTable
interface UserTableContent {
    columns: Column<User>[];
    data: User[];
    setFilter(filter: {}): void;
    setVis: (s: boolean) => void;
    toggleShowDD(b?: boolean): void;
    setUser: (u: User) => void;
}

export const UserTable: React.FC<UserTableContent & { loading: boolean }> = ({
    columns,
    data,
    setVis,
    setUser,
    setFilter,
    toggleShowDD,
    loading,
}) => {
    return (
        <div>
            <div className={defaultTableContainerStyle}>
                <table className={defaultTableStyle}>
                    <TableHeader
                        columns={columns}
                        setFilter={setFilter}
                        toggleShowDD={toggleShowDD}
                    />
                    <TableBody<User>
                        columns={columns}
                        data={data}
                        setUser={setUser}
                        setVis={setVis} 
                        loading={loading}                    />
                </table>
            </div>
        </div>
    );
};

// OrderTable
interface OrderTableContent {
    columns: Column<OrderProxy>[];
    data: OrderProxy[];
    setFilter(filter: {}): void;
    setVis: (s: boolean) => void;
    toggleShowDD(b?: boolean): void;
    setOrderProxy: (o: OrderProxy) => void;
}

export const OrderTable: React.FC<OrderTableContent & { loading: boolean }> = ({
    columns,
    data,
    setVis,
    setOrderProxy,
    setFilter,
    toggleShowDD,
    loading,
}) => {
    return (
        <div className={defaultTableContainerStyle}>
            <table className={defaultTableStyle}>
                <TableHeader
                    columns={columns}
                    setFilter={setFilter}
                    toggleShowDD={toggleShowDD}
                />
                <TableBody<OrderProxy>
                    columns={columns}
                    data={data}
                    loading = {loading}
                    setOrderProxy={setOrderProxy}
                    setVis={setVis}
                />
            </table>
        </div>
    );
};

