 /*
 * v_case_plan.tsx
 * case plan save and edit
 * @input case plan value
 * @output data table all case plan
 * @author Kamin,Panuphong,Chasita
 * @Create Date 2567-15-15
 */

import React, { useEffect, useState } from 'react';
import Menubar from '@/pages/components/c_menubar/c_menubar'
import Menubutton from '@/pages/components/c_menubutton/c_menubutton';
import Modal from '@/pages/components/c_modal_case/c_modal_case';
import "/src/css/actionplan.css"
import Tableapproval from '@/pages/components/c_table/c_table'
import { Column } from '@/pages/type/table_type';
import ModalEdit from '@/pages/components/c_modal_case_edit/c_modal_case_edit';
import Searchbox from "@/pages/components/c_search_box/c_search_box";
import axios from 'axios';
import LoadingModal from '@/pages/components/c_loading/c_loading_modal';
import Snackbar from '@mui/material/Snackbar';
import SnackbarContent from '@mui/material/SnackbarContent';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Note from '@/pages/components/c_note/c_note';
import Cookies from "js-cookie";
type Props = {}

// กำหนดโครงสร้างของ column ใน table
const columns: Column[] = [
  { id: 'Year', label: 'Year', minWidth: 100, align: 'center' },
  { id: 'Month', label: 'Month', minWidth: 120, align: 'center' },
  { id: 'casep_time', label: 'Time BM', minWidth: 150, align: 'right', format: (value: number) => value.toLocaleString('en-US') },
  { id: 'casep_case_more_2', label: 'BM >= 2Hrs.', minWidth: 150, align: 'right', format: (value: number) => value.toLocaleString('en-US') },
  { id: 'casep_case_less_2', label: 'BM > 30Min ~ < 2Hrs.', minWidth: 150, align: 'right', format: (value: number) => value.toLocaleString('en-US') },
  { id: 'casep_case_less_30', label: 'BM <= 30Min', minWidth: 150, align: 'right', format: (value: number) => value.toLocaleString('en-US') },
  { id: 'edit', label: 'Edit', minWidth: 150, align: 'center' },
];

const casePlan = () => {

  const [row_per_page, setRowsPerPage] = React.useState(10);  // ตัวแปรสำหรับจำนวนแถวที่ต้องการแสดง
  const [page, setPage] = React.useState(0);  // ตัวแปรสำหรับเก็บเลขหน้าของการแสดงผล
  const [count_row, setCountRow] = React.useState(0); // ตัวแปรสำหรับจำนวนแถวทั้งหมด
  // ฟังก์ชันสำหรับรับค่า value จาก component Select พื้นฐานแล้วจะรับมาเป็นค่า string
  const [data, setData] = useState([]);
  const [create_value, setCreateValue] = useState({});
  const [update_value, setUpdateValue] = useState<any>({});
  const [date_exist, setDateExist] = useState<any>();
  const [search_info, setSearchInfo] = React.useState("");
  // ตัวแปรสำหรับเก็บค่าแอนิเมชันโหลดถ้าเป็น true จะขึ้นหน้าโหลดแบบ Modal
  const [loading, setLoading] = useState(true);
  const [open_snackbar, setOpenSnackbar] = useState(false);
  const [snackbar_message, setSnackbarMessage] = useState('');
  // ตัวแปรป้องกันการ double click
  const [isPosting, setIsPosting] = useState(false);
  // ตัวแปรเก็บ url ของ api
  const pathurl = process.env.NEXT_PUBLIC_APP_URL;
  //ตัวแปรสำหรับเก็บคุกกี้
  const token = Cookies.get('user');
  // เรียกฟังก์ชันเมื่อมีการเปลี่ยนหน้า
  const getPage = (new_status: number) => {
    setPage(new_status);
  }

  // เรียกใช้ฟังก์ชันเมื่อมีการเปลี่ยนจำนวนแถวต่อหน้า
  const getRowPerPage = (new_status: number) => {
    setRowsPerPage(new_status);
  }
  // ฟังก์ชันเก็บข้อมูลเมื่อมีการเพิ่มข้อมูล
  const getValueCreate = (value_props: Object) => {
    setCreateValue(value_props);
  };
  // ฟังก์ชันเมื่อมีการแก้ไขข้อมูล
  const getValueEdit = (value_props: Object) => {
    setUpdateValue(value_props);
  };
  // ตัวแปรปีปัจจุบัน
  const currentYear = new Date().getFullYear();
  // ข้อมูลใน autocomplete แสดงปีปัจจุบันและอีก 2 ปีย้อนหลัง พร้อม เดือนอีก 12 เดือน
  const text = [
    currentYear.toString(),
    (currentYear - 1).toString(),
    (currentYear - 2).toString(),
    "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
  ];
  // ฟังก์ชันสำหรับรับค่าการค้นหาจาก Searchbox
  const get_search_val = (new_search_val: string) => {
    setSearchInfo(new_search_val);
  };

  // ฟังก์ชันสำหรับดึงข้อมูล case plan จาก API
  const fetchCaseData = async () => {
    try {
      const config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `${pathurl}/api/case/case-plans?&rowPerPage=${Number(row_per_page)}&page=${Number(page)}&search=${String(search_info)}`,
        headers: {
          'Content-Type': 'application/json',
          'Cookie': `user=${token}`
        },
        withCredentials: true,
      }
      const response = await axios.request(config);
      setCountRow(response.data.count);
      const updatedData = response.data.rows.map((row: any) => {
        let id = row.casep_id;
        return {
          ...row,
          edit: <ModalEdit getValue={getValueEdit} id_value={id} date_value={row.date_value} bm_time_value={row.casep_time} bm_less_30_value={row.casep_case_less_30} bm_less_2_value={row.casep_case_less_2} bm_more_2_value={row.casep_case_more_2} />,
        };
      });
      setData(updatedData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // ฟังก์ชันสำหรับสร้างข้อมูลใหม่ผ่าน API
  const createData = async () => {
    // หากมีการคลิกแล้ว 1 ครั้งจะหลุดการทำงาน
    if (isPosting) {
      setIsPosting(false);
      return; // If already posting, prevent multiple clicks
    }
    // ถ้าไม่ใช่ให้เปลี่ยนค่าเป็น true เพื่อป้องกันการคลิก
    setIsPosting(true);
    const config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `${pathurl}/api/case/case-plans/create`,
      headers: {
        'Content-Type': 'application/json',
        'Cookie': `user=${token}`
      },
      data: create_value,
      withCredentials: true
    };
    axios.request(config)
      .then((response) => {
        setDateExist(false);
        setIsPosting(false);
        setOpenSnackbar(true);
        setSnackbarMessage('Create Plan Success.');
        fetchCaseData();
      })
      .catch((error) => {
        if (error && error.response && error.response.status === 401) {
          if (error.response.data && error.response.data.exist === 'The date already exists !') {
            console.log('date exist')
            setDateExist(true);
            setOpenSnackbar(false);
            setSnackbarMessage('');
          } else {
            console.log(error);
          }
        } else {
          console.log(error);
        };
      })
  };

  // ฟังก์ชันสำหรับอัพเดทข้อมูลผ่าน API
  const updateData = async () => {
    // หากมีการคลิกแล้ว 1 ครั้งจะหลุดการทำงาน
    if (isPosting) {
      setIsPosting(false);
      return; // If already posting, prevent multiple clicks
    }
    // ถ้าไม่ใช่ให้เปลี่ยนค่าเป็น true เพื่อป้องกันการคลิก
    setIsPosting(true);
    try {
      const config = {
        method: 'put',
        maxBodyLength: Infinity,
        url: `${pathurl}/api/case/case-plans/update/${update_value.api_id_value}`,
        headers: {
          'Content-Type': 'application/json',
          'Cookie': `user=${token}`
        },
        data: update_value,
        withCredentials: true
      };
      const response = await axios.request(config);
      setIsPosting(false);
      setDateExist(false);
      setOpenSnackbar(true);
      fetchCaseData();
      setSnackbarMessage('Update Plan Success.');
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // useEffect สำหรับดึงข้อมูล case plan และตั้งค่า interval ในการดึงข้อมูลทุก 15 วินาที
  useEffect(() => {
    // เปิดหน้าครั้งแรกให้เปิดตัวโหลดแบบ modal แล้วยิง API 
    if (loading) {
      fetchCaseData();
      setOpenSnackbar(false);
      setSnackbarMessage('');
    }
    else { // ครั้งต่อไปยิงทุกๆ 15 วินาที
      const intervalId = setInterval(() => {
        fetchCaseData();
      }, 15000); // Fetch data every 15 seconds
      return () => {
        clearInterval(intervalId); // Cleanup the interval on component unmount
      };
    }
  }, [loading]);

  // useEffect สำหรับดึงข้อมูล case plan เมื่อมีการค้นหาหรือเปลี่ยนหน้า
  useEffect(() => {
    if (!loading) {
      fetchCaseData();
    }
  }, [count_row, page, row_per_page, search_info]);

  // useEffect สำหรับสร้างข้อมูลใหม่เมื่อมีการกระทำการ Create
  useEffect(() => {
    const fetchData = async () => {
      await createData();
    };
    if (!loading) {
      fetchData();
      setOpenSnackbar(false);
      setSnackbarMessage('');
    }
  }, [create_value])

  // useEffect สำหรับอัพเดทข้อมูลเมื่อมีการกระทำการ Edit
  useEffect(() => {
    const fetchData = async () => {
      await updateData();
    };
    if (!loading) {
      if (Object.keys(update_value).length !== 0) {
        fetchData();
        setOpenSnackbar(false);
        setSnackbarMessage('');
      }
    }
  }, [update_value])

  return (
    <main>
      <Menubar />
      {loading ? (
        <LoadingModal open={loading} />
      ) : (
        <div className="container mt-4">
          {/* เมนู CostPlan */}
          <div className="row approve-menu p-3">
            <Menubutton />
          </div>
          <div className="row mt-4">
            <div className="col search" id='search-box'>
              {/* เรียกใช้ Searchbox */}
              <Searchbox get_val={get_search_val} auto_val={text} />
            </div>
            {/* เรียกใช้ Modal */}
            <div className="col mod" id='input-case-plan'>
              <div className='me-3' id='but-modal'>
                <Modal createValue={getValueCreate} date_check={date_exist} setDateExist={setDateExist} />
              </div>
              <div className="d-flex flex-row-reverse">
                <Note />
              </div>
            </div>
          </div>
          <div className="table_approval mt-2">
            {/* เรียกใช้ component ตารางและใส่ parameter */}
            <Tableapproval columns={columns} rows={data} get_page={getPage} get_row_per_page={getRowPerPage} row_per_page={row_per_page} page_row={page} rows_count={count_row} />
          </div>
          <div>
            <Snackbar
              open={open_snackbar}
              autoHideDuration={2000} // Set the duration in milliseconds (2 seconds in this case)
              onClose={() => setOpenSnackbar(false)}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
              <SnackbarContent
                style={{ backgroundColor: 'green' }}
                message={snackbar_message}
                action={
                  <IconButton size="small" aria-label="close" color="inherit" onClick={() => setOpenSnackbar(false)}>
                    <CloseIcon fontSize="small" />
                  </IconButton>
                }
              />
            </Snackbar>
          </div>
        </div>
      )}
    </main>
  )
}

export default casePlan;