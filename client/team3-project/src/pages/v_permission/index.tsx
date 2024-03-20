/*
* v_Permission
* edit permission and change work time&date of employee
* @input  permission and work time&date
* @output sending to db
* @author Suphattra Prombut,Panuphong
* @Create Date 2567-02-16
*/
import React, { useState , useEffect } from "react";
import Menubar from "../components/c_menubar/c_menubar";
import "/src/css/permission.css";
import Searchbox from "@/pages/components/c_search_box/c_search_box";
import Boxbasic from "@/pages/components/c_box_permission/c_box_permission";
import Snackbar from '@mui/material/Snackbar';
import SnackbarContent from '@mui/material/SnackbarContent';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
import Cookies from "js-cookie";

type Props = {};

export default function User_manage_permission({ }: Props) {
  // ตัวแปรสำหรับเปิด Snackbar
  const [open_snack_bar, setOpenSnackbar] = useState(false);
  // ตัวแปรสำหรับใส่ข้อความใน Snackbar
  const [snack_bar_message, setSnackbarMessage] = useState('Update Successful');
  // ตัวแปรทำให้ดึงข้อมูลชื่อพนักงานเพียงแค่ครั้งแรก
  const [stop_hook,setStopHook] = useState(true);
  // ฟังก์ชันเปิด Snackbar ที่ส่งมาจาก component
  const setOpen = (new_status: boolean) => {
    setOpenSnackbar(new_status);
  };
  const [search_info, setSearchInfo] = React.useState('');
  // ตัวแปรสำหรับชื่อพนักงาน autocomplete
  const [text, setText] = React.useState<any>();
  //ตัวแปรสำหรับเก็บคุกกี้
  const token = Cookies.get('user');
  // ตัวแปรสำรับเก็บค่า url ของ api
  const pathurl = process.env.NEXT_PUBLIC_APP_URL;
  // ฟังก์ชันรับค่าจากตัว ค้นหา
  const getSearchVal = (new_search_val: string) => {
    setSearchInfo(new_search_val);
  };
  // ฟังก์ชันดึงข้อมูลชื่อพนักงานเพื่อแสดงในกล่องค้นหา
  const fetchUserName = async () => {
    let configNameUser = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `${pathurl}/api/check-attendance/get-name`,
      headers:{'Cookie': `user=${token}`},
      withCredentials: true,
    };
    const response_name = await axios.request(configNameUser);
    // เก็บข้อมูลชื่อเพื่อทำ autocomplete ในกล่องค้นหา
    const auto_complete = await response_name.data.map((data: any) => data.name);
    setText(auto_complete);
    setStopHook(false);
  }
  useEffect(() => {
    if(stop_hook){
      fetchUserName();
      setStopHook(false);
    }
  },[stop_hook])  
  return (
    <main>
      <Menubar />
      <div className="container">
        <div className="row CheckAttendance text_header p-5" >
          <h2 style={{ fontFamily: 'IBM Plex Sans Thai, sans-serif' }}>PERMISSION</h2>
        </div>
        <div className="row note-status">
          <div className="col-6 d-flex justify-content-center ms-5">
            <Searchbox get_val={getSearchVal} auto_val={text} />
          </div>
          <div className="col-6"></div>
        </div>
        <div className="row mt-2">
          <div className="col" id="searchbox" >
            <Boxbasic search={search_info} openSnackbar={setOpen} />
          </div>
        </div>
        <div>
          <Snackbar
            open={open_snack_bar}
            autoHideDuration={2000} // Set the duration in milliseconds (2 seconds in this case)
            onClose={() => setOpenSnackbar(false)}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          >
            <SnackbarContent
              style={{ backgroundColor: 'green' }}
              message={snack_bar_message}
              action={
                <IconButton size="small" aria-label="close" color="inherit" onClick={() => setOpenSnackbar(false)}>
                  <CloseIcon fontSize="small" />
                </IconButton>
              }
            />
          </Snackbar>
        </div>
      </div>
    </main>
  );
}
