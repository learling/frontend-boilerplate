import axios from "axios";
import { useEffect, useState } from "react";
import { RouteComponentProps } from "react-router-dom";
import { Container, Fade, Jumbotron } from "reactstrap";
import { isLoggedIn, logError } from "../helpers/functions";
import LogoutButton from "./LogoutButton";

export interface HomeProps {
  history: RouteComponentProps["history"];
}

const Home: React.FunctionComponent<HomeProps> = (props) => {
  const [text, setText] = useState<string>("");
  const apiUrl = process.env.REACT_APP_API_BASE_URL;
  const apiUser = process.env.REACT_APP_API_USERNAME;
  const apiPass = process.env.REACT_APP_API_PASSWORD;
  const apiKeyName = process.env.REACT_APP_API_KEY_NAME as string;
  const apiKeyValue = process.env.REACT_APP_API_KEY_VALUE;
  const testApi = () => {
    axios({
      method: "get",
      url: apiUrl,
      headers: {
        Authorization: "Basic " + window.btoa(apiUser + ":" + apiPass),
        [apiKeyName]: apiKeyValue,
      },
    })
      .then((response) => {
        setText(response.data);
      })
      .catch((error) => {
        logError(error);
      });
  };
  useEffect(() => {
    testApi();
    // eslint-disable-next-line
  }, []);
  return (
    <Container>
      {isLoggedIn() && <LogoutButton {...props} />}
      <Jumbotron>
        <h1>Home</h1>
        <pre>no space left on device</pre>
        <Fade>{text}</Fade>
      </Jumbotron>
    </Container>
  );
};

export default Home;
