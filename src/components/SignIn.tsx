import axios from "axios";
import { useState, SyntheticEvent } from "react";
import { Link, RouteComponentProps } from "react-router-dom";
import {
  Button,
  Col,
  Form,
  FormGroup,
  Input,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
  Spinner,
} from "reactstrap";
import { Customer } from "../helpers/interfaces";
import {
  setSession,
  validateEmail,
  validatePassword,
} from "../helpers/functions";

export interface SignInProps {
  history: RouteComponentProps["history"];
}

const SignIn: React.FunctionComponent<SignInProps> = (props) => {
  const apiUrl = process.env.REACT_APP_API_BASE_URL;
  const apiUser = process.env.REACT_APP_API_USERNAME;
  const apiPass = process.env.REACT_APP_API_PASSWORD;
  const apiKeyName = process.env.REACT_APP_API_KEY_NAME as string;
  const apiKeyValue = process.env.REACT_APP_API_KEY_VALUE;
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [modal, setModal] = useState(false);
  const toggle = () => setModal(!modal);
  const sendResetLink = () => {
    if (validateEmail(email)) {
      setLoading(true);
      axios({
        method: "get",
        url: apiUrl + "/customers/email/" + email,
        headers: {
          Authorization: "Basic " + window.btoa(apiUser + ":" + apiPass),
          [apiKeyName]: apiKeyValue,
        },
      })
        .then((response) => {
          toggle();
          let id: number | undefined;
          if (typeof response.data.content[0] !== undefined) {
            id = response.data.content[0].id;
          }
          if (id && id > 0) {
            axios({
              method: "patch",
              url: apiUrl + "/customers/" + id + "/?reset=1",
              headers: {
                Authorization: "Basic " + window.btoa(apiUser + ":" + apiPass),
                "Content-Type": "application/json",
                [apiKeyName]: apiKeyValue,
              },
              data: {
                email: email,
              },
            })
              .then((response) => {
                setLoading(false);
                setError("");
                alert("Please check your inbox (and spam)");
              })
              .catch((error) => {
                if ([401, 422].includes(error.response.status)) {
                  setError("Error: " + error.response.data);
                } else {
                  setError("Error: Please try again later.");
                }
                setLoading(false);
              });
          } else {
            setError("Error: Something is incorrect. Please try again later.");
          }
          setLoading(false);
        })
        .catch((error) => {
          toggle();
          if ([401, 422].includes(error.response.status)) {
            setError("Error: " + error.response.data);
          } else {
            setError("Error: Email seems to be incorrect.");
          }
          setLoading(false);
        });
    } else {
      setError("Error: Email format invalid.");
    }
  };
  const handleLogin = (event: SyntheticEvent) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    if (!validatePassword(password)) {
      setLoading(false);
      setError("Incorrect credentials.");
    } else {
      axios({
        method: "post",
        url: apiUrl + "/customers/login",
        headers: {
          Authorization: "Basic " + window.btoa(apiUser + ":" + apiPass),
          "Content-Type": "application/json",
          [apiKeyName]: apiKeyValue,
        },
        data: {
          username: username,
          password: password,
        },
      })
        .then((response) => {
          const customer: Customer = response.data;
          setSession(customer);
          setLoading(false);
          props.history.push("/dashboard");
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
  return (
    <Form
      className="form-box p-4"
      onKeyPress={(event) => {
        if (event.key === "Enter") {
          handleLogin(event);
        }
      }}
    >
      <h3>Sign in</h3>
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
          type="password"
          placeholder="Password"
          onChange={(event) => {
            setPassword(event.target.value);
          }}
          value={password}
        />
      </FormGroup>
      <Row>
        <Col sm="2">
          {loading ? (
            <Button color="dark" disabled>
              <Spinner size="sm" />
            </Button>
          ) : (
            <Button
              color="dark"
              onClick={(event) => {
                handleLogin(event);
              }}
            >
              Login
            </Button>
          )}
        </Col>
        <Col sm="10">
          <small className="text-danger">{error}</small>
        </Col>
      </Row>
      <br />
      <p className="mt-2">
        Need an account?<Link to="/register"> Sign up</Link>
      </p>
      <p className="mt-2">
        Forgot your password?
        <Link to="/login" onClick={toggle}>
          {" "}
          Reset password
        </Link>
      </p>
      <Modal isOpen={modal} toggle={toggle} centered={true} size="lg">
        <ModalHeader toggle={toggle}>Forgot passsword</ModalHeader>
        <ModalBody>
          <Input
            type="email"
            placeholder={"Enter your email to receive further instructions"}
            className="mb-3"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
            }}
          />
        </ModalBody>
        <ModalFooter>
          <Button color="dark" onClick={() => sendResetLink()}>
            Send reset link
          </Button>{" "}
          <Button color="dark" onClick={toggle}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </Form>
  );
};

export default SignIn;
