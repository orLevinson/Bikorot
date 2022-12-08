/*eslint-disable*/
import React, { useState, useEffect, Fragment } from "react";

// layout for this page
import RTL from "layouts/RTL.js";
// core components

import { useHttpClient } from "../../components/Hooks/http-hook";
import GridItem from "../../components/Grid/GridItem";
import CardHeader from "../../components/Card/CardHeader";
import GridContainer from "../../components/Grid/GridContainer";
import Return from "@material-ui/icons/Redo";
import { makeStyles } from "@material-ui/core";
import CardWithValues from "../../components/dashboard-page/cardWithValues/CardWithValues";
import RegularButton from "../../components/CustomButtons/Button";
import Snackbar from "../../components/Snackbar/Snackbar.js";

// custom css
import "../../css/dashboard.css";

// custom styles for the card
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
  const useStyles = makeStyles(styles);
  const classes = useStyles();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [currentUnit, setCurrentUnit] = useState({
    id: "",
    name: 'כלל צה"ל',
    parentId: "",
    level: "total",
    directUnits: [],
    unitsUnder: [],
  });
  const [modalState, setModalState] = useState({
    color: "",
    text: "",
    open: false,
  });

  // the modal opening function
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

  // calculating the current units to show
  const drillDownHandler = (id) => {
    const newUnit = {
      id: id,
      name: 'כלל צה"ל',
      parentId: currentUnit.id,
      level: "total",
      directUnits: [],
      unitsUnder: [],
    };
    let unitObj;
    switch (currentUnit.level) {
      // in case the level we are in is the top level
      case "total":
        unitObj = props.commandLvl[id];
        // check this unitObj really does exist
        if (!!unitObj && !!unitObj.id) {
          newUnit.name = unitObj.name;
          newUnit.level = "command";
          newUnit.unitsUnder = unitObj.unitsUnder;
          newUnit.directUnits = unitObj.directUnits;
          setCurrentUnit({ ...newUnit });
        }
        break;
      // in case we are in the command level
      case "command":
        unitObj = props.divisionLvl[id];
        // check this unitObj really does exist
        if (!!unitObj && !!unitObj.id) {
          newUnit.name = unitObj.name;
          newUnit.level = "division";
          newUnit.unitsUnder = unitObj.unitsUnder;
          newUnit.directUnits = unitObj.directUnits;
          setCurrentUnit({ ...newUnit });
        }
        break;
      // in case we clicked a brigade
      case "division":
        unitObj = props.brigadeLvl[id];
        // check this unitObj really does exist
        if (!!unitObj && !!unitObj.id) {
          newUnit.name = unitObj.name;
          newUnit.level = "brigade";
          newUnit.unitsUnder = [];
          newUnit.directUnits = unitObj.directUnits;
          setCurrentUnit({ ...newUnit });
        }
        break;
      // if there was a problem dont do nothing
      default:
        break;
    }
  };

  const goBackHandler = () => {
    const newUnit = {
      id: currentUnit.parentId,
      name: 'כלל צה"ל',
      parentId: "",
      level: "total",
      directUnits: [],
      unitsUnder: [],
    };
    let unitObj;
    switch (currentUnit.level) {
      // in case we are in the command level and want to go to total
      case "command":
        newUnit.id = "";
        for (const [unitKey, unitValue] of Object.entries(props.commandLvl)) {
          newUnit.unitsUnder.push(unitValue);
        }
        setCurrentUnit({ ...newUnit });
        break;
      // in case we want to go back from a division to the command
      case "division":
        unitObj = props.commandLvl[currentUnit.parentId];
        // check this unitObj really does exist
        if (!!unitObj && !!unitObj.id) {
          newUnit.name = unitObj.name;
          newUnit.parentId = "";
          newUnit.level = "command";
          newUnit.unitsUnder = unitObj.unitsUnder;
          newUnit.directUnits = unitObj.directUnits;
          setCurrentUnit({ ...newUnit });
        }
        break;
      case "brigade":
        unitObj = props.divisionLvl[currentUnit.parentId];
        // check this unitObj really does exist
        if (!!unitObj && !!unitObj.id) {
          newUnit.name = unitObj.name;
          newUnit.parentId = unitObj.parentId;
          newUnit.level = "division";
          newUnit.unitsUnder = unitObj.unitsUnder;
          newUnit.directUnits = unitObj.directUnits;
          setCurrentUnit({ ...newUnit });
        }
        break;
        default:
          break;
    }
  };

  useEffect(() => {
    const commandsArr = [];
    for (const [unitKey, unitValue] of Object.entries(props.commandLvl)) {
      commandsArr.push(unitValue);
    }
    setCurrentUnit((prev) => {
      return { ...prev, unitsUnder: commandsArr };
    });
  }, []);

  return (
    <Fragment>
      <div>
        <GridContainer fullWidth>
          <GridItem xs={12} sm={12} md={12}>
            <br />
            <CardHeader color={"primary"}>
              <h3 className={classes.cardTitleWhite}>
                דאשבורד מפקדים - {currentUnit.name}
              </h3>
              <p className={classes.cardCategoryWhite}>
                כאן ניתן להציג את ממוצעי היחידות עפ"י ממוצע שנתי. הממוצע מורכב
                מכלל הביקורות של יחידות הבת שלהן במשך השנה האחרונה
              </p>
            </CardHeader>
            <div style={{ position: "relative" }}>
              {/* there is no need to go back when you are in the top level */}
              {currentUnit.level !== "total" && (
                <div style={{ position: "absolute", top: 30, right: 15 }}>
                  <RegularButton color={"primary"} onClick={goBackHandler}>
                    <Return />
                  </RegularButton>
                </div>
              )}
              <GridContainer fullWidth centered>
                {currentUnit.unitsUnder.map((unit) => {
                  return (
                    <GridItem xs={6} sm={4} md={4} key={unit.id}>
                      <CardWithValues
                        name={unit.name}
                        reviewersAvg={unit.reviewerAvg}
                        managersAvg={unit.managerAvg}
                        func={() => {
                          drillDownHandler(unit.id);
                        }}
                      />
                    </GridItem>
                  );
                })}
                {currentUnit.directUnits.map((unit) => {
                  return (
                    <GridItem xs={6} sm={4} md={4} key={unit.id}>
                      <CardWithValues
                        name={unit.name}
                        reviewersAvg={unit.reviewerAvg}
                        managersAvg={unit.managerAvg}
                      />
                    </GridItem>
                  );
                })}
              </GridContainer>
            </div>
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
  let commandLvl = {};
  let divisionLvl = {};
  let brigadeLvl = {};
  let fail = false;

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_ADDRESS}api/units/averages`
    );

    if (!response.ok) {
      throw new Error("fetching content failed");
    }

    const parsedResponse = await response.json();

    if (!parsedResponse) {
      throw new Error("fetching content failed");
    }

    if (!!parsedResponse.success) {
      commandLvl = parsedResponse.commandLvl;
      divisionLvl = parsedResponse.divisionLvl;
      brigadeLvl = parsedResponse.brigadeLvl;
    }
  } catch (err) {
    fail = true;
  }

  return {
    props: {
      commandLvl,
      divisionLvl,
      brigadeLvl,
      fail,
    },
    revalidate: 5,
  };
}

export default RTLPage;
