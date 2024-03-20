/*
* c_table_group.tsx
* component table group
* @input  -
* @output show table summary in group
* @author Panuphong Khonsue
* @Create Date 2566-11-23
*/

import React from 'react'
import { styled } from '@mui/material/styles';
import TablePagination from '@mui/material/TablePagination';
import "/src/css/table.css"
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
// ตัวเก็บค่าพารามิเตอร์ให้มีค่าเป็นarray แบบใดก็ได้ จะมี คอลลัมน์ แถว และ ปุ่มเป็นตัวเลือกให้ใช้สำหรับตารางที่ต้องใช้ปุ่มในตาราง
type Props = {
    data: any; // ตัวแปรเก็บข้อมูลคอลลัมน์ที่ส่งเข้ามายัง component นี้
};
//แต่ง css ให้กับตาราง
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

//ฟังก์ชันสร้างข้อมูลสำหรับแสดงผลในตาราง
function createData(
    //ตัวแปรของข้อมูลทั้งหมด
    pd_dept: string,
    cost: number,
    result: number,
    diff: number,
    diff_color: string,
    //ตัวแปรสำหรับข้อมูลย่อย
    sub_data?: Array<any>, // Make history parameter optional
) {
    return {
        pd_dept,
        cost,
        result,
        diff,
        diff_color,
        sub_data: sub_data || [], // Set default value to an empty array if history is not provided
    };
}

//ฟังก์ชันแสดงผลเนื้อหาในตารางแบบซ้อนกัน
function Row(props: { row: ReturnType<typeof createData> }) {
    const { row } = props;
    const [open, setOpen] = React.useState(false);
    return (
        <React.Fragment>
            {(row.sub_data.length > 0 ? [row] : [row]).map((rowData, index) => (
                <StyledTableRow key={index} sx={{ '& > *': { borderBottom: 'unset' } }}>
                    <StyledTableCell component="th" scope="row">
                        <IconButton
                            aria-label="expand row"
                            size="small"
                            onClick={() => {
                                setOpen(!open)
                            }}
                        >
                            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                        </IconButton>
                        {rowData.pd_dept}
                    </StyledTableCell>
                    <StyledTableCell align="left">BM</StyledTableCell>
                    <StyledTableCell align="right">{rowData.cost}</StyledTableCell>
                    <StyledTableCell align="right">{rowData.result}</StyledTableCell>
                    <StyledTableCell align="right" style={{ color: rowData.diff_color }}>{rowData.diff}</StyledTableCell>
                </StyledTableRow>
            ))}
            {/* หากคลิกแล้วจะแสดงข้อมูลย่อยออกมา */}
            {open && (
                <>
                    {/* Render rows for each item in row.sub_data */}
                    <StyledTableRow sx={{ '& > *': { borderBottom: 'unset' }, backgroundColor: 'White !important' }}>
                        <StyledTableCell></StyledTableCell>
                        <StyledTableCell component="th" scope="row" align="left">PM</StyledTableCell>
                        <StyledTableCell align="right">{row.sub_data[0].plan_PM.toLocaleString()}</StyledTableCell>
                        <StyledTableCell align="right">{row.sub_data[0].actual_PM.toLocaleString()}</StyledTableCell>
                        <StyledTableCell align="right" style={{ color: row.sub_data[0].diff_PM_color }}>{row.sub_data[0].diff_PM.toLocaleString()}</StyledTableCell>
                    </StyledTableRow>

                    <StyledTableRow sx={{ '& > *': { borderBottom: 'unset', backgroundColor: 'rgba(114, 160, 193, 0.2) !important' } }}>
                        <StyledTableCell></StyledTableCell>
                        <StyledTableCell component="th" scope="row" align="left">Total</StyledTableCell>
                        {/* Calculate total date, amount, and amount1 */}
                        <StyledTableCell align="right">{row.sub_data[0].plan_total.toLocaleString()}</StyledTableCell>
                        <StyledTableCell align="right">{row.sub_data[0].actual_total.toLocaleString()}</StyledTableCell>
                        <StyledTableCell align="right" style={{ color: row.sub_data[0].diff_total_color }}>{row.sub_data[0].diff_total.toLocaleString()}</StyledTableCell>
                    </StyledTableRow>
                </>
            )}

        </React.Fragment>
    );
}



export default function Table_group({ data }: Props) {
    // ตัวแปรสำหรับจำนวนหน้าของตาราง เริ่มต้นให้เป็น0
    const [page, setPage] = React.useState(0);
    // ให้จำลองแถวมี10แถวเริ่มต้น
    const [rowsPerPage, setRowsPerPage] = React.useState(4);
    //เก็บตัวแปรข้อมูลต่างๆทั้งข้อมูลหลักและข้อมูลย่อย
    const rows = data ? data.map((item: any) => {
        return {
            pd_dept: item.pd_dept,
            cost: item.plan_BM.toLocaleString(),
            result: item.actual_BM.toLocaleString(),
            diff: item.diff_BM.toLocaleString(),
            diff_color: item.diff_BM_color,
            sub_data: [item.subdata]
        };
    }) : [];
    // ตัวแปรสำหรับเก็บค่าเปลี่ยนจำนวนแถว
    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    // ตัวแปรสำหรับเรียกใช้ฟังก์ชันเมื่อมีการเปลี่ยนจำนวนแถว
    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    return (
        <main>
            <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                <TableContainer component={Paper}>
                    <Table aria-label="collapsible table" stickyHeader>
                        {/* ข้อมูลคอลลัมน์ทั้งหมด */}
                        <TableHead>
                            <StyledTableRow>
                                <StyledTableCell align="center" style={{ width: '18% !important' }}>Section</StyledTableCell>
                                <StyledTableCell align="left" style={{ width: '22% !important' }}>Maintenance Category</StyledTableCell>
                                <StyledTableCell align="right" style={{ width: '22% !important' }}>Cost Plan&nbsp; (Baht)</StyledTableCell>
                                <StyledTableCell align="right" style={{ width: '18% !important' }}>Result&nbsp; (Baht)</StyledTableCell>
                                <StyledTableCell align="right" style={{ width: '18% !important' }}>Diff. &nbsp; (Baht)</StyledTableCell>
                            </StyledTableRow>
                        </TableHead>
                        <TableBody>
                            {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row: any) => (
                                // ตารางแสดงเนื้อหาในตาราง
                                <Row key={row.pd_dept} row={row} />
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                {/* Paginate */}
                <TablePagination
                    rowsPerPageOptions={[2, 3, 4]}
                    component="div"
                    count={rows.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>
        </main>
    );
}