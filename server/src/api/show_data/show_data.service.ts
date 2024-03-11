/*
* show_data.service.ts
* service for request password and reset password
* @input  -
* @output -
* @author Panuphong,Kamin,Tassapol,Nattapak
* @Create Date 2567-03-04
*/
import database from "../../config/database";

export const get_data_maintenance = (
  select: any,
  search: string,
  pagi_nate: string,
  callBack: (error: any, result: any) => void
) => {
  // ถ้าสถานะเป็น 1 ให้ค้นหาตัวที่ซ่อมเสร็จแล้ว
  if (select == 1) {
    database.query(
      "SELECT  IDNO, cg_sub_name, SetubiNo, `Machine Name`,rdmj_product.product_name as product_name, Location, `Layout No.`,IFNULL(date_format(KoshoHasseiJikoku,'%d %b %Y (%H:%i)'), '-') as KoshoHasseiJikoku, CASE WHEN Hassei_Shuuryo IS NULL OR Hassei_Shuuryo = 'NULL' THEN '-' ELSE Hassei_Shuuryo END as Hassei_Shuuryo,name , CASE WHEN Jyokyo IS NULL OR Jyokyo = 'NULL' THEN '-' ELSE Jyokyo END as Jyokyo, CASE WHEN Genin1 IS NULL OR Genin1 = 'NULL' THEN '-' ELSE Genin1 END as Genin1, CASE WHEN HasseiYouin IS NULL OR HasseiYouin = 'NULL' THEN '-' ELSE HasseiYouin END as HasseiYouin,IFNULL(date_format(KaisiJikoku,'%d %b %Y (%H:%i)'), '-') as KaisiJikoku,IFNULL(date_format(ShuuryoJikoku,'%d %b %Y (%H:%i)'), '-') as ShuuryoJikoku, product_id, cg_id " +
      "FROM rdmj_database.t_haneisho " +
      "JOIN machine ON `Machine No.` = SetubiNo " +
      "join rdmj_section on IraiBusho1 = section_id  " +
      "join rdmj_category on HozenKubun = cg_id " +
      "join user on `Employee no.` = JissiBusho1 " +
      "join rdmj_product on product_id = `PD Dept.`  " +
      "WHERE KaisiJikoku IS NOT NULL and ShuuryoJikoku IS NOT NULL " +
      search +
      "order by KoshoHasseiJikoku desc " +
      pagi_nate +
      "; ",
      [],
      (err, results, fields) => {
        if (err) {
          console.error("Error in database query:", err);
          return callBack(err, null);
        }
        return callBack(null, results);
      }
    );
  }
  //ถ้าสถานะเป็น 2 ให้หาตัวที่อยู่ในคิว
  else if (select == 2) {
    database.query(
      "SELECT  IDNO, cg_sub_name, SetubiNo, `Machine Name`,rdmj_product.product_name as product_name, Location, `Layout No.`,IFNULL(date_format(KoshoHasseiJikoku,'%d %b %Y (%H:%i)'), '-') as KoshoHasseiJikoku, CASE WHEN Hassei_Shuuryo IS NULL OR Hassei_Shuuryo = 'NULL' THEN '-' ELSE Hassei_Shuuryo END as Hassei_Shuuryo,name , CASE WHEN Jyokyo IS NULL OR Jyokyo = 'NULL' THEN '-' ELSE Jyokyo END as Jyokyo, CASE WHEN Genin1 IS NULL OR Genin1 = 'NULL' THEN '-' ELSE Genin1 END as Genin1, CASE WHEN HasseiYouin IS NULL OR HasseiYouin = 'NULL' THEN '-' ELSE HasseiYouin END as HasseiYouin,IFNULL(date_format(KaisiJikoku,'%d %b %Y (%H:%i)'), '-') as KaisiJikoku,IFNULL(date_format(ShuuryoJikoku,'%d %b %Y (%H:%i)'), '-') as ShuuryoJikoku, product_id, cg_id " +
      "FROM rdmj_database.t_haneisho " +
      "JOIN machine ON `Machine No.` = SetubiNo " +
      "join rdmj_section on IraiBusho1 = section_id  " +
      "join rdmj_category on HozenKubun = cg_id " +
      "join user on `Employee no.` = JissiBusho1 " +
      "join rdmj_product on product_id = `PD Dept.`  " +
      "WHERE KaisiJikoku IS NULL and ShuuryoJikoku IS NULL " +
      search +
      "order by KoshoHasseiJikoku desc " +
      pagi_nate +
      "; ",
      [],
      (err, results, fields) => {
        if (err) {
          console.error("Error in database query:", err);
          return callBack(err, null);
        }
        return callBack(null, results);
      }
    );
  }
  // ถ้าสถานะเป็น 3 ให้หาตัวที่กำลังซ่อมบำรุง
  else if (select == 3) {
    database.query(
      "SELECT  IDNO, cg_sub_name, SetubiNo, `Machine Name`,rdmj_product.product_name as product_name, Location, `Layout No.`,IFNULL(date_format(KoshoHasseiJikoku,'%d %b %Y (%H:%i)'), '-') as KoshoHasseiJikoku, CASE WHEN Hassei_Shuuryo IS NULL OR Hassei_Shuuryo = 'NULL' THEN '-' ELSE Hassei_Shuuryo END as Hassei_Shuuryo,name , CASE WHEN Jyokyo IS NULL OR Jyokyo = 'NULL' THEN '-' ELSE Jyokyo END as Jyokyo, CASE WHEN Genin1 IS NULL OR Genin1 = 'NULL' THEN '-' ELSE Genin1 END as Genin1, CASE WHEN HasseiYouin IS NULL OR HasseiYouin = 'NULL' THEN '-' ELSE HasseiYouin END as HasseiYouin,IFNULL(date_format(KaisiJikoku,'%d %b %Y (%H:%i)'), '-') as KaisiJikoku,IFNULL(date_format(ShuuryoJikoku,'%d %b %Y (%H:%i)'), '-') as ShuuryoJikoku, product_id, cg_id " +
      "FROM rdmj_database.t_haneisho " +
      "JOIN machine ON `Machine No.` = SetubiNo " +
      "join rdmj_section on IraiBusho1 = section_id  " +
      "join rdmj_category on HozenKubun = cg_id " +
      "join user on `Employee no.` = JissiBusho1 " +
      "join rdmj_product on product_id = `PD Dept.`  " +
      "WHERE KaisiJikoku IS NOT NULL and ShuuryoJikoku IS NULL " +
      search +
      "order by KoshoHasseiJikoku desc " +
      pagi_nate +
      "; ",
      [],
      (err, results, fields) => {
        if (err) {
          console.error("Error in database query:", err);
          return callBack(err, null);
        }
        return callBack(null, results);
      }
    );
  }
  // ถ้าไม่ใช่ก็แสดงผลทั้งหมด
  else {
    database.query(
      "SELECT  IDNO, cg_sub_name, SetubiNo, `Machine Name`,rdmj_product.product_name as product_name, Location, `Layout No.`,IFNULL(date_format(KoshoHasseiJikoku,'%d %b %Y (%H:%i)'), '-') as KoshoHasseiJikoku, CASE WHEN Hassei_Shuuryo IS NULL OR Hassei_Shuuryo = 'NULL' THEN '-' ELSE Hassei_Shuuryo END as Hassei_Shuuryo,name , CASE WHEN Jyokyo IS NULL OR Jyokyo = 'NULL' THEN '-' ELSE Jyokyo END as Jyokyo, CASE WHEN Genin1 IS NULL OR Genin1 = 'NULL' THEN '-' ELSE Genin1 END as Genin1, CASE WHEN HasseiYouin IS NULL OR HasseiYouin = 'NULL' THEN '-' ELSE HasseiYouin END as HasseiYouin,IFNULL(date_format(KaisiJikoku,'%d %b %Y (%H:%i)'), '-') as KaisiJikoku,IFNULL(date_format(ShuuryoJikoku,'%d %b %Y (%H:%i)'), '-') as ShuuryoJikoku, product_id, cg_id " +
      "FROM rdmj_database.t_haneisho " +
      "JOIN machine ON `Machine No.` = SetubiNo " +
      "join rdmj_section on IraiBusho1 = section_id  " +
      "join rdmj_category on HozenKubun = cg_id " +
      "join user on `Employee no.` = JissiBusho1 " +
      "join rdmj_product on product_id = `PD Dept.`  " +
      search +
      "order by KoshoHasseiJikoku desc " +
      pagi_nate +
      "; ",
      [],
      (err, results, fields) => {
        if (err) {
          console.error("Error in database query:", err);
          return callBack(err, null);
        }
        return callBack(null, results);
      }
    );
  }
};

export const count_row = (
  select: any,
  search: string,
  callBack: (error: any, result: any) => void
) => {
  // ถ้าสถานะเป็น 1 ให้ค้นหาตัวที่ซ่อมเสร็จแล้ว
  if (select == 1) {
    database.query(
      "SELECT COUNT(*) as count " +
      "FROM rdmj_database.t_haneisho " +
      "JOIN machine ON `Machine No.` = SetubiNo " +
      "join rdmj_section on IraiBusho1 = section_id  " +
      "join rdmj_category on HozenKubun = cg_id " +
      "join user on `Employee no.` = JissiBusho1 " +
      "join rdmj_product on product_id = `PD Dept.`  " +
      "WHERE KaisiJikoku IS NOT NULL and ShuuryoJikoku IS NOT NULL " +
      search +
      "order by KoshoHasseiJikoku desc; ",
      [],
      (err, results, fields) => {
        if (err) {
          console.error("Error in database query:", err);
          return callBack(err, null);
        }
        return callBack(null, results);
      }
    );
  }
  //ถ้าสถานะเป็น 2 ให้หาตัวที่อยู่ในคิว
  else if (select == 2) {
    database.query(
      "SELECT COUNT(*) as count " +
      "FROM rdmj_database.t_haneisho " +
      "JOIN machine ON `Machine No.` = SetubiNo " +
      "join rdmj_section on IraiBusho1 = section_id  " +
      "join rdmj_category on HozenKubun = cg_id " +
      "join user on `Employee no.` = JissiBusho1 " +
      "join rdmj_product on product_id = `PD Dept.`  " +
      "WHERE KaisiJikoku IS NULL and ShuuryoJikoku IS NULL " +
      search +
      "order by KoshoHasseiJikoku desc; ",
      [],
      (err, results, fields) => {
        if (err) {
          console.error("Error in database query:", err);
          return callBack(err, null);
        }
        return callBack(null, results);
      }
    );
  }
  // ถ้าสถานะเป็น 3 ให้หาตัวที่กำลังซ่อมบำรุง
  else if (select == 3) {
    database.query(
      "SELECT COUNT(*) as count " +
      "FROM rdmj_database.t_haneisho " +
      "JOIN machine ON `Machine No.` = SetubiNo " +
      "join rdmj_section on IraiBusho1 = section_id  " +
      "join rdmj_category on HozenKubun = cg_id " +
      "join user on `Employee no.` = JissiBusho1 " +
      "join rdmj_product on product_id = `PD Dept.`  " +
      "WHERE KaisiJikoku IS NOT NULL and ShuuryoJikoku IS NULL " +
      search +
      "order by KoshoHasseiJikoku desc; ",
      [],
      (err, results, fields) => {
        if (err) {
          console.error("Error in database query:", err);
          return callBack(err, null);
        }
        return callBack(null, results);
      }
    );
  }
  // ถ้าไม่ใช่ก็แสดงผลทั้งหมด Dept.`
  else {
    database.query(
      "SELECT COUNT(*) as count " +
      "FROM rdmj_database.t_haneisho " +
      "JOIN machine ON `Machine No.` = SetubiNo " +
      "join rdmj_section on IraiBusho1 = section_id  " +
      "join rdmj_category on HozenKubun = cg_id " +
      "join user on `Employee no.` = JissiBusho1 " +
      "join rdmj_product on product_id = `PD Dept.`  " +
      search +
      "order by KoshoHasseiJikoku desc; ",
      [],
      (err, results, fields) => {
        if (err) {
          console.error("Error in database query:", err);
          return callBack(err, null);
        }
        return callBack(null, results);
      }
    );
  }
};
//ค่าแผนการซ่อมบำรุง
export const get_monthly_case_plan = (
  callBack: (error: any, result: any) => void
) => {
  const date = new Date();
  date.toLocaleString('en-US', { timeZone: 'Asia/Bangkok' });
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  database.query(
    `SELECT COALESCE(casep_time,0) as casp_time,COALESCE(casep_case_less_30, 0) as casep_case_less_30, COALESCE(casep_case_less_2, 0) as casep_case_less_2, COALESCE(casep_case_more_2, 0) as casep_case_more_2 ,COALESCE(casep_case_less_30, 0) + COALESCE(casep_case_less_2, 0) + COALESCE(casep_case_more_2, 0) as totalcase    FROM rdmj_database.rdmj_case_plan ` +
    `join rdmj_category on cg_id = casep_cg_id ` +
    `where MONTH(casep_month_year) = ${month} AND YEAR(casep_month_year) = ${year} ` +
    `UNION ALL ` +
    `SELECT 0 AS casp_time,0 AS casep_case_less_30,0 AS casep_case_less_2,0 AS casep_case_more_2,0 AS totalcase ` +
    `WHERE NOT EXISTS (SELECT 1 FROM rdmj_database.rdmj_case_plan WHERE MONTH(casep_month_year) = ${month} AND YEAR(casep_month_year) = ${year}); `,
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
//ค่าเครื่องจักรที่เสียจริง
export const get_monthly_case_active = (
  callBack: (error: any, result: any) => void
) => {
  const date = new Date();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  database.query(
    "SELECT " +
    `COALESCE((SELECT COUNT(Hassei_Shuuryo) FROM rdmj_database.t_haneisho ` +
    `WHERE Hassei_Shuuryo >= 120 AND MONTH(ShuuryoJikoku) = ${month} AND YEAR(ShuuryoJikoku) = ${year}),0) AS count_hassei_greater_than_120, ` +
    `COALESCE((SELECT COUNT(Hassei_Shuuryo) FROM rdmj_database.t_haneisho ` +
    `WHERE Hassei_Shuuryo < 120 AND Hassei_Shuuryo > 30 AND MONTH(ShuuryoJikoku) = ${month} AND YEAR(ShuuryoJikoku) = ${year}),0) AS count_hassei_between_30_and_120,  ` +
    `COALESCE((SELECT COUNT(Hassei_Shuuryo) FROM rdmj_database.t_haneisho ` +
    `WHERE Hassei_Shuuryo < 30 AND MONTH(ShuuryoJikoku) = ${month} AND YEAR(ShuuryoJikoku) = ${year}),0) AS count_hassei_less_than_30, ` +
    `COALESCE((SELECT COUNT(Hassei_Shuuryo) FROM rdmj_database.t_haneisho ` +
    `WHERE Hassei_Shuuryo > 0 and MONTH(ShuuryoJikoku) = ${month} AND YEAR(ShuuryoJikoku) = ${year}),0) AS totalcase ,` +
    `COALESCE((SELECT sum(Hassei_Shuuryo) FROM rdmj_database.t_haneisho ` +
    `WHERE Hassei_Shuuryo > 0 and MONTH(ShuuryoJikoku) = ${month} AND YEAR(ShuuryoJikoku) = ${year}),0) AS totaltime ; `,
    [],
    (err, results, fields) => {
      if (err) {
        console.error("Error in database quer   y:", err);
        return callBack(err, null);
      }
      return callBack(null, results);
    }
  );
};
//ตาราง daily case 
export const get_daily_case = (callBack: (error: any, result: any) => void) => {
  const new_date = new Date();
  const date = new_date.toISOString().split("T")[0];
  database.query(
    "SELECT KoshoHasseiJikoku as Failure_Occurrence ,KaisiJikoku as start_time,ShuuryoJikoku as end_time ,concat(cg_name,' (',cg_sub_name,')') as cg_name ,cg_sub_name " +
    `FROM rdmj_database.t_haneisho join rdmj_category on cg_id = HozenKubun where KibouShuuriJikoku like '${date}%' or ShuuryoJikoku is null; `,
    [],
    (err, results, fields) => {
      if (err) {
        console.error("Error in database quer   y:", err);
        return callBack(err, null);
      }
      return callBack(null, results);
    }
  );
};
//สีของข้อมูลตาราง
export const get_layout_data = (product_name:string,pd_dept:string,callBack: (error: any, result: any) => void) => {
  const date = new Date();
  database.query(
    "SELECT SetubiNo as machine_no,IraiBusho1 as section_code, name as technician" +
    ",cg_sub_name,CONCAT(TIMESTAMPDIFF(HOUR, KoshoHasseiJikoku, CONVERT_TZ(NOW(), 'UTC', 'Asia/Bangkok')),'.' " +
    ",LPAD(TIMESTAMPDIFF(MINUTE, KoshoHasseiJikoku, CONVERT_TZ(NOW(), 'UTC', 'Asia/Bangkok')) % 60, 2, '0')) AS time_difference, " +
    "CASE " +
    "WHEN TIMESTAMPDIFF(MINUTE, KoshoHasseiJikoku, CONVERT_TZ(NOW(), 'UTC', 'Asia/Bangkok')) <= 30 AND HozenKubun = 1 THEN '#FFD06F' " +
    "WHEN TIMESTAMPDIFF(MINUTE, KoshoHasseiJikoku, CONVERT_TZ(NOW(), 'UTC', 'Asia/Bangkok')) > 30 AND TIMESTAMPDIFF(HOUR, KoshoHasseiJikoku, CONVERT_TZ(NOW(), 'UTC', 'Asia/Bangkok')) < 2 AND HozenKubun = 1 THEN '#FF964F' "+
    "WHEN TIMESTAMPDIFF(HOUR, KoshoHasseiJikoku, CONVERT_TZ(NOW(), 'UTC', 'Asia/Bangkok')) >= 2 AND HozenKubun = 1 THEN '#FF6961' "+
    "WHEN ShuuryoJikoku IS NULL AND (HozenKubun = 2 or HozenKubun = 4) THEN '#A2D865' "+
    "ELSE '#FFFFFF'  "+
    "END AS ColorCode "+
    "FROM rdmj_database.t_haneisho "+
    "JOIN machine ON `Machine No.` = SetubiNo "+
    "join user on `Employee no.` = JissiBusho1 "+
    "join rdmj_category on HozenKubun = cg_id "+
    "WHERE ShuuryoJikoku IS NULL AND mc_product_name = ?  AND `PD Dept.` = ? "+
    "having time_difference > 0 "+
    "order by `PD Dept.`,HozenKubun "+
    "limit 1 ; ",
    [product_name,pd_dept],
    (err, results, fields) => {
      if (err) {
        console.error("Error in database quer   y:", err);
        return callBack(err, null);
      }
      return callBack(null, results);
    }
  );
};
// ดึงข้อมูลจำนวนคนงานทั้งหมด
export const get_manpower = (callBack: (error: any, result: any) => void) => {
  database.query(
    "SELECT name, " +
    "COUNT(CASE WHEN (cg_sub_name = 'BM' or cg_sub_name = 'PM') THEN 1 END) AS request, " +
    "COUNT(CASE WHEN (cg_sub_name = 'BM' or cg_sub_name = 'PM') and (DATE(CONVERT_TZ(NOW(), 'UTC', 'Asia/Bangkok')) = DATE(CONVERT_TZ(Hakkoubi, '+00:00', '+07:00'))) and ShuuryoJikoku IS NOT NULL THEN 1 END) AS achieve, " +
    "COUNT(CASE WHEN (cg_sub_name = 'BM' or cg_sub_name = 'PM') and ShuuryoJikoku IS NOT NULL THEN 1 END) AS achieve_his, " +
    "COUNT(CASE WHEN (cg_sub_name = 'BM') THEN 1 END) AS BM, " +
    "COUNT(CASE WHEN (cg_sub_name = 'BM') and ShuuryoJikoku IS NOT NULL THEN 1 END) AS bm_his, " +
    "COUNT(CASE WHEN (cg_sub_name = 'PM') THEN 1 END) AS PM, " +
    "COUNT(CASE WHEN (cg_sub_name = 'PM') and ShuuryoJikoku IS NOT NULL THEN 1 END) AS pm_his, " +
    "picture.pic_type, " +
    "picture.pic_img " +
    "FROM user " +
    "JOIN rdmj_user ON user.`Employee no.` = rdmj_user.user_emp_id " +
    "JOIN picture on rdmj_user.user_pic_id = pic_id " +
    "left JOIN t_haneisho ON JissiBusho1 = user.`Employee no.` " +
    "left JOIN rdmj_category ON HozenKubun = rdmj_category.cg_id " +
    "WHERE user_status = 1 " +
    "GROUP BY user_emp_id " +
    "ORDER BY request DESC; ",
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
// ดึงข้อมูลคนว่างงาน
export const get_available = (callBack: (error: any, result: any) => void) => {
  database.query(
    "SELECT name, " +
    "COUNT(CASE WHEN (cg_sub_name = 'BM' or cg_sub_name = 'PM') THEN 1 END) AS request, " +
    "COUNT(CASE WHEN (cg_sub_name = 'BM' or cg_sub_name = 'PM') and (DATE(CONVERT_TZ(NOW(), 'UTC', 'Asia/Bangkok')) = DATE(CONVERT_TZ(Hakkoubi, '+00:00', '+07:00'))) and ShuuryoJikoku IS NOT NULL THEN 1 END) AS achieve, " +
    "COUNT(CASE WHEN (cg_sub_name = 'BM' or cg_sub_name = 'PM') and ShuuryoJikoku IS NOT NULL THEN 1 END) AS achieve_his, " +
    "COUNT(CASE WHEN (cg_sub_name = 'BM') THEN 1 END) AS BM, " +
    "COUNT(CASE WHEN (cg_sub_name = 'BM') and ShuuryoJikoku IS NOT NULL THEN 1 END) AS bm_his, " +
    "COUNT(CASE WHEN (cg_sub_name = 'PM') THEN 1 END) AS PM, " +
    "COUNT(CASE WHEN (cg_sub_name = 'PM') and ShuuryoJikoku IS NOT NULL THEN 1 END) AS pm_his, " +
    "picture.pic_type, " +
    "picture.pic_img " +
    "FROM user " +
    "JOIN rdmj_user ON user.`Employee no.` = rdmj_user.user_emp_id " +
    "JOIN picture on rdmj_user.user_pic_id = pic_id " +
    "left JOIN t_haneisho ON JissiBusho1 = user.`Employee no.` " +
    "left JOIN rdmj_category ON HozenKubun = rdmj_category.cg_id " +
    "WHERE user_status = 1 AND IDNO IS NULL " +
    "GROUP BY user_emp_id " +
    "ORDER BY request DESC; ",
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
// ดึงข้อมูลคนที่กำลังทำงานอยู่
export const get_processing = (callBack: (error: any, result: any) => void) => {
  database.query(
    "SELECT name, " +
    "COUNT(CASE WHEN (cg_sub_name = 'BM' or cg_sub_name = 'PM') THEN 1 END) AS request, " +
    "COUNT(CASE WHEN (cg_sub_name = 'BM' or cg_sub_name = 'PM') and (DATE(CONVERT_TZ(NOW(), 'UTC', 'Asia/Bangkok')) = DATE(CONVERT_TZ(Hakkoubi, '+00:00', '+07:00'))) and ShuuryoJikoku IS NOT NULL THEN 1 END) AS achieve, " +
    "COUNT(CASE WHEN (cg_sub_name = 'BM' or cg_sub_name = 'PM') and ShuuryoJikoku IS NOT NULL THEN 1 END) AS achieve_his, " +
    "COUNT(CASE WHEN (cg_sub_name = 'BM') THEN 1 END) AS BM, " +
    "COUNT(CASE WHEN (cg_sub_name = 'BM') and ShuuryoJikoku IS NOT NULL THEN 1 END) AS bm_his, " +
    "COUNT(CASE WHEN (cg_sub_name = 'PM') THEN 1 END) AS PM, " +
    "COUNT(CASE WHEN (cg_sub_name = 'PM') and ShuuryoJikoku IS NOT NULL THEN 1 END) AS pm_his, " +
    "picture.pic_type, " +
    "picture.pic_img " +
    "FROM user " +
    "JOIN rdmj_user ON user.`Employee no.` = rdmj_user.user_emp_id " +
    "JOIN picture on rdmj_user.user_pic_id = pic_id " +
    "left JOIN t_haneisho ON JissiBusho1 = user.`Employee no.` " +
    "left JOIN rdmj_category ON HozenKubun = rdmj_category.cg_id " +
    "WHERE user_status = 1 AND IDNO IS NOT NULL " +
    "GROUP BY user_emp_id " +
    "ORDER BY request DESC; ",
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
// ดึงข้อมูลจำนวนคนงานทั้งหมด
export const get_count_manpower = (callBack: (error: any, result: any) => void) => {
  database.query(
    "SELECT COUNT(DISTINCT user.`Employee no.`) AS count " +
    "FROM user " +
    "JOIN rdmj_user ON user.`Employee no.` = rdmj_user.user_emp_id " +
    "JOIN picture on rdmj_user.user_pic_id = pic_id " +
    "left JOIN t_haneisho ON JissiBusho1 = user.`Employee no.` " +
    "left JOIN rdmj_category ON HozenKubun = rdmj_category.cg_id " +
    "WHERE user_status = 1 ",
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
// ดึงข้อมูลจำนวนคนที่ว่างงาน
export const get_count_available = (callBack: (error: any, result: any) => void) => {
  database.query(
    "SELECT COUNT(DISTINCT user.`Employee no.`) AS count " +
    "FROM user " +
    "JOIN rdmj_user ON user.`Employee no.` = rdmj_user.user_emp_id " +
    "JOIN picture on rdmj_user.user_pic_id = pic_id " +
    "left JOIN t_haneisho ON JissiBusho1 = user.`Employee no.` " +
    "left JOIN rdmj_category ON HozenKubun = rdmj_category.cg_id " +
    "WHERE user_status = 1 AND IDNO IS NULL ",
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
// ดึงข้อมูลจำนวนคนที่กำลังทำงาน
export const get_count_processing = (callBack: (error: any, result: any) => void) => {
  database.query(
    "SELECT COUNT(DISTINCT user.`Employee no.`) AS count " +
    "FROM user " +
    "JOIN rdmj_user ON user.`Employee no.` = rdmj_user.user_emp_id " +
    "JOIN picture on rdmj_user.user_pic_id = pic_id " +
    "left JOIN t_haneisho ON JissiBusho1 = user.`Employee no.` " +
    "left JOIN rdmj_category ON HozenKubun = rdmj_category.cg_id " +
    "WHERE user_status = 1 AND IDNO IS NOT NULL ",
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
// ดึงข้อมูลรายละเอียดขอ Hover
export const get_detail_machine_data = (product_name:string,pd_dept:string,callBack: (error: any, result: any) => void) => {
  database.query(
    "SELECT SetubiNo as machine_no,IraiBusho1 as section_code, name as technician" +
    ",cg_sub_name,CONCAT(TIMESTAMPDIFF(HOUR, KoshoHasseiJikoku, CONVERT_TZ(NOW(), 'UTC', 'Asia/Bangkok')),'.' " +
    ",LPAD(TIMESTAMPDIFF(MINUTE, KoshoHasseiJikoku, CONVERT_TZ(NOW(), 'UTC', 'Asia/Bangkok')) % 60, 2, '0')) AS time_difference, " +
    "CASE " +
    "WHEN TIMESTAMPDIFF(MINUTE, KoshoHasseiJikoku, CONVERT_TZ(NOW(), 'UTC', 'Asia/Bangkok')) <= 30 AND HozenKubun = 1 THEN '#FFD06F' " +
    "WHEN TIMESTAMPDIFF(MINUTE, KoshoHasseiJikoku, CONVERT_TZ(NOW(), 'UTC', 'Asia/Bangkok')) > 30 AND TIMESTAMPDIFF(HOUR, KoshoHasseiJikoku, CONVERT_TZ(NOW(), 'UTC', 'Asia/Bangkok')) < 2 AND HozenKubun = 1 THEN '#FF964F' "+
    "WHEN TIMESTAMPDIFF(HOUR, KoshoHasseiJikoku, CONVERT_TZ(NOW(), 'UTC', 'Asia/Bangkok')) >= 2 AND HozenKubun = 1 THEN '#FF6961' "+
    "WHEN ShuuryoJikoku IS NULL AND (HozenKubun = 2 or HozenKubun = 4) THEN '#A2D865' "+
    "ELSE '#FFFFFF'  "+
    "END AS ColorCode "+
    "FROM rdmj_database.t_haneisho "+
    "JOIN machine ON `Machine No.` = SetubiNo "+
    "join user on `Employee no.` = JissiBusho1 "+
    "join rdmj_category on HozenKubun = cg_id "+
    "WHERE ShuuryoJikoku IS NULL AND mc_product_name = ?  AND `PD Dept.` = ? "+
    "having time_difference > 0 order by HozenKubun,time_difference desc; ",
    [product_name,pd_dept],
    (err, results, fields) => {
      if (err) {
        console.error('Error in database query:', err);
        return callBack(err, null);
      }
      return callBack(null, results);
    }
  );
};

export const get_pd_dept_and_name = (callBack: (error: any, result: any) => void) => {
  database.query(
    "SELECT `PD Dept.` as pd_dept, mc_product_name FROM machine GROUP BY `PD Dept.`, mc_product_name; ",
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

export const get_MTTR_MTBF_kpi = (callBack: (error: any, result: any) => void) => {
  const date = new Date();
  const month = date.getMonth()+1;
  const year = date.getFullYear();
  database.query(
    "SELECT case when kpi.kpi_id = 1 then 'MTTR' when kpi.kpi_id = 2 then 'MTBF'else NULL END AS plan,kpi_target,kpi_unit "+
    "FROM rdmj_database.kpi join kpi_value on kpi.kpi_id = kpi_value.kpi_id "+
    "where month(Kpi_date) = ? and year(Kpi_date) = ? ; ",
    [month,year],
    (err, results, fields) => {
      if (err) {
        console.error('Error in database query:', err);
        return callBack(err, null);
      }
      return callBack(null, results);
    }
  );
};

export const get_MTTR_MTBF_actual = (callBack: (error: any, result: any) => void) => {
  const date = new Date();
  const month = date.getMonth()+1;
  const year = date.getFullYear();
  database.query(
    `SELECT ShuuryoJikoku, ROUND(((21*20)-(sum(TIMESTAMPDIFF(HOUR, KaisiJikoku , ShuuryoJikoku))))/count(IDNO),0) as MTBF,sum(TIMESTAMPDIFF(HOUR, KaisiJikoku, ShuuryoJikoku)) as MTTR FROM rdmj_database.t_haneisho `+
    `where HozenKubun = 1 AND ShuuryoJikoku IS NOT NULL and month(ShuuryoJikoku) = ${month} and year(ShuuryoJikoku) = ${year} `+
    `group by month(ShuuryoJikoku),year(ShuuryoJikoku) `+
    `UNION ALL  `+
    `SELECT 0 AS ShuuryoJikoku,420 AS MTBF,0 AS MTTR `+
    `WHERE NOT EXISTS (SELECT 1 FROM rdmj_database.t_haneisho WHERE month(ShuuryoJikoku) = ${month} and year(ShuuryoJikoku) = ${year}); `,
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

export default {
  get_data_maintenance,
  count_row,
  get_monthly_case_plan,
  get_monthly_case_active,
  get_daily_case,
  get_manpower,
  get_available,
  get_processing,
  get_count_manpower,
  get_count_available,
  get_count_processing,
  get_detail_machine_data,
  get_layout_data,
  get_pd_dept_and_name,
  get_MTTR_MTBF_kpi,
  get_MTTR_MTBF_actual
};
