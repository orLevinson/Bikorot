import React, { useContext, useState } from "react";
import Login from "../Login/Login";
import Snackbar from "../../Snackbar/Snackbar";
import Register from "../register/Register";
import { contextData } from "../../../context/context";

const LoginPage = (props) => {
  const [type, setType] = useState("login");
  const Context = useContext(contextData);

  console.log(Context);

  const loginHandler = async (personalNum, password) => {
    try {
      await Context.login(personalNum, password);
    } catch (error) {
      props.openModal("danger", "ההתחברות נכשלה, פרטים שגויים");
      props.setLoggedIn(false);
      props.clearError();
    }
  };
  return (
    <div>
      {type === "login" && <Login login={loginHandler} typeSet={setType} />}
      {type === "register" && (
        <Register login={loginHandler} typeSet={setType} />
      )}
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
