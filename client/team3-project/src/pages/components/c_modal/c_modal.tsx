 /*
 * v_modal.tsx
 * modal cost plan
 * @input cost plan value
 * @output modal cost plan input
 * @author Kamin,Panuphong
 * @Create Date 2567-15-15
 */

import React, { useEffect, useState } from 'react';
import "/src/css/modal.css"
import Button from '@mui/joy/Button';
import Input from '@mui/joy/Input';
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import DialogTitle from '@mui/joy/DialogTitle';
import Add from '@mui/icons-material/Add';
import Selectcomponent from '@/pages/components/c_select/c_select';
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
    const [selected_value, setSelectedValue] = React.useState(0);
    const [open, setOpen] = React.useState<boolean>(false);
    const [date, setDate] = React.useState('');
    const [bm_cost_plan, setBmCostPlan] = React.useState('');
    const [pm_cost_plan, setPmCostPlan] = React.useState('');
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
    // ฟังก์ชันสำหรับรับค่าที่ถูกเลือกจาก Dropdown
    const getSelectedValue = (new_status: string) => {
        setSelectedValue(parseInt(new_status));
    };

    // กำหนดข้อมูลที่จะส่งไปในฟังก์ชัน create_value
    const form_data = {
        api_date: date,
        api_bm: bm_cost_plan,
        api_pm: pm_cost_plan,
        api_selected: selected_value,
    }

    // ฟังก์ชันที่จะทำงานเมื่อ Form ถูก Submit
    const handleFormSubmit: React.FormEventHandler<HTMLFormElement> = async (event) => {
        event.preventDefault();
        // ตรวจสอบว่าข้อมูลถูกกรอกให้ครบหรือไม่
        if (!date || !bm_cost_plan || !pm_cost_plan || !selected_value) {
            setIsErrorFill(true);
            return;
        }
        // ตรวจสอบว่าข้อมูลที่กรอกเป็นค่าที่ถูกต้องหรือไม่
        if (parseInt(bm_cost_plan) < 0 || parseInt(pm_cost_plan) < 0) {
            setIsErrorInvalid(true);
            return;
        }// ส่งข้อมูลที่กรอกไปยังฟังก์ชัน create_value
        await createValue(form_data);
    }

    // ฟังก์ชันที่จะทำงานเมื่อปุ่ม Cancel ถูกคลิก
    const handleCancel = () => {
        setOpen(false);
        setIsErrorFill(false);
        setIsErrorInvalid(false);
        setDateExist(false);
        setPmCostPlan("");
        setBmCostPlan("");
        setDate("");
        setSelectedValue(0)
    };
    return (
        <React.Fragment>
            <Button
                variant="outlined"
                color="neutral"
                startDecorator={<Add />}
                onClick={() => setOpen(true)}
            >
                Input Cost Plan
            </Button>
            <Modal open={open} onClose={() => setOpen(false)}>
                <ModalDialog>
                    <DialogTitle>Input Cost Plan</DialogTitle>
                    {/* Form สำหรับกรอกข้อมูล */}
                    <form onSubmit={handleFormSubmit}>
                        <Stack spacing={2}>
                            <Grid container spacing={2}>
                                <Grid>
                                    {/* กล่องกรอกวันที่และต้นทุน BM */}
                                    <FormControl id='date'>
                                        <Input type="date" className='InputDate'
                                            slotProps={{
                                                input: {
                                                    min: '2018-06-07T00:00', max: '2018-06-14T00:00',
                                                },
                                            }}
                                            onChange={(e) => setDate(e.target.value)}
                                        />
                                    </FormControl>
                                    <FormControl id="bm_cost_plan">
                                        <Input className='bm_cost_plan' placeholder="BM Cost Plan" type="number" onChange={(e) => setBmCostPlan(e.target.value)} />
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
                                    {/* กล่อง Dropdown และต้นทุน PM */}
                                    <FormControl id='select-here' className='select-here'>
                                        <Selectcomponent get_val={getSelectedValue} width={200} size_select={"small"} text={"PD.Dept"} pad={'5px 0px 8px 15px'} font_size={16} options={options} />
                                    </FormControl>
                                    <FormControl id='pm_cost_plan'>
                                        <Input className='pm_cost_plan' placeholder="PM Cost Plan" type="number"  onChange={(e) => setPmCostPlan(e.target.value)} />
                                    </FormControl>
                                    {/* ปุ่มยกเลิก */}
                                    <Button type="cancel" className='Cancel' onClick={handleCancel} id='cancel-but'>Cancel</Button>
                                    {/* ปุ่มยืนยัน */}
                                    <Button type="confirm" className='Confirm' id='submit-but'>Confirm</Button>
                                </Grid>
                            </Grid>
                        </Stack>
                    </form>
                </ModalDialog>
            </Modal>
        </React.Fragment>
    );
}