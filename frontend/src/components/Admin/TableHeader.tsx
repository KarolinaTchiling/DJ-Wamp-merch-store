
interface Column<T> {
    header: string;
    accessor: keyof T;
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
                    <th key={String(column.accessor)}>{column.header}</th>
                ))}
            </tr>
        </thead>
    );
};

export default TableHeader;
