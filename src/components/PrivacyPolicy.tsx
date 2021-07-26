import { RouteComponentProps } from "react-router-dom";
import { Alert, Badge, Container, Jumbotron } from "reactstrap";
import { isLoggedIn } from "../helpers/functions";
import LogoutButton from "./LogoutButton";

export interface PrivacyPolicyProps {
  history: RouteComponentProps["history"];
}

const PrivacyPolicy: React.FunctionComponent<PrivacyPolicyProps> = (props) => {
  return (
    <Container>
      {isLoggedIn() && <LogoutButton {...props} />}
      <Jumbotron>
        <h2>No Privacy</h2>
        <address>{process.env.REACT_APP_ADDRESS}</address>
        <Badge color="dark" pill>
          This site is a sandbox.
        </Badge>
        <Alert color="light" className="mt-5">
          <p className="text-danger">
            Please do not test this app with sensitive information. The
            connection to the database is not secure!
          </p>
          <p>
            Explore the open source on{" "}
            <a
              href={process.env.REACT_APP_GITHUB}
              target="blank"
              className="pointer"
            >
              GitHub
            </a>
          </p>
        </Alert>
      </Jumbotron>
    </Container>
  );
};

export default PrivacyPolicy;
