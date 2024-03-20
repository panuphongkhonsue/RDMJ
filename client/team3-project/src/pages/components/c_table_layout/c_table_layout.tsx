/*
* c_table_layout.tsx
* component tableforlayout
* @input column, rows
* @output show table
* @author Panuphong Khonsue
* @Create Date 2566-11-23
*/

import React from 'react'
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import "/src/css/table.css"

// ตัวเก็บค่าพารามิเตอร์ให้มีค่าเป็นarray แบบใดก็ได้ จะมี คอลลัมน์ แถว และ ปุ่มเป็นตัวเลือกให้ใช้สำหรับตารางที่ต้องใช้ปุ่มในตาราง
type Props = {
  columns: Array<any>; // ตัวแปรเก็บข้อมูลคอลลัมน์ที่ส่งเข้ามายัง component นี้
  rows: Array<any>; // ตัวแปรเก็บข้อมูลแถวที่ส่งเข้ามายัง component นี้
};

// ปรับสีของตาราง
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  // ปรับสีของหัวตาราง
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#72A0C1",
    color: theme.palette.common.white,
    fontSize: 14,
    fontFamily: [
      'IBM Plex Sans Thai, sans-serif',
    ]
  },
  // ปรับขนาดของตัวหนังสือในเนื้อหาตาราง
  [`&.${tableCellClasses.body}`]: {
    fontSize: 12,
    fontFamily: [
      'IBM Plex Sans Thai, sans-serif',
    ]
  },
}));
// ปรับสีของตารางปกติ
const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: "rgba(114, 160, 193, 0.1)",
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

export default function Table_layout({columns,rows}: Props) {
  // Check if rows is undefined or null
  if (!rows) {
    return <p>No data available</p>;
  }

  // Check if columns is undefined or null
  if (!columns) {
    return <p>No columns available</p>;
  }



  // Check if rows is not an array
  if (!Array.isArray(rows)) {
    return <p>Invalid data format for rows</p>;
  }

  // Check if columns is not an array
  if (!Array.isArray(columns)) {
    return <p>Invalid data format for columns</p>;
  }


  return (
    <main>
      <Paper sx={{ width: '100%' }}>
        <TableContainer sx={{ maxHeight: 1000 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <StyledTableCell
                    key={column.id}
                    align={column.align}
                    style={{ minWidth: column.minWidth }}
                  >
                    {column.label}
                  </StyledTableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows
                .map((row, rowIndex) => {
                  // Check if row is not an object
                  if (typeof row !== 'object' || row === null) {
                    console.error(`Invalid data format for row at index ${rowIndex}`);
                    return null;
                  }

                  return (
                    <StyledTableRow hover role="checkbox" tabIndex={-1} key={rowIndex}>
                      {columns.map((column) => {
                        const value = row[column.id];
                        return (
                          <StyledTableCell key={column.id} align={column.align}>
                            {column.format && typeof value === 'number'
                              ? column.format(value)
                              : value}
                          </StyledTableCell>
                        );
                      })}
                    </StyledTableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
        {/* Paginate */}
      </Paper>
    </main>
  );
}