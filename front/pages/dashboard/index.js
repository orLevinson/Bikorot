/*eslint-disable*/
import React, { useState, useEffect } from "react";
// @material-ui/core
import { makeStyles } from "@material-ui/core/styles";
// @material-ui/icons
import ThumbUpIcon from "@material-ui/icons/ThumbUp";
import AccessTime from "@material-ui/icons/AccessTime";
import FileCopy from "@material-ui/icons/FileCopy";
// layout for this page
import RTL from "layouts/RTL.js";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardIcon from "components/Card/CardIcon.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";
import SnackbarContent from "../../components/Snackbar/SnackbarContent";
import Snackbar from "components/Snackbar/Snackbar.js";
import CustomTabs from "components/CustomTabs/CustomTabs.js";

import "../../css/dashboard.css";

import styles from "assets/jss/nextjs-material-dashboard/views/rtlStyle.js";
import { useHttpClient } from "../../components/Hooks/http-hook";
import RegisteringSuccessful from "../../components/RegisteringSuccessful/RegisteringSuccessful";
import Book from "@material-ui/icons/Book";
import People from "@material-ui/icons/People";
import RegisteringLife from "../../components/RegisteringLife/RegisteringLife";

function RTLPage(props) {
  const useStyles = makeStyles(styles);
  const classes = useStyles();
  const [numOfContenders, setNumOfContenders] = useState(props.numOfContenders);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
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
  // in case the initial props arent loading
  useEffect(() => {
    if (!!props.fail) {
      openModal("danger", "קרתה שגיאה במהלך טעינת הנתונים");
    }
  }, []);

  console.log(props.Proposition);

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
                {!!props.is_open ? "פתוחה" : "סגורה"}
              </h3>
            </CardHeader>
            <CardFooter stats>
              <div className={classes.stats}>
                נכון לשנת {new Date().getFullYear()}
              </div>
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
              <h3 className={classes.cardTitle}>{numOfContenders}</h3>
            </CardHeader>
            <CardFooter stats>
              <div className={classes.stats}>
                נכון לשנת {new Date().getFullYear()}
              </div>
            </CardFooter>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={4} md={4}>
          <Card>
            <CardHeader color="danger" stats icon>
              <CardIcon color="danger">
                <ThumbUpIcon />
              </CardIcon>
              <p className={classes.cardCategory}>מספר המועמדים שאושרו</p>
              <h3 className={classes.cardTitle}>{props.numOfWinning}</h3>
            </CardHeader>
            <CardFooter stats>
              <div className={classes.stats}>בכלל התחומים והפרסים</div>
            </CardFooter>
          </Card>
        </GridItem>
      </GridContainer>
      <GridContainer alignItems="stretch">
        <GridItem xs={12} sm={12} md={8}>
          <Card frontDesc={true}>
            <CardBody>
              <div className="frontDesc">
                <h1>ברוכים הבאים למערכת פרסי קל"ר</h1>
                <p>
                  כאן תוכלו להזין את נתוני המועמדים אותם תרצו לרשום לטקס פרסי
                  הקל"ר השנתי הקרוב
                </p>
                <p>לפניך קובץ התקנון להורדה:</p>
                <a
                  href={
                    !!props.Takanon
                      ? `${process.env.NEXT_PUBLIC_API_ADDRESS}${props.Takanon}`
                      : "#"
                  }
                >
                  להורדה לחצו כאן ⭳
                </a>
                <br />
                <div style={{ display: "flex", textAlign: "center", gap: 20 }}>
                  <div>
                    <p>קובץ פורמט הצעת מועמד</p>
                    <a
                      href={
                        !!props.Proposition
                          ? `${process.env.NEXT_PUBLIC_API_ADDRESS}${props.Proposition}`
                          : "#"
                      }
                    >
                      להורדה לחצו כאן ⭳
                    </a>
                  </div>
                  <div>
                    <p>קובץ פורמט תקציר מנהלים</p>
                    <a
                      href={
                        !!props.Short
                          ? `${process.env.NEXT_PUBLIC_API_ADDRESS}${props.Short}`
                          : "#"
                      }
                    >
                      להורדה לחצו כאן ⭳
                    </a>
                  </div>
                  <div>
                    <p>קובץ פורמט אישור ב"מ</p>
                    <a
                      href={
                        !!props.Bam
                          ? `${process.env.NEXT_PUBLIC_API_ADDRESS}${props.Bam}`
                          : "#"
                      }
                    >
                      להורדה לחצו כאן ⭳
                    </a>
                  </div>
                </div>
                <br />
              </div>
            </CardBody>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={12} md={4}>
          <Card className={classes.frontGrid}>
            <CardHeader color="info">
              <h4 className={classes.cardTitleWhite}>הודעות מנהל מערכת</h4>
            </CardHeader>
            <CardBody>
              {props.messages
                .map((messageItem) => {
                  return (
                    <SnackbarContent
                      key={messageItem._id}
                      message={messageItem.message}
                      rtlActive
                    />
                  );
                })
                .reverse()}
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <CustomTabs
            title="הרשמת מועמד"
            headerColor="primary"
            rtlActive
            tabs={[
              {
                tabName: "עבודה מצטיינת",
                tabIcon: Book,
                tabContent: (
                  <RegisteringSuccessful
                    setNumOfContenders={setNumOfContenders}
                    openModal={openModal}
                    sendRequest={sendRequest}
                    clearError={clearError}
                    is_open={props.is_open}
                    jobs={props.jobs}
                  />
                ),
              },
              {
                tabName: "מפעל חיים",
                tabIcon: People,
                tabContent: (
                  <RegisteringLife
                    setNumOfContenders={setNumOfContenders}
                    openModal={openModal}
                    sendRequest={sendRequest}
                    clearError={clearError}
                    is_open={props.is_open}
                    jobs={props.jobs}
                  />
                ),
              },
            ]}
          />
        </GridItem>
      </GridContainer>
      <Snackbar
        place="bl"
        color={modalState.color}
        message={modalState.text}
        open={modalState.open}
        closeNotification={() =>
          setModalState({
            color: "",
            text: "",
            open: false,
          })
        }
        close
      />
    </div>
  );
}

RTLPage.layout = RTL;

export async function getStaticProps() {
  let Takanon = null;
  let Proposition = null;
  let Short = null;
  let Bam = null;
  let web_name = 'אתר פרסי קל"ר';
  let is_open = false;
  let messages = [];
  let numOfContenders = 0;
  let numOfWinning = 0;
  let jobs = [];
  let fail = false;

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_ADDRESS}api/misc/frontInfo`
    );

    if (!response.ok) {
      throw new Error("fetching content failed");
    }

    const parsedResponse = await response.json();

    if (!parsedResponse) {
      throw new Error("fetching content failed 2");
    }

    web_name = parsedResponse.mainContent.web_name;
    is_open = parsedResponse.mainContent.is_open;
    Takanon = !!parsedResponse.mainContent.Takanon
      ? parsedResponse.mainContent.Takanon.path
      : null;
    Short = !!parsedResponse.mainContent.Short
      ? parsedResponse.mainContent.Short.path
      : null;
    Bam = !!parsedResponse.mainContent.Bam
      ? parsedResponse.mainContent.Bam.path
      : null;
    Proposition = !!parsedResponse.mainContent.Proposition
      ? parsedResponse.mainContent.Proposition.path
      : null;
    messages = parsedResponse.messages;
    numOfContenders = parsedResponse.numOfContenders;
    numOfWinning = parsedResponse.numOfWinning;
    jobs = parsedResponse.jobs;
  } catch (err) {
    console.log(err);
    fail = true;
  }

  return {
    props: {
      web_name,
      is_open,
      Takanon,
      Proposition,
      Bam,
      Short,
      messages,
      numOfContenders,
      numOfWinning,
      jobs,
      fail,
    },
    revalidate: 5,
  };
}

export default RTLPage;
