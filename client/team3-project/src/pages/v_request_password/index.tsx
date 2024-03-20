/*
* v_request_password.tsx
* request for password
* @input  email
* @output send email
* @author Panuphong
* @Create Date 2567-02-11
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
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import { Email } from '@mui/icons-material';
import Loading from '../components/c_loading/c_loading_circle';
import Cookies from "js-cookie";
import Head from 'next/head';

type Props = {}

export default function RequestPassword({ }: Props) {
    const [emp_email, setEmpEmail] = useState('');
    const [not_found, setNotFound] = useState('')
    const [loading, setLoading] = useState(true);
    //ตัวแปรสำหรับเก็บคุกกี้
    const token = Cookies.get('user');

    const pathurl = process.env.NEXT_PUBLIC_APP_URL;

    useEffect(()=>{
        const delay = 500; 
        setTimeout(() => {
            setLoading(false);
          }, delay);
    },['null']);
    
    const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (event) => {
        if (event.key === 'Enter') {
            setLoading(false)
            sent();
        }
    };

    const sent = async () => {
        const todo = {
            rp_email: emp_email,
        }
        const requiredOptions = {
            method: 'post',
            maxBodyLength: Infinity,
            url: `${pathurl}/api/request-password/`,
            headers: { 'Content-Type': 'application/json' ,'Cookie': `user=${token}`},
            withCredentials: true,
            data: todo
        }
        if (emp_email == '') {
            setNotFound("Please enter your email address correctly.")
        } else {
            axios.request(requiredOptions)
                .then((response) => {
                    router.push('/v_request_password/v_request_complete');
                })
                .catch((error) => {
                    setNotFound("Invalid Email !")
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
                        Reset Password
                    </div>
                    <div className='FormLabel mt-1'>
                            <div className="email mt-2">
                                <FormLabel className = " email-box">
                                    <Image src='/icon_email.svg' className='icon' width={30} height={30} alt="icon_email" />
                                    <Input className='input_text' placeholder="Email" id="emp_email" onChange={(e) => setEmpEmail(e.target.value)} onKeyDown={(e) => handleKeyDown(e)} />
                                </FormLabel>
                                <FormLabel className="hilight_text ms-5" id="not_found">{not_found}</FormLabel>
                            </div>
                            
                            <div className="but mt-3">
                                <Button className='button_login' variant="outlined" id="button_sent" onClick={sent}>Send</Button>
                                <Button href="/v_login" className='button_back' variant="outlined" id="button_Back_login">Back</Button>
                            </div>
                    </div>
                    <div className='FormLabel'>
                    </div>
                </div>

            </div>
            )}
        </div>
    )
}