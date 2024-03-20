/*
* c_loading_circle.tsx
* component loading circle
* @input -
* @output show loading circle
* @author Panuphong Khonsue
* @Create Date 2566-12-06
*/
import React from 'react'
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

// พิมพ์เขียวสำหรับรับค่าคุณสมบัติของตัว Select
type Props = {
    // ความสูงของกรอบ
    height:string;
    // ความกว้างของกรอบ
    width:string;
    // สีของวงกลมโหลด
    color:string;
    // ขนาดวงกลมโหลด
    size:number;
    // ความหนาวงกลมโหลด
    thickness:number;
};

export default function Loading({ height,width,color,size,thickness }: Props) {
    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: height, width: width}}>
            <CircularProgress sx={{ color: color}} size={size} thickness={thickness} />
        </Box>
    )
}