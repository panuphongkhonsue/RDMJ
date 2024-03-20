 /*
 * v_modal_edit.tsx
 * modal cost plan edit
 * @input cost plan value
 * @output modal cost plan input
 * @author Kamin,Panuphong
 * @Create Date 2567-15-15
 */

import React, { useState } from 'react';
import "/src/css/modal.css";
import Image from 'next/image';
import FormControl from '@mui/joy/FormControl';
import Stack from '@mui/joy/Stack';
import Grid from '@mui/joy/Grid';
import Button from '@mui/joy/Button';
import Input from '@mui/joy/Input';
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import DialogTitle from '@mui/joy/DialogTitle';
import Selectcomponent from '@/pages/components/c_select/c_select';

type Props = {
    getValue: (value: Object) => void
    id_value: any
    date_value: any
    bm_value: any
    pm_value: any
    select_pd_value: any
};

export default function BasicModalDialog({ getValue, id_value, date_value, bm_value, pm_value, select_pd_value }: Props) {
    const [open, setOpen] = React.useState<boolean>(false);
    const [selected_value, setSelectedValue] = React.useState(0);
    const [bm_cost_plan, setBmCostPlan] = React.useState('');
    const [pm_cost_plan, setPmCostPlan] = React.useState('');
    const [is_error_fill, setIsErrorFill] = React.useState(false);
    const [is_error_invalid, setIsErrorInvalid] = React.useState(false);

    // ฟังก์ชันที่รับค่าที่เลือกจาก Selectcomponent
    const getSelectedValue = (new_status: string) => {
        setSelectedValue(parseInt(new_status));
    };

    // ตัวแปรที่เก็บค่าตั้งต้นของ Selectcomponent
    const options = [
        { value: 1, label: 'PD1' },
        { value: 2, label: 'PD2' },
        { value: 3, label: 'PD3' },
        { value: 4, label: 'PD4' },
        { value: 5, label: 'PD5' },
        { value: 6, label: 'PD6' },
        { value: 7, label: 'PD7' },
        { value: 8, label: 'PD8' },
        { value: 9, label: 'QA' },
        { value: 10, label: 'MC' },
        { value: 11, label: 'PC' },
        { value: 12, label: 'PD common' },
    ];

    // ข้อมูลที่จะส่งไปให้ฟังก์ชัน get_value
    const formData = {
        api_id_value: id_value,
        api_date: date_value,
        api_bm: bm_cost_plan,
        api_pm: pm_cost_plan,
    }

    // ฟังก์ชันที่ทำงานเมื่อปุ่ม Confirm ถูกคลิก
    const handleFormSubmit: React.FormEventHandler<HTMLFormElement> = async (event) => {
        event.preventDefault();
        // ตรวจสอบว่าข้อมูลถูกกรอกให้ครบหรือไม่
        if (!bm_cost_plan || !pm_cost_plan) {
            setIsErrorFill(true);
            return;
        }
        // ตรวจสอบว่าข้อมูลที่กรอกเป็นค่าที่ถูกต้องหรือไม่
        if (parseInt(bm_cost_plan) < 0 || parseInt(pm_cost_plan) < 0) {
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

    // ฟังก์ชันที่ทำงานเมื่อปุ่ม Cancel ถูกคลิก
    const handleCancel = () => {
        setOpen(false);
        setIsErrorFill(false);
        setIsErrorInvalid(false);
        setPmCostPlan("");
        setBmCostPlan("");
        setSelectedValue(0)
    };

    return (
        <React.Fragment>
            {/* ปุ่มสำหรับเปิด Modal */}
            <Button className='Button' onClick={() => setOpen(true)}>
                <Image src='/edit.svg' width={20} height={20} alt="icon_emp_id" id='btn-edit' />
            </Button>
            {/* Modal */}
            <Modal open={open} onClose={() => setOpen(false)}>
                <ModalDialog>
                    <DialogTitle>Edit Cost Plan</DialogTitle>
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
                                    <FormControl id='bm_cost_plan'>
                                        <Input className='bm_cost_plan' type="number" id="bm_cost_plan"
                                            placeholder={'BM Cost Plan (' + String(bm_value) + ')'}
                                            onChange={(e) => setBmCostPlan(e.target.value)}
                                        />
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
                                    </FormControl>
                                </Grid>
                                <Grid>
                                    {/* กล่องกรอกแผนกและต้นทุน PM */}
                                    <FormControl>
                                        <Selectcomponent
                                            get_val={getSelectedValue}
                                            width={200}
                                            size_select={"small"}
                                            pad={'5px 0px 8px 15px'}
                                            font_size={16}
                                            placeholder={String(select_pd_value)}
                                            disabled={true}
                                        />
                                    </FormControl>
                                    <FormControl id='pm_cost_plan'>
                                        <Input className='pm_cost_plan' type="number" id="pm_cost_plan"
                                            placeholder={'PM Cost Plan (' + String(pm_value) + ')'}
                                            onChange={(e) => setPmCostPlan(e.target.value)}
                                        />
                                    </FormControl>
                                    {/* ปุ่มสำหรับยกเลิกและยืนยัน */}
                                    <Button type="cancel" className='Cancel' onClick={handleCancel} id='btn_cancel'>Cancel</Button>
                                    <Button type="confirm" className='Confirm' id='btn_confirm'>Confirm</Button>
                                </Grid>
                            </Grid>
                        </Stack>
                    </form>
                </ModalDialog>
            </Modal>
        </React.Fragment>
    );
}