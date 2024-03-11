/*
* c_box.tsx
* component box
* @input -
* @output Check-in
* @author Naruemon,Panuphong
* @Create Date 2567-01-16
*/
import React, { useEffect, useState } from 'react';
import Box from '@mui/system/Box';
import Button from '@mui/material/Button';
import Image from 'next/image';
import ModalCheck from '@/pages/components/c_modal_check/c_modal_check';
import '/src/css/check_attendance.css';
import LoadingModal from '../c_loading/c_loading_modal';

// กำหนด Props สำหรับ BoxBasic component
interface BoxBasicProps {
  item_Data: any;
}
// นิยาม BoxBasic component
const BoxBasic: React.FC<BoxBasicProps> = ({ item_Data }: BoxBasicProps) => {
  // ตัวแปรเปิด modal
  const [is_open, setIsOpen] = useState(false);
  // ตัวแปรส่งข้อมูลของคนที่เลือกเข้าไปยัง modal
  const [selected_item, setSelectedItem] = useState<any | null>(null);
  // ตัวแปรสำหรับใช้งานตัว laoding 
  const [loading, setLoading] = useState(true);
  // ตัวแปรสำหรับการตรวจสอบว่ากดปุ่ม checkin ที่คนไหน
  const [confirm_checkin, setConfirmCheckin] = useState<Array<boolean>>([]);
  // ปิด Modal
  const handleClose = () => {
    setSelectedItem(null);
    setIsOpen(false);
  };

  // เปิด Modal และเพิ่ม item เข้าไป
  const handleOpen = (item: any) => {
    // เก็บค่าข้อมูลของคนที่กด check-in
    setSelectedItem(item);
    // เรียกใช้ฟังก์ชันเพื่อเปิดน้าจอ modal
    setIsOpen(true);

  };

  // รับค่าการ Confirm จาก ModalCheck และทำการอัพเดท confirmed_items
  const confirm = (new_status: number) => {
    // สร้างตัวแปรและเก็บค่า array ของสถานะการกดปุ่ม
    const newConfirmCheckin = [...confirm_checkin];
    // ให้สถานะที่ index นั้นๆ เป็น true
    newConfirmCheckin[new_status] = true;
    // เพิ่มข้อมูลเข้าไปในตัวแปร confirm_checkin
    setConfirmCheckin(newConfirmCheckin);
  }


  useEffect(() => {
    // ตรวจสอบข้อมูล item_Data และกำหนดค่า loading เมื่อได้ข้อมูล
    if (item_Data && Array.isArray(item_Data)) {
      // เมื่อค่าของ item_Data มีการเปลี่ยนแปลงให้ค่าการกดปุ่ม checkin เป็นค่าว่าง
      setConfirmCheckin([]);
      setLoading(false);
      handleOpen; // ถ้าคุณต้องการเปิด modal สำหรับ item แรก
    }
  }, [item_Data]);
  // คืนค่า JSX ที่ประกอบด้วย Box และ ModalCheck
  return (
    <Box component="section">
      {/* ถ้ามีข้อมูลให้แสดงข้อมูลทั้งหมด */}
      {(!loading) ? (
        item_Data && Array.isArray(item_Data) && item_Data.length > 0 ? (
          item_Data.map((item: any) => (
            <Box className='box_checkAttendance rounded-4 shadow row mt-2' key={`${item.img}-${item.user_emp_id}`}>
              {/* แสดงรูปของพนักงาน */}
              <Image
                className='col-1 image-box'
                width={103}
                height={110.18}
                src={`data:${item.pic_type};base64,${item.pic_img}`}
                alt={item.name}
                loading="lazy"
              />
              {/* แสดงข้อมูลของพนักงาน */}
              <Box className='text_name_maintenance col'>
                <h4>{item.name}</h4>
                Position: {item.user_roles} <br />
                Working Time: {item.work_time} <br />
              </Box>
              {/* ปุ่ม check-in */}
              <div className='check col' id={`botton-check-in-${item.id}`}>
                <Button
                  className={`check_in ${item.id}`}
                  variant="contained"
                  color='success'
                  onClick={() => handleOpen(item)}
                  key={item.id}
                  disabled={(confirm_checkin[item.user_emp_id] === true || item.user_status === 1)}
                >
                  Check in
                </Button>
              </div>
            </Box>
          ))
        ) : (
          <div className='box_checkAttendance rounded-4 shadow row mt-2  d-flex justify-content-center align-items-center'>
            <div className='d-flex justify-content-center align-items-center' style={{fontSize: '40px'}}>No Data Here</div>
          </div>
        )
      ) : (
        <div>
          <LoadingModal open={loading} />
        </div>
      )}
      {/* เปิด modal ถ้า is_open เป็นจริง */}
      {is_open && (
        <ModalCheck
          is_open={is_open}
          onClose={handleClose}
          selected_item={selected_item}
          onConfirm={confirm}
        />
      )}
    </Box>
  );
};

export default BoxBasic;




