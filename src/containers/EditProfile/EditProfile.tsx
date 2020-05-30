import React, { useCallback, useContext, useState } from "react";
import { useStyles } from "./EditProfile.styles";
import { UserContext } from "../../contexts/UserContext";
import {
    Button,
    ButtonToolbar,
    Form,
    FormControl,
    FormGroup,
    Message,
    Modal,
    Panel,
} from "rsuite";
import { useHistory } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { LOGIN } from "../../graphql/mutations";
import { GraphQLError } from "graphql";
import { EDIT_PROFILE } from "../../graphql/mutations/EDIT_PROFILE";
import { FileType } from "rsuite/es/Uploader";
import UploadInput from "../../components/ImageUploadModal/UploadInput/UploadInput";

function previewFile(file: any, callback: any) {
    const reader = new FileReader();
    reader.onloadend = () => {
        callback(reader.result);
    };
    reader.readAsDataURL(file);
}

const EditProfile: React.FC = () => {
    const classes = useStyles();
    const { user, onLogin } = useContext(UserContext);
    const [errors, setErrors] = useState<readonly GraphQLError[]>([]);
    const [success, setSuccess] = useState(false);
    const [form, setForm] = useState({
        displayName: user?.displayName,
        phoneNumber: user?.phoneNumber || "",
        description: user?.description || "",
        password: "",
    });
    const history = useHistory();
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [fileInfo, setFileInfo] = useState<any>(null);
    // const { onLogin } = useContext(UserContext);
    const [save, { loading }] = useMutation(EDIT_PROFILE, {
        onCompleted({ editProfile }) {
            onLogin({ ...editProfile, token: user?.token });
            setSuccess(true);
            setSelectedFile(null);
            setFileInfo(null);
        },
        onError({ graphQLErrors }) {
            setErrors(graphQLErrors);
        },
    });

    const handleFileSelect = useCallback(
        (fileList: FileType[]) => {
            if (fileList.length === 0) {
                setSelectedFile(null);
                return;
            }
            setSelectedFile(fileList[fileList.length - 1].blobFile || null);
            if (fileList[fileList.length - 1]?.blobFile) {
                previewFile(
                    fileList[fileList.length - 1].blobFile,
                    (value: any) => setFileInfo(value)
                );
            }
        },
        [setSelectedFile, setFileInfo]
    );

    const handleSave = useCallback(async () => {
        setSuccess(false);
        await save({
            variables: {
                data: {
                    displayName: form.displayName,
                    phoneNumber: form.phoneNumber,
                    description: form.phoneNumber,
                    password: form.password.length > 0 ? form.password : null,
                },
                image: selectedFile,
            },
        });
    }, [form, save, setSuccess, selectedFile]);

    function onChange(key: string) {
        return function (value: string) {
            setForm({ ...form, [key]: value });
        };
    }

    return (
        <div className={classes.container}>
            <h5 style={{ marginBottom: 10 }}>Edit Profile</h5>
            <Form fluid>
                <FormGroup>
                    {errors.map((error, index) => (
                        <Message
                            key={`error-${index}`}
                            showIcon
                            type="error"
                            description={error.message}
                        />
                    ))}
                </FormGroup>
                <FormGroup>
                    {success && (
                        <Message
                            showIcon
                            type="success"
                            description={"Profile successfully updated!"}
                        />
                    )}
                </FormGroup>
                <FormGroup>
                    <UploadInput
                        handleChange={handleFileSelect}
                        selectedFile={selectedFile}
                        fileInfo={fileInfo}
                        avatar={true}
                        imageUrl={user?.imageUrl}
                    />
                </FormGroup>
                <FormGroup>
                    <FormControl
                        name="displayName"
                        placeholder="Display Name"
                        onChange={onChange("displayName")}
                        value={form.displayName}
                    />
                </FormGroup>
                <FormGroup>
                    <FormControl
                        name="description"
                        placeholder="Description"
                        onChange={onChange("description")}
                        value={form.description}
                    />
                </FormGroup>
                <FormGroup>
                    <FormControl
                        name="phoneNumber"
                        placeholder="Phone Number"
                        onChange={onChange("phoneNumber")}
                        value={form.phoneNumber}
                    />
                </FormGroup>
                <FormGroup>
                    <FormControl
                        name="password"
                        type="password"
                        placeholder="Password"
                        onChange={onChange("password")}
                        value={form.password}
                    />
                </FormGroup>
                <FormGroup>
                    <ButtonToolbar>
                        <Button
                            appearance="primary"
                            loading={loading}
                            onClick={handleSave}
                        >
                            Save
                        </Button>
                    </ButtonToolbar>
                </FormGroup>
            </Form>
        </div>
    );
};

export default EditProfile;
