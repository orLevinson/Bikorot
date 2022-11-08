import React, {useRef, useState} from "react";
import Card from "../Card/Card";
import CardBody from "../Card/CardBody";
import CardHeader from "../Card/CardHeader";
import CustomInput from "../CustomInput/CustomInput";
import CustomButton from "../CustomButtons/Button";
import { CircularProgress } from "@material-ui/core";
import CustomSnackbarContent from "../Snackbar/CustomSnackbarContent";
import { makeStyles } from "@material-ui/core/styles";
import styles from "assets/jss/nextjs-material-dashboard/views/rtlStyle.js";

import "../../css/dashboard.css";

const Messages = (props) => {
    const useStyles = makeStyles(styles);
    const classes = useStyles();
    const messageRef = useRef();
    const [messageLoading, setMessageLoading] = useState(false);

    
  const closeMessageHandler = async (id) => {
    try {
      const response = await props.sendRequest(
        `${process.env.NEXT_PUBLIC_API_ADDRESS}api/messages/${id}`,
        "DELETE",
        JSON.stringify({}),
        { "Content-Type": "application/json", Authorization: `bearer ${props.token}` }
      );

      if (!!response.message && response.message === "Deleted message.") {
        props.setMessages((prev) => prev.filter((i) => i._id !== id));
        props.openModal("success", "ההודעה נמחקה בהצלחה");
      }
    } catch (err) {
      props.openModal("danger", "קרתה שגיאה במהלך מחיקת ההודעה");
      props.clearError();
    }
  };

  const addMessageHandler = async () => {
    const message = messageRef.current.value;
    if (!message) {
      props.openModal("danger", "אנא הזן הודעה");
      return;
    }

    setMessageLoading(true);

    try {
      const response = await props.sendRequest(
        `${process.env.NEXT_PUBLIC_API_ADDRESS}api/messages/`,
        "POST",
        JSON.stringify({ message: message }),
        { "Content-Type": "application/json", Authorization: `bearer ${props.token}` }
      );
      if (!!response.message && response.message.message === message) {
        props.setMessages((prev) => [
          ...prev,
          { _id: response.message._id, message: message },
        ]);
        props.openModal("success", "ההודעה נוספה בהצלחה");
      }
    } catch (err) {
        props.openModal("danger", "קרתה שגיאה במהלך הוספת ההודעה");
        props.clearError();
    }
    setMessageLoading(false);
    messageRef.current.value = "";
  };

  return (
    <div>
      <Card className={classes.frontGrid}>
        <CardHeader color="info">
          <h4 className={classes.cardTitleWhite}>עריכת הודעות מנהל מערכת</h4>
        </CardHeader>
        <CardBody>
          <div>
            <CustomInput
              labelText="הודעה נוספת"
              inputProps={{
                inputRef: messageRef,
              }}
              id="ContenderPhone"
              formControlProps={{
                fullWidth: true,
              }}
            />
            <CustomButton
              disabled={messageLoading}
              onClick={addMessageHandler}
              color="info"
              fullWidth
            >
              {messageLoading ? (
                <CircularProgress
                  className="hello"
                  sx={{ mx: 4 }}
                  size={"1.5rem"}
                  color="warning"
                />
              ) : (
                "לחצו כאן להוספת הודעה"
              )}
            </CustomButton>
          </div>
          {props.messagesList
            .map((message) => {
              return (
                <CustomSnackbarContent
                  message={message.message}
                  rtlActive
                  key={message.id}
                  onClose={async () => {
                    await closeMessageHandler(message._id);
                  }}
                  close
                />
              );
            })
            .reverse()}
        </CardBody>
      </Card>
    </div>
  );
};

export default Messages;
