import axios from "axios";
import { useEffect, useState } from "react";
import { Link, RouteComponentProps } from "react-router-dom";
import {
  Alert,
  Button,
  Container,
  Fade,
  Input,
  Jumbotron,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Spinner,
} from "reactstrap";
import { isLoggedIn, validatePassword } from "../helpers/functions";
import LogoutButton from "./LogoutButton";

export interface DefaultpageProps {
  history: RouteComponentProps["history"];
}

const Defaultpage: React.FunctionComponent<DefaultpageProps> = (props) => {
  const apiUrl = process.env.REACT_APP_API_BASE_URL;
  const apiUser = process.env.REACT_APP_API_USERNAME;
  const apiPass = process.env.REACT_APP_API_PASSWORD;
  const apiKeyName = process.env.REACT_APP_API_KEY_NAME as string;
  const apiKeyValue = process.env.REACT_APP_API_KEY_VALUE;
  const [password, setPassword] = useState<string>("");
  const [activated, setActivated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [modal, setModal] = useState(false);
  const search = window.location.search;
  const path = window.location.pathname;
  const toggle = () => setModal(!modal);
  const checkUrl = () => {
    setLoading(true);
    axios({
      method: "get",
      url: apiUrl + path + search,
      headers: {
        Authorization: "Basic " + window.btoa(apiUser + ":" + apiPass),
        [apiKeyName]: apiKeyValue,
      },
    })
      .then((response) => {
        if (search.endsWith("active=1")) {
          setActivated(true);
        } else if (search.endsWith("reset=1")) {
          toggle();
        }
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
      });
  };
  const resetPassword = () => {
    const paths = path.split("/");
    const id = paths[2];
    if (validatePassword(password) && id.length > 0) {
      axios({
        method: "patch",
        url: apiUrl + "/customers/" + id,
        headers: {
          Authorization: "Basic " + window.btoa(apiUser + ":" + apiPass),
          "Content-Type": "application/json",
          [apiKeyName]: apiKeyValue,
        },
        data: {
          password: password,
        },
      })
        .then((response) => {
          setLoading(false);
          toggle();
          alert("Please check your inbox (and spam)");
          props.history.push("/login");
        })
        .catch((error) => {
          if ([401, 422].includes(error.response.status)) {
            alert("Error: " + error.response.data);
          } else {
            alert("Error: Please try again later.");
          }
          setLoading(false);
        });
    } else {
      alert("Password too weak");
    }
  };
  useEffect(() => {
    checkUrl();
    // eslint-disable-next-line
  }, []);
  if (loading) {
    return (
      <div className="p-3">
        <Spinner />
      </div>
    );
  }
  return (
    <Container>
      {isLoggedIn() && <LogoutButton {...props} />}
      <Jumbotron>
        {activated && <h2>Acount activated</h2>}
        <small className="text-muted">{path + search}</small>
        <hr />
        <Fade>
          <Alert color="light">
            <Link to="/">Home</Link>
          </Alert>
        </Fade>
      </Jumbotron>
      <Modal isOpen={modal} toggle={toggle} centered={true} size="lg">
        <ModalHeader toggle={toggle}>Reset passsword</ModalHeader>
        <ModalBody>
          <Input
            type="password"
            placeholder={"New password"}
            className="mb-3"
            value={password}
            onChange={(event) => {
              setPassword(event.target.value);
            }}
          />
        </ModalBody>
        <ModalFooter>
          <Button color="dark" onClick={() => resetPassword()}>
            Save
          </Button>{" "}
          <Button color="dark" onClick={toggle}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </Container>
  );
};

export default Defaultpage;
