/*
* user.router.ts
* router for api
* @input -
* @output -
* @author Nattapak
* @Create Date 2566-11-27
*/
import express from 'express';
import { getUserAll, getUserByUserId, login,logout, getUserDataByToken } from './User.controller';
import  {checkToken}  from '../../auth/token_validation';

const router = express.Router();

// Route to get all users
router.get('/user/',checkToken, getUserAll);

router.get('/user/:id',checkToken, getUserByUserId);

// Route to get a user by ID
router.get('/token',checkToken, getUserDataByToken);

// Route for user login
router.post('/login', login);

router.post('/logout',checkToken, logout);



export default router;
