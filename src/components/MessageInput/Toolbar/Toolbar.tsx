import React, { useCallback, useMemo, useState } from "react";
import { useStyles } from "./Toolbar.styles";
import { Icon, IconButton } from "rsuite";
import ImageUploadModal from "../../ImageUploadModal/ImageUploadModal";
import { FileType } from "rsuite/es/Uploader";

interface IProps {
    handleSubmit?: (message: string | null, image: File | null) => void;
}

const Toolbar: React.FC<IProps> = ({ handleSubmit }) => {
    const [showImageModal, setShowImageModal] = useState(false);
    const classes = useStyles();

    const handleAttachmentClick = useCallback(() => {
        setShowImageModal(true);
    }, [setShowImageModal]);

    const attachmentIcon = useMemo(
        () => <Icon icon="attachment" onClick={handleAttachmentClick} />,
        [handleAttachmentClick]
    );

    const handleModalClose = useCallback(() => {
        setShowImageModal(false);
    }, [setShowImageModal]);

    return (
        <>
            <div className={classes.wrapper}>
                <IconButton icon={attachmentIcon} />
            </div>
            <ImageUploadModal
                open={showImageModal}
                handleSubmit={handleSubmit}
                handleClose={handleModalClose}
            />
        </>
    );
};

export default Toolbar;
