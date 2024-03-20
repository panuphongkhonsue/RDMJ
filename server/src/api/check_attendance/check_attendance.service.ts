/*
* check_attendance.service.ts
* component box
* @input -
* @output -
* @author Naruemon,Panuphong
* @Create Date 2567-01-16
*/
import database from "../../config/database";
import { RowDataPacket } from 'mysql2';
import cron from 'node-cron';
const jwt = require("jsonwebtoken");
// ดึงข้อมูลการเช็คชื่อทั้งหมดจากฐานข้อมูล
export const getcheck_attendance_all = (search: string,limits:number, callBack: (error: any, result: any) => void) => {
    database.query(
        "SELECT user_emp_id, name, user_roles, user_work_time, pic_type, pic_img, user_status FROM rdmj_database.rdmj_user " +
        "JOIN user ON `Employee no.` = user_emp_id " +
        "JOIN picture ON pic_id = user_pic_id " +
        "WHERE name like ?" +
        "ORDER BY " +
        "CASE " +
        "   WHEN (user_work_time = 'A' AND TIME(CONVERT_TZ(CURRENT_TIME(), 'UTC', 'Asia/Bangkok')) BETWEEN '06:00:00' AND '18:59:59') THEN 1 " +
        "   WHEN (user_work_time = 'B' AND TIME(CONVERT_TZ(CURRENT_TIME(), 'UTC', 'Asia/Bangkok')) BETWEEN '19:00:00' AND '23:59:59' OR TIME(CONVERT_TZ(CURRENT_TIME(), 'UTC', 'Asia/Bangkok')) BETWEEN '00:00:00' AND '05:59:59') THEN 2 " +
        "   WHEN (user_work_time = 'D' AND TIME(CONVERT_TZ(CURRENT_TIME(), 'UTC', 'Asia/Bangkok')) BETWEEN '06:00:00' AND '18:59:59') THEN 1 " +
        "   ELSE 3 " +
        "END, " +
        "user_status desc,name " +
        "Limit ?; ",
        [`%${search}%`,limits],
        (err, results, fields) => {
            if (err) {
                console.error('Error in database query:', err);
                return callBack(err, null);
            }
            return callBack(null, results);
        }
    );
};
// ค้นหาจำนวนทั้งหมดของพนักงาน
export const get_check_count_user = (search:string,callBack: (error: any, result: any) => void) => {
    database.query(
        "SELECT count(name) as count FROM user WHERE name like ? ; ",
        [`%${search}%`],
        (err, results, fields) => {
            if (err) {
                console.error('Error in database query:', err);
                return callBack(err, null);
            }
            return callBack(null, results);
        }
    );
};
// ดึงข้อมูลชื่อพนักงานมาทั้งหมด
export const get_name = (callBack: (error: any, result: any) => void) => {
    database.query(
        "SELECT name  FROM user ORDER BY name; ",
        [],
        (err, results, fields) => {
            if (err) {
                console.error('Error in database query:', err);
                return callBack(err, null);
            }
            return callBack(null, results);
        }
    );
};
// ดึงข้อมูลชื่อพนักงานมาทั้งหมด
export const get_id = (callBack: (error: any, result: any) => void) => {
    database.query(
        "SELECT user_emp_id FROM rdmj_database.rdmj_user; ",
        [],
        (err, results, fields) => {
            if (err) {
                console.error('Error in database query:', err);
                return callBack(err, null);
            }
            return callBack(null, results);
        }
    );
};
const currentDate = new Date();
const options = { timeZone: 'Asia/Bangkok' };
currentDate.toLocaleString('en-US', options);

const date = currentDate.toISOString().split("T")[0];
const hour = String(currentDate.getHours()).padStart(2, '0');
const minute = String(currentDate.getMinutes()).padStart(2, '0');
const second = String(currentDate.getSeconds()).padStart(2, '0');
const formattedDate = `${date} ${hour}:${minute}:${second}`;

// เพิ่ม timestamp ลงในฐานข้อมูล
export const insert_time_stamp = (user: any, cookieToken: any, callBack: (error: any, result: any) => void) => {
    //ถ้ามีคุกกี้ให้ทำงานดังนี้
    if (cookieToken) {
        // การแปลงข้อมูลโทเคนเป็นข้อมูลและเก็บไว้ในตัวแปร
        const decoded: any = jwt.verify(cookieToken, process.env.JWT_TOKEN_SECRET);
        // ตัวแปรสำหรับเก็บข้อมูลจากโทเคน
        const ChangeDataByID = decoded.user_emp_id;
        const timeStampInsertQuery =
            "INSERT INTO rdmj_database.rdmj_work_time (wt_emp_id, wt_in_time, wt_create_by_id) VALUES (?, ?, ?);";

        database.query(timeStampInsertQuery, [user.user_emp_id, formattedDate, ChangeDataByID], (timeStampErr, timeStampResult, timeStampFields) => {
            if (timeStampErr) {
                console.error('Error in timestamp insert query:', timeStampErr);
                return callBack(timeStampErr, null);
            }

            return callBack(null, timeStampResult);
        });
    }
};

// อัปเดตสถานะผู้ใช้เป็น 1 (เข้างาน)
export const update_user_status = (user: any, callBack: (error: any, result: any) => void) => {
    const updateUserStatusQuery = "UPDATE rdmj_database.rdmj_user SET user_status = 1 WHERE user_emp_id = ?;";

    database.query(updateUserStatusQuery, [user.user_emp_id], (updateErr, updateResult, updateFields) => {
        if (updateErr) {
            console.error('Error in role_status update query:', updateErr);
            return callBack(updateErr, null);
        }

        return callBack(null, updateResult);
    });
};
// อัปเดตสถานะผู้ใช้เป็น 0 (ออกงาน)
export const reset_user_status = (user: any, callBack: (error: any, result: any) => void) => {
    const updateUserStatusQuery = "UPDATE rdmj_database.rdmj_user SET user_status = 0 WHERE user_emp_id = ? and user_status = 1;";

    database.query(updateUserStatusQuery, [user], (updateErr, updateResult, updateFields) => {
        if (updateErr) {
            console.error('Error in role_status update query:', updateErr);
            return callBack(updateErr, null);
        }

        return callBack(null, updateResult);
    });
};
function formatThaiDate(date: any) {
    const options = {
        timeZone: 'Asia/Bangkok',
        hour: '2-digit',
        hour12: false // Set to false for 24-hour format
    };
    return date.toLocaleString('en-US', options);
}




export default { getcheck_attendance_all, insert_time_stamp, update_user_status,get_check_count_user,get_name,get_id,reset_user_status }