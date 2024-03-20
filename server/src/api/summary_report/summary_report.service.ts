/*
* summary_report.service.ts
* service for summary report
* @input 
* @output -
* @author Tassapol,Panuphong
* @Create Date 2567-02-19
*/
import database from "../../config/database";

// แถบด้านบนสุด
export const get_cost = (callBack: (error: any, result: any) => void) => {
    database.query(
        "SELECT * FROM rdmj_cost_plan " + 
        "JOIN rdmj_product on product_id = costp_pd_id ; ",
        (err,results) => {
            if (err) {
                console.error('Error in database query:', err);
                return callBack(err,null);
            }
            return callBack(null, results);
        }
    );
};

export const get_mc_cost_bm_and_pm = (select:string,callBack: (error: any, result: any) => void) => {
    database.query(
        "SELECT COALESCE(ROUND(SUM(costp_cost_bm + costp_cost_pm), 0), 0) AS TotalMCCost ,COALESCE(ROUND(SUM(costp_cost_pm), 0), 0) AS CostPM , COALESCE(ROUND(SUM(costp_cost_bm), 0), 0) AS CostBM FROM rdmj_cost_plan " +
         select + 
        " and costp_pd_id < 9 ; ",
        (err,results) => {
            if (err) {
                console.error('Error in database query:', err);
                return callBack(err,null);
            }
            return callBack(null, results);
        }
    );
};

export const get_mc_cost_bm_and_pm_actual = (select:string,callBack: (error: any, result: any) => void) => {
    database.query(
        "SELECT " +
        "(SELECT COALESCE(ROUND(sum(TotalPrice),0),0) FROM rdmj_database.data_stock_out " +
        "WHERE "+
        select +
        "AND (PurposeCode = 1 OR PurposeCode = 4)) AS MCALL , " +
        "(SELECT COALESCE(ROUND(sum(TotalPrice),0),0) FROM rdmj_database.data_stock_out " +
        "WHERE "+
        select +
        "AND PurposeCode = 1) AS MCBMCOST , " +
        "(SELECT COALESCE(ROUND(sum(TotalPrice),0),0) FROM rdmj_database.data_stock_out " +
        "WHERE "+
        select +
        "AND PurposeCode = 4) AS MCPMCOST; ",
        (err,results) => {
            if (err) {
                console.error('Error in database query:', err);
                return callBack(err,null);
            }
            return callBack(null, results);
        }
    );
};

export const cost_by_pd_dept = (select:string,callBack: (error: any, result: any) => void) => {
    database.query(
        "SELECT costp_Month_year,costp_cost_bm,costp_cost_pm, product_name FROM rdmj_cost_plan " +
        "JOIN rdmj_product ON product_id = costp_pd_id " +
        select +
        "And product_name IN ('PD1', 'PD2', 'PD3', 'PD4', 'PD5', 'PD6', 'PD7', 'PD8') ; ",
        (err,results) => {
            if (err) {
                console.error('Error in database query:', err);
                return callBack(err,null);
            }
            return callBack(null, results);
        }
    );
};

export const cost_actual_bm = (select:string,callBack: (error: any, result: any) => void) => {
    database.query(
        "SELECT rdmj_product.product_name , ROUND(sum(TotalPrice),0) AS Actual_BM " +
        "FROM rdmj_database.data_stock_out " +
        "JOIN machine ON `Machine No.` = MachineCode " +
        "JOIN rdmj_product ON product_id = `PD Dept.` " +
        "WHERE "+
        select +  
        "AND PurposeCode = 1 " +
        "GROUP BY product_id; " ,
        (err,results) => {
            if (err) {
                console.error('Error in database query:', err);
                return callBack(err,null);
            }
            return callBack(null, results);
        }
    );
};

export const cost_actual_pm = (select:string,callBack: (error: any, result: any) => void) => {
    database.query(
        "SELECT rdmj_product.product_name , ROUND(sum(TotalPrice),0) AS Actual_PM " +
        "FROM rdmj_database.data_stock_out " +
        "JOIN machine ON `Machine No.` = MachineCode " +
        "JOIN rdmj_product ON product_id = `PD Dept.` " +
        "WHERE " +
        select +
        " AND PurposeCode = 4 " +
        "GROUP BY product_id; " ,
        (err,results) => {
            if (err) {
                console.error('Error in database query:', err);
                return callBack(err,null);
            }
            return callBack(null, results);
        }
    );
};

export const cost_actual_all_by_pddept = (select:string,callBack: (error: any, result: any) => void) => {
    database.query(
        "SELECT rdmj_product.product_name , ROUND(sum(TotalPrice),0) AS Actual_All_By_PDDept " +
        "FROM rdmj_database.data_stock_out " +
        "JOIN machine ON `Machine No.` = MachineCode " +
        "JOIN rdmj_product ON product_id = `PD Dept.` " +
        "WHERE "+
        select+
        "AND (PurposeCode = 4 or PurposeCode = 1) " +
        "GROUP BY product_id; " ,
        (err,results) => {
            if (err) {
                console.error('Error in database query:', err);
                return callBack(err,null);
            }
            return callBack(null, results);
        }
    );
};

export const cost_plan_all_by_pddept = (select:string,callBack: (error: any, result: any) => void) => {
    database.query(
        "SELECT costp_Month_year,costp_cost_bm + costp_cost_pm AS Cost_All_By_PDDept, product_name FROM rdmj_cost_plan " + 
        "JOIN rdmj_product ON product_id = costp_pd_id " +
        select,
        (err,results) => {
            if (err) {
                console.error('Error in database query:', err);
                return callBack(err,null);
            }
            return callBack(null, results);
        }
    );
};

export const get_table_cost_plan = (select:string,callBack: (error: any, result: any) => void) => {
    database.query(
        "SELECT sum(costp_cost_bm) as cost_cost_bm ,sum(costp_cost_pm) as costp_cost_pm, sum(costp_cost_bm) + sum(costp_cost_pm) as total_cost_plan ,product_id , product_name from rdmj_database.rdmj_cost_plan "+
        "join rdmj_product on product_id = costp_pd_id " +
        select +
        " group by product_id; " ,
        (err,results) => {
            if (err) {
                console.error('Error in database query:', err);
                return callBack(err,null);
            }
            return callBack(null, results);
        }
    );
};

export const get_table_actual = (select:string,callBack: (error: any, result: any) => void) => {
    database.query(
        "SELECT rdmj_product.product_name, COALESCE(SUM(CASE WHEN PurposeCode = 1 OR PurposeCode = 4 THEN ROUND(TotalPrice, 0) ELSE 0 END), 0) AS MCALL,COALESCE(SUM(CASE WHEN PurposeCode = 1 THEN ROUND(TotalPrice, 0) ELSE 0 END), 0) AS MCBMCOST,COALESCE(SUM(CASE WHEN PurposeCode = 4 THEN ROUND(TotalPrice, 0) ELSE 0 END), 0) AS MCPMCOST FROM rdmj_product "+
        "LEFT JOIN machine ON `PD Dept.` = rdmj_product.product_id  "+
        "LEFT JOIN data_stock_out ON `Machine No.` = MachineCode   "+
        select +
        "group by `PD Dept.` ; " ,
        (err,results) => {
            if (err) {
                console.error('Error in database query:', err);
                return callBack(err,null);
            }
            return callBack(null, results);
        }
    );
};

export default {get_cost,get_mc_cost_bm_and_pm,get_mc_cost_bm_and_pm_actual,cost_by_pd_dept,cost_actual_bm,cost_actual_pm,cost_actual_all_by_pddept,cost_plan_all_by_pddept,get_table_cost_plan,get_table_actual};