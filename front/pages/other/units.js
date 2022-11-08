/*eslint-disable*/
import React, { useCallback, useEffect, useState } from "react";
// @material-ui/core
import { makeStyles } from "@material-ui/core/styles";
// @material-ui/icons
import AccessTime from "@material-ui/icons/AccessTime";
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
import CustomTable from "components/Table/Table.js";
import Snackbar from "components/Snackbar/Snackbar.js";

import styles from "assets/jss/nextjs-material-dashboard/views/rtlStyle.js";

import "../../css/dashboard.css";

function Units(props) {
  const useStyles = makeStyles(styles);
  const classes = useStyles();
  const [modalState, setModalState] = useState({
    color: "",
    text: "",
    open: false,
  });

  const scores = useCallback(() => {
    const scoresObj = {
      mlai: ["ביקורת ניהול מלאי"],
      irgun: ["ביקורת ע. לארגון"],
      kitchen: ["ביקורת ניהול מטבח"],
      vehicle: ["ביקורת רכב"],
      palsam: ['ביקורת פלס"ם'],
    };
    for (let i = 0; i < 5; i++) {
      if (!!props.mlai && !!props.mlai[i]) {
        scoresObj.mlai.push(props.mlai[i]);
      } else {
        scoresObj.mlai.push("אין");
      }
      if (!!props.irgun && !!props.irgun[i]) {
        scoresObj.irgun.push(props.irgun[i]);
      } else {
        scoresObj.irgun.push("אין");
      }
      if (!!props.palsam && !!props.palsam[i]) {
        scoresObj.palsam.push(props.palsam[i]);
      } else {
        scoresObj.palsam.push("אין");
      }
      if (!!props.kitchen && !!props.kitchen[i]) {
        scoresObj.kitchen.push(props.kitchen[i]);
      } else {
        scoresObj.kitchen.push("אין");
      }
      if (!!props.vehicle && !!props.vehicle[i]) {
        scoresObj.vehicle.push(props.vehicle[i]);
      } else {
        scoresObj.vehicle.push("אין");
      }
    }

    return scoresObj;
  }, [props]);

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

  const scoreObj = scores();

  return (
    <div>
      <GridContainer>
        <GridItem xs={12} sm={4} md={4}>
          <Card>
            <CardHeader color="rose" stats icon>
              <CardIcon color="rose">
                <AccessTime />
              </CardIcon>
              <p className={classes.cardCategory}>לחץ כאן להורדת</p>
              <h3 className={classes.cardTitle}>
                <a
                  href={
                    !!props.mlaiFile
                      ? `${process.env.NEXT_PUBLIC_API_ADDRESS}${props.mlaiFile}`
                      : "#"
                  }
                >
                  ביקורת ניהול מלאי ⭳
                </a>
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
            <CardHeader color="primary" stats icon>
              <CardIcon color="primary">
                <AccessTime />
              </CardIcon>
              <p className={classes.cardCategory}>לחץ כאן להורדת</p>
              <h3 className={classes.cardTitle}>
                <a
                  href={
                    !!props.irgunFile
                      ? `${process.env.NEXT_PUBLIC_API_ADDRESS}${props.irgunFile}`
                      : "#"
                  }
                >
                  ביקורת ע. לארגון ⭳
                </a>
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
                <AccessTime />
              </CardIcon>
              <p className={classes.cardCategory}>לחץ כאן להורדת</p>
              <h3 className={classes.cardTitle}>
                <a
                  href={
                    !!props.palsamFile
                      ? `${process.env.NEXT_PUBLIC_API_ADDRESS}${props.palsamFile}`
                      : "#"
                  }
                >
                  ביקורת פלס"ם ⭳
                </a>
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
            <CardHeader color="info" stats icon>
              <CardIcon color="info">
                <AccessTime />
              </CardIcon>
              <p className={classes.cardCategory}>לחץ כאן להורדת</p>
              <h3 className={classes.cardTitle}>
                <a
                  href={
                    !!props.vehicleFile
                      ? `${process.env.NEXT_PUBLIC_API_ADDRESS}${props.vehicleFile}`
                      : "#"
                  }
                >
                  ביקורת רכב ⭳
                </a>
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
            <CardHeader color="warning" stats icon>
              <CardIcon color="warning">
                <AccessTime />
              </CardIcon>
              <p className={classes.cardCategory}>לחץ כאן להורדת</p>
              <h3 className={classes.cardTitle}>
                <a
                  href={
                    !!props.kitchenFile
                      ? `${process.env.NEXT_PUBLIC_API_ADDRESS}${props.kitchenFile}`
                      : "#"
                  }
                >
                  ביקורת מטבח ⭳
                </a>
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
            <CardHeader color="danger" stats icon>
              <CardIcon color="danger">
                <AccessTime />
              </CardIcon>
              <p className={classes.cardCategory}>לחץ כאן להורדת</p>
              <h3 className={classes.cardTitle}>
                <a
                  href={
                    !!props.luz
                      ? `${process.env.NEXT_PUBLIC_API_ADDRESS}${props.luz}`
                      : "#"
                  }
                >
                  לו"ז ביקורות ⭳
                </a>
              </h3>
            </CardHeader>
            <CardFooter stats>
              <div className={classes.stats}>
                נכון לשנת {new Date().getFullYear()}
              </div>
            </CardFooter>
          </Card>
        </GridItem>
      </GridContainer>
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <Card>
            <CardHeader color="primary">
              <h4 className={classes.cardTitleWhite}>עמוד יחידות מצטיינות</h4>
              <p className={classes.cardCategoryWhite}>
                בעמוד זה יופיעו היחידות בעלות ציוני הביקורות הגבוהים ביותר,
                דוחות של הביקורות השונות ולו"ז ביקורות
              </p>
            </CardHeader>
            <CardBody>
              <CustomTable
                tableHeaderColor="primary"
                tableHead={[
                  "קטגוריה",
                  "זוכה 1",
                  "זוכה 2",
                  "זוכה 3",
                  "זוכה 4",
                  "זוכה 5",
                ]}
                tableData={[
                  scoreObj.mlai,
                  scoreObj.irgun,
                  scoreObj.palsam,
                  scoreObj.vehicle,
                  scoreObj.kitchen,
                ]}
              />
            </CardBody>
          </Card>
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

Units.layout = RTL;

export async function getStaticProps() {
  let mlai = [];
  let irgun = [];
  let vehicle = [];
  let kitchen = [];
  let palsam = [];
  let mlaiFile = null;
  let irgunFile = null;
  let vehicleFile = null;
  let kitchenFile = null;
  let palsamFile = null;
  let luz = null;
  let fail = false;

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_ADDRESS}api/units/`
    );

    if (!response.ok) {
      throw new Error("fetching content failed");
    }

    const parsedResponse = await response.json();

    if (!parsedResponse || !parsedResponse.message) {
      throw new Error("fetching content failed 2");
    }
    const msg = parsedResponse.message;
    mlai = msg.mlai;
    irgun = msg.irgun;
    vehicle = msg.vehicle;
    kitchen = msg.kitchen;
    palsam = msg.palsam;
    mlaiFile = !!msg.mlaiFile ? msg.mlaiFile.path : null;
    irgunFile = !!msg.irgunFile ? msg.irgunFile.path : null;
    vehicleFile = !!msg.vehicleFile ? msg.vehicleFile.path : null;
    kitchenFile = !!msg.kitchenFile ? msg.kitchenFile.path : null;
    palsamFile = !!msg.palsamFile ? msg.palsamFile.path : null;
    luz = !!msg.luz ? msg.luz.path : null;
  } catch (err) {
    console.log(err);
    fail = true;
  }

  return {
    props: {
      mlai,
      irgun,
      vehicle,
      kitchen,
      palsam,
      mlaiFile,
      irgunFile,
      vehicleFile,
      kitchenFile,
      palsamFile,
      luz,
      fail,
    },
    revalidate: 5,
  };
}

export default Units;
