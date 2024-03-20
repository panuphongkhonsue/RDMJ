/*
* v_reset_pasasword.tsx
* reset password
* @input  password,confirm password
* @output password change 
* @author Panuphong
* @Create Date 2567-02-18
*/
import React, { FormEvent, useEffect, useState } from 'react'
import Image from 'next/image'
import "/src/css/login.css"
import 'bootstrap/dist/css/bootstrap.css'
import Input from '@mui/joy/Input';
import FormLabel from '@mui/joy/FormLabel';
import Button from '@mui/material/Button';
import Link from 'next/link'
import axios from 'axios';
import router from "next/router"
import { useRouter } from 'next/router';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Loading from '../components/c_loading/c_loading_circle';
import Head from 'next/head'
type Props = {}

export default function ResetPassword({ }: Props) {
    // ตัวแปรสำหรับแอนิเมชันโหลด
    const [loading, setLoading] = useState(true);
    // ตัวแปรเก็บรหัสผ่านใหม่
    const [emp_reset_password, setEmpResetPassword] = useState('');
    // คัวแปรเก็บยืนยันรหัสผ่าน
    const [emp_confirm_password, setEmpConfirmPassword,] = useState('');
    // ตัวแปรสำหรับดักข้อผิดพลาด
    const [not_found, setNotFound] = useState('')
    const router = useRouter();
    // get token from path
    const { token } = router.query;
    // when the page start, check the token and the link expired
    const pathurl = process.env.NEXT_PUBLIC_APP_URL;
    useEffect(() => {
        if (token) {
            const checkExpired = {
                method: 'get',
                maxBodyLength: Infinity,
                url: `${pathurl}/api/request-password/check-expired-link?token=${token}`,
                headers: { 'Content-Type': 'application/json' },
            }
            axios.request(checkExpired)
                .then((response) => {
                    const delay = 500;
                    setTimeout(() => {
                        setLoading(false);
                    }, delay);
                })
                .catch((error) => {
                    if (error && error.response && error.response.status === 401) {
                        if (error.response.data && error.response.data.token === 'Token expired') {
                            alert('Token expired. Please initiate a new password reset.');
                            router.replace('/'); // Redirect to a 404 page or an error page
                        } else if (error.response.data && error.response.data.link === 'Link has expired') {
                            alert('Link expired. Please initiate a new password reset.');
                            router.replace('/'); // Redirect to a 404 page or an error page
                        } else {
                            alert('Link not existed. Please initiate a new password reset.');
                            router.replace('/'); // Redirect to a 404 page or an error page
                            console.log(error);
                        }
                    } else {
                        alert('Link not existed. Please initiate a new password reset.');
                        router.replace('/'); // Redirect to a 404 page or an error page
                        console.log(error);

                    };
                })
        }
    }, [token]); // Only run the effect when the token change

    //send password to reset function
    const sent: React.MouseEventHandler<HTMLButtonElement> = async (event) => {
        if (emp_reset_password == '' && emp_confirm_password == '') {
            setNotFound("Please enter your passwords")
        }
        else if (emp_reset_password != emp_confirm_password) {
            setNotFound("Please enter your passwords to match.")
        }
        else if (emp_reset_password.length < 10 || emp_reset_password.length > 14) {
            setNotFound("Password must have 10-14 characters. ")
        }
        else {
            // object for sending to reset password
            const todo = {
                rp_password: emp_confirm_password,
                token: token as string, // Assuming token is a string, adjust accordingly
            };
            // call api 
            const requiredOptions = {
                method: 'patch',
                maxBodyLength: Infinity,
                url: `${pathurl}/api/request-password/reset-password`,
                headers: { 'Content-Type': 'application/json' },
                data: todo
            }

            axios.request(requiredOptions)
                .then((response) => {
                    router.push('/v_reset_password/v_reset_complete');
                })
                .catch((error) => {
                    setNotFound('Password reset failed. Please try again.');
                    console.log(error);
                });
        }
    }
    return (

        <div className="bg_color">
        <Head>
            <link rel="icon" href="/icon_denso.svg" />
            <title>RDMJ</title>
        </Head>
            {loading ? (
                <Loading height='80vh' width='100vh' color='white' size={40} thickness={4} />
            ) : (
                <div className="align-items-center">
                    <div className='bg_request rounded-4 shadow p-5  '>
                        <Image src='/icon_denso.svg' className='logo_denso' width={400} height={100} alt="icon_emp_id" />
                        <div className='text_name_rdmj'>
                            Realtime Dashboard Daily Maintenance Job
                        </div>
                        <div className='text_reset_password'>
                            Change Your Password
                        </div>
                        <div className='FormLabel mt-3'>
                            <form>
                                <div>
                                    <FormLabel>
                                        <Image src='/icon_password.svg' className='icon' width={30} height={30} alt="icon_email" />
                                        <Input className='input_text' placeholder="New Password" type="password" id="emp_new_password" onChange={(e) => setEmpResetPassword(e.target.value)} />
                                    </FormLabel>
                                    <FormLabel className='input-confirm'>
                                        <Image src='/icon_password.svg' className='icon' width={30} height={30} alt="icon_email" />
                                        <Input className='input_text' placeholder="Confirm Password" type="password" id="emp_cf_password" onChange={(e) => setEmpConfirmPassword(e.target.value)} />
                                    </FormLabel>
                                    <FormLabel className="hilight_text ms-5" id="not_found">{not_found}</FormLabel>
                                </div>
                                <Button className='button_login mt-3 bor' variant="outlined" id="button_confirm" onClick={sent}>Confirm</Button>
                            </form>
                        </div>
                        <div className='FormLabel'>
                        </div>
                    </div>

                </div>
            )}
        </div>
    )
}