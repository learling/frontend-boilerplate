import { RouteComponentProps } from "react-router-dom";
import { Button } from "reactstrap";
import { destroySession } from "../helpers/functions";

export interface LogoutButtonProps {
  history: RouteComponentProps["history"];
}

const LogoutButton: React.FunctionComponent<LogoutButtonProps> = (props) => {
  const handleLogout = () => {
    destroySession();
    props.history.push("/login");
  };
  return (
    <header className="p-2 text-right">
      <Button onClick={handleLogout} color="dark" size="sm">
        Logout
      </Button>
    </header>
  );
};

export default LogoutButton;
