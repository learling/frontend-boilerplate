import { Redirect, Route, RouteProps } from "react-router-dom";
import { isLoggedIn } from "../helpers/functions";

export interface PublicRouteProps extends RouteProps {}

const PublicRoute: React.FunctionComponent<PublicRouteProps> = ({
  component: Component,
  ...rest
}: any) => {
  return (
    <Route
      {...rest}
      render={(props) => {
        return !isLoggedIn() ? (
          <Component {...props} />
        ) : (
          <Redirect to="/dashboard" />
        );
      }}
    />
  );
};

export default PublicRoute;
