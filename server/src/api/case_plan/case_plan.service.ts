 /*
 * case_plan.service.ts
 * service for case plan
 * @input -
 * @output -
 * @author Kamin,Panuphong,Chasita
 * @Create Date 2567-15-15
 */
import database from "../../config/database";
const jwt = require("jsonwebtoken");

// ฟังก์ชันค้นหาข้อมูลจำนวนแถวข้อมูล
export const get_case = (search: string, PagiNate: string, callBack: (error: any, result: any) => void) => {
    // ทำ query ไปยังฐานข้อมูลเพื่อดึงข้อมูล case plan ตามเงื่อนไขที่ระบุ
    database.query(
        `SELECT casep_id, year(casep_month_year) as Year, monthname(casep_month_year) as Month, casep_time, casep_case_less_30, casep_case_less_2, casep_case_more_2,date_format(casep_month_year,"%Y-%m-%d") as date_value FROM rdmj_case_plan
         WHERE casep_cg_id = 1 and year(casep_month_year) like '%${search}%' or monthname(casep_month_year) like '%${search}%' or casep_time like '%${search}%' or casep_case_less_30 like '%${search}%' or casep_case_less_2 like '%${search}%' or casep_case_more_2 like '%${search}%' ORDER BY casep_month_year DESC ${PagiNate}; `,
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

// ฟังก์ชันค้นหาข้อมูลทั้งหมด
export const get_count_case = (search: string, callBack: (error: any, result: any) => void) => {
    // ทำ query ไปยังฐานข้อมูลเพื่อดึงจำนวนแถวข้อมูล case plan ตามเงื่อนไขที่ระบุ
    database.query(
        `SELECT COUNT(*) AS count FROM rdmj_case_plan WHERE casep_cg_id = 1 and year(casep_month_year) like '%${search}%' or monthname(casep_month_year) like '%${search}%' or casep_time like '%${search}%' or casep_case_less_30 like '%${search}%' or casep_case_less_2 like '%${search}%' or casep_case_more_2 like '%${search}%' ORDER BY casep_month_year DESC; `,
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

// ฟังก์ชันสร้างข้อมูล case plan ใหม่
export const create_case = (caseModal: any,cookieToken:any, callBack: (error: any, result: any) => void) => {
    //ถ้ามีคุกกี้ให้ทำงานดังนี้
  if (cookieToken) {
    // การแปลงข้อมูลโทเคนเป็นข้อมูลและเก็บไว้ในตัวแปร
    const decoded: any = jwt.verify(cookieToken, process.env.JWT_TOKEN_SECRET);
    // ตัวแปรสำหรับเก็บข้อมูลจากโทเคน
    const ChangeDataByID = decoded.user_emp_id;
    // ทำ query ไปยังฐานข้อมูลเพื่อสร้างข้อมูล case plan ใหม่
    database.query(
        "INSERT INTO rdmj_case_plan (casep_month_year, casep_time, casep_case_less_30, casep_case_less_2, casep_case_more_2, casep_cg_id, casep_userid_create) VALUES (?, ?, ?, ?, ?, 1, ?) ",
        [
            caseModal.api_date,
            caseModal.api_bm_time,
            caseModal.api_bm_less_30,
            caseModal.api_bm_less_2,
            caseModal.api_bm_more_2,
            ChangeDataByID,
        ],
        (err, results, fields) => {
            if (err) {
                console.error('Error in creating case plans:', err);
                return callBack(err, null);
            }
            return callBack(null, results);
        }
    );
  }
};

// ฟังก์ชันอัพเดทข้อมูล case plan ที่มีอยู่แล้ว
export const update_case = (id: any, caseModal: any, callBack: (error: any, result: any) => void) => {
    // ทำ query ไปยังฐานข้อมูลเพื่ออัพเดทข้อมูล case plan
    database.query(
        "UPDATE rdmj_case_plan SET casep_time = ?, casep_case_less_30 = ?, casep_case_less_2 = ?, casep_case_more_2 = ? WHERE casep_id = ? ",
        [
            caseModal.api_bm_time,
            caseModal.api_bm_less_30,
            caseModal.api_bm_less_2,
            caseModal.api_bm_more_2,
            caseModal.api_id_value,
        ],
        (err, results, fields) => {
            if (err) {
                console.error('Error in updating case plan:', err);
                return callBack(err, null);
            }
            return callBack(null, results);
        }
    );
};

// ฟังก์ชันดึงข้อมูล case plan ทั้งหมด
export const get_all_case = (callBack: (error: any, result: any) => void) => {
    // ทำ query ไปยังฐานข้อมูลเพื่อดึงข้อมูล case plan ทั้งหมด
    database.query(
        "SELECT casep_id, year(casep_month_year) as Year, month(casep_month_year) as Month, casep_time, casep_case_less_30, casep_case_less_2, casep_case_more_2 FROM rdmj_case_plan WHERE casep_cg_id = 1; " +
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

export const create_edit = (caseModal: any,cookieToken:any, callBack: (error: any, result: any) => void) => {
//ถ้ามีคุกกี้ให้ทำงานดังนี้
  if (cookieToken) {
    // การแปลงข้อมูลโทเคนเป็นข้อมูลและเก็บไว้ในตัวแปร
    const decoded: any = jwt.verify(cookieToken, process.env.JWT_TOKEN_SECRET);
    // ตัวแปรสำหรับเก็บข้อมูลจากโทเคน
    const ChangeDataByID = decoded.user_emp_id;
    database.query(
        "INSERT INTO rdmj_case_plan_edit (casep_edit_casep_id, casep_edit_create_date, casep_edit_by_userid) VALUES (?, ?, ?) ",
        [caseModal.api_id_value, caseModal.api_date,ChangeDataByID],
        (err, results, fields) => {
            if (err) {
                console.error('Error in creating case plans:', err);
                return callBack(err, null);
            }
            return callBack(null, results);
        }
    );
  }
};

// ส่งค่าฟังก์ชันทั้ง 5 ออกไปให้ module อื่นๆ เรียกใช้
export default { get_case, create_case, update_case, get_count_case, get_all_case, create_edit };