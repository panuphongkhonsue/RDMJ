 /*
 * v_modal_case_edit.tsx
 * modal case edit
 * @input case plan value
 * @output modal case plan input
 * @author Kamin,Panuphong,Chasita
 * @Create Date 2567-15-15
 */

import React, { useState } from 'react';
import Button from '@mui/joy/Button';
import Input from '@mui/joy/Input';
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import DialogTitle from '@mui/joy/DialogTitle';
import "/src/css/modal_case.css"
import Image from 'next/image';
import FormControl from '@mui/joy/FormControl';
import Stack from '@mui/joy/Stack';
import Grid from '@mui/joy/Grid';

type Props = {
    getValue: (value: Object) => void
    id_value: any
    date_value: any
    bm_time_value: any
    bm_less_30_value: any
    bm_less_2_value: any
    bm_more_2_value: any
};

export default function BasicModalDialog({ getValue, id_value, date_value, bm_time_value, bm_less_30_value, bm_less_2_value, bm_more_2_value }: Props) {
    const [open, setOpen] = React.useState<boolean>(false);
    const [bm_time, setBmTime] = React.useState('');
    const [bm_less_30, setBmLess30] = React.useState('');
    const [bm_less_2, setBmLess2] = React.useState('');
    const [bm_more_2, setBmMore2] = React.useState('');
    const [is_error_fill, setIsErrorFill] = React.useState(false);
    const [is_error_invalid, setIsErrorInvalid] = React.useState(false);
    // กำหนดข้อมูลที่จะส่งไปในฟังก์ชัน get_value
    const formData = {
        api_id_value: id_value,
        api_date: date_value,
        api_bm_time: bm_time,
        api_bm_less_30: bm_less_30,
        api_bm_less_2: bm_less_2,
        api_bm_more_2: bm_more_2,
    }

    // ฟังก์ชันที่จะทำงานเมื่อปุ่ม Confirm ถูกคลิก
    const handleFormSubmit: React.FormEventHandler<HTMLFormElement> = async (event) => {
        event.preventDefault();
        // ตรวจสอบว่าข้อมูลถูกกรอกให้ครบหรือไม่
        if (!bm_time || !bm_less_30 || !bm_less_2 || !bm_more_2) {
            setIsErrorFill(true);
            return;
        }
        // ตรวจสอบว่าข้อมูลที่กรอกเป็นค่าที่ถูกต้องหรือไม่
        if (parseInt(bm_time) < 0 || parseInt(bm_less_30) < 0 || parseInt(bm_less_2) < 0 || parseInt(bm_more_2) < 0) {
            setIsErrorInvalid(true);
            return;
        }
        // ส่งข้อมูลที่กรอกไปยังฟังก์ชัน get_value
        getValue(formData);
        // ปิด Modal และรีเซ็ตค่าตัวแปรของข้อผิดพลาด
        setOpen(false);
        setIsErrorFill(false);
        setIsErrorInvalid(false);
    }

    // ฟังก์ชันที่จะทำงานเมื่อปุ่ม Cancel ถูกคลิก
    const handleCancel = () => {
        setOpen(false);
        setIsErrorFill(false);
        setIsErrorInvalid(false);
        setBmLess2("");
        setBmLess30("");
        setBmMore2("");
        setBmTime("");
    };
    return (
        <React.Fragment>
            {/* ปุ่มสำหรับเปิด Modal */}
            <Button className='Button' onClick={() => setOpen(true)}>
                <Image src='/edit.svg' width={20} height={20} alt="icon_emp_id" />
            </Button>
            {/* Modal */}
            <Modal open={open} onClose={() => setOpen(false)}>
                <ModalDialog>
                    <DialogTitle>Edit Case Plan</DialogTitle>
                    {/* Form สำหรับกรอกข้อมูล */}
                    <form onSubmit={handleFormSubmit}>
                        <Stack spacing={2}>
                            <Grid container spacing={2}>
                                <Grid>
                                    {/* กล่องกรอกวันที่และต้นทุน BM */}
                                    <FormControl>
                                        <Input type="date" className='InputDate'
                                            disabled={true}
                                            value={date_value}
                                        />
                                    </FormControl>
                                    <FormControl>
                                        <Input className='bm_morethan_twohrs' type="number" id="bm_morethan_twohrs"
                                            placeholder={'BM >= 2Hrs. (' + String(bm_more_2_value) + ')'}
                                            onChange={(e) => setBmMore2(e.target.value)}
                                        />
                                    </FormControl>
                                    <FormControl>
                                        <Input className='bm_less_threemin' type="number" id="bm_less_threemin"
                                            placeholder={'BM <= 30Min (' + String(bm_less_30_value) + ')'}
                                            onChange={(e) => setBmLess30(e.target.value)}
                                        />
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
                                </Grid>
                                <Grid>
                                    {/* กล่องกรอกเวลา BM และต้นทุนเพิ่มเติม */}
                                    <FormControl>
                                        <Input className='TimeBM' type="number" id="TimeBM"
                                            placeholder={'Time BM(Hrs.) (' + String(bm_time_value) + ')'}
                                            onChange={(e) => setBmTime(e.target.value)}
                                        />
                                    </FormControl>
                                    <FormControl>
                                        <Input className='bm_morethan_threemin' type="number" id="bm_morethan_threemin"
                                            placeholder={'BM > 30M~2Hrs (' + String(bm_less_2_value) + ')'}
                                            onChange={(e) => setBmLess2(e.target.value)}
                                        />
                                    </FormControl>
                                    {/* ปุ่มยกเลิก */}
                                    <Button type="cancel" className='Cancel' onClick={handleCancel}>Cancel</Button>
                                    {/* ปุ่มยืนยัน */}
                                    <Button type="confirm" className='Confirm'>Confirm</Button>
                                </Grid>
                            </Grid>
                        </Stack>
                    </form>
                </ModalDialog>
            </Modal>
        </React.Fragment>
    );
}