/*
* user_manage.router.ts
* router for api
* @input -
* @output -
* @author Panuphong,Suphattra
* @Create Date 2567-02-16
*/
import express from 'express';
import { getUserAll, insertPermissionandWorkTime} from './user_manage.controller';
import  {checkToken}  from '../../auth/token_validation';

const router = express.Router();

// Route to get all users
router.get('/user-manage/',checkToken,getUserAll);
router.post('/user-insert-log/',checkToken,insertPermissionandWorkTime);


export default router