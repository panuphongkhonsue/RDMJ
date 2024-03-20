/*
* user_manage.service.ts
* service for user manage
* @input -
* @output -
* @author Panuphong,Suphattra
* @Create Date 2567-02-16
*/
import database from "../../config/database";
const jwt = require("jsonwebtoken");

export const get_user = (
  search: string,
  limits: number,
  callBack: (error: any, result: any) => void
) => {
  database.query(
    " SELECT rdmj_user.user_emp_id ,user.name, rdmj_user.user_roles, rdmj_user.user_work_time, rdmj_user.user_permission,picture.pic_type,picture.pic_img,date_format(rdmj_work_time_edit.wte_date_to_change,'%d %M %Y' ) as wte_date_to_change,rdmj_work_time_edit.wte_status_change FROM user " +
    "JOIN rdmj_user ON user.`Employee no.` = rdmj_user.user_emp_id  " +
    "JOIN picture on rdmj_user.user_pic_id = pic_id " +
    "LEFT JOIN rdmj_work_time_edit on wte_user_id = rdmj_user.user_emp_id  " +
    "WHERE WHERE (rdmj_work_time_edit.wte_date_on_change = (SELECT MAX(wte_date_on_change) FROM rdmj_work_time_edit WHERE  wte_user_id = rdmj_user.user_emp_id)   " +
    "or wte_status_change is null) " +
    "and user.name like ?" +
    "ORDER BY CASE WHEN wte_status_change = 0 THEN 0 ELSE 1 END, user.name ASC , rdmj_user.user_work_time LIMIT ? ; ",
    [`%${search}%`, limits],
    (err, results, fields) => {
      if (err) {
        console.error("Error in database query:", err);
        return callBack(err, null);
      }
      return callBack(null, results);
    }
  );
};
// ฟังก์ชันรับจำนวน user ทั้งหมด
export const get_count_user = (search: string,
  callBack: (error: any, result: any) => void
) => {
  database.query(
    "SELECT count(name) as count FROM user WHERE user.name like ? ; ",
    [`%${search}%`],
    (err, results, fields) => {
      if (err) {
        console.error("Error in database query:", err);
        return callBack(err, null);
      }
      return callBack(null, results);
    }
  );
};

export const get_worktime_log = (
  callBack: (error: any, result: any) => void
) => {
  database.query(
    "SELECT wte_user_id,wte_change_to,wte_date_to_change FROM rdmj_work_time_edit Where wte_status_change = 0; ",
    [],
    (err, results, fields) => {
      if (err) {
        console.error("Error in database query:", err);
        return callBack(err, null);
      }
      return callBack(null, results);
    }
  );
};
// จัดดการ format ของวันและเวลาเพื่อบันทึกลงฐานข้อมูล
function formatThaiDate(date: any) {
  const options = {
    timeZone: 'Asia/Bangkok',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  };
  return date.toLocaleString('en-US', options).replace(/(\d+)\/(\d+)\/(\d+),\s(\d+):(\d+):(\d+)/, '$3-$1-$2 $4:$5:$6');
}
// ฟังก์ชันเพิ่มข้อมูลลงในตาราง rdmj_permission_edit เพื่อเก็บ log การเปลี่ยนเเปลง
export const insert_permission_editLog = (empId: any, perMissionChangeTo: number, cookieToken: any,
  callback: (err: any, results: any) => void
) => {
  //ถ้ามีคุกกี้ให้ทำงานดังนี้
  if (cookieToken) {
    const currentDate = new Date();
    // ตัวแปรสำหรับเก็บข้อมูลวันที่ ที่ทำการแปลง format เรียบร้อยแล้ว
    const formattedDate = formatThaiDate(currentDate);
    // การแปลงข้อมูลโทเคนเป็นข้อมูลและเก็บไว้ในตัวแปร
    const decoded: any = jwt.verify(cookieToken, process.env.JWT_TOKEN_SECRET);
    // ตัวแปรสำหรับเก็บข้อมูลจากโทเคน
    const ChangeDataByID = decoded.user_emp_id;
    // ตัวแปรเพื่อเก็บจำนวนคำสั่ง SQL ที่ถูกทำ
    const insertStatement = `INSERT INTO rdmj_permission_edit (per_user_id,per_status_change,per_permission_change_to, per_date_on_change, per_change_by_id) VALUES (?, ?, ?, ?,?); `;
    // ใช้คำสั่ง SQL เพื่อเพิ่มข้อมูลลงในตาราง
    database.query(
      insertStatement,
      [
        empId,
        1,
        perMissionChangeTo,
        formattedDate,
        ChangeDataByID,
      ],
      (err: any, result: any) => {
        if (err) {
          console.error("Error in database query:", err);
          callback(err, null);
        }
        callback(null, "All inserts completed");
      }
    );
  }
};
// ฟังก์ชันเพิ่มข้อมูลลงในตาราง rdmj_worktime_edit เพื่อเก็บ log การเปลี่ยนเเปลง
export const insert_worktime_editLog = (empId: any, DateToChangeWorkTime: any, workTimeChangeTo: any, cookieToken: any,
  updateStatement: string,
  callback: (err: any, results: any) => void
) => {
  //ถ้ามีคุกกี้ให้ทำงานดังนี้
  if (cookieToken) {
    const currentDate = new Date();
    // ตัวแปรสำหรับเก็บข้อมูลวันที่ ที่ทำการแปลง format เรียบร้อยแล้ว
    const formattedDate = formatThaiDate(currentDate);
    // การแปลงข้อมูลโทเคนเป็นข้อมูลและเก็บไว้ในตัวแปร
    const decoded: any = jwt.verify(cookieToken, process.env.JWT_TOKEN_SECRET);
    // ตัวแปรสำหรับเก็บข้อมูลจากโทเคน
    const ChangeDataByID = decoded.user_emp_id;
    // ตัวแปรเพื่อเก็บจำนวนคำสั่ง SQL ที่ถูกทำ
    const insertStatement = `INSERT INTO rdmj_work_time_edit (wte_user_id,wte_status_change,wte_change_to, wte_date_on_change, wte_date_to_change, wte_change_by_id) VALUES (?, ?, ?, ?,?,?); `;
    if (updateStatement !== '' && updateStatement !== null && updateStatement !== undefined) {
      // คำสั่ง Update ข้อสถานะข้อมูลเก่าที่เคยขอเปลี่ยน
      database.query(updateStatement, [empId], (err: any, result: any) => {
        if (err) {
          console.error("Error in database query:", err);
          callback(err, null);
        }
        // ใช้คำสั่ง SQL เพื่อเพิ่มข้อมูลลงในตาราง
        database.query(
          insertStatement,
          [
            empId,
            0,
            workTimeChangeTo,
            formattedDate,
            DateToChangeWorkTime,
            ChangeDataByID,
          ],
          (err: any, result: any) => {
            if (err) {
              console.error("Error in database query:", err);
              callback(err, null);
            }
            callback(null, "All inserts completed");
          }
        );
      });
    }
    else {
      database.query(
        insertStatement,
        [
          empId,
          0,
          workTimeChangeTo,
          formattedDate,
          DateToChangeWorkTime,
          ChangeDataByID,
        ],
        (err: any, result: any) => {
          if (err) {
            console.error("Error in database query:", err);
            callback(err, null);
          }
          callback(null, "All inserts completed");
        }
      );
    }
  }
};

//ฟังก์ชันอัปเดตการเปลี่ยนข้อมูลสิทธ์พนักงาน
export const bulk_update_user_permission = (
  empId: number,
  newPermission: string,
  callBack: (err: any, results: any) => void
) => {
  let sqlStatement = `
  UPDATE rdmj_user 
  SET user_permission = '${newPermission}' 
  WHERE user_emp_id = '${empId}';
  `;
  // Execute UPDATE
  database.query(sqlStatement, (err, results) => {
    if (err) {
      console.error("Error in database query:", err);
      return callBack(err, null);
    }
    return callBack(null, "Bulk update successful");
  });
};
//ฟังก์ชันอัปเดตการเปลี่ยนข้อมูลกะพนักงาน
export const bulk_update_user_work_time = (
  empId: number,
  newWorkTime: string,
  callBack: (err: any, results: any) => void
) => {
  let sqlStatement = `
        UPDATE rdmj_user 
        SET user_work_time = '${newWorkTime}' 
        WHERE user_emp_id = '${empId}';
      `;
  const updateStatement = `UPDATE rdmj_work_time_edit SET wte_status_change = 1 WHERE wte_user_id = ?;`;

  // Execute UPDATE
  database.query(sqlStatement, (err, results) => {
    if (err) {
      console.error("Error in database query:", err);
      return callBack(err, null);
    }
    database.query(updateStatement, [empId], (err, results) => {
      if (err) {
        console.error("Error in database query:", err);
        return callBack(err, null);
      }
    });
  });
  //ส่งค่าผลลัพธ์
  return callBack(null, "Bulk update successful");
};
export default {
  get_user,
  insert_permission_editLog,
  bulk_update_user_work_time,
  bulk_update_user_permission,
  get_worktime_log,
  insert_worktime_editLog,
  get_count_user,
};
