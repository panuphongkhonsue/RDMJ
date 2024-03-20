/*
* summary_report.router.ts
* router for api
* @input 
* @output -
* @author Tassapol,Panuphong
* @Create Date 2567-02-19
*/
import express from 'express';
import {getCostAll,getMcCostBmAndPm,getCostPdDept,getAllDataByPdDept,getTotalPlanAndActual,getTableCostPlan} from './summary_report.controller';
import  {checkToken}  from '../../auth/token_validation';

const router = express.Router();

// Route to get all users
router.get('/',checkToken, getCostAll);
router.get('/get-mc-cost-bm-and-pm',checkToken, getMcCostBmAndPm)
router.get('/get-cost-pd-dept',checkToken, getCostPdDept)
router.get('/get-all-data-by-pddept',checkToken, getAllDataByPdDept)
router.get('/get-total-plan-and-actual',checkToken, getTotalPlanAndActual)
router.get('/table-cost-plan',checkToken,getTableCostPlan)



export default router;