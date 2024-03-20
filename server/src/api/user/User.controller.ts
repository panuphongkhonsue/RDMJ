/*
* User.controller.ts
* controller for User
* @input -
* @output -
* @author Nattapak
* @Create Date 2566-11-27
*/
import { Json } from 'sequelize/types/utils';
import bcrypt from 'bcrypt';
import { genSaltSync, hashSync,compareSync } from "bcrypt";
const {sign} = require("jsonwebtoken");
const jwt = require("jsonwebtoken")

import user from "./user.service";
// import { sign } from "crypto";
const get_user = user.get_user
const get_user_by_user_id = user.get_user_by_user_id
const get_user_by_cookie_token = user.get_user_by_cookie_token


const getUserAll = (req:any,res:any) =>{
    const id = req.params.id;
    get_user((err,result)=>{
        if (err) {
            // Handle the error appropriately
            console.error('Error in createReqPassword:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        // Assuming result contains the data you want to send in the response
        res.status(201).json(result);
    });
}
const getUserByUserId = (req:any,res:any) =>{
    const id = req.params.id;
    get_user_by_user_id(id,(err,result)=>{
        if (err) {
            // Handle the error appropriately
            console.error('Error in createReqPassword:', err);
            return res.json({ massage: 'Internal Server Error' });
        }
        if(!result){
            return res.json({ massage: 'Record not Found' });
        }
        // Assuming result contains the data you want to send in the response
        res.json(result);
    });
}

const login = async  (req:any,res:any) =>{
    const body = req.body;
    get_user_by_user_id(body.user_emp_id ,async (err,result)=>{
        if (err) {
            // Handle the error appropriately
            console.error('Error in createReqPassword:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        if(result[0]==''||result[0]==undefined && result[0]==null ){ 
            return res.status(501).json({error: 'Invalid Employee ID or Password' });
        } else{
            const passwordMatch:any = await bcrypt.compare(body.user_password, result[0].user_password);
            if(passwordMatch){
                const jsontoken = sign({user_emp_id:result[0].user_emp_id},process.env.JWT_TOKEN_SECRET,{expiresIn:"90d"})
                const cookieOpitions ={
                    expiresIn:new Date(Date.now() + 90 *24*60*60*1000)
                }
                res.cookie("user",jsontoken,cookieOpitions);
                return result[0],res.status(201).json({
                    token:jsontoken});
            }else{
                return res.status(502).json({ error: 'Invalid Employee ID or Password' });
            }
        }
       

    } );
}

const logout = (req:any,res:any) =>{
    res.clearCookie('user');
    res.redirect("/");
}

const getUserDataByToken = (req: any, res: any) => {
    const cookieToken = req.cookies.user; // Assuming the cookie name is 'user'
    const cookieTo = req.cookies;
    if (!cookieToken) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    get_user_by_cookie_token(cookieToken, (error, userData) => {
        if (error) {
            console.error(error);
            return res.status(401).json({ message: 'Unauthorized' });
        }

        res.json({ user: userData ,message: 'compess'});
    });
};

  


export {getUserAll, getUserByUserId,login,logout,getUserDataByToken};
