/*
* c_note.tsx
* component note
* @input -
* @output show note
* @author Panuphong Khonsue
* @Create Date 2567-01-28
*/

import React from 'react'
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Unstable_Popup as BasePopup } from '@mui/base/Unstable_Popup';
import { styled } from '@mui/system';
import "/src/css/maintenance.css";
// พิมพ์เขียวสำหรับรับค่าคุณสมบัติของตัว 
type Props = {

};
const PopupBody = styled('div')(
    ({ theme }) => `
    width: max-content;
    height:150px;
    padding: 12px 16px;
    margin: 8px;
    border-radius: 10px;
    border: 1px solid #424242;
    background-color: #424242;
    opacity:1;
    font-family: 'IBM Plex Sans Thai', sans-serif !important;
    color:white;
    z-index: 1000;
    position: absolute;
    right:0;
    bottom:0;
    margin-right: 25px;
  `,
);

export default function Note({ }: Props) {
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
        <div className="image-note" onMouseEnter={handleHover} onMouseLeave={onMouseLeave}>
            <Image src='/notification-note.svg' width={30} height={30} alt="note" priority />
            <BasePopup id={id} open={open} anchor={anchor}>
                <PopupBody>
                    <div className="popup-triangle"></div>
                        <div>
                            <h4>
                                Note
                            </h4>
                        </div>
                        <div className="text-popup">
                            <div className="circle-note"></div>
                            Date : Day/Month/Year
                        </div>
                        <div className="text-popup">
                            <div className="circle-note"></div>
                            Unit of time : Hours
                        </div>
                        <div className="text-popup">
                            <div className="circle-note"></div>
                            Unit of money : Baht
                        </div>
                        <div className="text-popup">
                            <div className="circle-note"></div>
                            Unit of occurrance : Time(Hrs.)
                        </div>
                        {/* {item.per_date_to_change} */}
                </PopupBody>
            </BasePopup>
        </div>
    )
}