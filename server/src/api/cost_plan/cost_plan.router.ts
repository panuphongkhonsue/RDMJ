/*
* cost_plan.router.ts
* router for cost plan
* @input -
* @output -
* @author Kamin,Panuphong
* @Create Date 2567-15-15
*/
import express from 'express';
import { getCostPlan, createCostPlan, updateCostPlan } from './cost_plan.controller';
import  {checkToken}  from '../../auth/token_validation';

const router = express.Router();

router.get('/cost-plans',checkToken, getCostPlan);
router.post('/cost-plans/create',checkToken, createCostPlan);
router.put('/cost-plans/update/:id',checkToken, updateCostPlan);

export default router;