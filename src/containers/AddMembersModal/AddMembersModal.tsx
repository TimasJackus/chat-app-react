import React, { useCallback, useState } from "react";
import { Button, CheckPicker, Message, Modal } from "rsuite";
import { useMutation } from "@apollo/client";
import { ADD_MEMBERS } from "../../graphql/mutations/ADD_MEMBERS";
import { GraphQLError } from "graphql";

interface IProps {
    id: string;
    open: boolean;
    handleClose: () => void;
    refetch: () => void;
    users: any;
}

const AddMembersModal: React.FC<IProps> = ({
    open,
    handleClose,
    users,
    refetch,
    id,
}) => {
    const [errors, setErrors] = useState<readonly GraphQLError[]>([]);
    const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
    const [addMembers, { loading }] = useMutation(ADD_MEMBERS, {
        onCompleted() {
            refetch();
            handleClose();
        },
        onError({ graphQLErrors }) {
            setErrors(graphQLErrors);
        },
    });

    const handleSubmit = useCallback(async () => {
        await addMembers({ variables: { members: selectedUsers, id } });
        setSelectedUsers([]);
    }, [selectedUsers, addMembers, id]);

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
                    placeholder="Add users to group / channel"
                    data={data}
                    onChange={handleOnChange}
                    value={selectedUsers}
                    style={{ width: "100%" }}
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

export default React.memo(AddMembersModal);
