import React, {
  useState,
  useEffect,
  useCallback,
  useContext,
  useRef,
} from "react";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import GridContainer from "../Grid/GridContainer";
import GridItem from "../Grid/GridItem";
import Card from "../Card/Card";
import QuestionItem from "./QuestionItem";
import questionsObj from "../../questionsObj";
import reviewTemplate from "../../reviewTemplate";
import { reviewContextData } from "../../context/contextReview";

export default function Subject2(props) {
  const [categories, setCategories] = useState([]);
  const [files, setFiles] = useState([]);
  const { reviewData, changeSubject2 } = useContext(reviewContextData);
  const currentlyOpen = useRef(0);

  useEffect(() => {
    // on load set the reviewContext data in the values state also
    // load the initial questions into the blocks and set the categories


    let currentSubject = [];

    for (const [key, value] of Object.entries(questionsObj.subject2)) {
      currentSubject.push(value);
    }

    let currentSubjectFiles = [];

    for (const [key, value] of Object.entries(props.files)) {
      currentSubjectFiles.push(value);
    }

    setCategories(currentSubject);
    setFiles(currentSubjectFiles);
  }, []);

  const changeHandler = useCallback(
    (value, category, index, type) => {
      let copy = { ...reviewData.scores.subject2 };
      copy[category][index][
        type === "score" ? "score" : "text"
      ] = value;
      changeSubject2(copy);
    },
    [reviewData, changeSubject2]
  );

  if (!!reviewData.scores.subject2 && categories.length > 0) {
    return (
      <div>
        {categories.map((category, index) => {
          return (
            <Accordion
              defaultExpanded={index === currentlyOpen.current}
              onClick={() => (currentlyOpen.current = index)}
              key={category.title + Math.random()}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Typography>{category.title}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <GridContainer fullWidth>
                  {category.questions.map((question,qIndex) => {
                     let filePath = null;
                     if (Array.isArray(files[index])) {
                       if (
                         typeof files[index][qIndex] === "object" &&
                         !!files[index][qIndex].path
                       ) {
                         filePath = files[index][qIndex].path;
                       }
                     }
                    return (
                      <GridItem
                        lg={6}
                        key={question.text + question.subject + Math.random()}
                      >
                        <Card>
                          <QuestionItem
                           filePath={filePath}
                            valueScore={
                              reviewData.scores.subject2[question.category][
                                question.index
                              ].score
                            }
                            changeValueScore={(e) => {
                              changeHandler(
                                e,
                                question.category,
                                question.index,
                                "score"
                              );
                            }}
                            valueText={
                              reviewData.scores.subject2[question.category][
                                question.index
                              ].text
                            }
                            changeValueText={(value) => {
                              changeHandler(
                                value,
                                question.category,
                                question.index,
                                "text"
                              );
                            }}
                            question={question.text}
                          />
                        </Card>
                      </GridItem>
                    );
                  })}
                </GridContainer>
              </AccordionDetails>
            </Accordion>
          );
        })}
      </div>
    );
  } else {
    return <div></div>;
  }
}
