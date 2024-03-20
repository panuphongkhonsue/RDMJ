// /pages/type/table_type.tsx
import React from 'react';

//พมพ์เขีวสำหรับคอลัมน์ในตารางจะมีต้องกำหนด id, ข้อความ, ความกว้าง, ตำแหน่ง
export interface Column {
    id: string;
    label: string;
    minWidth?: number;
    align?: any ;
    format?: (value: number) => string;
}
// Your React component using the Column interface
const TableType: React.FC = () => {
    // Your component logic here
    return (
        <div>
            {/* Your component JSX here */}
        </div>
    );
};

export default TableType;
