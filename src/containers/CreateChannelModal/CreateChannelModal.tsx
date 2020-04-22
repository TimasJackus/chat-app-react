import React, { useCallback, useState } from "react";
import { Button, CheckPicker, Input, Message, Modal } from "rsuite";
import { useMutation } from "@apollo/client";
import { INIT_CHANNEL } from "../../graphql/mutations/INIT_CHANNEL";
import { GraphQLError } from "graphql";

interface IProps {
    open: boolean;
    handleClose: () => void;
    refetch: () => void;
    users: any;
}

const CreateChannelModal: React.FC<IProps> = ({
    open,
    handleClose,
    users,
    refetch,
}) => {
    const [errors, setErrors] = useState<readonly GraphQLError[]>([]);
    const [form, setForm] = useState({
        name: "",
        members: [],
    });
    const [initConversation, { loading }] = useMutation(INIT_CHANNEL, {
        onCompleted() {
            refetch();
            handleClose();
        },
        onError({ graphQLErrors }) {
            setErrors(graphQLErrors);
        },
    });

    const handleSubmit = useCallback(async () => {
        await initConversation({
            variables: { members: form.members, name: form.name },
        });
    }, [form.members, form.name, initConversation]);

    const handleOnChange = useCallback(
        (key: string) => (value: any) => {
            const nextForm = {
                ...form,
                [key]: value,
            };
            console.log(nextForm);
            setForm(nextForm);
        },
        [form, setForm]
    );

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
                <Input
                    onChange={handleOnChange("name")}
                    value={form?.name}
                    placeholder="Channel name"
                    style={{ marginBottom: 10, marginTop: 10 }}
                />
                <CheckPicker
                    placeholder="Add users to channel"
                    data={data}
                    onChange={handleOnChange("members")}
                    value={form.members}
                    style={{ width: "100%" }}
                />
            </Modal.Body>
            <Modal.Footer>
                <Button
                    onClick={handleSubmit}
                    loading={loading}
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

export default CreateChannelModal;
