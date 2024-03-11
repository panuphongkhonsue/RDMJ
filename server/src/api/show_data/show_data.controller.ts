/*
* show_data.controller.ts
* controller for request password and reset password
* @input  -
* @output -
* @author Panuphong,Kamin,Tassapol,Nattapak
* @Create Date 2567-03-04
*/
import maintenance from "./show_data.service";
// import { sign } from "crypto";
const get_data_maintenance = maintenance.get_data_maintenance;
const count_row = maintenance.count_row;
const get_monthly_case_plan = maintenance.get_monthly_case_plan
const get_monthly_case_active = maintenance.get_monthly_case_active
const get_daily_case = maintenance.get_daily_case
const get_manpower = maintenance.get_manpower
const get_available = maintenance.get_available
const get_processing = maintenance.get_processing
const get_count_manpower = maintenance.get_count_manpower
const get_count_available = maintenance.get_count_available
const get_count_processing = maintenance.get_count_processing
const get_detail_machine_data = maintenance.get_detail_machine_data;
const get_layout_data = maintenance.get_layout_data
const get_pd_dept_and_name = maintenance.get_pd_dept_and_name
const get_MTTR_MTBF_actual = maintenance.get_MTTR_MTBF_actual
const get_MTTR_MTBF_kpi = maintenance.get_MTTR_MTBF_kpi

//controller สำหรับ service หน้า Maintenance
const getDataMaintenanceAll = (req: any, res: any) => {
    // เก็บค่าที่ส่งมาจากหน้าบ้าน category ID และ Product ID
    const cgId = Number(req.query.cgId)
    const product_id = Number(req.query.productId);
    // เก็บค่าจากหน้าบ้านค่าสถานะ
    const select_status = req.query.selectStatus;
    // สร้างตัวแปรไว้สำหรับ ค้นหาค่า select
    let search = "";
    // หา index เริ่มต้นของ Paginate ข้อมูล
    const start_index = Number(req.query.page) * Number(req.query.rowPerPage);
    // หา index สุดท้ายของ paginate ข้อมูล
    const row_per_page = Number(req.query.rowPerPage);
    // สร้างตัวแปรสำหรับเก็บค่าทำ paginate
    const pagi_nate = ` Limit ${row_per_page} OFFSET ${start_index} `;
    // ตรวจสอบสสถานะ และ สิ่งที่ต้องการค้นหา ให้เปลี่ยนคำสั่งสำหรับการค้นหาข้อมูล
    if (select_status == 0) {
        if (cgId !== 0 && product_id !== 0) {
            search = ` WHERE cg_id = ${cgId} and product_id = ${product_id} `;
        }
        else if (cgId !== 0) {
            search = ` WHERE cg_id = ${cgId} `;
        }
        else if (product_id !== 0) {
            search = ` WHERE product_id = ${product_id} `;
        }
    }
    else {
        if (cgId !== 0 && product_id !== 0) {
            search = ` and cg_id = ${cgId} and product_id = ${product_id} `;
        }
        else if (cgId !== 0) {
            search = ` and cg_id = ${cgId}  `;
        }
        else if (product_id !== 0) {
            search = ` and product_id = ${product_id} `;
        }

    }
    count_row(select_status, search, async (err, result) => {
        if (err) {
            console.error('Error in get_data_maintenance:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        get_data_maintenance(select_status, search, pagi_nate, async (err, results) => {
            if (err) {
                console.error('Error in get_data_maintenance:', err);
                return res.status(500).json({ error: 'Internal Server Error' });
            }
            res.status(201).json({
                totalRows: result[0].count,
                rows: results,
            });
        });
    });
};

const getMonthlyCase = (req: any, res: any) => {
    let checktarget = new Array()

    get_monthly_case_plan((err, result) => {
        if (err) {
            // Handle the error appropriately
            console.error('Error in createReqPassword:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        // Assuming result contains the data you want to send in the response
        let case_plan_kpi = result;
        get_monthly_case_active((err, resultactive) => {

            if (err) {
                // Handle the error appropriately
                console.error('Error in createReqPassword:', err);
                return res.status(501).json({ error: 'Internal Server Error' });
            }
            if (case_plan_kpi[0].casep_case_less_30 >= resultactive[0].count_hassei_less_than_30) {
                checktarget.push("#248B00")
            } else {
                checktarget.push("#E1032B")
            }
            if (case_plan_kpi[0].casep_case_less_2 >= resultactive[0].count_hassei_between_30_and_120) {
                checktarget.push("#248B00")
            } else {
                checktarget.push("#E1032B ")
            }
            if (case_plan_kpi[0].casep_case_more_2 >= resultactive[0].count_hassei_greater_than_120) {
                checktarget.push("#248B00 ")
            } else {
                checktarget.push("#E1032B ")
            }
            if (case_plan_kpi[0].casp_time >= resultactive[0].totaltime) {
                checktarget.push("#248B00")
            } else {
                checktarget.push("#E1032B")
            }
            if (case_plan_kpi[0].totalcase >= resultactive[0].totalcase) {
                checktarget.push("#248B00")
            } else {
                checktarget.push("#E1032B")
            }
            if (case_plan_kpi[0].casp_time >= 60) {
                let hour = Math.trunc(case_plan_kpi[0].casp_time / 60)
                let min = case_plan_kpi[0].casp_time % 60
                case_plan_kpi[0].casp_time = hour + '.' + min
            }
            if (resultactive[0].totaltime >= 60) {
                let hour = Math.trunc(resultactive[0].totaltime / 60)
                let min = resultactive[0].totaltime % 60
                resultactive[0].totaltime = hour + '.' + min
            }

            if(resultactive[0].totalcase >=1000000){
                resultactive[0].totalcase = `${resultactive[0].totalcase/1000000}M`
            }else if(resultactive[0].totalcase >=10000){
                resultactive[0].totalcase = `${resultactive[0].totalcase/1000}K`
            }
            if(case_plan_kpi[0].totalcase >=1000000){
                case_plan_kpi[0].totalcase = `${case_plan_kpi[0].totalcase/1000000}M`
            }else if(case_plan_kpi[0].totalcase >=10000){
                case_plan_kpi[0].totalcase = `${case_plan_kpi[0].totalcase/1000}K`
            }

            if(resultactive[0].count_hassei_less_than_30 >=1000000){
                resultactive[0].count_hassei_less_than_30 = `${resultactive[0].count_hassei_less_than_30/1000000}M`
            }else if(resultactive[0].count_hassei_less_than_30 >=10000){
                resultactive[0].count_hassei_less_than_30 = `${resultactive[0].count_hassei_less_than_30/1000}K`
            }
            if(case_plan_kpi[0].casep_case_less_30 >=1000000){
                case_plan_kpi[0].casep_case_less_30 = `${case_plan_kpi[0].casep_case_less_30/1000000}M`
            }else if(case_plan_kpi[0].casep_case_less_30 >=10000){
                case_plan_kpi[0].casep_case_less_30 = `${case_plan_kpi[0].casep_case_less_30/1000}K`
            }

            if(resultactive[0].count_hassei_between_30_and_120 >=1000000){
                resultactive[0].count_hassei_between_30_and_120 = `${resultactive[0].count_hassei_between_30_and_120/1000000}M`
            }else if(resultactive[0].count_hassei_between_30_and_120 >=10000){
                resultactive[0].count_hassei_between_30_and_120 = `${resultactive[0].count_hassei_between_30_and_120/1000}K`
            }
            if(case_plan_kpi[0].casep_case_less_2 >=1000000){
                case_plan_kpi[0].casep_case_less_2 = `${case_plan_kpi[0].casep_case_less_2/1000000}M`
            }else if(case_plan_kpi[0].casep_case_less_2 >=10000){
                case_plan_kpi[0].casep_case_less_2 = `${case_plan_kpi[0].casep_case_less_2/1000}K`
            }

            if(resultactive[0].count_hassei_greater_than_120 >=1000000){
                resultactive[0].count_hassei_greater_than_120 = `${resultactive[0].count_hassei_greater_than_120/1000000}M`
            }else if(resultactive[0].count_hassei_greater_than_120 >=10000){
                resultactive[0].count_hassei_greater_than_120 = `${resultactive[0].count_hassei_greater_than_120/1000}K`
            }
            if(case_plan_kpi[0].casep_case_more_2 >=1000000){
                case_plan_kpi[0].casep_case_more_2 = `${case_plan_kpi[0].casep_case_more_2/1000000}M`
            }else if(case_plan_kpi[0].casep_case_more_2 >=10000){
                case_plan_kpi[0].casep_case_more_2 = `${case_plan_kpi[0].casep_case_more_2/1000}K`
            }
            // Assuming result contains the data you want to send in the response
            res.status(201).json({ plan: case_plan_kpi, active: resultactive, checktarget });
        })
    });
}

const getDailyCase = (req: any, res: any) => {
    get_daily_case((err, result) => {
        if (err) {
            // Handle the error appropriately
            console.error('Error in createReqPassword:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        const count_request = [{ "ALL": 0, "BM": 0, "PM": 0, "CM": 0, "PD": 0 }]
        const count_processing = [{ "ALL": 0, "BM": 0, "PM": 0, "CM": 0, "PD": 0 }]
        const count_finished = [{ "ALL": 0, "BM": 0, "PM": 0, "CM": 0, "PD": 0 }]
        const data_name: Array<any> = []
        for (const results of result) {
            if (results.cg_name)
                count_request[0].ALL++
            if (results.cg_sub_name == "BM") {
                count_request[0].BM++;
                if (results.end_time == null || results.end_time == '') {
                    count_processing[0].ALL++
                    count_processing[0].BM++
                } else {
                    count_finished[0].ALL++
                    count_finished[0].BM++
                }
            } else if (results.cg_sub_name == "PM") {
                count_request[0].PM++;
                if (results.end_time == null || results.end_time == '') {
                    count_processing[0].ALL++
                    count_processing[0].PM++                    
                } else {
                    count_finished[0].ALL++
                    count_finished[0].PM++
                }
            } else if (results.cg_sub_name == "CM") {
                count_request[0].CM++;
                if (results.end_time == null || results.end_time == '') {
                    count_processing[0].ALL++
                    count_processing[0].CM++
                } else {
                    count_finished[0].ALL++
                    count_finished[0].CM++
                }
            } else if (results.cg_sub_name == "PD") {
                count_request[0].PD++;
                if (results.end_time == null || results.end_time == '' ) {
                    count_processing[0].ALL++
                    count_processing[0].PD++
                } else {
                    count_finished[0].ALL++
                    count_finished[0].PD++
                }
            }
        }
        const repost_request = [{ "ALL": '', "BM": '', "PM": '', "CM": '', "PD": '' }]
        const repost_processing = [{ "ALL": '', "BM": '', "PM": '', "CM": '', "PD": '' }]
        const repost_finished = [{ "ALL": '', "BM": '', "PM": '', "CM": '', "PD": '' }]
        if(count_request[0].ALL >= 1000000){
            count_request[0].ALL = count_request[0].ALL / 1000000
            repost_request[0].ALL =`${String(count_request[0].ALL)}M`
        }else if(count_request[0].ALL >= 1000){
            count_request[0].ALL = count_request[0].ALL / 1000
            repost_request[0].ALL =`${String(count_request[0].ALL)}K`
        }else{
            repost_request[0].ALL = String(count_request[0].ALL)
        }
        if(count_request[0].BM >= 1000000){
            count_request[0].BM = count_request[0].BM / 1000000
            repost_request[0].BM =`${String(count_request[0].BM)}M`
        }else if(count_request[0].BM >= 1000){
            count_request[0].BM = count_request[0].BM / 1000
            repost_request[0].BM =`${String(count_request[0].BM)}K`
        }else{
            repost_request[0].BM = String(count_request[0].BM)
        }
        if(count_request[0].PM >= 1000000){
            count_request[0].PM = count_request[0].PM / 1000000
            repost_request[0].PM =`${String(count_request[0].PM)}M`
        }else if(count_request[0].PM >= 1000){
            count_request[0].PM = count_request[0].PM / 1000
            repost_request[0].PM =`${String(count_request[0].PM)}K`
        }else{
            repost_request[0].PM = String(count_request[0].PM)
        }
        if(count_request[0].CM >= 1000000){
            count_request[0].CM = count_request[0].CM / 1000000
            repost_request[0].CM =`${String(count_request[0].CM)}M`
        }else if(count_request[0].CM >= 1000){
            count_request[0].CM = count_request[0].CM / 1000
            repost_request[0].CM =`${String(count_request[0].CM)}K`
        }else{
            repost_request[0].CM = String(count_request[0].CM)
        }
        if(count_request[0].PD >= 1000000){
            count_request[0].PD = count_request[0].PD / 1000000
            repost_request[0].PD =`${String(count_request[0].PD)}M`
        }else if(count_request[0].PD >= 1000){
            count_request[0].PD = count_request[0].PD / 1000
            repost_request[0].PD =`${String(count_request[0].PD)}K`
        }else{
            repost_request[0].PD = String(count_request[0].PD)
        }
        if(count_processing[0].ALL >= 1000000){
            count_processing[0].ALL = count_processing[0].ALL / 1000000
            repost_processing[0].ALL =`${String(count_processing[0].ALL)}M`
        }else if(count_processing[0].ALL >= 1000){
            count_processing[0].ALL = count_processing[0].ALL / 1000
            repost_processing[0].ALL =`${String(count_processing[0].ALL)}K`
        }else{
            repost_processing[0].ALL = String(count_processing[0].ALL)
        }
        if(count_processing[0].BM >= 1000000){
            count_processing[0].BM = count_processing[0].BM / 1000000
            repost_processing[0].BM =`${String(count_processing[0].BM)}M`
        }else if(count_processing[0].BM >= 1000){
            count_processing[0].BM = count_processing[0].BM / 1000
            repost_processing[0].BM =`${String(count_processing[0].BM)}K`
        }else{
            repost_processing[0].BM = String(count_processing[0].BM)
        }
        if(count_processing[0].PM >= 1000000){
            count_processing[0].PM = count_processing[0].PM / 1000000
            repost_processing[0].PM =`${String(count_processing[0].PM)}M`
        }else if(count_processing[0].PM >= 1000){
            count_processing[0].PM = count_processing[0].PM / 1000
            repost_processing[0].PM =`${String(count_processing[0].PM)}K`
        }else{
            repost_processing[0].PM = String(count_processing[0].PM)
        }
        if(count_processing[0].CM >= 1000000){
            count_processing[0].CM = count_processing[0].CM / 1000000
            repost_processing[0].CM =`${String(count_processing[0].CM)}M`
        }else if(count_processing[0].CM >= 1000){
            count_processing[0].CM = count_processing[0].CM / 1000
            repost_processing[0].CM =`${String(count_processing[0].CM)}K`
        }else{
            repost_processing[0].CM = String(count_processing[0].CM)
        }
        if(count_processing[0].PD >= 1000000){
            count_processing[0].PD = count_processing[0].PD / 1000000
            repost_processing[0].PD =`${String(count_processing[0].PD)}M`
        }else if(count_processing[0].PD >= 1000){
            count_processing[0].PD = count_processing[0].PD / 1000
            repost_processing[0].PD =`${String(count_processing[0].PD)}K`
        }else{
            repost_processing[0].PD = String(count_processing[0].PD)
        }
        if(count_finished[0].ALL >= 1000000){
            count_finished[0].ALL = count_finished[0].ALL / 1000000
            repost_finished[0].ALL =`${String(count_finished[0].ALL)}M`
        }else if(count_finished[0].ALL >= 1000){
            count_finished[0].ALL = count_request[0].ALL / 1000
            repost_finished[0].ALL =`${String(count_finished[0].ALL)}K`
        }else{
            repost_finished[0].ALL = String(count_finished[0].ALL)
        }
        if(count_finished[0].BM >= 1000000){
            count_finished[0].BM = count_finished[0].BM / 1000000
            repost_finished[0].BM =`${String(count_finished[0].BM)}M`
        }else if(count_finished[0].BM >= 1000){
            count_finished[0].BM = count_finished[0].BM / 1000
            repost_finished[0].BM =`${String(count_finished[0].BM)}K`
        }else{
            repost_finished[0].BM = String(count_finished[0].BM)
        }
        if(count_finished[0].PM >= 1000000){
            count_finished[0].PM = count_finished[0].PM / 1000000
            repost_finished[0].PM =`${String(count_finished[0].PM)}M`
        }else if(count_request[0].PM >= 1000){
            count_finished[0].PM = count_finished[0].PM / 1000
            repost_finished[0].PM =`${String(count_finished[0].PM)}K`
        }else{
            repost_finished[0].PM = String(count_finished[0].PM)
        }
        if(count_finished[0].CM >= 1000000){
            count_finished[0].CM = count_finished[0].CM / 1000000
            repost_finished[0].CM =`${String(count_finished[0].CM)}M`
        }else if(count_finished[0].CM >= 1000){
            count_finished[0].CM = count_finished[0].CM / 1000
            repost_finished[0].CM =`${String(count_finished[0].CM)}K`
        }else{
            repost_finished[0].CM = String(count_finished[0].CM)
        }
        if(count_finished[0].PD >= 1000000){
            count_finished[0].PD = count_finished[0].PD / 1000000
            repost_finished[0].PD =`${String(count_finished[0].PD)}M`
        }else if(count_finished[0].PD >= 1000){
            count_finished[0].PD = count_finished[0].PD / 1000
            repost_finished[0].PD =`${String(count_finished[0].PD)}K`
        }else{
            repost_finished[0].PD = String(count_finished[0].PD)
        }
        // Assuming result contains the data you want to send in the response
        res.status(201).json({ count_request:repost_request, count_processing:repost_processing, count_finished:repost_finished });
    });
}


const getManpower = (req: any, res: any) => {
    // นับจำนวนพนักงานทั้งหมด
    const count = {count_manpower:0,count_available:0,count_processing:0}
    get_count_manpower((err: any, manpowerResult: any) => {
        if (err) {
            console.error('Error in get_count_manpower:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        count.count_manpower = manpowerResult[0].count
        // นับจำนวนพนักงานที่พร้อมใช้งาน
        get_count_available((err: any, availableResult: any) => {
            if (err) {
                console.error('Error in get_count_available:', err);
                return res.status(500).json({ error: 'Internal Server Error' });
            }

            count.count_available = availableResult[0].count
            // นับจำนวนพนักงานที่กำลังประมวลผล
            get_count_processing((err: any, processingResult: any) => {
                if (err) {
                    console.error('Error in get_count_processing:', err);
                    return res.status(500).json({ error: 'Internal Server Error' });
                }

                count.count_processing = processingResult[0].count
                const selectStatusManpower = req.query.selectStatusManpower;
                // ตรวจสอบ selectStatusManpower และดำเนินการตามเงื่อนไข
                if (selectStatusManpower == 0) {
                    // เรียกใช้ get_manpower เมื่อ selectStatusManpower เป็น 0
                    get_manpower((err: any, result: any) => {
                        if (err) {
                            console.error('Error in get_manpower:', err);
                            return res.status(500).json({ error: 'Internal Server Error' });
                        }
                        // // ตรวจสอบว่าข้อมูลไม่ว่างเปล่าหรือไม่
                        // if (!result || result.length === 0) {
                        //     return res.status(200).json({ message: 'No Data Exist' });
                        // }
                        // แปลงข้อมูลรูปภาพเป็น base64
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
                        // ส่งผลลัพธ์กลับไปยังผู้ใช้
                        res.status(201).json({
                            manpower: result,
                            count_manpower: count.count_manpower,
                            count_available: count.count_available,
                            count_processing: count.count_processing
                        });
                    });
                } else if (selectStatusManpower == 1) {
                    // เรียกใช้ get_available เมื่อ selectStatusManpower เป็น 1
                    get_available((err: any, result: any) => {
                        if (err) {
                            console.error('Error in get_available:', err);
                            return res.status(500).json({ error: 'Internal Server Error' });
                        }
                        // ตรวจสอบว่าข้อมูลไม่ว่างเปล่าหรือไม่
                        // if (!result || result.length === 0) {
                        //     return res.status(200).json({ message: 'No Data Exist' });
                        // }
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
                        // ส่งผลลัพธ์กลับไปยังผู้ใช้
                        res.status(201).json({
                            manpower: result,
                            count_manpower: count.count_manpower,
                            count_available: count.count_available,
                            count_processing: count.count_processing
                        });
                    });
                } else if (selectStatusManpower == 2) {
                    // เรียกใช้ get_processing เมื่อ selectStatusManpower เป็น 2
                    get_processing((err: any, result: any) => {
                        if (err) {
                            console.error('Error in get_processing:', err);
                            return res.status(500).json({ error: 'Internal Server Error' });
                        }
                        // ตรวจสอบว่าข้อมูลไม่ว่างเปล่าหรือไม่
                        // if (!result || result.length === 0) {
                        //     return res.status(200).json({ message: 'No Data Exist' });
                        // }
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
                        // ส่งผลลัพธ์กลับไปยังผู้ใช้
                        res.status(201).json({
                            manpower: result,
                            count_manpower: count.count_manpower,
                            count_available: count.count_available,
                            count_processing: count.count_processing
                        });
                    });
                } else {
                    // เมื่อไม่มีเงื่อนไขที่เข้าทำงาน
                    res.status(400).json({ error: 'Invalid selectStatusManpower value' });
                }
                
            });
        });
    });
};

//controller สำหรับเรียกใช้ service ดึงข้อมูลรายละเอียดเครื่องจักรสำหรับ Hover
const getDetailMachineData = (req: any, res: any) => {
    const product_name = String(req.query.product_name);
    const pd_dept = String(req.query.pd_dept);
    get_detail_machine_data(product_name,pd_dept,(err: any, result: any) => {
        if (err) {
            console.error('Error in get_processing:', err);
            return res.status(500).json( 'Internal Server Error' );
        }
        if(result === null && result === undefined){
            res.status(201).json("No Data");
        }
        res.status(201).json(result);
    });
};
//controller สำหรับ service ดึงสีของแผนที่
const  getLayoutData = async (req: any, res: any) => {
    try {
        const result = await new Promise<any>((resolve, reject) => {
            get_pd_dept_and_name((err: any, result: any) => {
                if (err) {
                    console.error('Error in get_processing:', err);
                    reject(err);
                }
                resolve(result);
            });
        });
        if (!result || result.length === 0) {
            return res.status(201).json("No Data");
        }
        let product_name: { [productName: string]: any } = {};
        for (const data of result) {
            const mc_pd_name: string = data.mc_product_name;
            const pd_dept: string = data.pd_dept;
            if (!product_name[pd_dept]) {
                product_name[pd_dept] = {};
            }
            if (!product_name[pd_dept][mc_pd_name]) {
                product_name[pd_dept][mc_pd_name] = { ColorCode: '' };
            }
            const colorResult = await new Promise<any>((resolve, reject) => {
                get_layout_data(mc_pd_name, pd_dept, (err: any, result: any) => {
                    if (err) {
                        console.error('Error in get_processing:', err);
                        reject(err);
                    }
                    resolve(result);
                });
            });
            const ColorCode_data = colorResult[0]?.ColorCode || '';
            product_name[pd_dept][mc_pd_name].ColorCode = ColorCode_data;
        }
        res.status(201).json(product_name);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json('Internal Server Error');
    }
};

const getMttrMtbf = (req: any, res: any) => {
    let MTTR = {Target:0,Actual:0,ColorCode:''}
    let MTBF = {Target:0,Actual:0,ColorCode:''}
    get_MTTR_MTBF_kpi((err: any, result: any) => {
        if (err) {
            console.error('Error in get_processing:', err);
            return res.status(500).json( 'Internal Server Error' );
        }
        if(result === null && result === undefined){
            res.status(201).json("No Data");
        }
        const kpi = result;
        get_MTTR_MTBF_actual((err: any, result: any) => {
            if (err) {
                console.error('Error in get_processing:', err);
                return res.status(500).json( 'Internal Server Error' );
            }
            if(result === null && result === undefined){
                res.status(201).json("No Data");
            }
            for(let data of kpi){
                if(data.plan === 'MTBF'){
                    MTBF.Target = data.kpi_target;
                    MTBF.Actual = result[0].MTBF;
                    if(result[0].MTBF>=data.kpi_target){
                        MTBF.ColorCode = '#248B00'
                    }else{
                        MTBF.ColorCode = '#E1032B'
                    }
                }else if(data.plan === 'MTTR'){
                    MTTR.Target = data.kpi_target;
                    MTTR.Actual = result[0].MTTR;
                    if(result[0].MTTR<=data.kpi_target){
                        MTTR.ColorCode = '#248B00'
                    }else{
                        MTTR.ColorCode = '#E1032B'
                    }
                }
            }
            let repost_MTTR = {Target:"",Actual:"",ColorCode:MTTR.ColorCode}
            let repost_MTBF = {Target:"",Actual:"",ColorCode:MTBF.ColorCode}
            if(MTTR.Target >= 1000000){
                MTTR.Target = MTTR.Target / 1000000
                repost_MTTR.Target =`${String(MTTR.Target)}M`
            }else if(MTTR.Target >= 1000){
                MTTR.Target = MTTR.Target / 1000
                repost_MTTR.Target =`${String(MTTR.Target)}K`
            }else{
                repost_MTTR.Target = String(MTTR.Target)
            }
            if(MTTR.Actual >= 1000000){
                MTTR.Actual = MTTR.Actual / 1000000
                repost_MTTR.Actual =`${String(MTTR.Actual)}M`
            }else if(MTTR.Actual >= 1000){
                MTTR.Actual = MTTR.Actual / 1000
                repost_MTTR.Actual =`${String(MTTR.Actual)}K`
            }else{
                repost_MTTR.Actual = String(MTTR.Actual)
            }
            if(MTBF.Target >= 1000000){
                MTBF.Target = MTBF.Target / 1000000
                repost_MTBF.Target =`${String(MTBF.Target)}M`
            }else if(MTBF.Target >= 1000){
                MTBF.Target = MTBF.Target / 1000
                repost_MTBF.Target =`${String(MTBF.Target)}K`
            }else{
                repost_MTBF.Target = String(MTBF.Target)
            }
            if(MTBF.Actual >= 1000000){
                MTBF.Actual = MTBF.Actual / 1000000
                repost_MTBF.Actual =`${String(MTBF.Actual)}M`
            }else if(MTBF.Actual >= 1000){
                MTBF.Actual = MTBF.Actual / 1000
                repost_MTBF.Actual =`${String(MTBF.Actual)}K`
            }else{
                repost_MTBF.Actual = String(MTBF.Actual)
            }
            res.status(201).json({MTTR:repost_MTTR,MTBF:repost_MTBF});
        });
    });
};


export { getDataMaintenanceAll, getMonthlyCase, getDailyCase, getManpower, getDetailMachineData ,getLayoutData,getMttrMtbf };
