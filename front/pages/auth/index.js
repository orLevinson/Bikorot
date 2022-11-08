/*eslint-disable*/
import React, { useEffect, useState } from "react";
// @material-ui/core
import { makeStyles } from "@material-ui/core/styles";
// layout for this page
import RTL from "layouts/RTL.js";
// core components
import styles from "assets/jss/nextjs-material-dashboard/views/rtlStyle.js";
import { useHttpClient } from "../../components/Hooks/http-hook";
import LoginPage from "../../components/page-login/loginPage/LoginPage";

import "../../css/dashboard.css";


function RTLPage(props) {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loggedIn, setLoggedIn] = useState(false);
  const [token,setToken] = useState();
  const [modalState, setModalState] = useState({
    color: "",
    text: "",
    open: false,
  });
  const openModal = (color, text) => {
    setModalState({
      color: color,
      text: text,
      open: true,
    });
    setTimeout(() => {
      setModalState({
        color: "",
        text: "",
        open: false,
      });
    }, 10000);
  };

  // auto signout
  useEffect(() => {
    const token = localStorage.getItem("token");
    const expiryDate = localStorage.getItem("expiresIn");

    if (!token || !expiryDate) {
      return;
    }

    const dateObj = new Date(expiryDate);
    const currentdate = new Date();

    if (currentdate.getTime() > dateObj.getTime()) {
      return;
    }

    setLoggedIn(true);
    setToken(token);
    const timeDifference = dateObj.getTime() - currentdate.getTime();

    setTimeout(() => {
      setLoggedIn(false);
      setToken("");
      localStorage.clear();
    }, timeDifference);
  }, []);

  // login handler
  if (!loggedIn) {
    return (
      <LoginPage
        sendRequest={sendRequest}
        clearError={clearError}
        setLoggedIn={setLoggedIn}
        setToken={setToken}
        openModal={openModal}
        setModalState={setModalState}
        modalState={modalState}
      />
    );
  }

  return <div></div>;
}

RTLPage.layout = RTL;


export default RTLPage;
