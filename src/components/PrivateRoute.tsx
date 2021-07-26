import { Redirect, Route, RouteProps } from "react-router-dom";
import { isLoggedIn } from "../helpers/functions";

export interface PrivateRouteProps extends RouteProps {}

const PrivateRoute: React.FunctionComponent<PrivateRouteProps> = ({
  component: Component,
  ...rest
}: any) => {
  return (
    <Route
      {...rest}
      render={(props) => {
        return isLoggedIn() ? (
          <Component {...props} />
        ) : (
          <Redirect to="/login" />
        );
      }}
    />
  );
};

export default PrivateRoute;
