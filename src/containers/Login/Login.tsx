import React from "react";
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
    Col
} from "rsuite";
import { useStyles } from "./Login.styles";
import { useHistory } from "react-router-dom";
import { gql, useMutation } from "@apollo/client";
import { useUserContext } from "../../contexts";

const LOGIN = gql`
    mutation login($data: LoginInput!) {
        login(data: $data) {
            user {
                id
            }
            token
        }
    }
`;

export default function Login() {
    const classes = useStyles();
    const history = useHistory();
    const { onLogin } = useUserContext();
    const [login] = useMutation(LOGIN, {
        onCompleted({ login }) {
            onLogin({
                ...login.user,
                token: login.token
            });
        }
    });

    function handleClick() {
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
                                    <FormControl
                                        name="name"
                                        placeholder="Email address"
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <FormControl
                                        name="password"
                                        type="password"
                                        placeholder="Password"
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <ButtonToolbar>
                                        <Button
                                            appearance="primary"
                                            onClick={() => {
                                                login({
                                                    variables: {
                                                        data: {
                                                            email:
                                                                "jackustimas@gmail.com",
                                                            password: "test1234"
                                                        }
                                                    }
                                                });
                                            }}
                                        >
                                            Sign in
                                        </Button>
                                        <Button
                                            appearance="link"
                                            onClick={handleClick}
                                        >
                                            Forgot password?
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
