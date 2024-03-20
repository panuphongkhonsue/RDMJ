/*
* index.tsx
* Show Page Menu Maintenance
* @input 
* @output show data maintenance
* @author Nareson Jiwbang,Panuphong
* @Create Date 2566-12-20
*/

import React from 'react'
import { useState, useEffect } from 'react';
import Menubar from '@/pages/components/c_menubar/c_menubar'
import Table from '@/pages/components/c_table/c_table'
import "/src/css/maintenance.css";
import { Column } from '@/pages/type/table_type';
import Selectcomponent from '@/pages/components/c_select/c_select';
import 'bootstrap/dist/css/bootstrap.css'
import axios from 'axios';
import LoadingModal from '../components/c_loading/c_loading_modal';
import LinearIndeterminate from '../components/c_loading/c_loading_linear';
import Note from '../components/c_note/c_note';
import Cookies from "js-cookie";
type Props = {}

const columns: Column[] = [
  { id: 'IDNO', label: 'Job No.', minWidth: 150, align: 'center' },
  { id: 'cg_sub_name', label: 'Maintenance Category', minWidth: 230, align: 'left' },
  { id: 'SetubiNo', label: 'Machine No.', minWidth: 170, align: 'left' },
  { id: 'Machine Name', label: 'Machine Name', minWidth: 200, align: 'left' },
  { id: 'product_name', label: 'PD Dept.', minWidth: 140, align: 'left' },
  { id: 'Location', label: 'Location', minWidth: 200, align: 'left' },
  { id: 'Layout No.', label: 'Layout No.', minWidth: 150, align: 'left' },
  { id: 'KoshoHasseiJikoku', label: 'Failure Occurrance', minWidth: 200, align: 'left' },
  { id: 'Hassei_Shuuryo', label: 'Occurrance End', minWidth: 200, align: 'right' },
  { id: 'Jyokyo', label: 'Problem', minWidth: 500, align: 'left' },
  { id: 'name', label: 'Technicain', minWidth: 300, align: 'left' },
  { id: 'Genin1', label: 'Actual Case', minWidth: 500, align: 'left' },
  { id: 'HasseiYouin', label: 'What do you work', minWidth: 500, align: 'left' },
  { id: 'KaisiJikoku', label: 'Start Time', minWidth: 250, align: 'left' },
  { id: 'ShuuryoJikoku', label: 'Ending Time', minWidth: 200, align: 'left' },
  { id: "status_work", label: 'Status', minWidth: 150, align: 'center' },
];

// ตัวแปรเก็บข้มูลของข้อมูล option ใน select
const options_maintenance_category = [
  { value: 0, label: 'ALL' },
  { value: 1, label: 'BM' },
  { value: 4, label: 'PM' },
  { value: 2, label: 'CM' },
  { value: 3, label: 'PD' },
];
const options_pd_dept = [
  { value: 0, label: 'ALL' },
  { value: 1, label: 'PD1' },
  { value: 2, label: 'PD2' },
  { value: 3, label: 'PD3' },
  { value: 4, label: 'PD4' },
  { value: 5, label: 'PD5' },
  { value: 6, label: 'PD6' },
  { value: 7, label: 'PD7' },
  { value: 8, label: 'PD8' },
];
const options_status = [
  { value: 0, label: 'ALL' },
  { value: 1, label: 'Finished' },
  { value: 2, label: 'Queue' },
  { value: 3, label: 'Processing' },
];

export default function DetailMachine({ }: Props) {
  // ตัวแปรเก็บข้อมูลที่ดึงข้อมูลจากหลังบ้าน
  const [get_data_m, setDataM] = useState(['']);
  // ตัวแปรสำหรับเก็บค่าแอนิเมชันโหลดถ้าเป็น true จะขึ้นหน้าโหลดแบบ Modal
  const [loading, setLoading] = useState(true);
  // ตัวแปรสำหรับเก็บค่าแอนิเมชันโหลดถ้าเป็น true จะขึ้นหน้าโหลดแบบเส้น
  const [loading_linear, setLoadingLinear] = useState(true);
  // ตัวแปรของ select ใช้ค้นหาค่าจาก category
  const [selected_value_maintenance_category, setSelectedValueMaintenanceCategory] = React.useState(0);
  // ตัวแปรของ select ใช้ค้นหาค่าจาก PD Dept
  const [selected_value_pd_dept, setSelectedValuePdDept] = React.useState(0);
  // ตัวแปรของ select ใช้ค้นหาค่าจากสถานะ
  const [selected_status, setSelectedStatus] = React.useState(0);
  const [row_per_page, setRowsPerPage] = React.useState(10);
  // ตัวแปรสำหรับเก็บเลขหน้าของการแสดงผล
  const [page, setPage] = React.useState(0);
  //ตัวแปรสำหรับเก็บคุกกี้
  const token = Cookies.get('user');
  // ตัวแปรสำหรับจำนวนแถวที่ต้องการ
  const [count_row, setCountRow] = React.useState(0);
  // ฟังก์ชันสำหรับรับค่า value จาก component Select พื้นฐานแล้วจะรับมาเป็นค่า string
  const getSelectedValueCategory = (new_status: string) => {
    // เรียกฟังก์ชัน set_selected_value และเปลี่ยนค่าเป็น int 
    setSelectedValueMaintenanceCategory(parseInt(new_status));
    setPage(0);
  };
  const getSelectedValuePd = (new_status: string) => {
    // เรียกฟังก์ชัน set_selected_value และเปลี่ยนค่าเป็น int 
    setSelectedValuePdDept(parseInt(new_status));
    setPage(0);
  };
  const getSelectedValueStatus = (new_status: string) => {
    // เรียกฟังก์ชัน set_selected_value และเปลี่ยนค่าเป็น int 
    setSelectedStatus(parseInt(new_status));
    setPage(0);
  };
  // เรียกฟังก์ชันเมื่อมีการเปลี่ยนหน้า
  const getPage = (new_status: number) => {
    setPage(new_status);
  }
  // เรียกใช้ฟังก์ชันเมื่อมีการเปลี่ยนจำนวนแถวต่อหน้า
  const getRowPerPage = (new_status: number) => {
    setRowsPerPage(new_status);
  }
  const pathurl = process.env.NEXT_PUBLIC_APP_URL;
  //ดึงข้อมูลจาก API 
  const fetchMaintenanceData = async () => {
    try {
      const config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `${pathurl}/api/show-data?cgId=${Number(selected_value_maintenance_category)}&productId=${Number(selected_value_pd_dept)}&selectStatus=${Number(selected_status)}&rowPerPage=${Number(row_per_page)}&page=${Number(page)}`,
        headers:{'Cookie': `user=${token}`},
        withCredentials: true,
        };

      const response = await axios.request(config);
      // ทำการนำข้อมูลจาก response มาเก็บใส่ตัวแปรและคำนวณตารางสถานะ
      setCountRow(response.data.totalRows);
      const updatedData = response.data.rows.map((row: any) => {
        let status_work_value = '';
        if (row.KaisiJikoku === '-') {
          status_work_value = 'Queue';
        } else if (row.ShuuryoJikoku === '-') {
          status_work_value = 'Processing';
        } else {
          status_work_value = 'Finished';
        }
        //คืนค่าสองตัวนี้เอาไว้ในตัวแปร updateData
        return {
          // ข้อมูลที่ได้จาก response 
          ...row,
          //เพิ่มข้อมูล status work
          status_work: status_work_value,
        };
      });

      setDataM(updatedData);
      setLoading(false);
      setLoadingLinear(false);
    } catch (error) {
      // Handle errors
      console.error(error);
    }
  }
  // ในครั้งแรกจะเรียกใช้ API และใช้แอนิเมชันโหลดแบบ Modal หลังจากนั้นจะยิง API ทุกๆ 15 วินาที 
  useEffect(() => {
    // เปิดหน้าครั้งแรกให้เปิดตัวโหลดแบบ modal แล้วยิง API 
    if (loading) {
      fetchMaintenanceData();
    }
    else { // ครั้งต่อไปยิงทุกๆ 15 วินาที
      const intervalId = setInterval(() => {
        fetchMaintenanceData();
      }, 15000); // Fetch data every 15 seconds
      return () => {
        clearInterval(intervalId); // Cleanup the interval on component unmount
      };
    }
  }, [get_data_m]);
  // ใช้สำหรับตัวโหลดแบบเส้น
  useEffect(() => {
    setLoadingLinear(true);
    // ถ้ากดตัวเลือกใน select จะขึ้นหน้าโหลดแบบเส้นและยิง API
    fetchMaintenanceData();
  }, [selected_status, selected_value_maintenance_category, selected_value_pd_dept, row_per_page, page]);
  const row = get_data_m;
  return (
    <main>
      <Menubar />
      {loading ? (
        <LoadingModal open={loading} />
      ) : (
        <div className='overall'>
          {loading_linear && <LinearIndeterminate />}
          <div className='m-2 pt-5'>
            <div className='text_header ms-3 '>
              <h2>MAINTENANCE ORDER</h2>
            </div>
            <div className="row mt-4 mb-2 ms-1">
              {/* select กรองตัวค้นหา */}
              <div className="row select pt-3 pb-3" >
                {/* เรียกใช้ component Select โดยจะต้องใส่ parameter get_val สำหรับเรียกใช้ฟงัก์ชันที่สร้างเอาไว้ข้างบน 
             width ไว้สำหรับปรับความกว้าง size_select สำหรับเลือกขนาด มี 'small' , 'medium' , large text คือ label บอกว่า select
             ตัวนี้คืออะไร option คือ ค่าใน select มีอะไรบ้าง la_bel คือ คำอธิบายตัว select  pad คือค่า padding และ font size สำหรับปรับขนาดตัวหนังสือ */}
                <div className='position_select col d-flex flex-row gap-2 flex-wrap'>
                  <Selectcomponent get_val={getSelectedValueCategory} width={210} size_select={"small"} text={"Maintenance Category"} pad={'5px 0px 8px 15px'} font_size={16} options={options_maintenance_category} />
                  <Selectcomponent get_val={getSelectedValuePd} width={188} size_select={"small"} text={"PD Dept."} pad={'5px 0px 8px 15px'} font_size={16} options={options_pd_dept} />
                  <Selectcomponent get_val={getSelectedValueStatus} width={188} size_select={"small"} text={"Status"} pad={'5px 0px 8px 15px'} font_size={16} options={options_status} />
                </div>
                <div className="col d-flex flex-row-reverse">
                  <Note />
                </div>
              </div>
            </div>
            {/* คำอธิบายสถานะของตาราง */}
            <div className="row note-status">
              {/* วิธีเรียกใช้ ตัว Search box component โดยใส่พารามิเตอร์ฟังก์ชันและตัวแปรสำหรับทำ Autocomplete 
              <Searchbox get_val={get_search_val} auto_val={text} />
          */}
              <div className="col"></div>
              <div className="col status text-end">

              </div>
            </div>
            {/* ตาราง */}
            <div className="table_approval mt-2">
              {/* เรียกใช้component ตารางและใส่ parameter */}
              <Table columns={columns} rows={row} get_page={getPage} get_row_per_page={getRowPerPage} row_per_page={row_per_page} page_row={page} rows_count={count_row} />
            </div>
          </div>
        </div>
      )}

    </main>
  )
}