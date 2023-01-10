/*eslint-disable*/
import React, {
  useState,
  useEffect,
  Fragment,
  useContext,
  useCallback,
} from "react";
import { useRouter } from "next/router";
import { contextData } from "../../context/context";
// layout for this page
import RTL from "layouts/RTL.js";
// core components

import { useHttpClient } from "../../components/Hooks/http-hook";
import GridItem from "../../components/Grid/GridItem";
import CardHeader from "../../components/Card/CardHeader";
import GridContainer from "../../components/Grid/GridContainer";
import Card from "../../components/Card/Card";
import {
  CircularProgress,
  FormControl,
  InputLabel,
  makeStyles,
  MenuItem,
  Select,
} from "@material-ui/core";
import CardBody from "../../components/Card/CardBody";
import Snackbar from "../../components/Snackbar/Snackbar";
import RegularButton from "../../components/CustomButtons/Button";
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
  const router = useRouter();
  const useStyles = makeStyles(styles);
  const Context = useContext(contextData);
  const classes = useStyles();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [modalState, setModalState] = useState({
    color: "",
    text: "",
    open: false,
  });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [chosen, setChosen] = useState({
    subject: null,
    category: null,
    question: null,
  });
  const [options, setOptions] = useState({
    subjects: [],
    categories: [],
    questions: [],
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

  // create the options object for the selects
  const subjectsArr = [
    "נושא 1",
    "נושא 2",
    "נושא 3",
    "נושא 4",
    "נושא 5",
    "נושא 6",
  ];

  const createObj = useCallback(
    ({ subject, category, question }) => {
      let subjects = [];
      let categories = [];
      let questions = [];

      subjects = subjectsArr.map((subject, index) => {
        return { name: subject, index: index + 1 };
      });

      if (subject !== null && subject !== "") {
        const name = "subject" + subject;
        if (!!template[name]) {
          for (let [catKey, catValue] of Object.entries(template[name])) {
            const index = catKey.split("category")[1];
            categories.push({ name: catValue.title, index: index });
          }
        }
        if (category !== null && category !== "") {
          const catName = "category" + category;
          if (
            !!template[name] &&
            !!template[name][catName] &&
            !!template[name][catName].questions &&
            Array.isArray(template[name][catName].questions)
          ) {
            template[name][catName].questions.forEach((question, index) => {
              questions.push({ name: question.text, index });
            });
          }
        }
      }
      setOptions({
        subjects,
        categories,
        questions,
      });
    },
    [setOptions]
  );

  useEffect(() => {
    createObj(chosen);
  }, [chosen, createObj]);

  const updateFileHandler = async () => {
    // check if there is a file
    if (!file) {
      openModal("danger", "אנא בחר קובץ");
      return;
    }

    // check if a question was chosen
    if(chosen.question === null || chosen.question === ""){
      openModal("danger", "אנא בחר שאלה");
      return;
    }

    try {
      setLoading(true);
      // creating a new formData because there is a file and we can't send it with JSON
      const formData = new FormData();
      formData.append("subject",chosen.subject);
      formData.append("category",chosen.category);
      formData.append("question",chosen.question);
      formData.append("file",file);

      const response = await sendRequest(
        `${process.env.NEXT_PUBLIC_API_ADDRESS}api/info/changeFile`,
        "PATCH",
        formData,
        {
          Authorization: Context.userData.token,
        }
      );
      if (!!response.success) {
        setFile(null);
        setLoading(false);
        openModal("success", "הקובץ שונה בהצלחה");
      }
    } catch (err) {
      openModal("danger", "קרתה שגיאה במהלך שליחת הקובץ");
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
                <h3 className={classes.cardTitleWhite}>שנה קבצי מחוון</h3>
                <p className={classes.cardCategoryWhite}>
                  כאן ניתן להעלות קבצי מחוון לכל סעיף בביקורת
                </p>
              </CardHeader>
              <CardBody>
                <GridContainer fullWidth>
                  <GridItem sx={6} sm={6} md={6}>
                    <GridContainer>
                      <GridItem sx={12} sm={12} md={12}>
                        <FormControl fullWidth>
                          <InputLabel id="subject-select-label">
                            נושא
                          </InputLabel>
                          <Select
                            labelId="subject-select-label"
                            id="subject-select"
                            label="subject"
                            value={chosen.subject}
                            onChange={(e) => {
                              setChosen((prev) => {
                                return {
                                  subject: e.target.value,
                                  category: null,
                                  question: null,
                                };
                              });
                            }}
                          >
                            {options.subjects.map((subject) => {
                              return (
                                <MenuItem
                                  key={"subject" + subject.index}
                                  value={subject.index}
                                >
                                  {subject.name}
                                </MenuItem>
                              );
                            })}
                          </Select>
                        </FormControl>
                      </GridItem>
                      <GridItem sx={12} sm={12} md={12}>
                        <FormControl fullWidth>
                          <InputLabel id="category-select-label">
                            קטגוריה
                          </InputLabel>
                          <Select
                            labelId="category-select-label"
                            id="category-select"
                            label="category"
                            value={chosen.category}
                            onChange={(e) => {
                              setChosen((prev) => {
                                return {
                                  ...prev,
                                  category: e.target.value,
                                  question: null,
                                };
                              });
                            }}
                          >
                            {options.categories.map((category) => {
                              return (
                                <MenuItem
                                  key={
                                    "category" + category.index + Math.random()
                                  }
                                  value={category.index}
                                >
                                  {category.name}
                                </MenuItem>
                              );
                            })}
                          </Select>
                        </FormControl>
                      </GridItem>
                      <GridItem sx={12} sm={12} md={12}>
                        <FormControl fullWidth>
                          <InputLabel id="question-select-label">
                            שאלה
                          </InputLabel>
                          <Select
                            labelId="question-select-label"
                            id="question-select"
                            label="question"
                            value={chosen.question}
                            onChange={(e) => {
                              setChosen((prev) => {
                                return { ...prev, question: e.target.value };
                              });
                            }}
                          >
                            {options.questions.map((question) => {
                              return (
                                <MenuItem
                                  key={
                                    "question" + question.index + Math.random()
                                  }
                                  value={question.index}
                                >
                                  {question.name}
                                </MenuItem>
                              );
                            })}
                          </Select>
                        </FormControl>
                      </GridItem>
                    </GridContainer>
                  </GridItem>
                  <GridItem sx={6} sm={6} md={6}>
                    <GridContainer>
                      <input
                        style={{
                          margin: "auto",
                          padding: "20px",
                          marginBotton: "10px",
                        }}
                        type={"file"}
                        onChange={(e) => {
                          setFile(e.target.files[0]);
                        }}
                      />
                      <GridItem sx={12} sm={12} md={12}>
                        <RegularButton
                          disabled={loading}
                          color={"success"}
                          onClick={updateFileHandler}
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
                            "שמור קובץ"
                          )}
                        </RegularButton>
                      </GridItem>
                    </GridContainer>
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
  let files = {};
  let fail = false;

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_ADDRESS}api/info/allFiles`
    );

    if (!response.ok) {
      throw new Error("fetching content failed");
    }

    const parsedResponse = await response.json();

    if (!parsedResponse) {
      throw new Error("fetching content failed");
    }

    if (!!parsedResponse.success) {
      files = parsedResponse.files;
    }
  } catch (err) {
    fail = true;
  }

  return {
    props: {
      files,
      fail,
    },
    revalidate: 5,
  };
}

export default RTLPage;
