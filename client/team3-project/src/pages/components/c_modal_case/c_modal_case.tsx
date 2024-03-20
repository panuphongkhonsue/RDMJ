 /*
 * v_modal_case.tsx
 * modal case plan
 * @input case plan value
 * @output modal case plan input
 * @author Kamin,Panuphong,Chasita
 * @Create Date 2567-15-15
 */

import React, { useEffect, useState } from 'react';
import Button from '@mui/joy/Button';
import Input from '@mui/joy/Input';
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import DialogTitle from '@mui/joy/DialogTitle';
import Add from '@mui/icons-material/Add';
import "/src/css/modal_case.css"
import FormControl from '@mui/joy/FormControl';
import Stack from '@mui/joy/Stack';
import Grid from '@mui/joy/Grid';

type Props = {
    createValue: (value: Object) => void
    // ฟังก์ชันสำหรับเปลี่ยนค่าเมื่อปิด Modal ่ผ่านปุ่ม Cancle ไม่ให้แสดงตัวหนังสือสีแดง
    setDateExist: (value: any) => void
    // ตัวแปรสำหรับตรวจสอบว่าวันที่เลือกตรงกับวันที่มีอยู่แล้วหรือไม่
    date_check: boolean
};

export default function BasicModalDialog({ createValue, date_check, setDateExist }: Props) {
    const [open, setOpen] = React.useState<boolean>(false);
    const [date, setDate] = React.useState('');
    const [bm_time, setBmTime] = React.useState('');
    const [bm_less_30, setBmLess30] = React.useState('');
    const [bm_less_2, setBmLess2] = React.useState('');
    const [bm_more_2, setBmMore2] = React.useState('');
    const [is_error_fill, setIsErrorFill] = React.useState(false);
    const [is_error_invalid, setIsErrorInvalid] = React.useState(false);
    // ถ้าวันที่เลือกไม่ตรงกับที่มีในฐานข้อมูลจะปิด Modal
    useEffect(() => {
        if (!date_check) {
            setOpen(false);
            setIsErrorFill(false);
            setIsErrorInvalid(false);
            setDateExist('');
        }
    }, [date_check]);
    // กำหนดข้อมูลที่จะส่งไปในฟังก์ชัน create_value
    const form_data = {
        api_date: date,
        api_bm_time: bm_time,
        api_bm_less_30: bm_less_30,
        api_bm_less_2: bm_less_2,
        api_bm_more_2: bm_more_2,
    }

    // ฟังก์ชันที่จะทำงานเมื่อ Form ถูก Submit
    const handleFormSubmit: React.FormEventHandler<HTMLFormElement> = async (event) => {
        event.preventDefault();
        // ตรวจสอบว่าข้อมูลถูกกรอกให้ครบหรือไม่
        if (!date || !bm_time || !bm_less_30 || !bm_less_2 || !bm_more_2) {
            setIsErrorFill(true);
            return;
        }
        // ตรวจสอบว่าข้อมูลที่กรอกเป็นค่าที่ถูกต้องหรือไม่
        if (parseInt(bm_time) < 0 || parseInt(bm_less_30) < 0 || parseInt(bm_less_2) < 0 || parseInt(bm_more_2) < 0) {
            setIsErrorInvalid(true);
            return;
        }

        // ส่งข้อมูลที่กรอกไปยังฟังก์ชัน create_value
        await createValue(form_data);
    }

    // ฟังก์ชันที่จะทำงานเมื่อปุ่ม Cancel ถูกคลิก
    const handleCancel = () => {
        setOpen(false);
        setIsErrorFill(false);
        setIsErrorInvalid(false);
        setDateExist(false);
        setBmLess2("");
        setBmLess30("");
        setDate("");
        setBmMore2("");
        setBmTime("");
    };
    return (
        <React.Fragment>
            {/* ปุ่มสำหรับเปิด Modal */}
            <Button
                variant="outlined"
                color="neutral"
                startDecorator={<Add />}
                onClick={() => setOpen(true)}
            >
                Input Case Plan
            </Button>

            {/* Modal */}
            <Modal open={open} onClose={() => setOpen(false)}>
                <ModalDialog>
                    <DialogTitle>Input Case Plan</DialogTitle>
                    {/* Form สำหรับกรอกข้อมูล */}
                    <form onSubmit={handleFormSubmit}>
                        <Stack spacing={2}>
                            <Grid container spacing={2}>
                                <Grid>
                                    {/* กล่องกรอกวันที่และต้นทุน BM */}
                                    <FormControl id='date'>
                                        <Input type="date" className='InputDate' id='date'
                                            slotProps={{
                                                input: {
                                                    min: '2018-06-07T00:00', max: '2018-06-14T00:00',
                                                },
                                            }}
                                            onChange={(e) => setDate(e.target.value)}
                                        />
                                    </FormControl>
                                    <FormControl id="bm_morethan_twohrs">
                                        <Input className='bm_morethan_twohrs' placeholder="BM >= 2Hrs." type="number" id="bm_morethan_twohrs" onChange={(e) => setBmMore2(e.target.value)} />
                                    </FormControl>
                                    <FormControl id="bm_less_threemin">
                                        <Input className='bm_less_threemin' placeholder="BM <= 30Min" type="number" id="bm_less_threemin" onChange={(e) => setBmLess30(e.target.value)} />
                                    </FormControl>
                                    {/* แสดงข้อผิดพลาดเมื่อไม่ได้กรอกข้อมูลหรือกรอกข้อมูลไม่ครบ */}
                                    {is_error_fill && (
                                        <div className='Error'>
                                            Please input in all fields !
                                        </div>
                                    )}
                                    {/* แสดงข้อผิดพลาดเมื่อข้อมูลที่กรอกไม่ถูกต้อง */}
                                    {is_error_invalid && (
                                        <div className='Error'>
                                            Please input the information correctly !
                                        </div>
                                    )}
                                    {/* แสดงข้อผิดพลาดเมื่อวันที่ที่กรอกซ้ำกับข้อมูลที่มีอยู่แล้ว */}
                                    {date_check && (
                                        <div className='Error'>
                                            The date already exists !
                                        </div>
                                    )}
                                </Grid>
                                <Grid>
                                    {/* กล่องกรอกเวลา BM และต้นทุนเพิ่มเติม */}
                                    <FormControl id="timebm">
                                        <Input className='TimeBM' placeholder="Time BM(Hrs.)" type="number" id="TimeBM" onChange={(e) => setBmTime(e.target.value)} />
                                    </FormControl>
                                    <FormControl id="bm_morethan_threemin">
                                        <Input className='bm_morethan_threemin' placeholder="BM > 30Min ~ < 2Hrs." type="number" id="bm_morethan_threemin" onChange={(e) => setBmLess2(e.target.value)} />
                                    </FormControl>
                                    {/* ปุ่มยกเลิก */}
                                    <Button type="cancel" className='Cancel' onClick={handleCancel} id='cancel'>Cancel</Button>
                                    {/* ปุ่มยืนยัน */}
                                    <Button type="confirm" className='Confirm' id='confirm'>Confirm</Button>
                                </Grid>
                            </Grid>
                        </Stack>
                    </form>
                </ModalDialog>
            </Modal>
        </React.Fragment>
    );
}