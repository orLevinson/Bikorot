/*eslint-disable*/
import React, { useState, useEffect } from "react";
// @material-ui/core

// @material-ui/icons

// layout for this page
import RTL from "layouts/RTL.js";
// core components

import { useHttpClient } from "../../components/Hooks/http-hook";
import GridItem from "../../components/Grid/GridItem";
import CardHeader from "../../components/Card/CardHeader";
import GridContainer from "../../components/Grid/GridContainer";
import Card from "../../components/Card/Card";
import Table from "../../components/Table/Table";
import Return from "@material-ui/icons/Redo";
import { makeStyles } from "@material-ui/core";
import CardBody from "../../components/Card/CardBody";
import SearchBar from "../../components/search-page/searchBar/SearchBar";
import CardWithValues from "../../components/dashboard-page/cardWithValues/CardWithValues";
import RegularButton from "../../components/CustomButtons/Button";

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
  // useEffect(() => {
  //   if (!!props.fail) {
  //     openModal("danger", "קרתה שגיאה במהלך טעינת הנתונים");
  //   }
  // }, []);

  return (
    <div>
      <GridContainer fullWidth>
        <GridItem xs={12} sm={12} md={12}>
          <br />
          <CardHeader color={"primary"}>
            <h3 className={classes.cardTitleWhite}>דאשבורד מפקדים</h3>
            <p className={classes.cardCategoryWhite}>
              כאן ניתן להציג את ממוצעי היחידות עפ"י ממוצע שנתי. הממוצע מורכב
              מכלל הביקורות של יחידות הבת שלהן במשך השנה האחרונה
            </p>
          </CardHeader>
          <div style={{ position: "relative" }}>
            <GridContainer fullWidth centered>
              <div style={{ position: "absolute", top: 30, right: 15 }}>
                <RegularButton color={"primary"}>
                  <Return />
                </RegularButton>
              </div>
              <GridItem xs={6} sm={4} md={4}>
                <CardWithValues />
              </GridItem>
              <GridItem xs={6} sm={4} md={4}>
                <CardWithValues />
              </GridItem>
              <GridItem xs={6} sm={4} md={4}>
                <CardWithValues />
              </GridItem>
              <GridItem xs={6} sm={4} md={4}>
                <CardWithValues />
              </GridItem>
              <GridItem xs={6} sm={4} md={4}>
                <CardWithValues />
              </GridItem>
              <GridItem xs={6} sm={4} md={4}>
                <CardWithValues />
              </GridItem>
              <GridItem xs={6} sm={4} md={4}>
                <CardWithValues />
              </GridItem>
              <GridItem xs={6} sm={4} md={4}>
                <CardWithValues />
              </GridItem>
            </GridContainer>
          </div>
        </GridItem>
      </GridContainer>
    </div>
  );
}

RTLPage.layout = RTL;

export default RTLPage;
