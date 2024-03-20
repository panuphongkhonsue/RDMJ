/*
* c_search_bpx.tsx
* component search box
* @input  text for searching
* @output sending value to  function in parameter
* @author Panuphong Khonsue
* @Create Date 2566-11-15
*/

import * as React from 'react';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
// ค่าพารามิเตอร์สำหรับแสดงผลใน Searchbox
type Props = {
    // พารามิเตอร์ฟังก์ชันสำหรับนำฟังก์ชันไปใช้ในหน้า View ได้
    get_val: (value: string) => void
    // ข้อมูลสำหรับ AutoComplete
    auto_val: Array<any>
};

// animation loading
function sleep(duration: number): Promise<void> {
    return new Promise<void>((resolve) => {
        setTimeout(() => {
            resolve();
        }, duration);
    });
}

// พารามิเตอร์ get_val เป็นฟังก์ชันสำหรับเมื่อผู้ใช้กรอกข้อมูลจะสามารถนำข้อมูลนั้นไปเก็บใส่ตัวแปนใช้ต่อได้และ auto_val คือข้อมูลสำหรับทำ autocomplete
export default function Searchbox({ get_val, auto_val }: Props) {
    // ตัวแปรแอนิเมชัน
    const [open, setOpen] = React.useState(false);
    // ตัวแปรเก็บข้อมูลในพารามิเตอร์
    const [options, setOptions] = React.useState<readonly Props[]>([]);
    // ตัวแปรแอนิเมชันโหลด
    const loading = open && options.length === 0;
    // ตั้งค่าตัวแอนิเมชันสำหรับโหลด
    React.useEffect(() => {
        let active = true;

        if (!loading) {
            return undefined;
        }

        (async () => {
            await sleep(1e3); // For demo purposes.

            if (active) {
                setOptions([...auto_val]);
            }
        })();

        return () => {
            active = false;
        };
    }, [loading, auto_val]);
    // ตั้งค่าตัวแอนิเมชันเปิด autocomplete
    React.useEffect(() => {
        if (!open) {
            setOptions([]);
        }
    }, [open]);

    // ฟังก์ชันสำหรับคืนค่าสิ่งที่ผุ้ใช้กรอก
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const input_value = event.target.value;
        get_val(input_value)
    };
    return (
        <Stack spacing={2} sx={{ width: 250 }}>
            <Autocomplete
                freeSolo
                id="asynchronous"
                size='small'
                open={open}
                onOpen={() => {
                    setOpen(true);
                }}
                onClose={() => {
                    setOpen(false);
                }}
                // ฟังก์ชันเมื่อเลือกตัวเลือกใน Autocomplete
                onInputChange={(event, newInputValue) => {
                    get_val(newInputValue)
                }}
                isOptionEqualToValue={(option, value) => option === value}
                getOptionLabel={(option:any) => option}
                options={options}
                loading={loading}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label="Search"
                        // เรียกใช้ฟังก์ชันเมื่อผู้ใช้กรอกข้อมูลเพื่อส่งออกค่าสิ่งที่ผู้ใช้กรอก
                        onChange={handleInputChange}
                        InputProps={{
                            ...params.InputProps,
                            endAdornment: (
                                <React.Fragment>
                                    {loading ? <CircularProgress color="inherit" size={20} /> : null}
                                    {params.InputProps.endAdornment}
                                </React.Fragment>
                            ),
                        }}
                    />
                )}
            />
        </Stack>
    )
}