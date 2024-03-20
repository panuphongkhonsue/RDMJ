/*
* c_table.tsx
* component stable
* @input column, rows
* @output show table
* @author Panuphong Khonsue
* @Create Date 2566-11-09
*/

import React from 'react'
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import Box from '@mui/material/Box';
import "/src/css/table.css"

// ตัวเก็บค่าพารามิเตอร์ให้มีค่าเป็นarray แบบใดก็ได้ จะมี คอลลัมน์ แถว และ ปุ่มเป็นตัวเลือกให้ใช้สำหรับตารางที่ต้องใช้ปุ่มในตาราง
type Props = {
  columns: Array<any>; // ตัวแปรเก็บข้อมูลคอลลัมน์ที่ส่งเข้ามายัง component นี้
  rows: any; // ตัวแปรเก็บข้อมูลแถวที่ส่งเข้ามายัง component นี้
  rows_count?:any; // ตัวแปรจำนวนข้อมูลทั้งหมด
  row_per_page?:any; // ตัวแปรจำนวนแถวต่อ 1 หน้า
  page_row?:any; // จำนวนหน้าที่เท่าไหร่
  get_row_per_page: (value: number) => void // ฟังก์ชันสำหรับกำหนดจำนวนแถวต่อหน้า
  get_page: (value: number) => void // ฟังก์ชันสำหรับเก็บค่าหน้าใหม่
};

// ปรับสีของตาราง
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  // ปรับสีของหัวตาราง
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#72A0C1",
    color: theme.palette.common.white,
    fontSize: 18,
    fontFamily: [
      'IBM Plex Sans Thai, sans-serif',
    ]
  },
  // ปรับขนาดของตัวหนังสือในเนื้อหาตาราง
  [`&.${tableCellClasses.body}`]: {
    fontSize: 16,
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

export default function Tablecomponents({ columns, rows,rows_count,row_per_page,page_row,get_row_per_page,get_page }: Props) {

  // Check if rows is undefined or null
  if (!rows || rows == '' || rows == null) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh', border: '5px solid #72A0C1' }}>
        <p style={{ fontSize: '30px' }}>No data available</p>
      </Box>
    );
  }

  // Check if columns is undefined or null
  if (!columns) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <p style={{ fontSize: '30px' }}>No columns available</p>
      </Box>
    );
  }

  // Check if rows is not an array
  if (!Array.isArray(rows)) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <p style={{ fontSize: '30px' }}>Invalid data format for rows</p>
      </Box>
    );
  }

  // Check if columns is not an array
  if (!Array.isArray(columns)) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh', border: '5px solid black' }}>
        <p style={{ fontSize: '30px' }}>Invalid data format for columns</p>
      </Box>
    );
  }

  // ตัวแปรสำหรับเก็บค่าเปลี่ยนจำนวนแถว
  const handleChangePage = (event: unknown, newPage: number) => {
    get_page(newPage);
  };

  // ตัวแปรสำหรับเรียกใช้ฟังก์ชันเมื่อมีการเปลี่ยนจำนวนแถว
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    get_page(0);
    get_row_per_page(+event.target.value);
  };

  return (
    <main>
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
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
        <TablePagination
          rowsPerPageOptions={[10, 25,50]}
          component="div"
          count={rows_count}
          rowsPerPage={row_per_page}
          page={page_row}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </main>
  );
}