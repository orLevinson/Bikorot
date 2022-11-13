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
import { makeStyles } from "@material-ui/core";
import CardBody from "../../components/Card/CardBody";
import SearchBar from "../../components/search-page/searchBar/SearchBar";

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
          <Card>
            <CardHeader color={"primary"}>
              <h3 className={classes.cardTitleWhite}>מנוע חיפוש ביקורות</h3>
              <p className={classes.cardCategoryWhite}>
                ניתן לחפש יחידה על פי שם יחידה, על פי שם יחידת אם(אוגדה,חטיבה או
                פיקוד) ולפי טווח תאריכים
              </p>
            </CardHeader>
            <CardBody>
              <SearchBar/>
              <Table
                tableHeaderColor="primary"
                tableHead={["Name", "Country", "City", "Salary"]}
                tableData={[
                  ["Dakota Rice", "Niger", "Oud-Turnhout", "$36,738"],
                  ["Minerva Hooper", "Curaçao", "Sinaai-Waas", "$23,789"],
                  ["Sage Rodriguez", "Netherlands", "Baileux", "$56,142"],
                  ["Philip Chaney", "Korea, South", "Overland Park", "$38,735"],
                  [
                    "Doris Greene",
                    "Malawi",
                    "Feldkirchen in Kärnten",
                    "$63,542",
                  ],
                  ["Mason Porter", "Chile", "Gloucester", "$78,615"],
                ]}
              />
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
    </div>
  );
}

RTLPage.layout = RTL;

export default RTLPage;