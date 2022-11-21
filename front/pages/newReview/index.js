import * as React from "react";
import RTL from "layouts/RTL.js";
import Box from "@material-ui/core/Box";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import { StepIcon } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import NewReviewSelector from "../../components/newReview/newReviewSelector";

const styles = (theme) => ({
  pl: {
    paddingLeft: 8,
  },
});

const steps = [
  "בחירת יחידה",
  "נושא 1",
  "נושא 2",
  "נושא 3",
  "נושא 4",
  "נושא 5",
  "סיכום",
];

function HorizontalLinearStepper(props) {
  const { classes } = props;
  const [activeStep, setActiveStep] = React.useState(0);

  const handleNext = () => {
    if (activeStep === steps.length - 1) {
      return;
    }
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    if (activeStep === 0) {
      return;
    }
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  return (
    <>
      <Box sx={{ width: "100%" }}>
        <Stepper activeStep={activeStep}>
          {steps.map((label, index) => {
            const stepProps = {};
            const labelProps = {};
            return (
              <Step key={label} {...stepProps}>
                <StepLabel
                  StepIconProps={{
                    classes: { root: classes.pl },
                  }}
                  {...labelProps}
                >
                  {label}
                </StepLabel>
              </Step>
            );
          })}
        </Stepper>
        <React.Fragment>
          <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
            <Button
              color="inherit"
              disabled={activeStep === 0}
              onClick={handleBack}
              sx={{ mr: 1 }}
            >
              קודם
            </Button>
            <Box sx={{ flex: "1 1 auto" }} />
            <Button onClick={handleNext}>
              {activeStep === steps.length - 1 ? "סיים" : "הבא"}
            </Button>
          </Box>
        </React.Fragment>
      </Box>
      <NewReviewSelector next={handleNext} step={activeStep} />
    </>
  );
}

HorizontalLinearStepper.layout = RTL;

export default withStyles(styles)(HorizontalLinearStepper);
