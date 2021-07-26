import axios from "axios";
import { useState, SyntheticEvent } from "react";
import { Link, RouteComponentProps } from "react-router-dom";
import {
  Button,
  Col,
  Form,
  FormGroup,
  Input,
  Label,
  Row,
  Spinner,
} from "reactstrap";
import { validateEmail, validatePassword } from "../helpers/functions";

export interface SignUpProps {
  history: RouteComponentProps["history"];
}

const SignUp: React.FunctionComponent<SignUpProps> = (props) => {
  const apiUrl = process.env.REACT_APP_API_BASE_URL;
  const apiUser = process.env.REACT_APP_API_USERNAME;
  const apiPass = process.env.REACT_APP_API_PASSWORD;
  const apiKeyName = process.env.REACT_APP_API_KEY_NAME as string;
  const apiKeyValue = process.env.REACT_APP_API_KEY_VALUE;
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [agree, setAgree] = useState<boolean>(false);
  const handleRegister = (event: SyntheticEvent) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    const data = JSON.stringify({
      username: username,
      email: email,
      password: password,
    });
    if (!validateEmail(email)) {
      setLoading(false);
      setError("Please enter a valid email address.");
    } else if (!validatePassword(password)) {
      setLoading(false);
      setError(
        "The password should contain at least one digit, one lower case, one upper case and 8 from the mentioned characters."
      );
    } else if (password !== confirmPassword) {
      setLoading(false);
      setError("The passwords do not match.");
    } else if (!agree) {
      setLoading(false);
      setError("Please agree to the Privacy Policy.");
    } else {
      axios({
        method: "post",
        url: apiUrl + "/customers",
        headers: {
          Authorization: "Basic " + window.btoa(apiUser + ":" + apiPass),
          "Content-Type": "application/json",
          [apiKeyName]: apiKeyValue,
        },
        data: data,
      })
        .then((response) => {
          setLoading(false);
          alert("Please check your inbox (and spam)");
          props.history.push("/login");
        })
        .catch((error) => {
          if ([401, 422].includes(error.response.status)) {
            setError("Error: " + error.response.data);
          } else {
            setError("Something went wrong. Please try again later.");
          }
          setLoading(false);
        });
    }
  };
  // TODO: activate
  return (
    <Form className="form-box p-4">
      <h3>Sign up</h3>
      <FormGroup>
        <Input
          type="text"
          placeholder="Username"
          onChange={(event) => {
            setUsername(event.target.value);
          }}
          value={username}
        />
      </FormGroup>
      <FormGroup>
        <Input
          type="email"
          placeholder="Email"
          onChange={(event) => {
            setEmail(event.target.value);
          }}
          value={email}
        />
      </FormGroup>
      <FormGroup>
        <Input
          type="password"
          placeholder="Password"
          onChange={(event) => {
            setPassword(event.target.value);
          }}
          value={password}
        />
      </FormGroup>
      <FormGroup>
        <Input
          type="password"
          placeholder="Confirm password"
          onChange={(event) => {
            setConfirmPassword(event.target.value);
          }}
          value={confirmPassword}
        />
      </FormGroup>
      <FormGroup check>
        <Label check>
          <Input
            type="checkbox"
            onChange={(event) => {
              setAgree(event.target.checked);
            }}
            checked={agree}
          />
          Agree to the
          <Link to="/privacypolicy"> Privacy Policy</Link>
        </Label>
      </FormGroup>
      <Row className="mt-2">
        <Col sm="2">
          {loading ? (
            <Button color="dark" disabled>
              <Spinner size="sm" />
            </Button>
          ) : (
            <Button
              color="dark"
              onClick={(event) => {
                handleRegister(event);
              }}
            >
              Register
            </Button>
          )}
        </Col>
        <Col sm="10">
          <small className="text-danger">{error}</small>
        </Col>
      </Row>
    </Form>
  );
};

export default SignUp;
