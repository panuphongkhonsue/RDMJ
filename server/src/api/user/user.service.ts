/*
* user.service.ts
* service for User
* @input -
* @output -
* @author Nattapak
* @Create Date 2566-11-27
*/
import database from "../../config/database";
const jwt = require("jsonwebtoken")

export const get_user = (callBack: (error: any, result: any) => void) => {
    database.query(
        "SELECT * FROM user join rdmj_user on `Employee no.` = user_emp_id;",
        [],
        (err,results,fields) => {
            if (err) {
                console.error('Error in database query:', err);
                return callBack(err,null);
            }
            return callBack(null, results);
        }
    );
};

export const get_user_by_user_id = (user_emp_id:any,callBack: (error: any, result: any) => void) => {
    database.query(
        "SELECT * FROM user join rdmj_user on `Employee no.` = user_emp_id where user_emp_id= ?;",
        [user_emp_id],
        (err,results,fields) => {
            if (err) {
                console.error('Error in database query:', err);
                return callBack(err,null);
            }
            return callBack(null, results);
        }
    )
}

export const get_user_by_cookie_token = (cookieToken: string, callback: (error: any, result?: any) => void): void => {
  try {
      if (cookieToken) {
          const decoded: any = jwt.verify(cookieToken, process.env.JWT_TOKEN_SECRET);

          database.query(
              "SELECT * FROM user JOIN rdmj_user ON `Employee no.` = user_emp_id WHERE user_emp_id = ?;",
              [decoded.user_emp_id],
              (err: any, result: any) => {
                  if (err) {
                      callback({ message: "Invalid token" });
                  } else {
                      callback(null, result[0]);
                  }
              }
          );
      } else {
          callback({ message: "Access denied! Unauthorized user" });
      }
  } catch (error) {
      callback(error);
  }
};

export default {get_user,get_user_by_user_id,get_user_by_cookie_token};
