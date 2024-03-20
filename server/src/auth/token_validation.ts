const { verify } = require("jsonwebtoken");
const jwt = require("jsonwebtoken")
import rdmj_database from "../config/database"

export const checkToken = (req:any,res:any,next:any)=>{
        const token = req.cookies.user;
        if(token){
            const tokenValue  = token.slice(7);
            const decoded = jwt.verify(req.cookies.user ,process.env.JWT_TOKEN_SECRET);
            rdmj_database.query("SELECT * FROM user join rdmj_user on `Employee no.` = user_emp_id where user_emp_id = ? ;",
            [decoded.user_emp_id],(err:any,result:any)=>{
                if(err){
                    res.json({
                        massage: "Invalid token"
                    })
                }else{
                    req.user_emp_id = result[0]
                    next();
                }
            })
        }else{
            res.json({
                massage: "Access dinied! unauthorization user"
            })
        }
    }

export default checkToken;