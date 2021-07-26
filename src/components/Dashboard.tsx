import { RouteComponentProps } from "react-router-dom";
import {
  Button,
  Col,
  Container,
  Form,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
  Spinner,
  Toast,
  ToastHeader,
} from "reactstrap";
import {
  getCustomer,
  getUsername,
  isLoggedIn,
  validateEmail,
  validatePassword,
} from "../helpers/functions";
import LogoutButton from "./LogoutButton";
import Items from "./Items";
import { useState } from "react";
import { Customer, CustomerToUpdate } from "../helpers/interfaces";
import axios from "axios";

export interface DashboardProps {
  history: RouteComponentProps["history"];
}

const Dashboard: React.FunctionComponent<DashboardProps> = (props) => {
  const apiUrl = process.env.REACT_APP_API_BASE_URL;
  const apiUser = process.env.REACT_APP_API_USERNAME;
  const apiPass = process.env.REACT_APP_API_PASSWORD;
  const apiKeyName = process.env.REACT_APP_API_KEY_NAME as string;
  const apiKeyValue = process.env.REACT_APP_API_KEY_VALUE;
  const [username, setUsername] = useState<string>(getUsername() || "");
  const customer: Customer = getCustomer() as Customer;
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [toUpdate, setToUpdate] = useState<CustomerToUpdate>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [modal, setModal] = useState(false);
  const toggle = () => setModal(!modal);
  const [show, setShow] = useState(false);
  const toast = () => setShow(!show);
  const [feedback, setFeedback] = useState<string>("");
  const updated = customer.updated
    ? customer.updated.replaceAll("T", " ").replaceAll(/:\d\d$/g, "")
    : "";
  const deleteCustomer = () => {
    setLoading(true);
    axios({
      method: "delete",
      url: apiUrl + "/customers/" + customer.id,
      headers: {
        Authorization: "Basic " + window.btoa(apiUser + ":" + apiPass),
        [apiKeyName]: apiKeyValue,
      },
    })
      .then((response) => {
        setLoading(false);
        toggle();
      })
      .catch((error) => {
        if ([401, 422].includes(error.response.status)) {
          setFeedback("Error: " + error.response.data);
        } else {
          setFeedback("Error: Please try again later.");
        }
        toast();
        setShow(true);
        setLoading(false);
      });
  };
  const updateCustomer = () => {
    setLoading(true);
    axios({
      method: "patch",
      url: apiUrl + "/customers/" + customer.id,
      headers: {
        Authorization: "Basic " + window.btoa(apiUser + ":" + apiPass),
        [apiKeyName]: apiKeyValue,
      },
      data: toUpdate,
    })
      .then((response) => {
        validateEmail(email) || setEmail("");
        setPassword("");
        toggle();
        setFeedback(
          "Please click on the Logout-button (top right corner) to sign out."
        );
        setShow(true);
        setLoading(false);
      })
      .catch((error) => {
        if ([401, 422].includes(error.response.status)) {
          setFeedback("Error: " + error.response.data);
        } else {
          setFeedback("Error: Please try again later.");
        }
        toggle();
        setShow(true);
        setLoading(false);
      });
  };
  if (loading) {
    return (
      <div className="p-3">
        <Spinner />
        <span> Updating profile...</span>
      </div>
    );
  }
  return (
    <Container>
      <Toast isOpen={show}>
        <ToastHeader toggle={toast}>{feedback}</ToastHeader>
      </Toast>
      {isLoggedIn() && <LogoutButton {...props} />}
      <h1>
        Welcome {username}{" "}
        <Button size="sm" color="dark" onClick={toggle}>
          Profile
        </Button>
        <Modal isOpen={modal} toggle={toggle} centered={true} size="lg">
          <Form>
            <ModalHeader toggle={toggle}>
              <Row>
                <Col sm="3">
                  <b>ID: {customer.id}</b>
                </Col>
                <Col sm="9">
                  <Input
                    placeholder="Username"
                    value={username}
                    onChange={(event) => {
                      setUsername(event.target.value);
                      let patch = toUpdate;
                      patch.username = event.target.value;
                      setToUpdate(patch);
                    }}
                  />
                </Col>
              </Row>
            </ModalHeader>
            <ModalBody>
              <Label>Email</Label>
              <Input
                type="email"
                placeholder={"Email in current session: " + customer.email}
                className="mb-3"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  if (validateEmail(event.target.value)) {
                    let patch = toUpdate;
                    patch.email = event.target.value;
                    setToUpdate(patch);
                    setShow(false);
                  } else {
                    setFeedback("Email invalid");
                    setShow(true);
                  }
                }}
              />
              <Label>Reset password</Label>
              <Input
                type="password"
                className="mb-3"
                placeholder="Leave blank to keep your current password"
                value={password}
                onChange={(event) => {
                  setPassword(event.target.value);
                  if (validatePassword(event.target.value)) {
                    let patch = toUpdate;
                    patch.password = event.target.value;
                    setToUpdate(patch);
                    setShow(false);
                  } else {
                    setFeedback("Password too weak");
                    setShow(true);
                  }
                }}
              />
              <hr />
              <small className="mt-3 text-muted">
                Last edit: <span>{updated || "Profile not updated yet"}</span>
              </small>
              <hr />
              <Button color="danger" onClick={() => deleteCustomer()}>
                Delete account
              </Button>
            </ModalBody>
            <ModalFooter>
              <Button color="dark" onClick={() => updateCustomer()}>
                Save
              </Button>{" "}
              <Button
                color="dark"
                onClick={() => {
                  setEmail("");
                  setPassword("");
                  setShow(false);
                  toggle();
                }}
              >
                Cancel
              </Button>
            </ModalFooter>
          </Form>
        </Modal>
      </h1>
      <Items />
    </Container>
  );
};

export default Dashboard;
