import express,{ Request,Response } from "express";
import bodyParser from 'body-parser';
import cors from "cors";
import dotenv from "dotenv";
import usesRouter from "./api/user/user.router";
import costPlan from "./api/cost_plan/cost_plan.router";
import casePlan from "./api/case_plan/case_plan.router";
import requestPasswordRouter from "./api/request_password/request_password.router"
import showData from "./api/show_data/show_data.router";
import check_attendance from "./api/check_attendance/check_attendance.router";
import user_manage from "./api/user_manage/user_manage.router";
import cookieParser from 'cookie-parser';
import summary_report from "./api/summary_report/summary_report.router";

dotenv.config({ path: './.env'})
const app = express()
app.use(bodyParser.json())
app.use(cookieParser())
app.use(cors({
    origin: [
        'localhost',
        '127.0.0.1',
        'http://localhost:3000',
        'http://dekdee2.informatics.buu.ac.th:8003'
    ],
    credentials: true
}));
app.use(express.json());
app.use("/api/users",usesRouter)
app.use("/api/request-password",requestPasswordRouter)
app.use("/api/show-data",showData)
app.use("/api/cost",costPlan)
app.use("/api/case",casePlan)
app.use("/api/check-attendance",check_attendance)
app.use("/api/summary-report",summary_report)
app.use("/api/user-manage",user_manage)   

app.listen(3000, ()=>console.log("server is running..."));

