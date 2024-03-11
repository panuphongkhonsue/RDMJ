/*
* requset_password.controller.ts
* controller for request password and reset password
* @input  -
* @output -
* @author Panuphong
* @Create Date 2567-02-18
*/
import requst_password, { reset_password } from "./request_password.service";
import dotenv from "dotenv";
import bcrypt from 'bcrypt';
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// สร้างตัวแปรเรียกใช้ service
const create_req_password = requst_password.request_reset_password
const update_password = requst_password.reset_password;
const check_expired_link_query = requst_password.check_expired_link;
dotenv.config({ path: './.env' })
//สร้าง secretKey เพื่อสร้างรหัสความปลอดภัย
const secretKey = 'siam-denso-reset-password';
const saltRounds = 10;
// สร้างตัวแปรสำหรับเก็บemailของผู้ส่งเรียกจาก .env
const emailUser = process.env.MAIL_USERNAME;
// รหัสผ่้านที่ generate มาจาก .env
const emailPass = process.env.MAIL_GENERATEPASS;
// ฟังก์ชันสร้าง Token
function generateResetToken(userName: number, uniqueId: string) {
    const timeStamp = Date.now(); // Include a timestamp
    const token = jwt.sign({ userName, uniqueId, timeStamp }, secretKey, { expiresIn: '24h' });
    return token;
}


// ฟังก์ชันส่ง email
function sendResetEmail(email: string, token: any) {
    // หากคลิกลิงค์จะนำทางไปยัง Path อีก
    const resetLink = `http://dekdee2.informatics.buu.ac.th:8003/v_reset_password?token=${token}`;

    const tranSporter = nodemailer.createTransport({
        host: process.env.MAIL_HOST,
        port: process.env.MAIL_PORT,
        secure: false,
        auth: {
            user: emailUser,
            pass: emailPass
        }
    });

    // เนื้อหาภายใน email
    const mailOptions = {
        from: `"Siamdenso" <${emailUser}>`,
        to: email,
        subject: 'Password Reset',
        html: `
        <br>
        <div style="display:flex; flex-wrap:row">
            <img width="100" height="50" style="border-radius: 10%;" src="https://cdn.discordapp.com/attachments/1125681226636873790/1179683372847599678/LogoDenso.png?ex=657aacc1&is=656837c1&hm=452fc36913d4cf576118be8a94e2468fca9eb88094ec6f5262cc515f0e43b7c7&" alt="Siamdenso Logo">
            <h3 style="color:red;display:inline;margin-left:20px;align-item:center;margin-top:auto;margin-bottom:auto;">Reset Password.</h3>
        </div>
        <br>
        <hr>
        <br>
        <div>HI! ${email}</div>
        <br>
        <div>You can click this <a href="${resetLink}">link</a> to reset your password </div>
        <div>Please do this request within 24 hours.</div>
        <div>If you don't request a password reset. You don't need to take any action. And you can ignore about this e-mail.</div>
        <br>
        <br>
        <div>Best regards,</div>
        <div>Siam denso co. ltd.</div>
        
        `
    };

    tranSporter.sendMail(mailOptions, function (error: any, info: any) {
        if (error) {
            console.log(error);
        }
    });
}

// controller ของการส่งอีเมลล์สำหรับเปลี่ยนรหัสผ่าน
const requestResetPassword = (req: any, res: any) => {
    // Ensure req.body contains the necessary data
    const data = req.body.rp_email;
    const uniqueId = Math.random().toString(36).substring(7); // Generate a unique identifier
    //เรียก service เพือทำการค้นหารหัสพนักงานและบันทึกการส่งคำร้องขอเปลี่ยนรหัสผ่าน
    create_req_password(data, uniqueId, (error: any, result: any) => {
        if (error) {
            // Handle the error appropriately
            console.error('Error in createReqPassword:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        // รับค่ารหัสพนักงานใส่ตัวแปร username
        const userName = result;
        const email = data;
        // เรียกใช้ฟงัก์ชันเพื่อสร้าง Token
        const resetToken = generateResetToken(userName, uniqueId);
        // ทำการส่งอีเมลล์
        sendResetEmail(email, resetToken);
        // Assuming result contains the data you want to send in the response
        return res.status(201).json(result);
    });
};
// ฟังก์ชัน hash รหัสผ่านก่อนบันทึกลงสู่ฐานข้อมูล
const hashPassword = async (password: string) => {
    const hash = await bcrypt.hash(password, saltRounds);
    return hash;
};
// ฟังก์ชันเปรียบเทียบรหัสผ่านปกติและรหัสผ่านที่ hash แล้วว่าตรงกันหรือไม่
const comparePasswords = async (password: string, hashedPassword: string) => {
    const match = await bcrypt.compare(password, hashedPassword);
    return match;
}
// controller สำหรับเปลี่ยนรหัสผ่าน
const resetPassword = async (req: any, res: any) => {
    const hashedPassword = await hashPassword(req.body.rp_password);
    const isPasswordMatch = await comparePasswords(req.body.rp_password, hashedPassword);
    if (isPasswordMatch) {
        // ถอดรหัสเพื่อรับค่า username
        jwt.verify(req.body.token, secretKey, (err: any, decoded: any) => {
            if (err) {
                return res.status(401).send('Invalid token');
            }
            const { userName, uniqueId, timeStamp } = decoded;
            // เรียกใช้ service สำหรับเปลี่ยนรหัสผ่าน
            update_password(userName, hashedPassword, (error: any, result: any) => {
                if (error) {
                    // Handle the error appropriately
                    console.error('Error in resetPassword:', error);
                    return res.status(500).json({ error: 'Internal Server Error' });
                }
                return res.status(201).json(result);
            });
        });
    }

}

// controller สำหรับตรวจสอบว่า Token หมดอายุแล้ว หรือ link นี้้เคยใช้แล้ว
const checkExpiredLink = (req: any, res: any) => {
    const token = req.query.token;
    // ถอดรหัสก่อน
    if (!token) {
        return res.status(400).json({ error: 'Token must be provided in the request body' });
    }
    jwt.verify(token, secretKey, (err: any, decoded: any) => {
        if (err) {
            console.log(err);
            // return res.status(403).send('Forbidden');

        }
        const { userName, uniqueId, timeStamp } = decoded;
        // เช็คว่า Token หมดอายุหรือจากวันสร้างToken
        const freshnessThreshold = Date.now() - (24 * 60 * 60 * 1000); // 24 hours
        if (timeStamp < freshnessThreshold) {
            return res.status(401).json({ token: 'Token expired' });
        }
        // เรียกใช้ Service สำหรับตรวจสอบว่าคำขอนี้หมดอายุหรือยัง
        check_expired_link_query(userName, uniqueId, (error: any, result: any) => {
            if (error) {
                // Handle the error appropriately
                console.error('Error in resetPassword:', error);
                return res.status(500).json({ error: 'Internal Server Error' });
            }
            // ถ้าผู้ใช้ขอลิงค์ใหม่ไปแล้วลิงค์เก่าจะถูกเปลี่ยสถานะเป็น 1
            if (result == 1) {
                console.error('Error in resetPassword:', error);
                return res.status(401).json({ link: 'Link has expired' });
            }
            return res.status(201).json({ message: 'Success' });
        });

    });
}

export { requestResetPassword, resetPassword, checkExpiredLink };