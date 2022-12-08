/*eslint-disable*/
import React, { useState, useEffect, Fragment } from "react";
import router, { useRouter } from "next/router";

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
import Snackbar from "../../components/Snackbar/Snackbar";

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
  const classes = useStyles();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [reviewsToShow, setReviewsToShow] = useState([]);
  const [searchBarData, setSearchBarData] = useState({
    unit: "",
    date: null,
  });
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

  // a function to arrange the reviews in a nice format for the table
  const rearrangeHandler = (data) => {
    const reviews = [];
    for (let i = 0; i < data.length; i++) {
      const reviewItem = [];
      // creating a link to an uneditable page of the review in the review title
      const nameHeader = (
        <span
          onClick={() => {
            router.push("/showReview/" + data[i].id);
          }}
        >
          {!!data[i].unit ? data[i].unit.name : "חסר שם יחידה"}
        </span>
      );
      reviewItem.push(nameHeader);
      const reviewDateObj = new Date(data[i].dateCreated);
      const reviewDataStr = `${reviewDateObj.getDate()} / ${
        reviewDateObj.getMonth() + 1
      } / ${reviewDateObj.getFullYear()}`;
      reviewItem.push(reviewDataStr);
      reviewItem.push(!!data[i].author ? data[i].author.name : "חסר שם מבקר");
      reviewItem.push(parseInt(data[i].Score).toFixed(0));
      reviews.push(reviewItem);
    }
    return reviews;
  };

  const getUnitsHandler = async () => {
    try {
      const response = await sendRequest(
        `${process.env.NEXT_PUBLIC_API_ADDRESS}api/reviews/filter`,
        "POST",
        JSON.stringify(searchBarData),
        {
          "Content-Type": "application/json",
        }
      );
      if (!!response.success && !!response.reviews) {
        setReviewsToShow(rearrangeHandler(response.reviews));
      }
    } catch (err) {
      openModal("danger", "קרתה שגיאה במהלך השגת הביקורות");
      clearError();
    }
  };

  // in case the initial props arent loading
  useEffect(() => {
    if (!!props.fail) {
      openModal("danger", "קרתה שגיאה במהלך טעינת הנתונים");
    } else {
      setReviewsToShow(rearrangeHandler(props.reviews));
    }
  }, []);

  return (
    <Fragment>
      <div>
        <GridContainer fullWidth>
          <GridItem xs={12} sm={12} md={12}>
            <Card>
              <CardHeader color={"primary"}>
                <h3 className={classes.cardTitleWhite}>מנוע חיפוש ביקורות</h3>
                <p className={classes.cardCategoryWhite}>
                  ניתן לחפש יחידה על פי שם יחידה ולפי טווח תאריכים
                </p>
              </CardHeader>
              <CardBody>
                <SearchBar
                  searchBarData={searchBarData}
                  setSearchBarData={setSearchBarData}
                  getUnitsHandler={getUnitsHandler}
                />
                <Table
                  tableHeaderColor="primary"
                  tableHead={[
                    "יחידה",
                    "תאריך ביצוע ביקורת",
                    "מבקר",
                    "ציון סופי",
                  ]}
                  tableData={reviewsToShow}
                />
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
  let reviews = [];
  let fail = false;

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_ADDRESS}api/reviews/filter`,
      {
        method: "POST",
      }
    );

    if (!response.ok) {
      throw new Error("fetching content failed");
    }

    const parsedResponse = await response.json();

    if (!parsedResponse) {
      throw new Error("fetching content failed");
    }

    if (!!parsedResponse.success) {
      reviews = parsedResponse.reviews;
    }
  } catch (err) {
    fail = true;
  }

  return {
    props: {
      reviews,
      fail,
    },
    revalidate: 5,
  };
}

export default RTLPage;
