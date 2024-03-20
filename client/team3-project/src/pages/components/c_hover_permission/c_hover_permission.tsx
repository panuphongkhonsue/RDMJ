/*
* c_hover_permission.tsx
* component hover permission
* @input -
* @output show date to change worktime
* @author Panuphong Khonsue
* @Create Date 2567-02-16
*/

import React from 'react'
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Unstable_Popup as BasePopup } from '@mui/base/Unstable_Popup';
import { styled } from '@mui/system';
import "/src/css/maintenance.css";
// พิมพ์เขียวสำหรับรับค่าคุณสมบัติของตัว 
type Props = {
    date_to_change:string
};
const PopupBody = styled('div')(
    ({ theme }) => `
    width: max-content;
    height:100px;
    padding: 12px 16px;
    margin: 8px;
    border-radius: 10px;
    border: 1px solid black;
    background-color: #201F1F;
    opacity:1;
    font-family: 'IBM Plex Sans Thai', sans-serif !important;
    color:white;
    z-index: 1000;
    position: absolute;
    left:0;
    bottom: 0;
    
  `,
);

export default function HoverWorkTime({date_to_change }: Props) {
    // ฟังก์ชันแสดงข้อมูล Hover
    const [anchor, setAnchor] = React.useState<null | HTMLElement>(null);
    const handleHover = (event: React.MouseEvent<HTMLElement>) => {
        // Set the state to show the tooltip
        setAnchor(anchor ? null : event.currentTarget);
    };
    const onMouseLeave = () => setAnchor(null);
    const open = Boolean(anchor);
    const id = open ? 'simple-popper' : undefined;
    return (
        <div className="ms-1 calendar" onMouseEnter={handleHover} onMouseLeave={onMouseLeave}>
            <Image src='/calendar.svg' width={30} height={40} alt="time-icon" />
            <BasePopup id={id} open={open} anchor={anchor}>
                <PopupBody>
                    <h5 className="update">
                        Updating
                    </h5>
                    <div className="text-popup">
                        <div className="circle-note"></div>
                        Data will be changed on
                    </div>
                    <div className="text-popup">
                        <div className="circle-hidden"></div>
                        {date_to_change}
                    </div>
                    {/* {item.per_date_to_change} */}
                </PopupBody>
            </BasePopup>
        </div>
    )
}