import React from "react";
import { Button, Modal } from "rsuite";

interface IProps {
    open: boolean;
    handleClose: () => void;
    handleConfirm: () => void;
}

const LeaveConfirmModal: React.FC<IProps> = ({
    open,
    handleConfirm,
    handleClose,
}) => {
    return (
        <Modal show={open} onHide={handleClose}>
            <Modal.Header>
                <Modal.Title>Leave conversation</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>Do you really want to leave this conversation?</p>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={handleConfirm} appearance="primary">
                    Yes
                </Button>
                <Button onClick={handleClose} color="red">
                    No
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default React.memo(LeaveConfirmModal);
