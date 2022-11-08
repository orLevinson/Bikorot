import React, { useState } from "react";
import Login from "../Login/Login";
import Snackbar from "../../Snackbar/Snackbar";
import Register from "../register/Register";

const LoginPage = (props) => {
  const [type, setType] = useState("login");

  const loginHandler = async (password) => {
    try {
      const response = await props.sendRequest(
        process.env.NEXT_PUBLIC_API_ADDRESS + "api/misc/login",
        "POST",
        JSON.stringify({ password }),
        { "Content-Type": "application/json" }
      );

      if (!!response.message && !!response.message.success) {
        props.setLoggedIn(true);
        props.setToken(response.message.token);
        localStorage.setItem("token", response.message.token);
        localStorage.setItem(
          "expiresIn",
          new Date(Date.now() + 1000 * 60 * 60 * 24 * 7)
        );
      }
    } catch (error) {
      props.openModal("danger", "ההתחברות נכשלה, סיסמא שגויה");
      props.setLoggedIn(false);
      props.clearError();
    }
  };
  return (
    <div>
      {type === "login" && <Login login={loginHandler} typeSet={setType}/>}
      {type === "register" && <Register login={loginHandler} typeSet={setType}/>}
      {/* {type === "login" ?? <Login login={loginHandler} />} */}
      <Snackbar
        place="bl"
        color={props.modalState.color}
        message={props.modalState.text}
        open={props.modalState.open}
        closeNotification={() =>
          props.setModalState({
            color: "",
            text: "",
            open: false,
          })
        }
        close
      />
    </div>
  );
};

export default LoginPage;
