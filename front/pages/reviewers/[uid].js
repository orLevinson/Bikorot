/*eslint-disable*/
import React, { useState, useEffect, useContext, useCallback } from "react";
import { useRouter } from "next/router";
import { contextData } from "../../context/context";
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
import SearchBar from "../../components/reviewers-page/searchBar/SearchBar.js";
import Button from "../../components/reviewers-page/button/Button";
import Snackbar from "../../components/Snackbar/Snackbar";

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

function RTLPage() {
  const router = useRouter();
  const uid = router.query.uid;
  const useStyles = makeStyles(styles);
  const classes = useStyles();
  const [reviews, setReviews] = useState([]);
  const [reviewForTable, setReviewsForTable] = useState([]);
  const [name, setName] = useState("");
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loading, setLoading] = useState(false);
  const [modalState, setModalState] = useState({
    color: "",
    text: "",
    open: false,
  });

  const Context = useContext(contextData);
  console.log(Context);

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

  // find out if there is a user and if yes get his data and reviews

  const getUserReviews = async (unit = null, date = null) => {
    try {
      setLoading(true);
      const response = await sendRequest(
        `${process.env.NEXT_PUBLIC_API_ADDRESS}api/reviews/getByAuthor/${uid}`,
        "POST",
        JSON.stringify({
          unit,
          date,
        }),
        {
          "Content-Type": "application/json",
          Authorization: Context.userData.token,
        }
      );
      // load initial reviews
      if (!!response.success && !!response.reviews) {
        setName(response.name);
        setReviews(response.reviews);
        setLoading(false);
      } else {
        throw new Error();
      }
    } catch (err) {
      clearError();
      setLoading(false);
      openModal("danger", "קרתה תקלה במהלך שליפת הנתונים");
    }
  };

  // rearrange existing reviews
  useEffect(() => {
    const reviewsArray = [];
    reviews.forEach((review) => {
      const reviewArr = [];
      reviewArr.push(review.unit.name);
      const dateObj = new Date(review.dateCreated);
      const dateStr = `${dateObj.getDate()} / ${
        dateObj.getMonth() + 1
      } / ${dateObj.getFullYear()}`;
      reviewArr.push(dateStr);
      reviewArr.push(parseInt(review.Score).toFixed(0));
      reviewArr.push(
        <Button id={review._id} deleteReviewHandler={deleteReviewHandler} />
      );
      reviewsArray.push(reviewArr);
    });
    setReviewsForTable(reviewsArray);
  }, [reviews]);

  useEffect(() => {
    const isManager =
      Context.userData.perms === "manager" ||
      Context.userData.perms === "global";
    if (!isManager) {
      router.push("/dashboard");
      return;
    } else {
      getUserReviews();
    }
  }, [Context]);

  // delete review item
  const deleteReviewHandler = useCallback(
    async (id) => {
      try {
        setLoading(true);
        const response = await sendRequest(
          `${process.env.NEXT_PUBLIC_API_ADDRESS}api/reviews/${id}`,
          "DELETE",
          null,
          {
            "Content-Type": "application/json",
            Authorization: Context.userData.token,
          }
        );

        if (!!response.success) {
          setReviews((prev) => prev.filter((i) => i._id !== id));
          openModal("success", "הביקורת נמחקה בהצלחה");
          setLoading(false);
        }
      } catch (err) {
        clearError();
        setLoading(false);
        openModal("danger", "קרתה תקלה במהלך מחיקת הביקורת");
      }
    },
    [
      setReviews,
      openModal,
      setLoading,
      clearError,
      Context.userData,
      sendRequest,
    ]
  );

  return (
    <>
      <div>
        <GridContainer fullWidth>
          <GridItem xs={12} sm={12} md={12}>
            <Card>
              <CardHeader color={"primary"}>
                <h3 className={classes.cardTitleWhite}>
                  עמוד הביקורות של {name}
                </h3>
                <p className={classes.cardCategoryWhite}>
                  ניתן לחפש ביקורות ע"י שם יחידה, יחידת אם או תאריך. כמו גם,
                  ניתן לערוך את הביקורות או למחוק אותן
                </p>
              </CardHeader>
              <CardBody>
                <SearchBar loading={loading} getUserReviews={getUserReviews} />
                <Table
                  tableHeaderColor="primary"
                  tableHead={[
                    "יחידה",
                    "תאריך ביצוע ביקורת",
                    "ציון סופי",
                    "פעולות",
                  ]}
                  tableData={reviewForTable}
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
    </>
  );
}

RTLPage.layout = RTL;

export default RTLPage;
