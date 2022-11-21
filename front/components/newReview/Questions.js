import * as React from "react";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import CustomInput from "../CustomInput/CustomInput";
import GridContainer from "../Grid/GridContainer";
import GridItem from "../Grid/GridItem";
import RegularButton from "../CustomButtons/Button";
import Card from "../Card/Card";

function QuestionItem() {
  return (
    <div style={{ margin: 15 }}>
      <GridContainer fullWidth>
        <GridItem xs={12} md={12} sm={12}>
          <span className="littleHeader">סעיף 1</span>
        </GridItem>
        <GridItem xs={4} md={4} sm={4}>
          <CustomInput
            labelText={"ציון"}
            type="unitname"
            inputProps={{}}
            id="passwordInput"
            formControlProps={{
              fullWidth: true,
            }}
            noMarginTop={true}
          />
        </GridItem>
        <GridItem xs={4} md={4} sm={4}>
          <RegularButton color={"primary"} fullWidth>
            קובץ מחוון
          </RegularButton>
        </GridItem>
        <GridItem xs={4} md={4} sm={4}></GridItem>
        <GridItem xs={12} md={12} sm={12}>
          <CustomInput
            labelText={"פירוט"}
            type="textarea"
            id="passwordInput"
            formControlProps={{
              fullWidth: true,
            }}
            inputProps={{
              multiline: true,
              rows: 3,
            }}
            noMarginTop={true}
          />
        </GridItem>
      </GridContainer>
    </div>
  );
}

export default function SimpleAccordion() {
  return (
    <div>
      <Accordion defaultExpanded>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography>קטגוריה 1</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <GridContainer fullWidth>
            <GridItem lg={6}>
              <Card>
                <QuestionItem />
              </Card>
            </GridItem>
            <GridItem lg={6}>
              <Card>
                <QuestionItem />
              </Card>
            </GridItem>
            <GridItem lg={6}>
              <Card>
                <QuestionItem />
              </Card>
            </GridItem>
            <GridItem lg={6}>
              <Card>
                <QuestionItem />
              </Card>
            </GridItem>
            <GridItem lg={6}>
              <Card>
                <QuestionItem />
              </Card>
            </GridItem>
          </GridContainer>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2a-content"
          id="panel2a-header"
        >
          <Typography>קטגוריה 2</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <GridContainer fullWidth>
            <GridItem lg={6}>
              <Card>
                <QuestionItem />
              </Card>
            </GridItem>
            <GridItem lg={6}>
              <Card>
                <QuestionItem />
              </Card>
            </GridItem>
            <GridItem lg={6}>
              <Card>
                <QuestionItem />
              </Card>
            </GridItem>
            <GridItem lg={6}>
              <Card>
                <QuestionItem />
              </Card>
            </GridItem>
            <GridItem lg={6}>
              <Card>
                <QuestionItem />
              </Card>
            </GridItem>
          </GridContainer>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel3a-content"
          id="panel3a-header"
        >
          <Typography>קטגוריה 3</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <GridContainer fullWidth>
            <GridItem lg={6}>
              <Card>
                <QuestionItem />
              </Card>
            </GridItem>
            <GridItem lg={6}>
              <Card>
                <QuestionItem />
              </Card>
            </GridItem>
            <GridItem lg={6}>
              <Card>
                <QuestionItem />
              </Card>
            </GridItem>
            <GridItem lg={6}>
              <Card>
                <QuestionItem />
              </Card>
            </GridItem>
            <GridItem lg={6}>
              <Card>
                <QuestionItem />
              </Card>
            </GridItem>
          </GridContainer>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel3a-content"
          id="panel3a-header"
        >
          <Typography>קטגוריה 4</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <GridContainer fullWidth>
            <GridItem lg={6}>
              <Card>
                <QuestionItem />
              </Card>
            </GridItem>
            <GridItem lg={6}>
              <Card>
                <QuestionItem />
              </Card>
            </GridItem>
            <GridItem lg={6}>
              <Card>
                <QuestionItem />
              </Card>
            </GridItem>
            <GridItem lg={6}>
              <Card>
                <QuestionItem />
              </Card>
            </GridItem>
            <GridItem lg={6}>
              <Card>
                <QuestionItem />
              </Card>
            </GridItem>
          </GridContainer>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel3a-content"
          id="panel3a-header"
        >
          <Typography>קטגוריה 5</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <GridContainer fullWidth>
            <GridItem lg={6}>
              <Card>
                <QuestionItem />
              </Card>
            </GridItem>
            <GridItem lg={6}>
              <Card>
                <QuestionItem />
              </Card>
            </GridItem>
            <GridItem lg={6}>
              <Card>
                <QuestionItem />
              </Card>
            </GridItem>
            <GridItem lg={6}>
              <Card>
                <QuestionItem />
              </Card>
            </GridItem>
            <GridItem lg={6}>
              <Card>
                <QuestionItem />
              </Card>
            </GridItem>
          </GridContainer>
        </AccordionDetails>
      </Accordion>
    </div>
  );
}
