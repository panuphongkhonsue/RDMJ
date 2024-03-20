/*
* c_manpower.tsx
* component manpower
* @input manpower data
* @output show manpower data
* @author Panuphong,Kamin
* @Create Date 2567-02-19
*/

import React from 'react'
import { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.css'
import "/src/css/manpowers.css"
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import Image from 'next/image';
import Loading from '../c_loading/c_loading_circle';

// พิมพ์เขียวสำหรับรับค่าคุณสมบัติของตัว Select
type Props = {
  // ฟังก์ชันสำหรับ คืนค่าตัว index เพื่อตรวจสอบว่าต้องการดูพนักงานที่มีสถานะใด 0 คือ จำนวนพนักงานทั้งหมดที่เข้างาน 1 คือ คนที่ว่างงาน 2 คือ คนที่กำลังทำงาน
  getIndex: (value: number) => void
  // ตัวแปรจำนวนคนงานทั้งหมด
  manpower_all_count: number
  // ตัวแปรจำนวนคนงานที่ว่างงาน
  manpower_available: number
  // ตัวแปรสำหรับคนงานที่กำลังทำงาน
  manpower_processing: number
  // ตัวแปรสำหรับข้อมูลพนักงาน
  data: any
  // ตัวแปรสำหรับคืนค่าสถานะของการ load
  loading: boolean
  value: number
};
// พิมพ์เขียวสำหรับตกแต่ง component taps
interface TabPanelProps {
  children?: React.ReactNode;
  value: number;
}

// ฟังก์ชันตกแต่ง component taps
function CustomTabPanel(props: TabPanelProps) {
  const { children, value, ...other } = props;

  return (
    <div
      role="tabpanel"
      id={`simple-tabpanel-${value}`}
      aria-labelledby={`simple-tab-${value}`}
      {...other}
    >
      <Box sx={{ p: 3 }}>
        <div>{children}</div>
      </Box>
    </div>
  );
}
function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function Manpowers({ getIndex, manpower_all_count, manpower_available, manpower_processing, data, loading, value }: Props) {
  // ฟังก์ชันเมื่อเปลี่ยนเมนู จะทำการเปลี่ยนแปลงค่าเมนูเพื่อส่งไปยังหน้าที่เรียก component 
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    getIndex(newValue);
  };
  return (
    <div className="container">
      {loading ? (
        <Box sx={{ width: '100%', border: 1, borderColor: '#D1D1D1', borderTopLeftRadius: '10px', borderTopRightRadius: '10px', bgcolor: 'rgba(rgba(209, 209, 209, 1)'}}>
          <Box sx={{ padding: '5px', bgcolor: 'rgba(217, 217, 217, 0.6)', borderTopLeftRadius: '10px', borderTopRightRadius: '10px' }}>
            <div className="row ">
              <div className="col-7 text-texch"><div className="ms-3 tech">Technician</div></div>
              <Tabs value={value} onChange={handleChange} aria-label="basic tabs example" className="custom-tabs col" scrollButtons allowScrollButtonsMobile variant="scrollable">
                <Tab className='rounded-2  tap' label={
                  <div>
                    <img src="https://static.thenounproject.com/png/3316174-200.png" alt="Manpower Icon" style={{ width: '20px', height: '20px', marginRight: '5px' }} />
                    {/* {`Manpower : ${man_powers}`} */}
                    Manpower : {manpower_all_count}
                  </div>
                } {...a11yProps(0)} />
                <Tab className='rounded-2  tap' label={
                  <div>
                    <img src="https://static.vecteezy.com/system/resources/previews/016/424/618/non_2x/human-resources-icon-design-free-vector.jpg" alt="Manpower Icon" style={{ width: '20px', height: '20px', marginRight: '5px' }} />
                    Available : {manpower_available}
                  </div>
                } {...a11yProps(1)} />
                <Tab className='rounded-2  tap' label={
                  <div>
                    <img src="https://cdn-icons-png.flaticon.com/512/9759/9759793.png" alt="Manpower Icon" style={{ width: '20px', height: '20px', marginRight: '5px' }} />
                    Processing : {manpower_processing}
                  </div>
                } {...a11yProps(2)} />
              </Tabs>
            </div>
          </Box>
          <div className="container">
            <CustomTabPanel value={value}>
              <Loading height='10vh' width='120vh' color='black' size={40} thickness={4} />
            </CustomTabPanel>
          </div>
        </Box>
      ) : (
        <Box sx={{ width: '100%', border: 1, borderColor: '#D1D1D1', borderTopLeftRadius: '10px', borderTopRightRadius: '10px', bgcolor: 'rgba(rgba(209, 209, 209, 1)',height: '100%' }}>
          <Box sx={{ padding: '5px', bgcolor: 'rgba(217, 217, 217, 0.6)', borderTopLeftRadius: '10px', borderTopRightRadius: '10px' }}>
            <div className="row">
              <div className="col-7 text-texch"><div className="ms-3 tech">Technician</div></div>
              <Tabs value={value} onChange={handleChange} aria-label="basic tabs example" className="custom-tabs col" scrollButtons allowScrollButtonsMobile variant="scrollable">
                <Tab className='rounded-2  tap' label={
                  <div>
                    <img src="https://static.thenounproject.com/png/3316174-200.png" alt="Manpower Icon" style={{ width: '20px', height: '20px', marginRight: '5px' }} />
                    {/* {`Manpower : ${man_powers}`} */}
                    Manpower : {manpower_all_count}
                  </div>
                } {...a11yProps(0)} />
                <Tab className='rounded-2  tap' label={
                  <div>
                    <img src="https://static.vecteezy.com/system/resources/previews/016/424/618/non_2x/human-resources-icon-design-free-vector.jpg" alt="Manpower Icon" style={{ width: '20px', height: '20px', marginRight: '5px' }} />
                    Available : {manpower_available}
                  </div>
                } {...a11yProps(0)} />
                <Tab className='rounded-2  tap' label={
                  <div>
                    <img src="https://cdn-icons-png.flaticon.com/512/9759/9759793.png" alt="Manpower Icon" style={{ width: '20px', height: '20px', marginRight: '5px' }} />
                    Processing : {manpower_processing}
                  </div>
                } {...a11yProps(0)} />
              </Tabs>
            </div>
          </Box>
          <div className="container">
            <CustomTabPanel value={value}>
              <div className="row ms-1">
                Manpower for maintenance
              </div>
              {data && Array.isArray(data) && data.length > 0 ? (
                <div className="row mt-1 card-all">
                  {data.map((dataItem: any, dataIndex: any) => (
                    <div className="col-md-3 mt-2" key={dataIndex}>
                      <div className="card">
                        <div className="card-body col mt-3">
                          <Image src={`data:${dataItem.pic_type};base64,${dataItem.pic_img}`} className="rounded-circle" alt="employee image" width={50} height={50} />
                        </div>
                        <div className="card-body col mt-1">
                          {`${dataItem.name}`}
                        </div>
                        <div className="card-body col">
                          {`Request : ${dataItem.request - dataItem.achieve_his}`} | {`Achieve : ${dataItem.achieve}`}
                        </div>
                        <div className="card-body col">
                          {`BM : ${dataItem.BM - dataItem.bm_his}`} | {`PM : ${dataItem.PM - dataItem.pm_his}`}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div>
                  <div className='d-flex justify-content-center align-items-center' style={{ fontSize: '30px' }}>No Data Here</div>
                </div>
              )}
            </CustomTabPanel>
          </div>
        </Box>
      )}

    </div>
  )
}