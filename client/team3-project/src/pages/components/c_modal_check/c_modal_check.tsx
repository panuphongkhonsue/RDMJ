/*
* c_modal_check
* componant modal check attendance
* @input -
* @output Check-in
* @author Naruemon,Panuphong
* @Create Date 2567-01-16
*/
import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import DialogTitle from '@mui/joy/DialogTitle';
import Image from 'next/image';
import Box from '@mui/system/Box';
import '/src/css/modal_check_attendance.css';
import axios from 'axios';
import Cookies from "js-cookie";

// กำหนด Props สำหรับ ModalCheck component
interface ModalCheckProps {
  is_open: boolean;
  onClose: () => void;  // ส่งค่า cancelClicked กลับไป
  selected_item: any;
  onConfirm: (emp_id: number) => void; // อัพเดท Props นี้
}

// นิยาม ModalCheck component
const ModalCheck: React.FC<ModalCheckProps> = ({ is_open, onClose, selected_item, onConfirm }) => {
  const [cancel_clicked, setCancelClicked] = useState<boolean>(false);
  const [confirm_button_disabled, setIsConfirmButtonDisabled] = useState<boolean>(false);
  // ตัวแปร สำหรับตรวจสอบการคลิกเพื่อป้องกันการ double click
  const [isPosting, setIsPosting] = useState(false);
  //ตัวแปรสำหรับเก็บคุกกี้
  const token = Cookies.get('user');
  const pathurl = process.env.NEXT_PUBLIC_APP_URL;
  // ปุ่ม Confirm
  const confirm_button = (
    <Button
      className="confirm_button"
      type="submit"
      color="success"
      variant="contained"
      onClick={() => {
        onConfirm(selected_item.user_emp_id); // ส่งค่าตรงข้ามกลับไป
      }}
    >
      Confirm
    </Button>
  );

  // ปุ่ม Cancel
  const cancel_button = (
    <Button
      className="cancel_button"
      type="button"
      variant="contained"
      onClick={() => {
        setCancelClicked(true);
        onClose();
      }}
    >
      Cancel
    </Button>
  );
  // ฟังก์ชันสำหรับจัดการการ Submit ฟอร์ม
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // ถ้ามีการคลิกแล้วให้หลุดออกไปทันทีไม่ทำงานในส่วนนี้
    if (isPosting) {
      // จากนั้นเปลี่ยนค่ากลับไปเป็น false
      setIsPosting(false);
      return; // If already posting, prevent multiple clicks
    }
    // ถ้าไม่ใช่ให้เป็น true เพื่อกำหนดไว้ว่ามีการคลิกแล้วเพื่อป้องกันการ double click
    setIsPosting(true);
    // ทำการเรียก API ต่าง ๆ
    axios.request(configInsert);
    axios.request(configUpdate);
    setIsPosting(false);
    // อัพเดท state เพื่อเปิดให้ปุ่ม Confirm ใช้งานได้
    setIsConfirmButtonDisabled(false);

    // ปิด Modal
    onClose();
  };

  // สร้างข้อมูล JSON สำหรับส่งไปที่ API
  let data = JSON.stringify({
    "user_work_time": selected_item?.user_work_time,
    "user_emp_id": selected_item?.user_emp_id,
  });
  // กำหนดค่า Config สำหรับแต่ละ API
  let configInsert = {
    method: 'post',
    maxBodyLength: Infinity,
    url: `${pathurl}/api/check-attendance/timestamp`,
    headers: {
      'Content-Type': 'application/json',
      'Cookie': `user=${token}`
    },
    data: data,
    withCredentials: true
  };
  let configUpdate = {
    method: 'put',
    maxBodyLength: Infinity,
    url: `${pathurl}/api/check-attendance/update-status`,
    headers: {
      'Content-Type': 'application/json',
      'Cookie': `user=${token}`
    },
    data: data,
    withCredentials: true
  };

  // คืนค่า JSX ที่รวม Modal และ Form ใน Component
  return (
    <Modal open={is_open} onClose={() => onClose()}>
      <ModalDialog>
        <form onSubmit={handleSubmit}>
          <Box>
            <Box className='box_check rounded-4 row mt-2'>
              <DialogTitle>
                <div> <h4>Do you want to confirm for work?</h4></div>
              </DialogTitle>
              {selected_item && selected_item.pic_img &&
                <Box className='col-1 image-box'>
                  <Image
                    width={80}
                    height={95}
                    src={`data:${selected_item.pic_type};base64,${selected_item.pic_img}`}
                    alt={selected_item.name}
                    loading="lazy"
                  />
                </Box>
              }
              <Box className='text_name_maintenance col'>
                <h5>{selected_item?.name}</h5>
                Position: {selected_item?.user_roles} <br />
                Working Time: {selected_item?.work_time} <br />
              </Box>
              {/* Render ปุ่ม Cancel */}
              {cancel_button}
              {/* Render ปุ่ม Confirm */}
              {confirm_button}
            </Box>
          </Box>
        </form>
      </ModalDialog>
    </Modal>
  );
};

export default ModalCheck;

