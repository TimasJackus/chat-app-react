import React from "react";
import { Button, FormGroup, Message, Modal } from "rsuite";
import { GraphQLError } from "graphql";

interface IProps {
    show: boolean;
    close: () => void;
    errors: readonly GraphQLError[];
}

const ErrorModal: React.FC<IProps> = ({ show, close, errors }) => {
    return (
        <Modal show={show} onHide={close}>
            <Modal.Header>
                <Modal.Title>An error occurred!</Modal.Title>
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
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={close} appearance="primary">
                    Ok
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ErrorModal;
