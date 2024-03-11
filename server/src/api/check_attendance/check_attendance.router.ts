/*
* check_attendance.router.ts
* router for api
* @input -
* @output -
* @author Naruemon,Panuphong
* @Create Date 2567-01-16
*/
import express from 'express';
import check_attendance from './check_attendance.controller';
import  {checkToken}  from '../../auth/token_validation';

const router = express.Router();

// สำหรับดึงข้อมูลทั้งหมดของผู้ใช้
router.get('/',checkToken, check_attendance.getCheckAll);

// สำหรับการเพิ่ม timestamp
router.post('/timestamp',checkToken, check_attendance.getTimeStamp);
// สำหรับการอัปเดตสถานะผู้ใช้
router.put('/update-status',checkToken, check_attendance.updateStatus);

// สำหรับดึงชื่อพนักงานทั้งหมด
router.get('/get-name',checkToken,check_attendance.getName);
export default router