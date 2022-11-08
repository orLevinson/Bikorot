/*eslint-disable*/
import React, { useEffect, useState } from "react";
// @material-ui/core
import { makeStyles } from "@material-ui/core/styles";
// @material-ui/icons
import ThumbUpIcon from "@material-ui/icons/ThumbUp";
import AccessTime from "@material-ui/icons/AccessTime";
import FileCopy from "@material-ui/icons/FileCopy";
import Book from "@material-ui/icons/Book";
import People from "@material-ui/icons/People";
// layout for this page
import RTL from "layouts/RTL.js";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardIcon from "components/Card/CardIcon.js";
import CardFooter from "components/Card/CardFooter.js";
import Table from "components/Table/Table.js";
import Snackbar from "components/Snackbar/Snackbar.js";

import styles from "assets/jss/nextjs-material-dashboard/views/rtlStyle.js";

import "../../css/dashboard.css";
import CustomTabs from "../../components/CustomTabs/CustomTabs";

function ContendersPage(props) {
  const useStyles = makeStyles(styles);
  const classes = useStyles();
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
              <h3 className={classes.cardTitle}>{props.numOfContenders}</h3>
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
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <CustomTabs
            title="טבלת מועמדים"
            headerColor="primary"
            info="ההחלטה הסופית תעשה רק בתאריך מוגדר מראש. אי אישור ההחלטה אינה
                מצביעה על פסילה מוחלטת"
            rtlActive
            tabs={[
              {
                tabName: "עבודה מצטיינת",
                tabIcon: Book,
                tabContent: (
                  <Table
                    tableHeaderColor="primary"
                    tableHead={["שם", "מועמד לקטגוריה", "יחידה", "אושר"]}
                    tableData={props.contendersJobArr
                      .map((i) => [
                        i.name,
                        !!i.jobType ? i.jobType.title : "שגיאה",
                        i.unit,
                        i.isWinning ? "זוכה" : "לא זוכה",
                      ])
                      .reverse()}
                  />
                ),
              },
              {
                tabName: "מפעל חיים",
                tabIcon: People,
                tabContent: (
                  <Table
                    tableHeaderColor="primary"
                    tableHead={["שם", "תפקיד", "יחידה", "אושר"]}
                    tableData={props.contendersLifeArr
                      .map((i) => [
                        i.name,
                        i.job,
                        i.unit,
                        i.isWinning ? "זוכה" : "לא זוכה",
                      ])
                      .reverse()}
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

ContendersPage.layout = RTL;

export async function getStaticProps() {
  let is_open = false;
  let numOfContenders = 0;
  let numOfWinning = 0;
  let contendersJobArr = [];
  let contendersLifeArr = [];
  let fail = false;

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_ADDRESS}api/misc/contendersInfo`
    );

    if (!response.ok) {
      throw new Error("fetching content failed");
    }

    const parsedResponse = await response.json();

    console.log(parsedResponse);

    if (!parsedResponse) {
      throw new Error("fetching content failed");
    }

    is_open = parsedResponse.mainContent.is_open;
    contendersJobArr = !!parsedResponse.contenders
      ? parsedResponse.contenders.job
      : [];
    contendersLifeArr = !!parsedResponse.contenders
      ? parsedResponse.contenders.life
      : [];
    numOfContenders = parsedResponse.numOfContenders;
    numOfWinning = parsedResponse.numOfWinning;
  } catch (err) {
    console.log(err);
    fail = true;
  }

  return {
    props: {
      is_open,
      numOfContenders,
      numOfWinning,
      contendersJobArr,
      contendersLifeArr,
      fail,
    },
    revalidate: 5,
  };
}

export default ContendersPage;
