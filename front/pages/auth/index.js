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
import { useRouter } from "next/router";

function RTLPage(props) {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const router = useRouter();
  const [loggedIn, setLoggedIn] = useState(false);
  const [token, setToken] = useState();
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

  useEffect(() => {
    if (loggedIn) {
      router.push("/dashboard");
    }
  }, [loggedIn]);

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
