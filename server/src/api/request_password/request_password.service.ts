/*
* v_requset_password.service.ts
* service for request password and reset password
* @input  -
* @output -
* @author Panuphong
* @Create Date 2567-02-18
*/
import connection from "../../config/database";
import database from "../../config/database";

// service สร้างคำขอเปลี่ยนรหัสผ่าน
export const request_reset_password = (data: any, uniqueId: string, callBack: (error: any, result: any) => void) => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0'); // Add leading zero if needed
    const day = String(d.getDate()).padStart(2, '0'); // Add leading zero if needed

    const formattedDate = `${year}-${month}-${day}`;
    // ค้นหารหัสพนักงานจากอีเมลล์
    database.query(
        "SELECT user_emp_id FROM rdmj_database.rdmj_user WHERE user_email like ?",
        [data],
        (errCheck, results) => {
            if (errCheck) {
                // Handle error in the outer query
                return callBack(errCheck, null);
            }

            // ถ้า result ไม่เป็น array และน้อยกว่า 0 จะส่ง error กลับไป ในกรณีที่ไม่เจอรหัสพนักงานจากอีเมลล์ที่ถูกส่งมา 
            if (!(Array.isArray(results) && results.length > 0)) {
                console.error('No results or unexpected structure:', results);
                return callBack(new Error('No results or unexpected structure'), null);
            }
            // หากเคยมีคำร้องขอเก่าที่ยังมีสถานะไม่ได้ใช้งานให้เปิดใช้งานโดยค่า ใช้งาน คือ 1
            database.query(
                "Update rdmj_request_password SET rp_status = ? Where rp_email like ? and rp_status = ?;",
                [1, data + '%', 0],
                (errInsert) => {
                    if (errInsert) {
                        console.error('Error in database query:', errInsert);
                        return callBack(errInsert, null);
                    }
                }
            );
            // ตัวแปรเก็บค่ารหัสพนักงาน
            const userResult = results[0] as { user_emp_id: number };
            // บันทึกข้อมูลการส่งคำร้องขอเปลี่ยนรหัสผ่าน
            database.query(
                "INSERT INTO rdmj_request_password(rp_email, rp_date,rp_status,rp_unique_id, rp_emp_id) VALUES(?, ?,?,?,?);",
                [data, formattedDate, 0, uniqueId, userResult.user_emp_id],
                (errInsert) => {
                    if (errInsert) {
                        console.error('Error in database query:', errInsert);
                        return callBack(errInsert, null);
                    }
                    callBack(null, userResult.user_emp_id);
                }
            );
        });
};


// service เปลี่ยนรหัสผ่าน 
export const reset_password = (userName: any, resetPassword: any, callBack: (error: any, result: any) => void) => {
    // แก้ไขข้อมูลรหัสผ่านของพนักงาน
    database.query(
        "Update rdmj_database.rdmj_user SET user_password  = ? Where user_emp_id = ?;", [resetPassword, userName],
        (err, result) => {
            if (err) {
                console.error('Error in database query:', err);
                return callBack(err, null);
            }
            // แก้ไขข้อมูลให้สถานะของการเปลี่ยนรหัสผ่านกลายเป็นถูกใช้งานโดยค่า คือ 1
            database.query(
                "Update rdmj_request_password SET rp_status = ? Where rp_emp_id like ? and rp_status = ?;", [1, userName, 0],
                (err) => {
                    if (err) {
                        console.error('Error in database query:', err);
                        return callBack(err, null);
                    }
                    return callBack(null, result);
                }
            );
        }
    );
};

// service สำหรับตรวจสอบการหมดอายุของ Token และ link
export const check_expired_link = (userName: any, uniqueId: string, callBack: (error: any, result: any) => void) => {
    // ตรวจสอบว่าสถานะของคำร้องขอนี้้ถูกใช้งานหรือยัง
    database.query(
        "Select rp_status FROM rdmj_database.rdmj_request_password WHERE rp_unique_id = ? and rp_emp_id = ?;", [uniqueId, userName],
        (err, results) => {
            if (err) {
                console.error('Error in database query:', err);
                return callBack(err, null);
            }
            if (!(Array.isArray(results) && results.length > 0)) {
                console.error('No results or unexpected structure:', results);
                return callBack(new Error('No results or unexpected structure'), null);
            }
            const statusResults = results[0] as { rp_status: number };
            return callBack(err, statusResults.rp_status);
        }
    );
};

export default { request_reset_password, reset_password, check_expired_link };