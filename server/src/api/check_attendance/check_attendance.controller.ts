/*
* check_attendance.controler.ts
* component box
* @input -
* @output -
* @author Naruemon,Panuphong
* @Create Date 2567-01-16
*/
import check_atendance from "./check_attendance.service";
const schedule = require("node-cron");
// import { sign } from "crypto";
const getcheck_attendance_all = check_atendance.getcheck_attendance_all
const insert_time_stamp = check_atendance.insert_time_stamp
const update_user_status = check_atendance.update_user_status
const get_check_count_user = check_atendance.get_check_count_user
const get_name = check_atendance.get_name
const get_userid = check_atendance.get_id
const reset_user_status = check_atendance.reset_user_status
// ตัวแปรเก็บข้อมูลการเปลี่ยนแปลงกะการทำงานและสิทธ์
let userData: any;
// ฟังก์ชันสำหรับการยกเลิกงานกำหนดเวลาทั้งหมด
const cancelAllTasks = () => {
    // Cancel all existing tasks
    if (userData !== undefined) {
        userData.forEach((user: any) => {
            if (user.task) {
                user.task.stop();
            }
        });
    }
};
// ฟังก์ชันสำหรับแก้ไขสถานะการออกงาน
const updateUserStatus = () => {
    // Cancel any existing tasks
    cancelAllTasks();
    // เรียกใช้ฟังก์ชันสำหรับเก็บข้อมูล log การเปลี่ยนกะ
    get_userid((err, result) => {
        if (err) {
            console.error(err);
            // Handle the error appropriately, e.g., return an error response
        } else {
            // นำข้อมูลการเปลี่ยนกะเก็บเอาไว้
            userData = result;
            if (userData !== undefined) {
                // // Schedule tasks for each user
                userData.forEach((user: any) => {
                    // console.log(userId);
                    reset_user_status(user.user_emp_id, (err, result) => {
                        if (err) {
                            console.error(err);
                            // Handle the error appropriately, e.g., return an error response
                        }
                    });
                });
            }
            else {
                console.log("User Data is empty");
            }
        }
    });
};
schedule.schedule("0 5,17 * * *", () => {
    console.log("Schedule run Check Attendance");
    updateUserStatus();
}, {
    scheduled: true,
    timezone: "Asia/Bangkok"
});
// ฟังก์์ชันเรียกดึงข้อมูลชื่อพนักงานทั้งหมด
const getName = (req: any, res: any) => {
    get_name((err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        return res.status(201).json(result);
    });
}
// ฟังก์ชันสำหรับดึงข้อมูลการลงเวลาทั้งหมด
const getCheckAll = (req: any, res: any) => {
    const search = req.query.search;
    const limits = Number(req.query.limit);
    getcheck_attendance_all(search, limits, (err, result) => {
        if (err) {
            console.error('Error in getChackAll:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        get_check_count_user(search, (errs, results) => {
            if (errs) {
                console.error('Error in getChackAll:', errs);
                return res.status(500).json({ error: 'Internal Server Error' });
            }
            function arrayBufferToBase64(buffer: any) {
                var binary = '';
                var bytes = new Uint8Array(buffer);
                var len = bytes.byteLength;
                for (var i = 0; i < len; i++) {
                    binary += String.fromCharCode(bytes[i]);
                }
                return btoa(binary);
            }
            for (const index in result) {
                result[index].pic_img = arrayBufferToBase64(result[index].pic_img)
            }
            res.status(201).json({
                totalCount: results[0].count,
                result: result,
            });
        })
    });
}

// ฟังก์ชันสำหรับบันทึก timestamp การลงเวลา
const getTimeStamp = (req: any, res: any) => {
    const user = req.body;
    const cookieToken = req.cookies.user;
    // ตัวแปรสำหรับเก็บข้อมูลโทเคนคุ๊กกี้
    if (!cookieToken) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    insert_time_stamp(user, cookieToken, (err, result) => {
        if (err) {
            console.error('Error in getTimeStamp:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        res.status(201).json(result);
    });
}
// ฟังก์ชันสำหรับอัปเดตสถานะผู้ใช้
const updateStatus = (req: any, res: any) => {
    const user = req.body;
    update_user_status(user, (err, result) => {
        if (err) {
            console.error('Error in updateStatus:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        res.status(201).json(result);
    });
}



export default { getCheckAll, updateStatus, getTimeStamp, getName }