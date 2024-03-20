/*
* c_hover_layout.tsx
* component hover_layout
* @input -
* @output show Machine data and detail breakdown
* @author Panuphong Khonsue
* @Create Date 2567-02-23
*/

import React from 'react'
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Unstable_Popup as BasePopup } from '@mui/base/Unstable_Popup';

import { styled } from '@mui/system';
import "/src/css/layout.css";
import axios from 'axios';
import Loading from '../c_loading/c_loading_circle';
import Cookies from "js-cookie";
// พิมพ์เขียวสำหรับรับค่าคุณสมบัติของตัว Select
type Props = {
    product_name: string;
    pd_dept: number;
    ColorCode: any;
    placement?: string;
};
// height:150px;
const PopupBody = styled('div')(
    ({ theme }) => `
    width: max-content;
    padding: 12px 16px;
    margin: 8px;
    border-radius: 8px;
    border: 1px solid #133E4E;
    background-color: #133E4E;
    box-shadow: ${theme.palette.mode === 'dark'
            ? `0px 4px 8px rgb(0 0 0 / 0.7)`
            : `0px 4px 8px rgb(0 0 0 / 0.1)`
        };
    font-family: 'IBM Plex Sans', sans-serif;
    z-index: 1000;
    overflow-y: auto;
    max-height:500px;
    @media (max-width: 768px) { /* Adjust the breakpoint as needed */
        display:none;
    }
    /* Apply scrollbar styles */
    &::-webkit-scrollbar {
      width: 8px;
    }

    /* Track */
    &::-webkit-scrollbar-track {
      background: #f1f1f1;
    }

    /* Handle */
    &::-webkit-scrollbar-thumb {
      background: #888;
      border-radius: 10px;
    }

    /* Handle on hover */
    &::-webkit-scrollbar-thumb:hover {
      background: #555;
    }
  `,
);


export default function HoverMaintenance({ product_name, pd_dept, ColorCode, placement = 'left-start' }: Props) {
    // ฟังก์ชันแสดงข้อมูล Hover
    const [anchor, setAnchor] = React.useState<null | HTMLElement>(null);
    const [machine_detail, setMachineDetail] = React.useState<any>({});
    // ตัวแปรสำหรับใช้งานตัว loading 
    const [loading, setLoading] = useState(true);
    let cancelTokenSource = axios.CancelToken.source();
    const pathurl = process.env.NEXT_PUBLIC_APP_URL;
    const token = Cookies.get('user');
    //ดึงข้อมูลจาก API 
    const fetchDetailMachineData = async () => {
        try {
            setLoading(true);
            const config = {
                method: 'get',
                maxBodyLength: Infinity,
                url: `${pathurl}/api/show-data/detail-machine-data?product_name=${String(product_name)}&pd_dept=${Number(pd_dept)}`,
                headers: { 'Content-Type': 'application/json', 'Cookie': `user=${token}` },
                cancelToken: cancelTokenSource.token,
                withCredentials: true
            };
            const response = await axios.request(config);
            setMachineDetail(response.data);
            setLoading(false);
        } catch (error) {
            if (axios.isCancel(error)) {
                console.log('Request canceled', error.message);
            } else {
                // Handle other errors
                console.error(error);
            }
        }
        finally {
            setLoading(false); // Set loading state to false when request is completed
        }
    }
    const handleHover = (event: React.MouseEvent<HTMLElement>) => {
        const delay = 1000;
        setLoading(true);
        setAnchor(anchor ? null : event.currentTarget);
        // Schedule the execution of the statements inside setTimeout after the delay
        setTimeout(() => {
            fetchDetailMachineData();
        }, delay);
    };
    const onMouseLeave = () => {
        // Cancel the Axios request if it's still ongoing
        cancelTokenSource.cancel();
        setAnchor(null);
        setMachineDetail({});
    };
    const open = Boolean(anchor);
    const id = open ? 'simple-popper' : undefined;
    return (
        <div className="container hover-action" onMouseEnter={handleHover} onMouseLeave={onMouseLeave} style={{ width: '100%', height: '100%', backgroundColor: ColorCode }}>
            {product_name}
            <BasePopup id={id} open={open} anchor={anchor} placement={placement}>
                {(!loading) ? (
                    machine_detail && Array.isArray(machine_detail) && machine_detail.length > 0 ? (
                        <PopupBody>
                            <div className='d-flex justify-content-center flex-column'>
                                <h4 className='d-flex justify-content-center h-25 mb-0' style={{ color: 'white' }} >Machine Details</h4>
                                <hr style={{ borderTop: '2px solid white', background: 'white' }} />
                            </div>
                            {machine_detail.map((item: any) => (
                                <div className="box-hover mt-2">
                                    <div className=" ms-2 d-flex">
                                        <div className='circle-note-hover mt-1' style={{ backgroundColor: item.ColorCode }}></div>
                                        <div className='text-hover'>Machine NO. &nbsp;&nbsp;: <div style={{ color: 'black', display: 'inline', fontSize: '15px' }}>{item.machine_no} </div></div>
                                    </div>
                                    <div className=" ms-2 d-flex">
                                        <div className='space-note-hover mt-1'></div>
                                        <div className='text-hover'>Section Code &nbsp;&nbsp;: <div style={{ color: 'black', display: 'inline', fontSize: '15px' }}>{item.section_code} </div> </div>
                                    </div>
                                    <div className=" ms-2 d-flex">
                                        <div className='space-note-hover mt-1'></div>
                                        <div className='text-hover'>Technician &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; : <div className='text-ellipsis' style={{ color: 'black', display: 'inline', fontSize: '15px' }}>{item.technician} </div> </div>
                                    </div>
                                    <div className=" ms-2 d-flex ">
                                        <div className='space-note-hover mt-1'></div>
                                        <div className="d-flex justify-content-between">
                                            <div className='text-hover'>M/C : <div style={{ color: 'black', display: 'inline', fontSize: '13px' }}>{item.cg_sub_name} </div> </div>
                                            <div className='text-hover'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Time  : <div style={{ color: 'black', display: 'inline', fontSize: '13px' }}>{item.time_difference} </div></div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </PopupBody>
                    ) : (
                        <PopupBody>
                            <div className="popup-triangle-hover"></div>
                            <div className='d-flex justify-content-center flex-column'>
                                <h4 className='d-flex justify-content-center h-25 mb-0' style={{ color: 'white' }} >Machine Details</h4>
                                <hr style={{ borderTop: '2px solid white', background: 'white' }} />
                            </div>

                            <div className="box-hover d-flex align-items-center justify-content-center">
                                <div style={{ fontSize: '40px' }}>No Data</div>
                            </div>
                        </PopupBody>
                    )
                ) : (
                    <PopupBody>
                        <div className="popup-triangle-hover"></div>
                        <div className='d-flex justify-content-center flex-column'>
                            <h4 className='d-flex justify-content-center h-25 mb-0' style={{ color: 'white' }} >Machine Details</h4>
                            <hr style={{ borderTop: '2px solid white', background: 'white' }} />
                        </div>

                        <div className="box-hover d-flex align-items-center justify-content-center">
                            <Loading height='50' width='50' color='black' size={30} thickness={4} />
                        </div>
                    </PopupBody>
                )}
            </BasePopup>
        </div>
    )
}