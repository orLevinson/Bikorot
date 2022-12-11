import React, { useContext, useEffect, useState } from "react";
import Login from "../Login/Login";
import Snackbar from "../../Snackbar/Snackbar";
import Register from "../register/Register";
import { contextData } from "../../../context/context";

const LoginPage = (props) => {
  const [type, setType] = useState("login");
  const Context = useContext(contextData);

  const loginHandler = async (personalNum, password) => {
    try {
      await Context.login(personalNum, password);
      props.openModal("success", "התחברת למערכת");
      props.setLoggedIn(true);
    } catch (error) {
      props.openModal("danger", "ההתחברות נכשלה, פרטים שגויים");
      props.setLoggedIn(false);
      props.clearError();
    }
  };

  const registerHandler = async (
    name,
    personalNum,
    password,
    repeatPassword
  ) => {
    let errors = "";
    if (name.split(" ").length < 2) {
      errors += "אנא הזן שם מלא. ";
    }

    if (personalNum.length < 6) {
      errors += "אנא הזן מספר אישי תקין. ";
    }

    if (password.length < 6) {
      errors += "אנא הזן סיסמא עם יותר מ6 תווים. ";
    }

    if (password !== repeatPassword) {
      errors += "2 הסיסמאות שהזנת לא תואמות. ";
    }

    if (errors.length === 0) {
      try {
        await Context.register(name, personalNum, password);
        props.openModal(
          "success",
          "נרשמת בהצלחה, מנהל המערכת יעניק לך הרשאות בקרוב"
        );
        props.setLoggedIn(true);
      } catch (error) {
        props.openModal("danger", "קרתה שגיאה במהלך ההרשמה");
        props.setLoggedIn(false);
        props.clearError();
      }
    } else {
      props.openModal("danger", errors);
    }
  };

  // as long as there is a token in the context api, change
  // the state to logged in so the user cannot access
  // the auth page
  useEffect(() => {
    if (!!Context.userData.token) {
      props.setLoggedIn(true);
    }
  }, [Context]);
  
  return (
    <div>
      {type === "login" && <Login login={loginHandler} typeSet={setType} />}
      {type === "register" && (
        <Register register={registerHandler} typeSet={setType} />
      )}
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
