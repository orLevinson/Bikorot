import React, { useContext } from "react";
import { contextData } from "../../context/context";
import RegularButton from "../CustomButtons/Button";

const LogoutButton = () => {
  const Context = useContext(contextData);

  const divStyle = {
    position: "relative",
    zIndex: 20,
    paddingBottom: 20,
    width:"inherit",
    display:"flex",
    justifyContent:"center",
    alignItems:"center"
  }

  return (
    <div style={divStyle}>
      <RegularButton onClick={Context.logout} color={"danger"}>
        התנתק מהמערכת
      </RegularButton>
    </div>
  );
};

export default LogoutButton;
