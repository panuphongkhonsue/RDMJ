/*
* summary_report.controller.ts
* controller for summary report
* @input 
* @output -
* @author Tassapol,Panuphong
* @Create Date 2567-02-19
*/
import cost from "./summary_report.service";
// import { sign } from "crypto";
const get_cost = cost.get_cost
const get_mc_cost_bm_and_pm = cost.get_mc_cost_bm_and_pm
const get_mc_cost_bm_and_pm_actual = cost.get_mc_cost_bm_and_pm_actual
const cost_by_pd_dept = cost.cost_by_pd_dept
const cost_actual_bm = cost.cost_actual_bm
const cost_actual_pm = cost.cost_actual_pm
const cost_actual_all_by_pddept = cost.cost_actual_all_by_pddept
const cost_plan_all_by_pddept = cost.cost_plan_all_by_pddept
const get_table_cost_plan = cost.get_table_cost_plan
const get_table_actual = cost.get_table_actual

const getCostAll = (req: any, res: any) => {
    get_cost((err, result) => {
        if (err) {
            // Handle the error appropriately
            console.error('Error in createReqPassword:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        // Assuming result contains the data you want to send in the response
        res.status(201).json(result);
    });
}

const getMcCostBmAndPm = (req: any, res: any) => {
    const year = req.query.select_year;
    const month = req.query.select_month;
    let selected = `WHERE month(costp_Month_year) = ${month} AND year(costp_Month_year) = ${year} `;
    get_mc_cost_bm_and_pm(selected,(err, result) => {
        if (err) {
            // Handle the error appropriately
            console.error('Error in createReqPassword:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        // Assuming result contains the data you want to send in the response
        var cost_plan = result
        selected = `month(Date) = ${month} AND year(Date) = ${year} `;
        get_mc_cost_bm_and_pm_actual(selected,((err, resultgetall) => {
            var compare = new Array()
            if (err) {
                // Handle the error appropriately
                console.error('Error in createReqPassword:', err);
                return res.status(500).json({ error: 'Internal Server Error' });
            }
            if (resultgetall[0].MCALL >= cost_plan[0].TotalMCCost) {
                compare.push(true)
            } else {
                compare.push(false)
            }
            if (resultgetall[0].MCBMCOST >= cost_plan[0].CostBM) {
                compare.push(true)
            } else {
                compare.push(false)
            }

            if (resultgetall[0].MCPMCOST >= cost_plan[0].CostPM) {
                compare.push(true)
            } else {
                compare.push(false)
            }

            if (resultgetall[0].MCALL >= 1000000) {
                resultgetall[0].MCALL = (resultgetall[0].MCALL / 1000000).toFixed(2) + " M"
            } else {
                resultgetall[0].MCALL = (resultgetall[0].MCALL / 1000).toFixed(2) + " K"
            }

            if (resultgetall[0].MCBMCOST >= 1000000) {
                resultgetall[0].MCBMCOST = (resultgetall[0].MCBMCOST / 1000000).toFixed(2) + " M"
            } else {
                resultgetall[0].MCBMCOST = (resultgetall[0].MCBMCOST / 1000).toFixed(2) + " K"
            }

            if (resultgetall[0].MCPMCOST >= 1000000) {
                resultgetall[0].MCPMCOST = (resultgetall[0].MCPMCOST / 1000000).toFixed(2) + " M"
            } else {
                resultgetall[0].MCPMCOST = (resultgetall[0].MCPMCOST / 1000).toFixed(2) + " K"
            }

            if (cost_plan[0].TotalMCCost >= 1000000) {
                cost_plan[0].TotalMCCost = (cost_plan[0].TotalMCCost / 1000000).toFixed(2) + " M"
            } else {
                cost_plan[0].TotalMCCost = (cost_plan[0].TotalMCCost / 1000).toFixed(2) + " K"
            }

            if (cost_plan[0].CostBM >= 1000000) {
                cost_plan[0].CostBM = (cost_plan[0].CostBM / 1000000).toFixed(2) + " M"
            } else {
                cost_plan[0].CostBM = (cost_plan[0].CostBM / 1000).toFixed(2) + " K"
            }

            if (cost_plan[0].CostPM >= 1000000) {
                cost_plan[0].CostPM = (cost_plan[0].CostPM / 1000000).toFixed(2) + " M"
            } else {
                cost_plan[0].CostPM = (cost_plan[0].CostPM / 1000).toFixed(2) + " K"
            }
            // Assuming result contains the data you want to send in the response
            res.status(201).json({ getcostactual: resultgetall, getcostplan: cost_plan, compare });
        }))
    })
};

const getCostPdDept = (req: any, res: any) => {
    const year = req.query.select_year;
    const month = req.query.select_month;
    let selected = `WHERE month(costp_Month_year) = ${month} AND year(costp_Month_year) = ${year} `;
    cost_by_pd_dept(selected,(err, result) => {
        if (err) {
            // Handle the error appropriately
            console.error('Error in createReqPassword:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        // Assuming result contains the data you want to send in the response
        let planbm = [0, 0, 0, 0, 0, 0, 0, 0]
        let planpm = [0, 0, 0, 0, 0, 0, 0, 0]
        for (const value_for_graph of result) {
            if (value_for_graph.product_name == "PD1") {
                planbm[0] = value_for_graph.costp_cost_bm
                planpm[0] = value_for_graph.costp_cost_pm
            }
            else if (value_for_graph.product_name == "PD2") {
                planbm[1] = value_for_graph.costp_cost_bm
                planpm[1] = value_for_graph.costp_cost_pm
            }
            else if (value_for_graph.product_name == "PD3") {
                planbm[2] = value_for_graph.costp_cost_bm
                planpm[2] = value_for_graph.costp_cost_pm
            }
            else if (value_for_graph.product_name == "PD4") {
                planbm[3] = value_for_graph.costp_cost_bm
                planpm[3] = value_for_graph.costp_cost_pm
            }
            else if (value_for_graph.product_name == "PD5") {
                planbm[4] = value_for_graph.costp_cost_bm
                planpm[4] = value_for_graph.costp_cost_pm
            }
            else if (value_for_graph.product_name == "PD6") {
                planbm[5] = value_for_graph.costp_cost_bm
                planpm[5] = value_for_graph.costp_cost_pm
            }
            else if (value_for_graph.product_name == "PD7") {
                planbm[6] = value_for_graph.costp_cost_bm
                planpm[6] = value_for_graph.costp_cost_pm
            }
            else {
                planbm[7] = value_for_graph.costp_cost_bm
                planpm[7] = value_for_graph.costp_cost_pm
            }
        }
        selected = `month(Date) = ${month} AND year(Date) = ${year} `;
        cost_actual_bm(selected,(err, result) => {
            if (err) {
                // Handle the error appropriately
                console.error('Error in createReqPassword:', err);
                return res.status(500).json({ error: 'Internal Server Error' });
            }
            let costbm = [0, 0, 0, 0, 0, 0, 0, 0]
            for (const value_for_graph of result) {
                if (value_for_graph.product_name == "PD1") {
                    costbm[0] = value_for_graph.Actual_BM
                }
                else if (value_for_graph.product_name == "PD2") {
                    costbm[1] = value_for_graph.Actual_BM
                }
                else if (value_for_graph.product_name == "PD3") {
                    costbm[2] = value_for_graph.Actual_BM
                }
                else if (value_for_graph.product_name == "PD4") {
                    costbm[3] = value_for_graph.Actual_BM
                }
                else if (value_for_graph.product_name == "PD5") {
                    costbm[4] = value_for_graph.Actual_BM
                }
                else if (value_for_graph.product_name == "PD6") {
                    costbm[5] = value_for_graph.Actual_BM
                }
                else if (value_for_graph.product_name == "PD7") {
                    costbm[6] = value_for_graph.Actual_BM
                }
                else {
                    costbm[7] = value_for_graph.Actual_BM
                }
            }
            // Assuming result contains the data you want to send in the response

            cost_actual_pm(selected,(err, result) => {
                if (err) {
                    // Handle the error appropriately
                    console.error('Error in createReqPassword:', err);
                    return res.status(500).json({ error: 'Internal Server Error' });
                }
                let costpm = [0, 0, 0, 0, 0, 0, 0, 0]
                for (const value_for_graph of result) {
                    if (value_for_graph.product_name == "PD1") {
                        costpm[0] = value_for_graph.Actual_PM
                    }
                    else if (value_for_graph.product_name == "PD2") {
                        costpm[1] = value_for_graph.Actual_PM
                    }
                    else if (value_for_graph.product_name == "PD3") {
                        costpm[2] = value_for_graph.Actual_PM
                    }
                    else if (value_for_graph.product_name == "PD4") {
                        costpm[3] = value_for_graph.Actual_PM
                    }
                    else if (value_for_graph.product_name == "PD5") {
                        costpm[4] = value_for_graph.Actual_PM
                    }
                    else if (value_for_graph.product_name == "PD6") {
                        costpm[5] = value_for_graph.Actual_PM
                    }
                    else if (value_for_graph.product_name == "PD7") {
                        costpm[6] = value_for_graph.Actual_PM
                    }
                    else {
                        costpm[7] = value_for_graph.Actual_PM
                    }
                }
                // Assuming result contains the data you want to send in the response
                res.status(201).json({ plan: { planbm, planpm }, costbm, costpm });
            });
        });

    });
}

//ข้อมูลกราฟ 
const getAllDataByPdDept = (req: any, res: any) => {
    const year = req.query.select_year;
    const month = req.query.select_month;
    let selected = `month(Date) = ${month} AND year(Date) = ${year} `;
    cost_actual_all_by_pddept(selected,(err, result) => {
        if (err) {
            // Handle the error appropriately
            console.error('Error in createReqPassword:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        let actual = [0,0,0,0,0,0,0,0]
        for (const value_for_graph of result) {
            if (value_for_graph.product_name == "PD1") {
                actual[0] = value_for_graph.Actual_All_By_PDDept
            }
            else if (value_for_graph.product_name == "PD2") {
                actual[1] = value_for_graph.Actual_All_By_PDDept
            }
            else if (value_for_graph.product_name == "PD3") {
                actual[2] = value_for_graph.Actual_All_By_PDDept
            }
            else if (value_for_graph.product_name == "PD4") {
                actual[3] = value_for_graph.Actual_All_By_PDDept
            }
            else if (value_for_graph.product_name == "PD5") {
                actual[4] = value_for_graph.Actual_All_By_PDDept
            }
            else if (value_for_graph.product_name == "PD6") {
                actual[5] = value_for_graph.Actual_All_By_PDDept
            }
            else if (value_for_graph.product_name == "PD7") {
                actual[6] = value_for_graph.Actual_All_By_PDDept
            }
            else {
                actual[7] = value_for_graph.Actual_All_By_PDDept
            }
        }
        selected = `WHERE month(costp_Month_year) = ${month} AND year(costp_Month_year) = ${year} `;
        cost_plan_all_by_pddept(selected,(err, result) => {
            if (err) {
                // Handle the error appropriately
                console.error('Error in createReqPassword:', err);
                return res.status(500).json({ error: 'Internal Server Error' });
            }
            let product_name = [0, 0, 0, 0, 0, 0, 0, 0]
            for (const value_for_graph of result) {
                if (value_for_graph.product_name == "PD1") {
                    product_name[0] = value_for_graph.Cost_All_By_PDDept
                }
                else if (value_for_graph.product_name == "PD2") {
                    product_name[1] = value_for_graph.Cost_All_By_PDDept
                }
                else if (value_for_graph.product_name == "PD3") {
                    product_name[2] = value_for_graph.Cost_All_By_PDDept
                }
                else if (value_for_graph.product_name == "PD4") {
                    product_name[3] = value_for_graph.Cost_All_By_PDDept
                }
                else if (value_for_graph.product_name == "PD5") {
                    product_name[4] = value_for_graph.Cost_All_By_PDDept
                }
                else if (value_for_graph.product_name == "PD6") {
                    product_name[5] = value_for_graph.Cost_All_By_PDDept
                }
                else if (value_for_graph.product_name == "PD7") {
                    product_name[6] = value_for_graph.Cost_All_By_PDDept
                }
                else if (value_for_graph.product_name == "PD8") {
                    product_name[7] = value_for_graph.Cost_All_By_PDDept
                }
            }
            // Assuming result contains the data you want to send in the response
            res.status(201).json({ cost_actual_all_by_pddept: actual, cost_plan_all_by_pddept: product_name });
        });
    });
};
// กราฟ 3
const getTotalPlanAndActual = (req: any, res: any) => {
    const year = req.query.select_year;
    const month = req.query.select_month;
    let selected = `WHERE month(costp_Month_year) = ${month} AND year(costp_Month_year) = ${year} `;
    get_mc_cost_bm_and_pm(selected,(err, result) => {
        if (err) {
            // Handle the error appropriately
            console.error('Error in createReqPassword:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        // Assuming result contains the data you want to send in the response
        const cost_plan = result
        selected = `month(Date) = ${month} AND year(Date) = ${year} `;
        get_mc_cost_bm_and_pm_actual(selected,((err, resultgetall) => {
            const resultall = (resultgetall)
            if (err) {
                // Handle the error appropriately
                console.error('Error in createReqPassword:', err);
                return res.status(500).json({ error: 'Internal Server Error' });
            }

            // Assuming result contains the data you want to send in the response
            res.status(201).json({ getcostactualtotal: resultgetall, getcostplantotal: cost_plan });
        }))
    })
};

const getTableCostPlan = (req: any, res: any) => {
    const year = req.query.select_year;
    const month = req.query.select_month;
    // Organize result by product_name
    const productName = ['PD1','PD2','PD3','PD4','PD5','PD6','PD7','PD8']
    let cost_plan: { [productName: string]: any} = {};
    let subdata = {};
    productName.forEach(name => {
        cost_plan[name] = {pd_dept:name, plan_BM: 0, actual_BM: 0, diff_BM: 0,diff_BM_color: "#248B00",subdata:{plan_PM: 0, actual_PM: 0, diff_PM: 0,diff_PM_color: "#248B00", plan_total: 0, actual_total: 0, diff_total: 0,diff_total_color: "#248B00"}};
    });
    let selected = `WHERE month(costp_Month_year) = ${month} AND year(costp_Month_year) = ${year} `;
    get_table_cost_plan(selected,(err, result) => {
        if (err) {
            // Handle the error appropriately
            console.error('Error in createReqPassword:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        // Assuming result contains the data you want to send in the response
        for(const row of result){
            const productName = row.product_name;
            if (cost_plan.hasOwnProperty(productName)) {
                cost_plan[productName].plan_BM = row.cost_cost_bm;
                cost_plan[productName].subdata.plan_PM = row.costp_cost_pm;
                cost_plan[productName].subdata.plan_total = row.total_cost_plan;
            }
        };
        selected = `where month(Date) = ${month} AND year(Date) = ${year} `;
        get_table_actual(selected,((err, resultgetall) => {
            if (err) {
                // Handle the error appropriately
                console.error('Error in createReqPassword:', err);
                return res.status(500).json({ error: 'Internal Server Error' });
            }
            for(const row of resultgetall){
                const productName = row.product_name;
                if (cost_plan.hasOwnProperty(productName)) {
                    cost_plan[productName].actual_BM = row.MCBMCOST;
                    cost_plan[productName].subdata.actual_PM = row.MCPMCOST;
                    cost_plan[productName].subdata.actual_total = row.MCALL;
                }
            };
            for(const index of productName){
                cost_plan[index].subdata.diff_PM = Number(cost_plan[index].subdata.plan_PM - cost_plan[index].subdata.actual_PM);
                cost_plan[index].diff_BM = Number(cost_plan[index].plan_BM - cost_plan[index].actual_BM);
                cost_plan[index].subdata.diff_total = Number(cost_plan[index].subdata.plan_total - cost_plan[index].subdata.actual_total);
                if(cost_plan[index].subdata.diff_PM<0){
                    cost_plan[index].subdata.diff_PM_color = "#E1032B"
                }
                if(cost_plan[index].diff_BM<0){
                    cost_plan[index].diff_BM_color = "#E1032B"
                }
                if(cost_plan[index].subdata.diff_total<0){
                    cost_plan[index].subdata.diff_total_color = "#E1032B"
                }
            }
            const responseData = Object.values(cost_plan);
            // Assuming result contains the data you want to send in the response
            res.status(201).json({getcostplantotal: responseData });
        }))
    })
};

export { getCostAll, getMcCostBmAndPm, getCostPdDept, getAllDataByPdDept, getTotalPlanAndActual,getTableCostPlan };