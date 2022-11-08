/*eslint-disable*/
import React, { useEffect, useState } from "react";
// @material-ui/core
import { makeStyles } from "@material-ui/core/styles";
import Book from "@material-ui/icons/Book";
import People from "@material-ui/icons/People";
// layout for this page
import RTL from "layouts/RTL.js";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Snackbar from "components/Snackbar/Snackbar.js";
import styles from "assets/jss/nextjs-material-dashboard/views/rtlStyle.js";
import CustomTabs from "../../components/CustomTabs/CustomTabs";
import ContendersTable from "../../components/contendersTable/ContendersTable";
import { useHttpClient } from "../../components/Hooks/http-hook";
import Jobs from "../../components/addJob/Jobs";
import Messages from "../../components/messages/Messages";
import FrontFiles from "../../components/frontFiles/FrontFiles";
import FilterJobs from "../../components/filters/FilterJobs";
import TopAdminCards from "../../components/topAdminCards/TopAdminCards";
import "../../css/dashboard.css";
import LoginPage from "../../components/page-login/loginPage/LoginPage";
import LifeTable from "../../components/LifeTable/LifeTable";
import LifeFilters from "../../components/LifeFilters/LifeFilters";
import ChangeUnits from "../../components/ChangeUnits/ChangeUnits";
import UnitsFiles from "../../components/unitsFiles/UnitsFiles";

function RTLPage(props) {
  const useStyles = makeStyles(styles);
  const classes = useStyles();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loggedIn, setLoggedIn] = useState(false);
  const [modalState, setModalState] = useState({
    color: "",
    text: "",
    open: false,
  });
  const [token, setToken] = useState("");
  const [isOpen, setIsOpen] = useState(props.is_open);
  const [contendersLife, setContendersLife] = useState(props.contendersLifeArr);
  const [contendersJob, setContendersJob] = useState(props.contendersJobArr);
  const [contendersLifeToShow, setContendersLifeToShow] =
    useState(contendersLife);
  const [contendersJobToShow, setContendersJobToShow] = useState(contendersJob);
  const [messagesList, setMessages] = useState(props.messageArr);
  const [jobsList, setJobsList] = useState(props.jobsArr);
  const [unitsList, setUnitsList] = useState(props.unitsArr);
  const [searchNameJob, setSearchNameJob] = useState("");
  const [searchNameLife, setSearchNameLife] = useState("");
  const [searchCategory, setSearchCategory] = useState("AllCategories");
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

  // auto signout
  useEffect(() => {
    const token = localStorage.getItem("token");
    const expiryDate = localStorage.getItem("expiresIn");

    if (!token || !expiryDate) {
      return;
    }

    const dateObj = new Date(expiryDate);
    const currentdate = new Date();

    if (currentdate.getTime() > dateObj.getTime()) {
      return;
    }

    setLoggedIn(true);
    setToken(token);
    const timeDifference = dateObj.getTime() - currentdate.getTime();

    setTimeout(() => {
      setLoggedIn(false);
      setToken("");
      localStorage.clear();
    }, timeDifference);
  }, []);

  // login handler
  if (!loggedIn) {
    return (
      <LoginPage
        sendRequest={sendRequest}
        clearError={clearError}
        setLoggedIn={setLoggedIn}
        setToken={setToken}
        openModal={openModal}
        setModalState={setModalState}
        modalState={modalState}
      />
    );
  }
  // return (
  //   <div>
  //     <TopAdminCards
  //       token={token}
  //       sendRequest={sendRequest}
  //       openModal={openModal}
  //       clearError={clearError}
  //       setIsOpen={setIsOpen}
  //       setContendersLife={setContendersLife}
  //       setContendersJob={setContendersJob}
  //       setUnitsList={setUnitsList}
  //       setMessages={setMessages}
  //       isOpen={isOpen}
  //       contendersLife={contendersLife}
  //       contendersJob={contendersJob}
  //     />
  //     <CustomTabs
  //       title="סוג תחרות"
  //       headerColor="rose"
  //       rtlActive
  //       tabs={[
  //         {
  //           tabName: "עבודות מצטיינות  מפעל חיים",
  //           tabIcon: Book,
  //           tabContent: (
  //             <>
  //               <GridContainer>
  //                 <GridItem xs={12} sm={12} md={12}>
  //                   <CustomTabs
  //                     title="טבלת מועמדים"
  //                     headerColor="primary"
  //                     info="מרגע השינוי העדכון במערכת יקרה בעוד כדקה"
  //                     rtlActive
  //                     tabs={[
  //                       {
  //                         tabName: "עבודות מצטיינת",
  //                         tabIcon: Book,
  //                         tabContent: (
  //                           <div>
  //                             <div className="SearchContainer">
  //                               <FilterJobs
  //                                 setSearchCategory={setSearchCategory}
  //                                 searchCategory={searchCategory}
  //                                 jobsList={jobsList}
  //                                 setSearchName={setSearchNameJob}
  //                                 searchName={searchNameJob}
  //                                 contenders={contendersJob}
  //                                 setContendersToShow={setContendersJobToShow}
  //                               />
  //                             </div>
  //                             <ContendersTable
  //                               contenders={contendersJobToShow}
  //                               sendRequest={sendRequest}
  //                               token={token}
  //                               setContenders={setContendersJob}
  //                               openModal={openModal}
  //                               clearError={clearError}
  //                             />
  //                           </div>
  //                         ),
  //                       },
  //                       {
  //                         tabName: "מפעל חיים",
  //                         tabIcon: People,
  //                         tabContent: (
  //                           <div>
  //                             <div className="SearchContainer">
  //                               <LifeFilters
  //                                 setSearchCategory={setSearchCategory}
  //                                 searchCategory={searchCategory}
  //                                 jobsList={jobsList}
  //                                 setSearchName={setSearchNameLife}
  //                                 searchName={searchNameLife}
  //                                 contenders={contendersLife}
  //                                 setContendersToShow={setContendersLifeToShow}
  //                               />
  //                             </div>
  //                             <LifeTable
  //                               contenders={contendersLifeToShow}
  //                               sendRequest={sendRequest}
  //                               token={token}
  //                               setContenders={setContendersLife}
  //                               openModal={openModal}
  //                               clearError={clearError}
  //                             />
  //                           </div>
  //                         ),
  //                       },
  //                     ]}
  //                   />
  //                 </GridItem>
  //               </GridContainer>
  //               <GridContainer>
  //                 <GridItem xs={12} sm={12} md={6}>
  //                   <Messages
  //                     messagesList={messagesList}
  //                     setMessages={setMessages}
  //                     openModal={openModal}
  //                     clearError={clearError}
  //                     sendRequest={sendRequest}
  //                     token={token}
  //                   />
  //                 </GridItem>
  //                 <GridItem xs={12} sm={12} md={6}>
  //                   <FrontFiles
  //                     openModal={openModal}
  //                     clearError={clearError}
  //                     sendRequest={sendRequest}
  //                     token={token}
  //                   />
  //                   <GridContainer>
  //                     <GridItem xs={12} sm={12} md={12}>
  //                       <Jobs
  //                         jobsList={jobsList}
  //                         setJobsList={setJobsList}
  //                         openModal={openModal}
  //                         clearError={clearError}
  //                         sendRequest={sendRequest}
  //                         token={token}
  //                       />
  //                     </GridItem>
  //                   </GridContainer>
  //                 </GridItem>
  //               </GridContainer>
  //             </>
  //           ),
  //         },
  //         {
  //           tabName: "יחידות מצטיינות",
  //           tabIcon: Book,
  //           tabContent: (
  //             <>
  //               <GridContainer>
  //                 <GridItem xs={12} sm={12} md={6}>
  //                   <ChangeUnits
  //                     unitsList={unitsList}
  //                     setUnitsList={setUnitsList}
  //                     openModal={openModal}
  //                     clearError={clearError}
  //                     sendRequest={sendRequest}
  //                     token={token}
  //                   />
  //                 </GridItem>
  //                 <GridItem xs={12} sm={12} md={6}>
  //                   <UnitsFiles
  //                     openModal={openModal}
  //                     clearError={clearError}
  //                     sendRequest={sendRequest}
  //                     token={token}
  //                   />
  //                 </GridItem>
  //               </GridContainer>
  //             </>
  //           ),
  //         },
  //       ]}
  //     />
  //     <Snackbar
  //       place="bl"
  //       color={modalState.color}
  //       message={modalState.text}
  //       open={modalState.open}
  //       closeNotification={() =>
  //         setModalState({
  //           color: "",
  //           text: "",
  //           open: false,
  //         })
  //       }
  //       close
  //     />
  //   </div>
  // );
  return <div></div>;
}

RTLPage.layout = RTL;

export async function getStaticProps() {
  let is_open = false;
  let jobsArr = [];
  let messageArr = [];
  let unitsArr = [];
  let contendersLifeArr = [];
  let contendersJobArr = [];
  let fail = false;

  // try {
  //   const response = await fetch(
  //     `${process.env.NEXT_PUBLIC_API_ADDRESS}api/misc/adminInfo`
  //   );

  //   if (!response.ok) {
  //     throw new Error("fetching content failed");
  //   }

  //   const parsedResponse = await response.json();

  //   if (!parsedResponse) {
  //     throw new Error("fetching content failed 2");
  //   }

  //   is_open = !!parsedResponse.mainContent
  //     ? parsedResponse.mainContent.is_open
  //     : false;
  //   contendersLifeArr = parsedResponse.contendersLife;
  //   contendersJobArr = parsedResponse.contendersJob;
  //   jobsArr = parsedResponse.jobs;
  //   messageArr = parsedResponse.messages;
  //   unitsArr = parsedResponse.units;
  // } catch (err) {
  //   console.log(err);
  //   fail = true;
  // }

  return {
    props: {
      is_open,
      jobsArr,
      contendersLifeArr,
      contendersJobArr,
      unitsArr,
      messageArr,
      fail,
    },
    revalidate: 1,
  };
}

export default RTLPage;
