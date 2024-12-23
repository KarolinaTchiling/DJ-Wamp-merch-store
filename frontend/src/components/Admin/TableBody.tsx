import React from "react";
import { OrderProxy, User } from "../../types.ts";

interface Column<T> {
    header: string;
    accessor: keyof T;
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
}: TableBodyProps<T>) => {
    const defaultStyle = `py-2 px-4 border-b border-camel text-gray-800 hover:text-white
      whitespace-pre break-words`;

    return (
        <tbody>
            {data.map((row) => (
                <tr
                    key={row.id} // Assuming both User and OrderProxy have an `id` property
                    className="even:bg-cream cursor-pointer hover:bg-camel"
                    onClick={() => {
                        if ("userSpecificProperty" in row && setUser) {
                            setUser(row as unknown as User); // Safely cast to User if the property exists
                        } else if ("orderSpecificProperty" in row && setOrderProxy) {
                            setOrderProxy(row as OrderProxy); // Safely cast to OrderProxy if the property exists
                        }
                        window.scrollTo(0, 0);
                        setVis(true);
                    }}
                >
                    {columns.map((column) => (
                        <td key={String(column.accessor)} className={classname || defaultStyle}>
                            {row[column.accessor] as React.ReactNode}
                        </td>
                    ))}
                </tr>
            ))}
        </tbody>
    );
};

export default TableBody;

