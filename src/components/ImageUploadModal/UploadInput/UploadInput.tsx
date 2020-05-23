import React from "react";
import { Uploader } from "rsuite";
import { FileType } from "rsuite/es/Uploader";
import { useStyles } from "./UploadInput.styles";

interface IProps {
    selectedFile: File | null;
    handleChange: (fileList: FileType[]) => void;
}

const UploadInput: React.FC<IProps> = ({ selectedFile, handleChange }) => {
    const classes = useStyles();
    return (
        <>
            <Uploader
                disabled={!!selectedFile}
                autoUpload={false}
                onChange={handleChange}
                multiple={false}
                listType="picture-text"
                accept={"image/*"}
                draggable={true}
            >
                <div className={classes.textWrapper}>
                    Select image to upload
                </div>
            </Uploader>
        </>
    );
};

export default UploadInput;
