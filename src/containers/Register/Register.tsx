import React from "react";
import {
    Container,
    Content,
    FlexboxGrid,
    Panel,
    Form,
    FormGroup,
    FormControl,
    ControlLabel,
    ButtonToolbar,
    Button,
    Col,
    Grid,
    Row
} from "rsuite";

export default function Register() {
    return (
        <Container>
            <Content>
                <Grid fluid>
                    <Row gutter={20}>
                        <Col xs={12} style={{ background: "red" }}>
                            xsHidden xs={12}
                        </Col>
                        <Col xs={12} style={{ background: "red" }}>
                            xs={12} xs={12}
                        </Col>
                    </Row>
                </Grid>
                {/* <Grid justify="center">
                    <Row>
                        <Panel header={<h3>Hi</h3>} bordered>
                            <Form fluid>
                                <FormGroup>
                                    <ControlLabel>
                                        Username or email address
                                    </ControlLabel>
                                    <FormControl name="name" />
                                </FormGroup>
                                <FormGroup>
                                    <ControlLabel>Password</ControlLabel>
                                    <FormControl
                                        name="password"
                                        type="password"
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <ButtonToolbar>
                                        <Button appearance="primary">
                                            Sign in
                                        </Button>
                                        <Button appearance="link">
                                            Forgot password?
                                        </Button>
                                    </ButtonToolbar>
                                </FormGroup>
                            </Form>
                        </Panel>
                    </Row>
                </Grid> */}
            </Content>
        </Container>
    );
}
