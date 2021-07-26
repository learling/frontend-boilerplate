import { RouteComponentProps } from "react-router-dom";
import { Badge, Container, Jumbotron } from "reactstrap";
import { isLoggedIn } from "../helpers/functions";
import LogoutButton from "./LogoutButton";

export interface ImpressumProps {
  history: RouteComponentProps["history"];
}

const Impressum: React.FunctionComponent<ImpressumProps> = (props) => {
  return (
    <Container>
      {isLoggedIn() && <LogoutButton {...props} />}
      <Jumbotron>
        <h2>Impressum</h2>
        <address>{process.env.REACT_APP_ADDRESS}</address>
        <Badge color="dark" pill>
          This site is a sandbox.
        </Badge>
      </Jumbotron>
    </Container>
  );
};

export default Impressum;
