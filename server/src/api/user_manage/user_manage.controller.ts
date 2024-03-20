/*
* user_manage.controller.ts
* controller for user manage
* @input -
* @output -
* @author Panuphong,Suphattra
* @Create Date 2567-02-16
*/
import { get_user, insert_permission_editLog, bulk_update_user_work_time, bulk_update_user_permission, get_worktime_log, insert_worktime_editLog, get_count_user } from "./user_manage.service";
const schedule = require("node-cron");
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
function formatThaiDate(date: any) {
  const options = {
    timeZone: 'Asia/Bangkok',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour12: false,
  };
  return date.toLocaleString('en-US', options).replace(/(\d+)\/(\d+)\/(\d+)/, '$3-$1-$2');
}
// ฟังก์ชันสำหรับการตรวจสอบว่ามีผู้ใช้คนไหนต้องเปลี่ยนกะแล้วหรือไม่
const updateWorkTime = () => {
  // Cancel any existing tasks
  cancelAllTasks();
  // เรียกใช้ฟังก์ชันสำหรับเก็บข้อมูล log การเปลี่ยนกะ
  get_worktime_log((err, result) => {
    if (err) {
      console.error("Error in createReqPassword:", err);
      // Handle the error appropriately, e.g., return an error response
    } else {
      // นำข้อมูลการเปลี่ยนกะเก็บเอาไว้
      userData = result;
      if (userData !== undefined) {
        // // Schedule tasks for each user
        userData.forEach((user: any) => {
          const { userId, workTimeChangeTo, scheduledDate } = user;
          const today = new Date();
          const date = formatThaiDate(today);
          const dateChange = formatThaiDate(user.wte_date_to_change);
          // ถ้ามีข้อมูลวันที่ต้องเปลี่ยนตรงกับวันนี้จะทำการเปลี่ยนข้อมูลกะการทำงานทันมที
          if (date === dateChange) {
            // Replace this with your actual task logic
            bulk_update_user_work_time(user.wte_user_id, user.wte_change_to, (err, results) => {
              if (err) {
                console.log(err);
              }
            });
          }
          else if (user.wte_date_to_change <= today) {
            // Replace this with your actual task logic
            bulk_update_user_work_time(user.wte_user_id, user.wte_change_to, (err, results) => {
              if (err) {
                console.log(err);
              }
            });
          }
          else {
            console.log("Nothing To Update")
          }
        });
      }
    }
  });
};
// Schedule tasks to run every day at midnight
schedule.schedule("0 0 * * *", () => {
  console.log("Schedule run");
  updateWorkTime();
}, {
  scheduled: true,
  timezone: "Asia/Bangkok"
});



//ฟังก์ชัน getUserAll เพื่อดึงข้อมูลผู้ใช้ทั้งหมด
const getUserAll = (req: any, res: any) => {
  // ตัวแปรรับค่าค้นหาจากหน้าบ้าน
  const search = String(req.query.search);
  const limits = Number(req.query.limit);
  // เรียกใช้ฟังก์ชัน getUserAll เพื่อดึงข้อมูลผู้ใช้ทั้งหมด
  get_user(search, limits, (err, result) => {
    if (err) {
      console.error("Error in createReqPassword:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
    get_count_user(search, (err, results) => {
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
};
//ฟังก์ชันที่ใช้่ในการ insert ช้อมูล เพื่อเก็บ log การเปลี่ยนเเปลง
const insertPermissionandWorkTime = (req: any, res: any) => {
  const cookieToken = req.cookies.user; // Assuming the cookie name is 'user'
  // ดึงข้อมูลจาก request body
  const data = req.body.allData;
  let dateTochange = req.body.dateToChangeWorkTime;
  // ตัวแปรสำหรับอัปเดตสถานะของารเปลี่ยน
  let status = "";
  // ดึงวันที่ปัจจุบันและกำหนดให้อยู่ในรูปแบบ YYYY-MM-DD
  const currentDate = new Date();
  const formattedDate = currentDate.toISOString().split("T")[0];
  // ตรวจสอบว่ามีข้อมูลใน Data หรือไม่
  if (Object.keys(data).length !== 0) {
    // ตัวแปรสำหรับเก็บข้อมูลโทเคนคุ๊กกี้
    if (!cookieToken) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    // ลูปเพื่อทำการ insertPermissionEditLog สำหรับแต่ละ Data
    for (const empID of Object.keys(data)) {
      const datas = data[empID];
      // ถ้ามีการแก้สิทธ์จะเข้าอยู่เงื่อนไขนี้
      if ((datas.perMissionChangeTo !== null && datas.perMissionChangeTo !== undefined)) {
        // บันทึกข้อมูลเป็น log
        insert_permission_editLog(
          Number(datas.empID),
          datas.perMissionChangeTo,
          cookieToken,
          (err, result) => {
            if (err) {
              return res.status(500).json({ error: "Internal Server Error" });
            }
          }
        );
        status = `UPDATE rdmj_permission_edit SET per_status_change = 1 WHERE per_user_id = '${datas.empID}'; `;
        // ทำการอัปเดต Permission ทันทีหากมีการเปลี่ยน Permission
        bulk_update_user_permission(
          Number(datas.empID),
          datas.perMissionChangeTo,
          (err, result) => {
            if (err) {
              return res.status(500).json({ error: "Internal Server Error" });
            }
          }
        );
      }
      status = '';
      // ตรวจสอบว่าแก้ไขกะหรือไม่
      if ((datas.workTimeChangeTo !== null && datas.workTimeChangeTo !== undefined)) {
        // แก้ไขสถานะการขอเปลี่ยนกะทั้งหมด
        status = `UPDATE rdmj_work_time_edit SET wte_status_change = 1 WHERE wte_user_id = '${datas.empID}'; `;
        // เพิ่มข้อมูล log worktime ด้วย
        insert_worktime_editLog(
          Number(datas.empID),
          dateTochange,
          datas.workTimeChangeTo,
          cookieToken,
          status,
          (err, result) => {
            if (err) {
              return res.status(500).json({ error: "Internal Server Error" });
            }
          }
        );
        // ถ้ามีข้อมูลวันที่ต้องเปลี่ยนตรงกับวันนี้จะทำการเปลี่ยนข้อมูลกะการทำงานทันที
        if (formattedDate === dateTochange) {
          cancelAllTasks();
          // แก้ไขกะให้พนักงาน
          bulk_update_user_work_time(
            Number(datas.empID),
            datas.workTimeChangeTo,
            (err, results) => {
              if (err) {
                console.log(err);
              }
            }
          );
        }
      }
    }
    return res.status(201).json("Success");
  } else {
    res.status(400).json({ message: "No Data" });
  }
};

export { getUserAll, insertPermissionandWorkTime };
