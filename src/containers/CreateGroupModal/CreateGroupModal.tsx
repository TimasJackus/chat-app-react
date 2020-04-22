import React, { useCallback, useState } from "react";
import { Button, CheckPicker, Message, Modal } from "rsuite";
import { useMutation } from "@apollo/client";
import { INIT_CONVERSATION } from "../../graphql/mutations";
import { GraphQLError } from "graphql";

interface IProps {
    open: boolean;
    handleClose: () => void;
    refetch: () => void;
    users: any;
}

const CreateGroupModal: React.FC<IProps> = ({
    open,
    handleClose,
    users,
    refetch,
}) => {
    const [errors, setErrors] = useState<readonly GraphQLError[]>([]);
    const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
    const [initConversation, { loading }] = useMutation(INIT_CONVERSATION, {
        onCompleted() {
            refetch();
            handleClose();
        },
        onError({ graphQLErrors }) {
            setErrors(graphQLErrors);
        },
    });

    const handleSubmit = useCallback(async () => {
        await initConversation({ variables: { members: selectedUsers } });
    }, [selectedUsers, initConversation]);

    const handleOnChange = useCallback((value: any) => {
        setSelectedUsers(value);
    }, []);

    const data = users.map((user: any) => ({
        label: user.displayName,
        value: user.id,
    }));

    return (
        <Modal show={open} onHide={handleClose}>
            <Modal.Header>
                <Modal.Title>Create a new group</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {errors.map((error, index) => (
                    <Message
                        key={`error-${index}`}
                        showIcon
                        type="error"
                        description={error.message}
                    />
                ))}
                <CheckPicker
                    placeholder="Add users to group"
                    data={data}
                    onChange={handleOnChange}
                    value={selectedUsers}
                    style={{ marginTop: 10, width: "100%" }}
                />
            </Modal.Body>
            <Modal.Footer>
                <Button
                    onClick={handleSubmit}
                    disabled={loading}
                    appearance="primary"
                >
                    Ok
                </Button>
                <Button
                    onClick={handleClose}
                    disabled={loading}
                    appearance="subtle"
                >
                    Cancel
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default CreateGroupModal;
