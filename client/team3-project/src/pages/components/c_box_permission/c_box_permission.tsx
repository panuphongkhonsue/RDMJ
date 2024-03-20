/*
* c_box_permission.tsx
* component box permission
* @input worktime,permission
* @output show card employee data and can edit worktime and permission
* @author Panuphong,Suphattra
* @Create Date 2567-02-16
*/

import React, { useEffect, useState } from "react";
import BoxList from "@mui/system/Box";
import BoxListItem from "@mui/system/Box";
import "/src/css/check_attendance.css";
import Image from "next/image";
import Selectcomponent from "@/pages/components/c_select/c_select";
import HoverWorkTime from "../c_hover_permission/c_hover_permission";
import Input from "@mui/joy/Input";
import Button from "@mui/material/Button";
import ConfirmationModal from "@/pages/components/c_box_permission/c_modal_permission"; // Import ConfirmationModal
import axios from "axios";
import LoadingModal from "../c_loading/c_loading_modal";
import { Unstable_Popup as BasePopup } from '@mui/base/Unstable_Popup';
import { styled } from '@mui/system';
import Cookies from "js-cookie";
import Loading from "../c_loading/c_loading_circle";
// พิมพ์เขียวสำหรับรับค่าคุณสมบัติของตัว Select
type Props = {
  search: string;
  // ฟังก์ชันสำรับเปิด snackbar ที่หน้า index
  openSnackbar: (value: boolean) => void
};

//ตัวเเปรสำหรับปรับ Permission employee
const options_permission = [
  { value: 1, label: "Viewer" },
  { value: 0, label: "Editor" },
];

//ตัวเเปรสำหรับเปลี่ยนกะการทำงาน employee
const options_time = [
  { value: 'B', label: "20.00 ~ 05.00" },
  { value: 'A', label: "08.00 ~ 17.00" },
];

export default function boxBasic({ search, openSnackbar }: Props) {
  // ตัวแปรสำหรับเก็บค่าแอนิเมชันโหลดถ้าเป็น true จะขึ้นหน้าโหลดแบบ Modal
  const [loading, setLoading] = useState(true);
  // ฟังก์ชันในการอัปเดตค่าของ item_data
  const [item_data, setItemData] = useState<any[]>([]);
  // ฟังก์ชันที่ใช้ในการอัปเดตค่าของ selected
  const [selected_value, setSelectedValue] = React.useState<any>({});
  const [selected_value_worktime, setSelectedValueWorktime] = React.useState(false);
  const [date, setDate] = React.useState('');
  // ฟังก์ชันสำหรับเปิด Modal ยืนยัน เพื่อทำการบันทึกข้อมูล
  const [open_confirmation, setOpenConfirmation] = useState(false);
  // ฟังก์ชันสำหรับการเเสดงหรือซ่อนปุ่มของ SelectDate
  const [show_select_date, setShowSelectDate] = React.useState(false);

  // ฟังก์ชันสำหรับการเเสดงหรือซ่อนปุ่มของ Reset เเละ Save
  const [show_reset_save_buttons, setShowResetSaveButtons] = useState(false);

  //ฟังก์ชันที่ใช้ในการอัปเดตค่าของ Item data
  const [item_state, setItem] = useState(item_data);
  // ตัวแปรรีเซ็ตค่าตัวเลือก
  const [reset_select_value, setResetSelectValue] = useState(false);
  //ตัวแปรสำหรับเก็บคุกกี้
  const token = Cookies.get('user');
  const today = new Date().toISOString().split('T')[0];
  // ตัวแปรสำหรับการป้องกันการ double click
  const [isPosting, setIsPosting] = useState(false);
  // ตัวแปรจำนวนข้อมูลที่ดึงจาก api
  const [count_user, setCountUser] = React.useState(0);
  // จำนวนจำกัดแสดงรายการต่อหน้า
  const [limit_user, setLimitUser] = React.useState(5);
  // ตัวแปรสำหรับเปิดปิด loading เมื่อกด show more
  const [loading_circle, setLoadingCircle] = React.useState(false);
  // ตัวแปรเก็บ url ของ การยิง api
  const pathurl = process.env.NEXT_PUBLIC_APP_URL;
  // ฟังก์ชันสำหรับการรับค่า selectDate เพื่อให้  Reset เเละ Save เเสดง
  const handleSelectDate = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedDate = event.target.value;
    setDate(selectedDate);
    setShowResetSaveButtons(true);
  };
  const handleSaveClick = () => {
    // เปิด modal ยืนยันเมื่อคลิกปุ่ม Save
    setOpenConfirmation(true);
  };
  // ฟังก์ชันเมื่อกดปุ่ม show more
  const setLimit = () => {
    setLimitUser(prevLimit => prevLimit + 5);
    setLoadingCircle(true);
  }
  //ฟังก์ชันเพื่อใช้ในการปิด Modal ยืนยัน เมื่อกด Close หรือ Save
  const handleConfirmationClose = () => {
    // ปิด modal ยืนยัน
    setOpenConfirmation(false);
  };
  //เมื่อทำการกด Save จะปิด Modal ยืนยัน
  const handleConfirmationSave = () => {
    // ถ้ามีการคลิกแล้ว 1 ครั้งให้หลุดออกไป
    if (isPosting) {
      // แล้วปรับให้ปุ่มกลับมาคลิกได้
      setIsPosting(false);
      return; // If already posting, prevent multiple clicks
    }
    // ถ้าไม่ใช่ให้เปลี่ยนค่าเป็น true เพื่อป้องกันการ double click
    setIsPosting(true);
    const data = {
      allData: selected_value,
      dateToChangeWorkTime: date,
    }
    const insertLog = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `${pathurl}/api/user-manage/user-insert-log`,
      headers: { 'Content-Type': 'application/json', 'Cookie': `user=${token}`, },
      data: data,
      withCredentials: true
    }
    axios.request(insertLog)
      .then((response) => {
        // ถ้าทำงานได้จะปิดการ default ทุกค่า
        openSnackbar(true);
        setIsPosting(false);
        setSelectedValue({})
        setItem([...item_data]);
        setDate('');
        setShowResetSaveButtons(false);
        setShowSelectDate(false);
        setSelectedValueWorktime(false);
        setResetSelectValue(false);
      })
      .catch((error) => {
        console.log(error);
      });
    // ปิดปุ่ม เปลี่ยนค่าใน select
    setOpenConfirmation(false);
    // ทำการบันทึกข้อมูล
  };

  // ฟังก์ชันเก็บค่าข้อมูลที่เลือกผู้ใช้ที่จะแก้ไข
  const getSelectedValues = (newStatus: string, type: string, employee_id: number) => {
    // ถ้าเลือก Permission จะทำการเปิดปุ่ม save และ reset
    if (type === "perMissionChangeTo") {

      // ถ้าแก้แค่ permission จะแสดงปุ่ม save และ reset
      if (!selected_value_worktime) {
        setShowResetSaveButtons(true);
      }
    }
    // ถ้าไม่ใช่จะไปเปิดของแก้ไขกะ
    else {
      setShowSelectDate(true);
      setSelectedValueWorktime(true);
      setShowResetSaveButtons(false);
    }
    // reset ค่าที่เลือกใน select
    setResetSelectValue(true);
    setSelectedValue((prevValues: any) => ({
      ...prevValues,
      [employee_id]: {
        ...prevValues[employee_id], // Preserve existing values
        empID: employee_id,
        [type]: type === "perMissionChangeTo" ? parseInt(newStatus) : newStatus,
      },
    }));
  };
  // เมื่อคลิกปุ่ม reset จะทำการคืนค่า default ทุกค่า
  const handleResetClick = () => {
    setItem([...item_data]);
    setDate('');
    setShowSelectDate(false);
    // ตั้งค่า selected_value เป็นค่าเริ่มต้น
    setSelectedValue({});
    setShowResetSaveButtons(false);
    openSnackbar(false);
    setResetSelectValue(false);
    setSelectedValueWorktime(false);
  };
  //ตัวเเปรในการสร้างปุ่ม reset_button 
  const reset_button = (
    <Button className="button_reset" id="Button_reset" onClick={handleResetClick}>Reset</Button>
  );

  //ตัวเเปรในการสร้างปุ่ม save_button 
  const save_button = (
    <Button className="button_save" id="Button_save" onClick={handleSaveClick}>Save</Button>
  );

  //การประกาศตัวเเปรในการ axios 
  let getDataAll = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${pathurl}/api/user-manage/user-manage?search=${String(search)}&limit=${Number(limit_user)}`,
    headers: { 'Cookie': `user=${token}` },
    withCredentials: true
  };
  const fetchUserData = async () => {
    axios.request(getDataAll)
      .then((response) => {
        const updateData = response.data.result.map((row: any) => {
          let work_time_text = ""
          if (row.user_work_time === "A" || row.user_work_time === "D") {
            work_time_text = "08.00 ~ 17.00"
          } else {
            work_time_text = "20.00 ~ 05.00"
          }
          let permission = ""
          if (row.user_permission == "1") {
            permission = "Viewer"
          } else {
            permission = "Editor"
          }
          return {
            ...row,
            working: work_time_text,
            permission: permission
          }
        })
        // เพิ่มค่าที่ได้จาก api เข้าไปในตัวแปรเพื่อนำไปใช้
        setCountUser(response.data.totalCount)
        setItemData(updateData)
        setItem(updateData)
        setLoading(false);
        setLoadingCircle(false);
      })
      .catch((error) => {
        console.log(error);
      });
  }
  // เมื่อเข้าหน้าครั้งแรกจะทำการยิง API เพื่อค้นหาข้อมูลหลังจากนั้นจะยิง API ทุก ๆ 15 วินาที
  useEffect(() => {
    if (loading) {
        fetchUserData();
        setResetSelectValue(true);

    }
    else { // ครั้งต่อไปยิงทุกๆ 15 วินาที
      const intervalId = setInterval(() => {
        fetchUserData();
      }, 15000); // Fetch data every 15 seconds
      return () => {
        clearInterval(intervalId); // Cleanup the interval on component unmount
      };
    }
  }, [item_data]);
  // หากมีการค้นหาชื่อพนักงานจะทำการยิง API ทันที
  useEffect(() => {
    if (!loading) {
      fetchUserData();
    }
    if (!reset_select_value) {
      fetchUserData();
    }
  }, [search, limit_user, reset_select_value]);
  
  return (

    <BoxList component="section">
      {loading ? (
        <LoadingModal open={loading} />
      ) : (
        item_state && Array.isArray(item_state) && item_state.length > 0 ? (
          <div>
            {/* ถ้ามีการแก้ไขกะหรือสิทธ์พนักงานจะแสดง element ทั้งหมด */}
            {(show_reset_save_buttons || show_select_date) && (
              <div className="row box-show">
                <div className="col-3"></div>
                <div className="col-6 d-flex justify-content-end">
                  <div className="row d-flex justify-content-end align-items-end">
                    <div className="col">
                      {/* ถ้าแก้ไขกะจะทำการแสดงตัวเลือกวันที่ */}
                      {show_select_date && (
                        <Input
                          id='input-date'
                          type="date"
                          className="select_date"
                          onChange={handleSelectDate}
                          slotProps={{
                            input: {
                              min: today as string,
                            },
                          }}
                          value={date}
                        />
                      )}
                    </div>
                  </div>
                </div>
                {/* ถ้าแก้ไขสิทธ์จะแสดงปุ่ม reset และ save */}
                <div className="col-3 d-flex flex-row justify-content-start align-items-end mb-1">
                  {show_reset_save_buttons && (
                    <>
                      {reset_button}
                      {save_button}
                    </>
                  )}
                </div>
              </div>
            )}

            {item_state.map((item, index) => (
              <BoxListItem
                key={index}
                className="box_permission rounded-4 shadow row mt-2"
                style={{
                  border: `1px solid ${item.wte_date_to_change !== null && item.wte_status_change !== 1 && item.wte_status_change !== null ? 'yellow' : 'white'}`,
                }}
              >
                <Image
                  className="col-1 image-box"
                  width={103}
                  height={110.18}
                  src={`data:${item.pic_type};base64,${item.pic_img}`}
                  alt={item.name}
                  loading="lazy"
                />
                <div className="text_name_maintenance col">
                  <h4>{item.name}</h4>
                  Position: {item.user_roles} <br />
                  Working Time :
                  <div
                    className="select_time"
                    id={`select_time_${index}`}
                  >
                    {/* ตัวเลือกเปลี่ยนกะ */}
                    <Selectcomponent
                      get_val={(newStatus) => getSelectedValues(newStatus, "workTimeChangeTo", item.user_emp_id)}
                      width={"174px"}
                      size_select={"small"}
                      text={item.working}
                      pad={"5px 0px 5px 0px"}
                      font_size={16}
                      options={options_time}
                      margin-left={"100px"}
                      value_set={reset_select_value}
                    />
                    <div />

                  </div>
                </div>
                <div className="select_permission col">
                  <div className="row">
                    <div className="col select-permission" id={`select_permission_${index}`}>
                      {/* เรียกใช้ Selectcomponent เพื่อเเก้ไข Permission employee */}
                      <Selectcomponent
                        get_val={(newStatus) => getSelectedValues(newStatus, "perMissionChangeTo", item.user_emp_id)}
                        width={"174px"}
                        size_select={"small"}
                        text={item.permission}
                        pad={"5px 0px 5px 0px"}
                        font_size={16}
                        options={options_permission}
                        value_set={reset_select_value}
                      />
                    </div>
                    <div className="col">
                      {/* ถ้ามีค่าการเปลี่ยนแปลงกะจะแสดง สัญลักษณ์เมื่อ Hover จะแสดงว่าข้อมูลจะถูกเปลี่ยนเมื่อวันใด */}
                      {item.wte_date_to_change !== null && item.wte_status_change !== 1 && (
                        <HoverWorkTime date_to_change={item.wte_date_to_change}/>
                      )}
                    </div>
                  </div>
                </div>
              </BoxListItem>
            ))}
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
            {/* เปิด modal */}
            <ConfirmationModal
              open={open_confirmation}
              onClose={handleConfirmationClose}
              onConfirm={handleConfirmationSave}
            />
          </div>
        ) : (
          <div className='box_permission rounded-4 shadow row mt-2  d-flex justify-content-center align-items-center'>
            <div className='d-flex justify-content-center align-items-center' style={{ fontSize: '40px' }}>No Data Here</div>
          </div>
        )
      )}
    </BoxList>
  );
}
