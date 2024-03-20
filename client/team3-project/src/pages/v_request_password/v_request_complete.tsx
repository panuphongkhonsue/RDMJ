/*
* v_request_password_complete.tsx
* show when request password success
* @input  -
* @output show request password success
* @author Panuphong
* @Create Date 2567-02-11
*/
import React from 'react'
import "/src/css/login.css"
import 'bootstrap/dist/css/bootstrap.css'
import Link from 'next/link' 
import Image from 'next/image'
import Head from 'next/head'
type Props = {}


export default function RequestPasswordComplete({}: Props) {
    return (
        <div className="bg_color">
         <Head>
            <link rel="icon" href="/icon_denso.svg" />
            <title>RDMJ</title>
        </Head>
    <div className="row align-items-center">
        <div className="col ">
            <div className='bg_request rounded-4 shadow p-5  '>
                <Image src='/icon_denso.svg' className='logo_denso' width={400} height={100} alt="icon_emp_id" />
                <div className='text_name_rdmj'>
                    Realtime Dashboard Daily Maintenance Job
                </div>  
                <div className='text_bold_request'>
                     Request Password Complete               
                 </div>  
                 <div className="check-email">
                    Please check your email to verified it.
                 </div>
                 <div className='text_center'>
                         <Link href="/v_login" className='hilight_text_complete' id="request_return_login">Please login again.</Link> Thank you
                </div>
            </div>
        </div>
     
    </div>
</div>
    )
  }