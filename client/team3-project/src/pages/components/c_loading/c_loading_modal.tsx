/*
* c_loading_modal.tsx
* component loading modal
* @input -
* @output show loading modal
* @author Panuphong Khonsue
* @Create Date 2566-12-06
*/
import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
// พิมพ์เขียวสำหรับรับค่าคุณสมบัติของตัว Select
type Props = {
    // true คือ เปิด modal โหลด false คือปิด
    open: boolean;
};
const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    height: 200,
    bgcolor: 'background.paper',
    border: '1px solid #000', // Set border color here
    borderRadius: '8px',
    boxShadow: 24,
    p: 4,
};
export default function LoadingModal({ open }: Props) {
    const [open_modal, setOpen] = React.useState(open);
    const handleClose = () => setOpen(false);
    return (
        <div>
            <Modal
                open={open_modal}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        Wait for a second.
                    </Typography>
                    <CircularProgress sx={{ color: '#72A0C1', display: 'block', margin: 'auto', mt: 3 }} size={80} thickness={4} />
                </Box>
            </Modal>
        </div>
    );
}