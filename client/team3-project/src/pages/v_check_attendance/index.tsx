/*
* v_check_attendance
* แสดงหน้า Check Attendance
* @input -
* @output Check-in
* @author Naruemon,Panuphong
* @Create Date 2567-01-16
*/
import React, { useEffect, useState } from 'react';
import Menubar from '../components/c_menubar/c_menubar';
import "/src/css/check_attendance.css";
import BoxBasic from '@/pages/components/c_box/c_box';
import Searchbox from '@/pages/components/c_search_box/c_search_box';
import axios from 'axios';
import LoadingModal from '../components/c_loading/c_loading_modal';
import Button from '@mui/material/Button';
import Loading from '../components/c_loading/c_loading_circle';
import Cookies from "js-cookie";
type Props = {}



const checkAttendance: React.FC<Props> = () => {
    // State เพื่อเก็บข้อมูลการเช็คที่ดึงมาจากเซิร์ฟเวอร์
    const [check_data, setCheckData] = useState();
    // ตัวแปรสำหรับเก็บค่าแอนิเมชันโหลดถ้าเป็น true จะขึ้นหน้าโหลดแบบ Modal
    const [loading, setLoading] = useState(true);
    // State เพื่อเก็บค่าการค้นหา
    const [search_info, setSearchInfo] = React.useState('');
    // ตัวแปรจำนวนข้อมูลที่ดึงจาก api
    const [count_user, setCountUser] = React.useState(0);
    // จำนวนจำกัดแสดงรายการต่อหน้า
    const [limit_user, setLimitUser] = React.useState(5);
    // ตัวแปรสำหรับเปิดปิด loading เมื่อกด show more
    const [loading_circle, setLoadingCircle] = React.useState(false);
    // ตัวแปรสำหรับชื่อพนักงาน autocomplete
    const [text, setText] = React.useState<any>();
    //ตัวแปรสำหรับเก็บคุกกี้
    const token = Cookies.get('user');
    // ฟังก์ชันสำหรับอัปเดตค่าค้นหา
    const getSearchVal = (new_search_val: string) => {
        setSearchInfo(new_search_val);
    }
    // ฟังก์ชันเมื่อกดปุ่ม show more
    const setLimit = () => {
        setLimitUser(prevLimit => prevLimit + 5);
        setLoadingCircle(true);
    }
    // ตัวแปรสำรับเก็บค่า url ของ api
    const pathurl = process.env.NEXT_PUBLIC_APP_URL;
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
        const auto_complete = response_name.data.map((data: any) => data.name);
        setText(auto_complete);
    }
    // ฟังก์ชันสำหรับดึงข้อมูลผู้ใช้จากเซิร์ฟเวอร์
    const fetchUserData = async () => {
        try {
            // กำหนดค่า Axios สำหรับการเรียก API
            let configUser = {
                method: 'get',
                maxBodyLength: Infinity,
                url: `${pathurl}/api/check-attendance/?search=${search_info}&limit=${limit_user}`,
                headers:{'Cookie': `user=${token}`},
                withCredentials: true,
            };
            // ทำการเรียก API
            const response = await axios.request(configUser);
            // ทำการ map ข้อมูลที่ได้มาและอัปเดต state พร้อมข้อมูลเพิ่มเติม
            const updated_data = response.data.result.map((row: any) => {
                let status_work_time = '';
                if (row.user_work_time == "B") {
                    status_work_time = '20.00 - 05.00';
                } else {
                    status_work_time = '08.00 - 17.00';
                }
                // คืนค่าข้อมูลที่ถูกอัปเดตพร้อมข้อมูลเพิ่มเติม
                return {
                    ...row,
                    work_time: status_work_time,
                };
            });
            setCountUser(response.data.totalCount)
            // ตั้งค่าข้อมูลที่ถูกอัปเดตใน state
            setCheckData(updated_data);
            // ปิดหน้า load
            setLoading(false);
            setLoadingCircle(false);
        } catch (error) {
            // จัดการข้อผิดพลาด
            console.error(error);
        }
    }
    // useEffect เพื่อดึงข้อมูลผู้ใช้เมื่อ component ถูกโหลด
    useEffect(() => {
        if (loading) {
            fetchUserData();
            fetchUserName();
        }
        else { // ครั้งต่อไปยิงทุกๆ 15 วินาที
            const intervalId = setInterval(() => {
                fetchUserData();
            }, 15000); // Fetch data every 15 seconds
            return () => {
                clearInterval(intervalId); // Cleanup the interval on component unmount
            };
        }
    }, [check_data]);
    // ยิง API เมื่อมีการค้นหา
    useEffect(() => {
        if (!loading) {
            fetchUserData();
        }
    }, [search_info, limit_user]);
    return (
        <main>
            {/* Render Menubar component */}
            <Menubar />
            {loading ? (
                <LoadingModal open={loading} />
            ) : (
                <div>
                    {/* Container หลัก */}
                    <div className="container">
                        {/* แถวของหัวข้อ */}
                        <div className="row CheckAttendance text_header p-5">
                            <h2 style={{ fontFamily: 'IBM Plex Sans Thai, sans-serif' }}>CHECK ATTENDANCE</h2>
                        </div>

                        {/* กล่องค้นหาและแถวข้อความสถานะ */}
                        <div className="row note-status">
                            <div className="col-2"></div>
                            {/* Render Searchbox component */}
                            <div className="col-3 d-flex justify-content-center" id='search-box'><Searchbox get_val={getSearchVal} auto_val={text} /></div>
                            <div className="col-2"></div>
                            <div className="col"></div>
                        </div>

                        {/* แถวแสดงข้อมูล */}
                        <div className="row mt-3">
                            <div className="col">
                                {/* Render BoxBasic component พร้อมข้อมูลที่ถูกดึงมา */}
                                <BoxBasic item_Data={check_data} />
                            </div>
                        </div>
                        <div className="show-more m-3 ">
                            {loading_circle ? (
                                <Loading height='5vh' width='5vh' color='grey' size={30} thickness={3} />
                            ) : (
                                // Second ternary operator for rendering "Show More" button
                                count_user >= limit_user ? (
                                    <Button onClick={setLimit}>Show More</Button>
                                ) : (
                                    // You can render another component or null based on condition2
                                    null
                                )
                            )}
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}

export default checkAttendance;
