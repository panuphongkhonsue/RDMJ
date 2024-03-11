/*
* v_requset_password.router.ts
* router for api
* @input  -
* @output -
* @author Panuphong
* @Create Date 2567-02-18
*/
import express from 'express';
import {requestResetPassword,resetPassword,checkExpiredLink} from './request_password.controller';
import  {checkToken}  from '../../auth/token_validation';


const router = express.Router();

// Route to create a request password, protected by token validation
router.post('/', requestResetPassword);
router.patch('/reset-password',resetPassword);
router.get('/check-expired-link', checkExpiredLink);
export default router;
