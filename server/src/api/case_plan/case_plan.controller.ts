 /*
 * case_plan.controller.ts
 * controller for case plan
 * @input -
 * @output -
 * @author Kamin,Panuphong,Chasita
 * @Create Date 2567-15-15
 */
import cases from "./case_plan.service";
import { Request, Response } from 'express';

// นำเข้าฟังก์ชันทั้งหมดจาก module cost_plan.service
const get_count_case = cases.get_count_case;
const get_case = cases.get_case;
const get_all_case = cases.get_all_case;
const create_case = cases.create_case;
const update_case = cases.update_case;
const create_edit = cases.create_edit;

// ฟังก์ชัน getCasePlan ใช้ในการดึงข้อมูล case plan จากฐานข้อมูล
const getCasePlan = (req: Request, res: Response) => {
    // ตัวแปรรับค่าคำค้นหาจากหน้าบ้าน
    const search = String(req.query.search);
    // ตัวแปรสำหรับแถวเริ่มต้นของตาราง
    const startIndex = Number(req.query.page) * Number(req.query.rowPerPage); 
    // จำนวนแถวต่อหน้าตาราง
    const rowPerPage = Number(req.query.rowPerPage);
    // คำสั่งค้นหาแบบกำหนดให้มีจำนวนแถวตามที่เราต้องการและเริ่มจากแถวใด
    let paginate = ` Limit ${rowPerPage} OFFSET ${startIndex} `;
    // เรียกใช้ฟังก์ชันรับค่าจำนวนแถวก่อน
    get_count_case(search, async (err, result) => {
        if (err) {
            console.error('Error in get_case_plan:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        // เรียกใช้ฟังก์ชันแสดงข้อมูลทั้งหมด
        get_case(search, paginate, async (err, results) => {
            if (err) {
                console.error('Error in get_case_plan:', err);
                return res.status(500).json({ error: 'Internal Server Error' });
            }
            res.status(201).json({
                rows: results,
                count: result[0].count,
            });
        });
    });
};

// ฟังก์ชัน createCasePlan ใช้ในการสร้างข้อมูล case plan
const createCasePlan = (req: Request, res: Response) => {
    const caseDataArray = req.body;
    let check = false;
    const cookieToken = req.cookies.user;
    // ตัวแปรสำหรับเก็บข้อมูลโทเคนคุ๊กกี้
    if (!cookieToken) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    // ดึงข้อมูล case plan ทั้งหมด
    get_all_case((err, result) => {
        for (const Data of result) {
            // ตรวจสอบว่ามีข้อมูลที่ซ้ำกันหรือไม่
            if (Data.Year == caseDataArray.api_date.substring(0, 4) && Data.Month == caseDataArray.api_date.substring(5, 7)) {
                check = true;
                break;
            }
        }
        // ถ้าไม่มีข้อมูลที่ซ้ำกันจะทำการสร้างข้อมูลใหม่
        if (check == false) {
            create_case(caseDataArray,cookieToken, (err, result) => {
                if (err) {
                    console.error('Error in create_case_plan:', err);
                    return res.status(500).json({ error: 'Internal Server Error' });
                }
                res.status(201).json({ message: 'Case plans created successfully', data: result });
            });
        } else {
            // ถ้ามีข้อมูลที่ซ้ำกันจะส่ง response กลับว่า 'The date already exists !'
            return res.status(401).json({ exist: 'The date already exists !' });
        }
    });
};

// ฟังก์ชัน updateCasePlan ใช้ในการอัพเดทข้อมูล case plan
const updateCasePlan = (req: Request, res: Response) => {
    const id = req.params.id;
    const costData = req.body;
    const caseDataArray = req.body;
    const cookieToken = req.cookies.user;
    // ตัวแปรสำหรับเก็บข้อมูลโทเคนคุ๊กกี้
    if (!cookieToken) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    // เรียกใช้ฟังก์ชันอัพเดทข้อมูล
    update_case(id, costData, (err, result) => {
        if (err) {
            console.error('Error in update_cost_plan:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        create_edit(caseDataArray,cookieToken, (err, result) => {
            if (err) {
                console.error('Error in create_case_plan:', err);
                return res.status(200).json({ error: 'Internal Server Error' });
            }
        });
        res.status(200).json({ message: 'Cost plan updated successfully', data: result });
    });
};

// ส่งฟังก์ชันทั้ง 3 ออกไปให้ module อื่นๆ เรียกใช้
export { getCasePlan, createCasePlan, updateCasePlan };