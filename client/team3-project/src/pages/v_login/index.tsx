/*
* v_login/index.tsx
* Display login
* @input username, password
* @output login
* @author Nattapak
* @Create Date 2566-10-09
*/

import React, { FormEvent, useEffect, useState } from 'react'
import Image from 'next/image'
import "/src/css/login.css"
import 'bootstrap/dist/css/bootstrap.css'
import Input from '@mui/joy/Input';
import FormLabel from '@mui/joy/FormLabel';
import Button from '@mui/material/Button';
import Link from 'next/link';
import axios, { AxiosResponse } from 'axios';
import router from "next/router"
import Cookies from 'js-cookie';

// เรียกใช้ function ของ v_login
export default function v_login() {

    //การตัวตัวแปร
    const [user_emp_id, setUserEmpId] = useState('');
    const [user_password, setUserPassword] = useState('');
    const [not_found, setNotFound] = useState('');
    const pathurl = process.env.NEXT_PUBLIC_APP_URL;
    const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (event) => {
        if (event.key === 'Enter') {
            login()
        }
    };
    //
    const login = async () => {
        //
        const to_do = {
            user_emp_id: user_emp_id,
            user_password: user_password
        }

        //
        const requiredOptions = {
            method: 'post',
            maxBodyLength: Infinity,
            url: `${pathurl}/api/users/login`,
            headers: {
                'Content-Type': 'application/json'
            },
            data: to_do,
            // withCredentials: true,
        }
        
        if(user_emp_id == ''|| user_password == ''){
            setNotFound('Invalid Username or Password !')
        }else{
            axios.request(requiredOptions)
            .then((response) => {
                const { token } = response.data;
                Cookies.set('user', token, { expires: 90 });
                router.push('/v_layout');
            })
            .catch((error) => {
                setNotFound('Invalid Username or Password !')
                console.log(error);
            });
        }
        
    }

    return (
        // ส่วนของสีพื้นหลัง
        <div className="bg_color">
            {/* ส่วนของการจัดเนื้อหาให้อยู่ตรงกลางหน้าจอ */}
            <div className="align-items-center ">
                {/* ส่วนเนื้อหา */}
                <div className="bg_login">
                    {/* โลโก้ของบริษัท Denso */}
                    <Image src='/icon_denso.svg' className="logo_denso" width={400} height={100} alt="icon_emp_id" priority/>
                    {/* ชื่อระบบ */}
                    <div className="text_name_rdmj">
                        Realtime Dashboard Daily Maintenance Job
                    </div>
                    {/* ส่วน Form ที่กรอกข้อมูล */}
                    <div className="FormLabel">
                        <form>
                            {/* ส่วนของการ Input Username  */}
                            <FormLabel>
                                <Image src='/icon_emp_id.svg' className="icon" width={30} height={30} alt="icon_emp_id" />
                                <Input required className="input_text" placeholder="Employee ID" type="text" id="emp_id" onChange={(e) => setUserEmpId(e.target.value)} onKeyDown={(e) => handleKeyDown(e)} />
                            </FormLabel>
                            {/* ส่วนของการ Input Password */}
                            <div className="input">
                                <FormLabel className=" input-password">
                                    <Image src='/icon_password.svg' className="icon" width={30} height={30} alt="icon_password" />
                                    <Input className="input_text" placeholder="Password" type="password" id="password" required onChange={(e) => setUserPassword(e.target.value)} onKeyDown={(e) => handleKeyDown(e)} />
                                </FormLabel>
                                {/* แจ้งเติอนกรอกผิด */}
                                <FormLabel className="hilight_text ms-5" id="not_found">{not_found}</FormLabel>
                            </div>
                            {/* ปุ่มยืนยัน Login */}
                            <Button /*href='/v_layout'*/ className="button_login mt-4" variant="outlined" id="button_login" onClick={login} >Login</Button>
                        </form>
                    </div>
                    {/* ส่วนของการ Reset Password */}
                    <div className="FormLabel">
                        Forgot Your <Link href="/v_request_password" className="hilight_text" id="request_password">Password?</Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
