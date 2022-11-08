import React, { useState } from "react";
import Card from "../Card/Card";
import CardHeader from "../Card/CardHeader";
import GridContainer from "../Grid/GridContainer";
import GridItem from "../Grid/GridItem";
import CardIcon from "components/Card/CardIcon.js";
import AccessTime from "@material-ui/icons/AccessTime";
import CardFooter from "components/Card/CardFooter.js";
import { Button, CircularProgress } from "@material-ui/core";
import FileCopy from "@material-ui/icons/FileCopy";
import CustomButton from "components/CustomButtons/Button.js";
import HighlightOff from "@material-ui/icons/HighlightOff";
import { makeStyles } from "@material-ui/core/styles";
import styles from "assets/jss/nextjs-material-dashboard/views/rtlStyle.js";
import "../../css/dashboard.css";

const TopAdminCards = (props) => {
  const useStyles = makeStyles(styles);
  const classes = useStyles();
  const [statusLoading, setStatusLoading] = useState(false);
  const [restartLoading, setRestartLoading] = useState(false);
  const [restartSure, setRestartSure] = useState(false);
  const [totalRestartLoading, setTotalRestartLoading] = useState(false);
  const [totalRestartSure, setTotalRestartSure] = useState(false);

  const statusChangeHandler = async () => {
    setStatusLoading(true);
    try {
      const response = await props.sendRequest(
        `${process.env.NEXT_PUBLIC_API_ADDRESS}api/maincontent/status`,
        "PATCH",
        JSON.stringify({}),
        {
          "Content-Type": "application/json",
          Authorization: `bearer ${props.token}`,
        }
      );

      if (!!response.message && !!response.message.is_open !== props.isOpen) {
        props.openModal("success", "מצב ההרשמה שונה בהצלחה");
        props.setIsOpen((prev) => !prev);
      }
    } catch (err) {
      props.openModal("danger", "קרתה שגיאה במהלך שינוי מצב ההרשמה");
      props.clearError();
    }
    setStatusLoading(false);
  };

  const restartHandler = async () => {
    setRestartLoading(true);
    try {
      const response = await props.sendRequest(
        `${process.env.NEXT_PUBLIC_API_ADDRESS}api/contenders/deleteAll`,
        "DELETE",
        JSON.stringify({}),
        {
          "Content-Type": "application/json",
          Authorization: `bearer ${props.token}`,
        }
      );

      if (
        !!response.message &&
        response.message === "removed all contenders successfully"
      ) {
        props.openModal("warning", "כלל המועמדים נמחקו");
        props.setContendersJob([]);
        props.setContendersLife([]);
      }
    } catch (err) {
      props.openModal("danger", "קרתה שגיאה במהלך מחיקת המועמדים");
      props.clearError();
    }
    setRestartLoading(false);
  };

  const totalRestartHandler = async () => {
    setTotalRestartLoading(true);
    try {
      const response = await props.sendRequest(
        `${process.env.NEXT_PUBLIC_API_ADDRESS}api/misc/destroyAll`,
        "DELETE",
        JSON.stringify({}),
        {
          "Content-Type": "application/json",
          Authorization: `bearer ${props.token}`,
        }
      );

      if (
        !!response.message &&
        response.message === "all the data has been resetted"
      ) {
        props.openModal("warning", "כלל הגורמים אופסו");
        props.setContendersLife([]);
        props.setContendersJob([]);
        props.setUnitsList({
         mlai:[],
         irgun:[],
         kitchen:[],
         vehicle:[],
         palsam:[]
        });
        props.setIsOpen(false);
        props.setMessages([]);
      }
    } catch (err) {
      props.openModal("danger", "קרתה שגיאה במהלך איפוס המידע");
      props.clearError();
    }
    setTotalRestartLoading(false);
  };

  return (
    <div>
      <GridContainer>
        <GridItem xs={12} sm={4} md={4}>
          <Card>
            <CardHeader color="warning" stats icon>
              <CardIcon color="warning">
                <AccessTime />
              </CardIcon>
              <p className={classes.cardCategory}>מצב ההרשמה</p>
              <h3 className={classes.cardTitle}>
                {!!props.isOpen ? "פתוחה" : "סגורה"}
              </h3>
            </CardHeader>
            <CardFooter stats>
              <Button
                disabled={statusLoading}
                onClick={statusChangeHandler}
                color="primary"
                fullWidth
              >
                {statusLoading ? (
                  <CircularProgress
                    className="hello"
                    sx={{ mx: 4 }}
                    size={"1.5rem"}
                    color="warning"
                  />
                ) : (
                  "לחצו כאן לשינוי מצב ההרשמה"
                )}
              </Button>
            </CardFooter>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={4} md={4}>
          <Card>
            <CardHeader color="success" stats icon>
              <CardIcon color="success">
                <FileCopy />
              </CardIcon>
              <p className={classes.cardCategory}>מספר מועמדים שהועלו</p>
              <h3 className={classes.cardTitle}>
                {props.contendersLife.length + props.contendersJob.length}
              </h3>
            </CardHeader>
            <CardFooter stats>
              {restartSure ? (
                <GridContainer>
                  <GridItem xs={6} sm={6} md={6}>
                    <CustomButton
                      onClick={() => {
                        setRestartSure(false);
                        restartHandler();
                      }}
                      color="success"
                      fullWidth
                    >
                      המשך לאיפוס
                    </CustomButton>
                  </GridItem>
                  <GridItem xs={6} sm={6} md={6}>
                    <CustomButton
                      onClick={() => {
                        setRestartSure(false);
                      }}
                      color="danger"
                      fullWidth
                    >
                      בטל איפוס
                    </CustomButton>
                  </GridItem>
                </GridContainer>
              ) : (
                <Button
                  disabled={restartLoading}
                  onClick={() => {
                    setRestartSure(true);
                  }}
                  color="primary"
                  fullWidth
                >
                  {restartLoading ? (
                    <CircularProgress
                      className="hello"
                      sx={{ mx: 4 }}
                      size={"1.5rem"}
                      color="warning"
                    />
                  ) : (
                    "לחצו כאן לאיפוס כמות מועמדים"
                  )}
                </Button>
              )}
            </CardFooter>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={4} md={4}>
          <Card>
            <CardHeader color="danger" stats icon>
              <CardIcon color="danger">
                <HighlightOff />
              </CardIcon>
              <p className={classes.cardCategory}>במידה ונגמרה התחרות</p>
              <h3 className={classes.cardTitle}>איפוס כלל הגורמים</h3>
            </CardHeader>
            <CardFooter stats>
              {totalRestartSure ? (
                <GridContainer>
                  <GridItem xs={6} sm={6} md={6}>
                    <CustomButton
                      onClick={() => {
                        setTotalRestartSure(false);
                        totalRestartHandler();
                      }}
                      color="success"
                      fullWidth
                    >
                      המשך לאיפוס
                    </CustomButton>
                  </GridItem>
                  <GridItem xs={6} sm={6} md={6}>
                    <CustomButton
                      onClick={() => {
                        setTotalRestartSure(false);
                      }}
                      color="danger"
                      fullWidth
                    >
                      בטל איפוס
                    </CustomButton>
                  </GridItem>
                </GridContainer>
              ) : (
                <Button
                  disabled={totalRestartLoading}
                  onClick={() => {
                    setTotalRestartSure(true);
                  }}
                  color="primary"
                  fullWidth
                >
                  {totalRestartLoading ? (
                    <CircularProgress
                      className="hello"
                      sx={{ mx: 4 }}
                      size={"1.5rem"}
                      color="warning"
                    />
                  ) : (
                    "לחצו כאן לאיפוס כלל הגורמים"
                  )}
                </Button>
              )}
            </CardFooter>
          </Card>
        </GridItem>
      </GridContainer>
    </div>
  );
};

export default TopAdminCards;
