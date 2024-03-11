 /*
 * case_plan.router.ts
 * router for api
 * @input -
 * @output -
 * @author Kamin,Panuphong,Chasita
 * @Create Date 2567-15-15
 */
import express from 'express';
import { getCasePlan, createCasePlan, updateCasePlan } from './case_plan.controller';
import  {checkToken}  from '../../auth/token_validation';

const router = express.Router();

router.get('/case-plans',checkToken, getCasePlan);
router.post('/case-plans/create',checkToken, createCasePlan);
router.put('/case-plans/update/:id',checkToken, updateCasePlan);

export default router;