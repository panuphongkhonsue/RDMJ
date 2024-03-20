/*
* c_select.tsx
* component select
* @input getval, width,size_select, options, text, pad, font_size
* @output show options in select
* @author Panuphong Khonsue
* @Create Date 2566-11-09
*/

import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import InputBase from '@mui/material/InputBase';
import { styled } from '@mui/material/styles';
import { Theme } from '@mui/material/styles';
// พิมพ์เขียวสำหรับรับค่าคุณสมบัติของตัว Select
type Props = {
  get_val: (value: string) => void // ฟังก์ชันสำหรับเก็บค่า value เพื่อส่งไปยังหน้าที่ต้องการใช้ ซึ่งต้องสร้างฟังก์ชันส่งเข้ามาใน parameter ของ component ด้วย
  width: any // ตัวแปรสำหรับปรับขนาดความกว้างของ Select
  size_select: any // ตัวแปรปรับขนาดความใหญ่ของ select
  options?: Array<any> //ตัวแปรสำหรับตัวเลือกทั้งหมดใน select
  text?: any // ตัว text แสดงผลเมื่อคลิก select
  pad?: any // paddingสำหรับปรับขนาด ของ select
  font_size: any; // ปรับขนาดตัวหนังสือ
  disabled?: boolean;
  placeholder?: string;
  value_set? : boolean;
};

// component สำหรับปรับแต่ง style ของ component select
const BootstrapInput = styled(InputBase)<{ pad: any; font_size: any; theme?: Theme }>(
  ({ pad, font_size, theme }) => ({
    '& .MuiInputBase-input': {
      borderRadius: 4,
      position: 'relative',
      backgroundColor: theme.palette.background.paper,
      border: '1px solid #ced4da',
      fontSize: font_size,
      color: '#666666',
      // padding เรียงจาก top right bottom left ตัวย่าง '10px 26px 10px 12px ปรับขนาดของ select'
      padding: pad,
      transition: theme.transitions.create(['border-color', 'box-shadow']),
      // Use the system font instead of the default Roboto font.
      fontFamily: [
        'IBM Plex Sans Thai, sans-serif',
      ].join(','),
      '&:focus': {
        borderRadius: 4,
        borderColor: '#80bdff',
        boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)',
      },
    },
    '& .MuiSvgIcon-root': {
    },
  }));
{/*เรียกใช้ component Select โดยจะต้องใส่ parameter get_val สำหรับเรียกใช้ฟงัก์ชันที่สร้างเอาไว้ข้างบน 
  width ไว้สำหรับปรับความกว้าง size_select สำหรับเลือกขนาด มี 'small' , 'medium' , large text คือ label บอกว่า select
ตัวนี้คืออะไร option คือ ค่าใน select มีอะไรบ้าง   pad คือค่า padding โดยเรียงจาก top right bottom left และ font_size คือค่าขนาดตัวหนังสือ*/}
export default function Selectcomponent({ get_val, width, size_select, options = [], text, pad, font_size, disabled = false, placeholder,value_set = false }: Props) {
  // ตัวแปรสำหรับเก็บค่า เริ่มต้นของ value
  const [value, set_value] = React.useState('');
   React.useEffect(() => {
    if(!value_set){
      set_value('');
    }
  }, [value_set]);
  const handle_change = (event: { target: { value: string } }) => {
    // ฟังก์์ชันที่ถูกส่งมาจะถูกเรียกใช้พร้อมดึงค่าที่กดเลือกจาก select
    set_value(event.target.value);
    get_val(event.target.value);
  };

  return (
    // size มี 3 ค่า คือ "small" , "medium" , "large"
    <FormControl sx={{ minWidth: width }} size={size_select}>
      <InputLabel id="demo-select-small-label" sx={{ fontSize: font_size, fontFamily: 'IBM Plex Sans Thai, sans-serif' }} >{text}</InputLabel>
      <Select
        labelId="demo-select-small-label"
        id="demo-select-small"
        value={value}
        label={text}
        onChange={handle_change}
        sx={{ '& .MuiSelect-select.MuiSelect-select': { color: disabled ? '#A9A9A9' : '#666666' } }}
        // เรียกใช้component style พร้อมกับค่า padding 
        input={<BootstrapInput pad={pad} font_size={font_size} />}
        disabled={disabled}
        displayEmpty
      >
        {placeholder && ( // ใส่เงื่อนไขในการแสดง placeholder
          <MenuItem value="" disabled>
            {placeholder}
          </MenuItem>
        )}
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value} style={{ color: '#666666', fontFamily: 'IBM Plex Sans Thai, sans-serif' }}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}