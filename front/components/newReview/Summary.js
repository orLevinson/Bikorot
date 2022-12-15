import React, { useCallback, useContext, useRef, useMemo } from "react";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import GridContainer from "../Grid/GridContainer";
import GridItem from "../Grid/GridItem";
import { reviewContextData } from "../../context/contextReview";
import SummaryItem from "./SummaryItem";

export default function Summary() {
  // the subject list wouldn't change so i just memoized it
  const subjects = useMemo(
    () => [
      { name: "נושא 1", key: "subject1" },
      { name: "נושא 2", key: "subject2" },
      { name: "נושא 3", key: "subject3" },
      { name: "נושא 4", key: "subject4" },
      { name: "נושא 5", key: "subject5" },
    ],
    []
  );
  const { reviewData, changeSummary } = useContext(reviewContextData);
  const currentlyOpen = useRef(0);

  const changeHandler = useCallback(
    (value, subject) => {
      let copy = { ...reviewData.summary };
      copy[subject].text = value;
      changeSummary(copy);
    },
    [reviewData, changeSummary]
  );

  return (
    <div>
      {subjects.map((subject, index) => {
        return (
          <Accordion
            defaultExpanded={currentlyOpen.current === index}
            onClick={() => (currentlyOpen.current = index)}
            key={subject.key + index}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography>{subject.name}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <GridContainer fullWidth>
                <GridItem lg={12}>
                  <SummaryItem
                    textValue={reviewData.summary[subject.key].text}
                    changeHandler={changeHandler}
                    subject={subject.key}
                  />
                </GridItem>
              </GridContainer>
            </AccordionDetails>
          </Accordion>
        );
      })}
    </div>
  );
}
