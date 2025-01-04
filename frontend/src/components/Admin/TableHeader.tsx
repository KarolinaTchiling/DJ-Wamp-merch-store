
interface Column<T> {
    header: string;
    accessor: keyof T;
    className?: string; 
}

interface TableHeaderProps<T> {
    columns: Column<T>[];
    setFilter(filter: {}): void;
    toggleShowDD(b?: boolean): void;
}

const TableHeader = <T,>({
    columns,
}: TableHeaderProps<T>) => {
    return (
        <thead>
            <tr>
                {columns.map((column) => (
                    <th className="w-[150px]" key={String(column.accessor)}>{column.header}</th>
                ))}
            </tr>
        </thead>
    );
};

export default TableHeader;
