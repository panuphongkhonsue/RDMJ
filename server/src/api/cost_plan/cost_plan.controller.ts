/*
* cost_plan.controller.ts
* controller for cost plan
* @input -
* @output -
* @author Kamin,Panuphong
* @Create Date 2567-15-15
*/
import cost from "./cost_plan.service";
import { Request, Response } from 'express';

// นำเข้าฟังก์ชันจาก cost_plan.service
const get_count_cost = cost.get_count_cost;
const get_cost = cost.get_cost;
const get_all_cost = cost.get_all_cost;
const create_costs = cost.create_costs;
const update_cost = cost.update_cost;
const create_edit = cost.create_edit;

// ฟังก์ชันสำหรับดึงข้อมูลแผนการใช้งบประมาณ
const getCostPlan = (req: Request, res: Response) => {
    // ตัวแปรรับค่าค้นหาจากหน้าบ้าน
    const search = String(req.query.search);
    // ตัวแปรสำหรับแถวเริ่มต้นของตาราง
    const startIndex = Number(req.query.page) * Number(req.query.rowPerPage);
    // จำนวนแถวต่อหน้าตาราง
    const rowPerPage = Number(req.query.rowPerPage);
    // คำสั่งค้นหาแบบกำหนดให้มีจำนวนแถวตามที่เราต้องการและเริ่มจากแถวใด
    let paginate = ` LIMIT ${rowPerPage} OFFSET ${startIndex} `;
    // เรียกใช้ฟังก์ชันรับค่าจำนวนแถวก่อน
    get_count_cost(search, async (err, result) => {
        if (err) {
            console.error('Error in get_cost_plan:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        // เรียกใช้ฟังก์ชันแสดงข้อมูลทั้งหมด
        get_cost(search, paginate, async (err, results) => {
            if (err) {
                console.error('Error in get_cost_plan:', err);
                return res.status(500).json({ error: 'Internal Server Error' });
            }
            res.status(201).json({
                rows: results,
                count: result[0].count,
            });
        });
    });
};

// ฟังก์ชันสำหรับสร้างแผนการใช้งบประมาณใหม่
const createCostPlan = (req: Request, res: Response) => {
    // รับข้อมูลจากหน้าบ้าน
    const costDataArray = req.body;
    // ตัวแปรสำหรับตรวจสอบว่าวันที่นี้มีข้อมูลแผนการใช้งบประมาณอยู่แล้วหรือไม่
    let check = false;
    const cookieToken = req.cookies.user;
    if (!cookieToken) {
        return res.status(401).json({ message: "Unauthorized" });
      }
    // เรียกใช้ฟังก์ชันดึงข้อมูลแผนการใช้งบประมาณทั้งหมด
    get_all_cost((err, result) => {
        // วนลูปตรวจสอบข้อมูลแผนการใช้งบประมาณทุกชุด
        for (const Data of result) {
            // ถ้าพบว่ามีข้อมูลในเดือนและปีเดียวกันกับที่ส่งมาจากหน้าบ้าน
            if (Data.Year == costDataArray.api_date.substring(0, 4) && Data.Month == costDataArray.api_date.substring(5, 7) && Data.costp_pd_id == costDataArray.api_selected) {
                check = true; // กำหนด Check เป็น true
                break; // ออกจากลูป
            }
        }
        // ถ้า Check เป็น false แสดงว่าไม่มีข้อมูลแผนการใช้งบประมาณในวันที่นี้
        if (check == false) {
            // เรียกใช้ฟังก์ชันสร้างข้อมูลแผนการใช้งบประมาณใหม่
            create_costs(costDataArray,cookieToken, (err, result) => {
                if (err) {
                    console.error('Error in create_cost_plan:', err);
                    return res.status(500).json({ error: 'Internal Server Error' });
                }
                // ส่งข้อมูล response กลับไปยังหน้าบ้าน
                res.status(201).json({ message: 'Cost plans created successfully', data: result });
            });
        } else {
            // ถ้า Check เป็น true แสดงว่ามีข้อมูลแผนการใช้งบประมาณในวันที่นี้แล้ว
            return res.status(401).json({ exist: 'The date already exists !' });
        }
    });
};

// ฟังก์ชันสำหรับอัพเดทข้อมูลแผนการใช้งบประมาณ
const updateCostPlan = (req: Request, res: Response) => {
    // รับค่า id และข้อมูลแผนการใช้งบประมาณจากหน้าบ้าน
    const id = req.params.id;
    const costData = req.body;
    const costDataArray = req.body;
    const cookieToken = req.cookies.user;
    if (!cookieToken) {
        return res.status(401).json({ message: "Unauthorized" });
      }
    // เรียกใช้ฟังก์ชันอัพเดทข้อมูลแผนการใช้งบประมาณ
    update_cost(id, costData, (err, result) => {
        if (err) {
            console.error('Error in update_cost_plan:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        create_edit(costDataArray,cookieToken, (err, result) => {
            if (err) {
                console.error('Error in create_cost_plan:', err);
                return res.status(200).json({ error: 'Internal Server Error' });
            }
        });
        // ส่งข้อมูล response กลับไปยังหน้าบ้าน
        res.status(200).json({ message: 'Cost plan updated successfully', data: result });
    });
};

// ส่งฟังก์ชันทั้ง 3 ไปยัง module อื่นๆ เพื่อให้สามารถเรียกใช้ได้
export { getCostPlan, createCostPlan, updateCostPlan };