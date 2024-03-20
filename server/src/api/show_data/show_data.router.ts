/*
* show_data.router.ts
* router for api
* @input  -
* @output -
* @author Panuphong,Kamin,Tassapol,Nattapak
* @Create Date 2567-03-04
*/
import express from 'express';
import { getDataMaintenanceAll, getMonthlyCase,getDailyCase, getManpower,getDetailMachineData,getLayoutData,getMttrMtbf } from './show_data.controller';
import  {checkToken}  from '../../auth/token_validation';

const router = express.Router();

// Route to get all users
router.get('/',checkToken, getDataMaintenanceAll);

router.get('/layout',checkToken, getMonthlyCase);

router.get("/daily-case",checkToken, getDailyCase)

router.get('/manpower',checkToken, getManpower);
router.get('/map-layout',checkToken, getLayoutData);
router.get('/mttr-mtbf',checkToken, getMttrMtbf);
router.get('/detail-machine-data',checkToken, getDetailMachineData);
export default router;
