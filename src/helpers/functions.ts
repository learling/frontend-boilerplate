import { Customer, CustomerToken } from "./interfaces";

export const sessionName: string = "bp";

export const setSession = (customer: Customer) => {
  sessionStorage.setItem(sessionName, JSON.stringify(customer));
  showDasboard();
};

export const getSession = () => {
  return sessionStorage.getItem(sessionName) || null;
};

export const isLoggedIn = () => {
  return getSession() !== null;
};

export const getCustomerToken = () => {
  const session: string | null = getSession() || null;
  if (session) {
    return (JSON.parse(session) as CustomerToken) || null;
  }
  return null;
};

export const getCustomer = () => {
  const customerToken: CustomerToken | null = getCustomerToken() || null;
  if (customerToken) {
    return (customerToken.customer as Customer) || null;
  }
  return null;
};

export const getUsername = () => {
  const customer: Customer | null = getCustomer() || null;
  if (customer) {
    return (customer.username as string) || null;
  }
  return null;
};

export const getToken = () => {
  const customerToken: CustomerToken | null = getCustomerToken() || null;
  if (customerToken) {
    return (customerToken.token as string) || null;
  }
  return null;
};

export const destroySession = () => {
  sessionStorage.removeItem(sessionName);
  hideDasboard();
};

export const validateEmail = (email: string) => {
  const pattern =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return pattern.test(email);
};

/*
The password should contain at least one digit, 
one lower case, one upper case and 
8 from the mentioned characters.
*/
export const validatePassword = (password: string) => {
  const pattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/;
  return pattern.test(password);
};

export const hideDasboard = () => {
  const signUp: HTMLElement | null = document.getElementById("register");
  const signIn: HTMLElement | null = document.getElementById("login");
  const dashbo: HTMLElement | null = document.getElementById("dashboard");
  if (signUp) signUp.innerHTML = "Sign up";
  if (signIn) signIn.innerHTML = "Sign in";
  if (dashbo) dashbo.innerHTML = "";
};

export const showDasboard = () => {
  const signUp: HTMLElement | null = document.getElementById("register");
  const signIn: HTMLElement | null = document.getElementById("login");
  const dashbo: HTMLElement | null = document.getElementById("dashboard");
  if (signUp) signUp.innerHTML = "";
  if (signIn) signIn.innerHTML = "";
  if (dashbo) dashbo.innerHTML = "Dashboard";
};

// TODO: proper handling
export const logError = (error: any) => {
  if (error.response) {
    // Request made and server responded
    console.log(error.response.data);
    console.log(error.response.status);
    console.log(error.response.headers);
  } else if (error.request) {
    // The request was made but no response was received
    console.log(error.request);
  } else {
    // Something happened in setting up the request that triggered an Error
    console.log("Error", error.message);
  }
};

export const formatAMPM = (date: Date) => {
  const fullYear: number = date.getFullYear();
  const month: number = date.getMonth() + 1;
  const day: number = date.getDate();
  let hours: number = date.getHours();
  const minutes: number = date.getMinutes();
  const strMonth = month < 10 ? "0" + month : month;
  const strDay = day < 10 ? "0" + day : day;
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  const strMinutes = minutes < 10 ? "0" + minutes : minutes;
  const strHours = hours < 10 ? "0" + hours : hours;
  const strTime = strHours + "-" + strMinutes + "-00 " + ampm;
  const strDate = fullYear + "-" + strMonth + "-" + strDay;
  return strDate + " " + strTime;
};
