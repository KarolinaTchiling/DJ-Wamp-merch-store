import React from "react";
import { OrderProxy, User } from "../../types.ts";
import Loader from "../../components/Misc/Loader.tsx"; 

interface Column<T> {
    header: string;
    accessor: keyof T;
    className?: string
}

interface TableBodyProps<T> {
    columns: Column<T>[];
    data: T[];
    setVis(s: boolean): void;
    setUser?(u: User): void;
    setOrderProxy?(o: OrderProxy): void;
    classname?: string;
}

const TableBody = <T extends User | OrderProxy>({
    columns,
    data,
    setVis,
    setUser,
    setOrderProxy,
    classname,
    loading,
}: TableBodyProps<T> & { loading: boolean }) => {
    const defaultStyle = `py-2 px-2 border-b border-camel text-gray-800 hover:text-white
      whitespace-pre break-words`;

      return (
        <tbody>
            {loading ? (
                <tr>
                    <td colSpan={columns.length} className="px-[480px] py-[100px]">
                        <Loader /> 
                    </td>
                </tr>
            ) : (
                data.map((row) => (
                    <tr
                        key={row.id} // Assuming both User and OrderProxy have an `id` property
                        className="odd:bg-cream cursor-pointer hover:bg-camel"
                        onClick={() => {
                            if ("fname" in row && setUser) {
                                // Handle User case
                                setUser(row as User);
                            } else if (setOrderProxy) {
                                // Handle OrderProxy case
                                setOrderProxy(row as OrderProxy);
                            }
                            window.scrollTo(0, 0);
                            setVis(true);
                        }}
                    >
                        {columns.map((column) => (
                            <td key={String(column.accessor)}className={`${defaultStyle} ${column.className || ''}`}>
                                {row[column.accessor] as React.ReactNode}
                            </td>
                        ))}
                    </tr>
                ))
            )}
        </tbody>
    );
};

export default TableBody;

