import React, { useCallback, useState } from "react";
import { Button, CheckPicker, Input, Message, Modal } from "rsuite";
import { useMutation } from "@apollo/client";
import { INIT_CHANNEL } from "../../graphql/mutations/INIT_CHANNEL";
import { GraphQLError } from "graphql";
import { CONVERT_TO_CHANNEL } from "../../graphql/mutations/CONVERT_TO_CHANNEL";

interface IProps {
    open: boolean;
    handleClose: () => void;
    refetch: () => void;
    conversationId: string | null;
}

const ConvertToChannelModal: React.FC<IProps> = ({
    open,
    handleClose,
    refetch,
    conversationId,
}) => {
    const [errors, setErrors] = useState<readonly GraphQLError[]>([]);
    const [form, setForm] = useState({
        name: "",
    });
    const [convertToChannel, { loading }] = useMutation(CONVERT_TO_CHANNEL, {
        onCompleted() {
            refetch();
            handleClose();
        },
        onError({ graphQLErrors }) {
            setErrors(graphQLErrors);
        },
    });

    const handleSubmit = useCallback(async () => {
        await convertToChannel({
            variables: { conversationId, name: form.name },
        });
    }, [conversationId, form.name, convertToChannel]);

    const handleOnChange = useCallback(
        (key: string) => (value: any) => {
            const nextForm = {
                ...form,
                [key]: value,
            };
            setForm(nextForm);
        },
        [form, setForm]
    );

    return (
        <Modal show={open} onHide={handleClose}>
            <Modal.Header>
                <Modal.Title>Convert To Channel</Modal.Title>
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

export default React.memo(ConvertToChannelModal);
