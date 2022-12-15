/*eslint-disable*/
import React, { useState, useEffect, useContext, useCallback } from "react";
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
import SearchBar from "../../components/managers-page/searchBar/SearchBar.js";
import Button from "../../components/managers-page/button/Button";
import { contextData } from "../../context/context";
import { useRouter } from "next/router";
import Snackbar from "../../components/Snackbar/Snackbar";
import UserButton from "../../components/managers-page/button/Button";

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
  const useStyles = makeStyles(styles);
  const classes = useStyles();
  const router = useRouter();
  const Context = useContext(contextData);
  const [usersList, setUsersList] = useState([]);
  const [userListToShow, setUsersListToShow] = useState([]);
  const [loading, setLoading] = useState(false);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [modalState, setModalState] = useState({
    color: "",
    text: "",
    open: false,
  });

  const openModal = useCallback(
    (color, text) => {
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
    },
    [setModalState]
  );

  const getUsers = useCallback(async () => {
    let users = [];
    try {
      setLoading(true);
      const response = await sendRequest(
        `${process.env.NEXT_PUBLIC_API_ADDRESS}api/users/allUsers`,
        "GET",
        null,
        {
          Authorization: Context.userData.token,
        }
      );
      console.log(response);
      if (!!response.success && !!response.users) {
        const newUserArr = [];
        response.users.forEach((user) => {
          const userArr = [];
          userArr.push(user.name);
          userArr.push(user.personalNum);
          switch (user.perms) {
            case "manager":
              userArr.push("מנהל");
              break;
            case "global":
              userArr.push("מנהל מערכת");
              break;
            case "reviewer":
              userArr.push("מבקר");
              break;
            default:
              userArr.push("אין הרשאות");
              break;
          }
          userArr.push(
            <UserButton
              id={user._id}
              openModal={openModal}
              getUsers={getUsers}
            />
          );
          newUserArr.push(userArr);
        });
        setUsersList([...newUserArr]);
        setLoading(false);
      } else {
        throw new Error();
      }
    } catch (err) {
      clearError();
      openModal("danger", "קרתה תקלה במהלך שליפת המשתמשים");
      setLoading(false);
    }
  }, [setLoading, openModal, setUsersList, sendRequest]);

  // just load the initial values
  useEffect(() => {
    const isManager =
      Context.userData.perms === "manager" ||
      Context.userData.perms === "global";
    if (!isManager) {
      router.push("/dashboard");
      return;
    } else {
      getUsers();
    }
  }, [Context, getUsers]);

  const sortUsers = (name = "", num = "") => {
    console.log(usersList.length);
    if (name === "" && num === "") {
      setUsersListToShow([...usersList]);
    }
    if (name !== "" && num === "") {
      setUsersListToShow(
        [...usersList].filter((user) => {
          if (user[0].includes(name)) {
            return true;
          }
          return false;
        })
      );
      console.log(usersList.length);
    }
    if (name === "" && num !== "") {
      setUsersListToShow(
        [...usersList].filter((user) => {
          if (user[1].includes(num)) {
            return true;
          }
          return false;
        })
      );
    }
    if (name !== "" && num !== "") {
      setUsersListToShow(
        [...usersList].filter((user) => {
          if (user[1].includes(num) && user[0].includes(name)) {
            return true;
          }
          return false;
        })
      );
    }
  };

  useEffect(() => {
    // update the sorting function whenever the userList changes
    sortUsers();
  }, [usersList]);

  return (
    <div>
      <GridContainer fullWidth>
        <GridItem xs={12} sm={12} md={12}>
          <Card>
            <CardHeader color={"primary"}>
              <h3 className={classes.cardTitleWhite}>רשימת מבקרים</h3>
              <p className={classes.cardCategoryWhite}>
                ניתן לחפש שמות מבקרים ע"י שם, מ"א. ניתן לשנות הרשאות ולחפש
                ביקורות של אותם המבקרים
              </p>
            </CardHeader>
            <CardBody>
              <SearchBar isLoading={loading} sortUsers={sortUsers} />
              <Table
                tableHeaderColor="primary"
                tableHead={["שם", "מספר אישי", "הרשאה", "פעולות"]}
                tableData={userListToShow}
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

RTLPage.layout = RTL;

export default RTLPage;
