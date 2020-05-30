import React from "react";
import { Icon, Uploader } from "rsuite";
import { FileType } from "rsuite/es/Uploader";
import { useStyles } from "./UploadInput.styles";

interface IProps {
    selectedFile: File | null;
    handleChange: (fileList: FileType[]) => void;
    avatar?: boolean;
    imageUrl?: string;
    fileInfo?: any;
}

const UploadInput: React.FC<IProps> = ({
    selectedFile,
    handleChange,
    avatar,
    imageUrl,
    fileInfo,
}) => {
    const classes = useStyles();
    console.log(selectedFile);
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
                fileListVisible={avatar !== true}
            >
                <div className={classes.textWrapper}>
                    {avatar ? (
                        <button className={classes.img}>
                            {fileInfo ? (
                                <div
                                    className={classes.avatar}
                                    style={{
                                        background: `url('${fileInfo}')`,
                                    }}
                                />
                            ) : imageUrl ? (
                                <div
                                    className={classes.avatar}
                                    style={{
                                        background: `url('${imageUrl}')`,
                                    }}
                                />
                            ) : (
                                <Icon icon="avatar" size="5x" />
                            )}
                        </button>
                    ) : (
                        "Select image to upload"
                    )}
                </div>
            </Uploader>
        </>
    );
};

export default UploadInput;
