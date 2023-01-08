/*eslint-disable*/
import React, { useState, useEffect, Fragment, useContext } from "react";
import router, { useRouter } from "next/router";
import { contextData } from "../../context/context";
// layout for this page
import RTL from "layouts/RTL.js";
// core components

import { useHttpClient } from "../../components/Hooks/http-hook";
import GridItem from "../../components/Grid/GridItem";
import CardHeader from "../../components/Card/CardHeader";
import GridContainer from "../../components/Grid/GridContainer";
import Card from "../../components/Card/Card";
import { CircularProgress, makeStyles, Table } from "@material-ui/core";
import CardBody from "../../components/Card/CardBody";
import Snackbar from "../../components/Snackbar/Snackbar";
import RegularButton from "../../components/CustomButtons/Button";
import ValuesTable from "../../components/valuesTable/ValuesTable";
import template from "../../questionsObj";

// custom css
import "../../css/dashboard.css";

const styles = {
  cardCategoryWhite: {
    "&,& a,& a:hover,& a:focus": {
      color: "rgba(255,255,255,.62)",
      margin: "0",
      fontSize: "14px",
      marginTop: "0",
      marginBottom: "0",
    },
    "& a,& a:hover,& a:focus": {
      color: "#FFFFFF",
    },
  },
  cardTitleWhite: {
    color: "#FFFFFF",
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none",
    "& small": {
      color: "#777",
      fontSize: "65%",
      fontWeight: "400",
      lineHeight: "1",
    },
  },
};

function RTLPage(props) {
  const route = useRouter();
  const useStyles = makeStyles(styles);
  const Context = useContext(contextData);
  const classes = useStyles();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [modalState, setModalState] = useState({
    color: "",
    text: "",
    open: false,
  });
  const [savedRows, setSavedRows] = useState(props.initialValue);
  const [currentRows, setCurrentRows] = useState(props.initialValue);
  const [loading, setLoading] = useState(false);

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

  // validate that the user is manager/global
  useEffect(() => {
    const isManager =
      Context.userData.perms === "manager" ||
      Context.userData.perms === "global";
    if (!isManager) {
      router.push("/dashboard");
      return;
    }
  }, [Context]);

  const subjects = ["נושא 1", "נושא 2", "נושא 3", "נושא 4", "נושא 5", "נושא 6"];

  const makeRows = (obj) => {
    const rows = [];
    // iterate the object
    let indexSubject = 0;
    let indexCategory = 0;
    for (let [key, value] of Object.entries(obj)) {
      // if the key is of a subject
      if (key.includes("subject")) {
        // push a title
        rows.push({ name: subjects[indexSubject], value: "" });
        // iterate the subject
        for (let [catKey, catValue] of Object.entries(value)) {
          const id = indexCategory;
          const name = !!template[key]
            ? !!template[key][catKey]
              ? !!template[key][catKey].title
                ? template[key][catKey].title
                : "שגיאה"
              : "שגיאה"
            : "שגיאה";
          const input = (
            <input
              type={"number"}
              max={100}
              min={0}
              onChange={(e) => {
                const value =
                  e.target.value > 100
                    ? // if input is bigger than 100
                      100
                    : e.target.value < 0
                    ? // or else if it smaller than 0
                      0
                    : parseInt(e.target.value);
                setCurrentRows((prev) => {
                  let copy = [...prev];
                  copy[id] = value;
                  return [...copy];
                });
              }}
              value={currentRows[indexCategory]}
            />
          );
          rows.push({
            name: (
              <span>
                <b>{id + 1}</b> - {name}
              </span>
            ),
            value: input,
          });
          indexCategory++;
        }
        indexSubject++;
      }
    }
    return rows;
  };

  const updatePercentsHandler = async () => {
    const values = currentRows;
    // check if it sums up to 100
    const sum = values.reduce((a, b) => a + b, 0);
    if (sum !== 100) {
      openModal("danger", "סכום האחוזים הוא לא 100");
      return;
    }

    try {
      setLoading(true);
      const response = await sendRequest(
        `${process.env.NEXT_PUBLIC_API_ADDRESS}api/info/changePercentages`,
        "PATCH",
        JSON.stringify({ values }),
        {
          "Content-Type": "application/json",
          Authorization: Context.userData.token,
        }
      );
      if (!!response.success) {
        setSavedRows(values);
        setLoading(false);
        openModal("success", "הציונים שונו בהצלחה");
      }
    } catch (err) {
      openModal("danger", "קרתה שגיאה במהלך שליחת האחוזים");
      clearError();
      setLoading(false);
    }
  };

  // in case the initial props arent loading
  useEffect(() => {
    if (!!props.fail) {
      openModal("danger", "קרתה שגיאה במהלך טעינת הנתונים");
    }
  }, []);

  return (
    <Fragment>
      <div>
        <GridContainer fullWidth>
          <GridItem xs={12} sm={12} md={12}>
            <Card>
              <CardHeader color={"primary"}>
                <h3 className={classes.cardTitleWhite}>שנה אחוזים</h3>
                <p className={classes.cardCategoryWhite}>
                  שים לב! סה"כ האחוזים חייב להסתכם ב100, במידה והסכום לא יהיה
                  100 תישלח שגיאה
                </p>
              </CardHeader>
              <CardBody>
                <GridContainer fullWidth>
                  <GridItem sx={6} sm={6} md={6}>
                    <RegularButton
                      color={"info"}
                      onClick={() => {
                        setCurrentRows(savedRows);
                        openModal("warning", "הציונים אופסו");
                      }}
                      fullWidth
                    >
                      אפס את הציונים
                    </RegularButton>
                  </GridItem>
                  <GridItem sx={6} sm={6} md={6}>
                    <RegularButton
                      disabled={loading}
                      color={"success"}
                      onClick={updatePercentsHandler}
                      fullWidth
                    >
                      {loading ? (
                        <CircularProgress
                          className="hello"
                          sx={{ mx: 4 }}
                          size={"1.5rem"}
                          color="warning"
                        />
                      ) : (
                        "שמור שינויים"
                      )}
                    </RegularButton>
                  </GridItem>
                  <GridItem sx={12} sm={12} md={12}>
                    <ValuesTable rows={makeRows(props.percents)} />
                  </GridItem>
                </GridContainer>
              </CardBody>
            </Card>
          </GridItem>
        </GridContainer>
      </div>
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
    </Fragment>
  );
}

RTLPage.layout = RTL;

export async function getStaticProps() {
  let percents = {};
  let fail = false;

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_ADDRESS}api/info/allPercentages`
    );

    if (!response.ok) {
      throw new Error("fetching content failed");
    }

    const parsedResponse = await response.json();

    if (!parsedResponse) {
      throw new Error("fetching content failed");
    }

    if (!!parsedResponse.success) {
      percents = parsedResponse.percentages;
    }
  } catch (err) {
    fail = true;
  }

  const initialValue = [];
  // set the initial value if the fetch didn't fail
  if (!fail) {
    for (let [key, value] of Object.entries(percents)) {
      if (key.includes("subject")) {
        for (let [catKey, catValue] of Object.entries(value)) {
          initialValue.push(catValue);
        }
      }
    }
  }

  return {
    props: {
      percents,
      initialValue,
      fail,
    },
    revalidate: 5,
  };
}

export default RTLPage;
