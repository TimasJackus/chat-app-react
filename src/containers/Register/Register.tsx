import React, { useState } from "react";
import {
    Container,
    Content,
    FlexboxGrid,
    Panel,
    Form,
    FormGroup,
    FormControl,
    ButtonToolbar,
    Button,
    Col,
    Message,
} from "rsuite";
import { useStyles } from "./Register.styles";
import { useHistory } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { GraphQLError } from "graphql";
import { REGISTER } from "../../graphql/mutations";

export default function Login() {
    const [errors, setErrors] = useState<readonly GraphQLError[]>([]);
    const [form, setForm] = useState({
        email: "",
        password: "",
        displayName: "",
    });
    const classes = useStyles();
    const history = useHistory();
    const [register, { loading }] = useMutation(REGISTER, {
        onCompleted() {
            history.push("/login");
        },
        onError({ graphQLErrors }) {
            setErrors(graphQLErrors);
        },
    });

    function onChange(key: string) {
        return function (value: string) {
            setForm({ ...form, [key]: value });
        };
    }

    function handleRegister() {
        setErrors([]);
        register({ variables: { data: form } });
    }

    function redirectToLogin() {
        history.push("/login");
    }

    return (
        <Container className={classes.container}>
            <Content>
                <FlexboxGrid justify="center">
                    <FlexboxGrid.Item componentClass={Col} xs={24}>
                        <Panel header={<h3>Register</h3>} bordered>
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
                                    <FormControl
                                        name="name"
                                        placeholder="Display name"
                                        onChange={onChange("displayName")}
                                        value={form.displayName}
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <FormControl
                                        name="email"
                                        placeholder="Email address"
                                        onChange={onChange("email")}
                                        value={form.email}
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
                                            onClick={handleRegister}
                                        >
                                            Register
                                        </Button>
                                        <Button
                                            appearance="link"
                                            onClick={redirectToLogin}
                                        >
                                            Sign in
                                        </Button>
                                    </ButtonToolbar>
                                </FormGroup>
                            </Form>
                        </Panel>
                    </FlexboxGrid.Item>
                </FlexboxGrid>
            </Content>
        </Container>
    );
}
