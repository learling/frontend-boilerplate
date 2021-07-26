import { useEffect, useState } from "react";
import { BrowserRouter, NavLink, Route, Switch } from "react-router-dom";
import { Navbar, NavbarBrand, Nav, Spinner } from "reactstrap";
import { destroySession, getCustomer, getToken } from "../helpers/functions";
import Dashboard from "./Dashboard";
import Defaultpage from "./Defaultpage";
import Home from "./Home";
import Impressum from "./Impressum";
import SignIn from "./SignIn";
import PrivateRoute from "./PrivateRoute";
import PublicRoute from "./PublicRoute";
import PrivacyPolicy from "./PrivacyPolicy";
import SignUp from "./SignUp";
import axios from "axios";
import { Customer } from "../helpers/interfaces";

export interface AppProps {}

const App: React.FunctionComponent<AppProps> = (props) => {
  const apiUrl = process.env.REACT_APP_API_BASE_URL;
  const apiUser = process.env.REACT_APP_API_USERNAME;
  const apiPass = process.env.REACT_APP_API_PASSWORD;
  const apiKeyName = process.env.REACT_APP_API_KEY_NAME as string;
  const apiKeyValue = process.env.REACT_APP_API_KEY_VALUE;
  const [authLoading, setAuthLoading] = useState<boolean>(true);
  const verifyToken = (id: string, token: string) => {
    setAuthLoading(true);
    axios({
      method: "get",
      url: `${apiUrl}/customers/${id}/verify/${token}`,
      headers: {
        Authorization: "Basic " + window.btoa(apiUser + ":" + apiPass),
        [apiKeyName]: apiKeyValue,
      },
    })
      .then((response) => {
        setAuthLoading(false);
      })
      .catch((error) => {
        destroySession();
        setAuthLoading(false);
      });
  };
  useEffect(() => {
    const token = getToken() || "";
    if (token.length < 20) {
      destroySession();
      return;
    }
    getCustomer() &&
      verifyToken((getCustomer() as Customer).id.toString(), token);
    // eslint-disable-next-line
  }, []);
  if (authLoading && getToken()) {
    return (
      <div className="p-3">
        <Spinner />
        <span> Checking authentication...</span>
      </div>
    );
  }
  return (
    <>
      <BrowserRouter>
        <Navbar className="mr-5">
          <NavbarBrand>
            <NavLink className="mr-4" exact to="/">
              reactstrap
            </NavLink>
          </NavbarBrand>
          <Nav className="mx-auto">
            <NavLink className="mr-4" exact to="/">
              <span>Home</span>
            </NavLink>
            <NavLink className="mr-4" to="/register">
              <span id="register">Sign up</span>
            </NavLink>
            <NavLink className="mr-4" to="/login">
              <span id="login">Sign in</span>
            </NavLink>
            <NavLink className="mr-4" to="/dashboard">
              <span id="dashboard">Dashboard</span>
            </NavLink>
            <NavLink className="mr-4" to="/impressum">
              <small>Impressum</small>
            </NavLink>
            <NavLink className="mr-4" to="/privacypolicy">
              <small>Privacy Policy</small>
            </NavLink>
          </Nav>
        </Navbar>
        <Switch>
          <Route exact path="/" component={Home} />
          <PublicRoute path="/login" component={SignIn} />
          <PrivateRoute path="/dashboard" component={Dashboard} />
          <Route path="/register" component={SignUp} />
          <Route path="/impressum" component={Impressum} />
          <Route path="/privacypolicy" component={PrivacyPolicy} />
          <Route path="/*" component={Defaultpage} />
        </Switch>
      </BrowserRouter>
      <footer className="footer p-1 bg-light w-100 text-center mt-5">
        <small>
          Do not enter any sensitive data. Just playing around here.
        </small>
      </footer>
    </>
  );
};

export default App;
