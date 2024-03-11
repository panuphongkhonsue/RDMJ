/*
* c_modal_permission.tsx
* component modal permission
* @input -
* @output show modal for confirm change data
* @author Panuphong,Suphattra
* @Create Date 2567-02-16
*/

import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";

interface ConfirmationModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  open,
  onClose,
  onConfirm,
}) => {
  return (
    <Dialog open={open} onClose={onClose} className="modal_alert">
      <DialogTitle className="MuiDialogTitle">Do you want to save all?</DialogTitle>
      <DialogContent className="MuiDialogContent">
        When you press confirm, the system will save all changes.
      </DialogContent>
      <DialogContent className="MuiDialogALert">
        Note!! : If you have previously changed working time, the system will record the new information instead.
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} className="cancel_button_modal" id='cancel-modal'>Cancel</Button>
        <Button onClick={onConfirm} className="confirm_button_modal" id='confirm-modal'>Confirm</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationModal;
