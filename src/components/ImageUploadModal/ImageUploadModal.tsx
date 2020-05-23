import React, { useCallback, useState } from "react";
import { Button, Modal } from "rsuite";
import UploadInput from "./UploadInput/UploadInput";
import { FileType } from "rsuite/es/Uploader";

interface IProps {
    open: boolean;
    handleClose: () => void;
    handleSubmit?: (message: string | null, image: File | null) => void;
}

const ImageUploadModal: React.FC<IProps> = ({
    open,
    handleClose,
    handleSubmit,
}) => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const handleFileSelect = useCallback(
        (fileList: FileType[]) => {
            if (fileList.length === 0) {
                setSelectedFile(null);
                return;
            }
            setSelectedFile(fileList[0].blobFile || null);
        },
        [setSelectedFile]
    );

    const handleUpload = useCallback(() => {
        if (handleSubmit) {
            handleSubmit(null, selectedFile);
            setSelectedFile(null);
            handleClose();
        }
    }, [handleSubmit, selectedFile, handleClose]);

    return (
        <Modal show={open} onHide={handleClose}>
            <Modal.Header>
                <Modal.Title>Upload image</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <UploadInput
                    handleChange={handleFileSelect}
                    selectedFile={selectedFile}
                />
            </Modal.Body>
            <Modal.Footer>
                <Button
                    disabled={!selectedFile}
                    onClick={handleUpload}
                    appearance="primary"
                >
                    Upload
                </Button>
                <Button onClick={handleClose} appearance="subtle">
                    Cancel
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ImageUploadModal;
