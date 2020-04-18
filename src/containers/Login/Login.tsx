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
import { useStyles } from "./Login.styles";
import { useHistory } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { useUserContext } from "../../contexts";
import { GraphQLError } from "graphql";
import { LOGIN } from "../../graphql/mutations";

export default function Login() {
    const [errors, setErrors] = useState<readonly GraphQLError[]>([]);
    const [form, setForm] = useState({
        email: "",
        password: "",
    });
    const classes = useStyles();
    const history = useHistory();
    const { onLogin } = useUserContext();
    const [login, { loading }] = useMutation(LOGIN, {
        onCompleted({ login }) {
            onLogin({
                ...login.user,
                token: login.token,
            });
            history.push("/");
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

    function handleLogin() {
        setErrors([]);
        login({ variables: { data: form } });
    }

    function redirectToRegister() {
        history.push("/register");
    }

    return (
        <Container className={classes.container}>
            <Content>
                <FlexboxGrid justify="center">
                    <FlexboxGrid.Item componentClass={Col} xs={24}>
                        <Panel header={<h3>Login</h3>} bordered>
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
                                            onClick={handleLogin}
                                        >
                                            Sign in
                                        </Button>
                                        <Button
                                            appearance="link"
                                            onClick={redirectToRegister}
                                        >
                                            Register
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
