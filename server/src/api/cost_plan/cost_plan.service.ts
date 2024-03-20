/*
* cost_plan.service.ts
* service for cost plan
* @input -
* @output -
* @author Kamin,Panuphong
* @Create Date 2567-15-15
*/
import database from "../../config/database";
const jwt = require("jsonwebtoken");

// ฟังก์ชันค้นหาข้อมูลจำนวนแถวข้อมูล
export const get_cost = (search: string, PagiNate: string, callBack: (error: any, result: any) => void) => {
    database.query(
        `SELECT costp_id, year(costp_Month_year) as Year, monthname(costp_Month_year) as Month, product_name, costp_cost_pm, costp_cost_bm,date_format(costp_Month_year,'%Y-%m-%d') as date_value FROM rdmj_database.rdmj_cost_plan JOIN rdmj_product ON rdmj_database.rdmj_cost_plan.costp_pd_id = rdmj_product.product_id 
        WHERE year(costp_Month_year) LIKE '%${search}%' OR monthname(costp_Month_year) LIKE '%${search}%' OR product_name LIKE '%${search}%' OR costp_cost_pm LIKE '%${search}%' OR costp_cost_bm LIKE '%${search}%'ORDER BY costp_Month_year DESC ${PagiNate} ; ` ,
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
export const get_count_cost = (search: string, callBack: (error: any, result: any) => void) => {
    database.query(
        `SELECT count(*) as count
        FROM rdmj_database.rdmj_cost_plan JOIN rdmj_product ON rdmj_database.rdmj_cost_plan.costp_pd_id = rdmj_product.product_id 
        WHERE year(costp_Month_year) LIKE '%${search}%' OR monthname(costp_Month_year) LIKE '%${search}%' OR product_name LIKE '%${search}%' OR costp_cost_pm LIKE '%${search}%' OR costp_cost_bm LIKE '%${search}%'ORDER BY costp_Month_year DESC; `,
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

// ฟังก์ชันสร้างข้อมูลแผนการใช้งบประมาณ
export const create_costs = (costModal: any,cookieToken: any, callBack: (error: any, result: any) => void) => {
    if (cookieToken) {
        // การแปลงข้อมูลโทเคนเป็นข้อมูลและเก็บไว้ในตัวแปร
        const decoded: any = jwt.verify(cookieToken, process.env.JWT_TOKEN_SECRET);
        // ตัวแปรสำหรับเก็บข้อมูลจากโทเคน
        const ChangeDataByID = decoded.user_emp_id;
        database.query(
            "INSERT INTO rdmj_cost_plan (costp_Month_year, costp_cost_bm, costp_cost_pm, costp_pd_id,costp_create_by_user_id) VALUES (?, ?, ?, ?,?) ",
            [costModal.api_date, costModal.api_bm, costModal.api_pm, costModal.api_selected,ChangeDataByID],
            (err, results, fields) => {
                if (err) {
                    console.error('Error in creating cost plans:', err);
                    return callBack(err, null);
                }
                return callBack(null, results);
            }
        );
    }
};

// ฟังก์ชันอัพเดทข้อมูลแผนการใช้งบประมาณ
export const update_cost = (id: any, costModal: any, callBack: (error: any, result: any) => void) => {
    database.query(
        "UPDATE rdmj_cost_plan SET costp_cost_bm = ?, costp_cost_pm = ? WHERE costp_id = ? ",
        [costModal.api_bm, costModal.api_pm, costModal.api_id_value],
        (err, results, fields) => {
            if (err) {
                console.error('Error in updating cost plan:', err);
                return callBack(err, null);
            }
            return callBack(null, results);
        }
    );
};

// ฟังก์ชันดึงข้อมูลแผนการใช้งบประมาณทั้งหมด
export const get_all_cost = (callBack: (error: any, result: any) => void) => {
    database.query(
        "SELECT costp_id, year(costp_Month_year) as Year, month(costp_Month_year) as Month, costp_pd_id, costp_cost_pm, costp_cost_bm FROM rdmj_cost_plan; " +
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

export const create_edit = (costModal: any,cookieToken:any, callBack: (error: any, result: any) => void) => {
    if (cookieToken) {
        // การแปลงข้อมูลโทเคนเป็นข้อมูลและเก็บไว้ในตัวแปร
        const decoded: any = jwt.verify(cookieToken, process.env.JWT_TOKEN_SECRET);
        // ตัวแปรสำหรับเก็บข้อมูลจากโทเคน
        const ChangeDataByID = decoded.user_emp_id;
        database.query(
            "INSERT INTO rdmj_cost_plan_edit (costp_edit_casep_id, costp_edit_date, costp_edit_userid) VALUES (?, ?, ?) ",
            [costModal.api_id_value, costModal.api_date ,ChangeDataByID],
            (err, results, fields) => {
                if (err) {
                    console.error('Error in creating cost plans:', err);
                    return callBack(err, null);
                }
                return callBack(null, results);
            }
        );
    }
};

// ส่งออกทุกฟังก์ชันเพื่อให้สามารถเรียกใช้จาก module อื่น
export default { get_cost, create_costs, update_cost, get_count_cost, get_all_cost, create_edit };