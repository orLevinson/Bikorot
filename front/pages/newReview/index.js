import React, { useState, useContext, useCallback, useEffect } from "react";
import { useRouter } from "next/router";
import { contextData } from "../../context/context";
import RTL from "layouts/RTL.js";
import Box from "@material-ui/core/Box";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import NewReviewSelector from "../../components/newReview/newReviewSelector";
import {
  reviewContextData,
  ReviewContextProvider,
} from "../../context/contextReview";
import Snackbar from "../../components/Snackbar/Snackbar";
import { useHttpClient } from "../../components/Hooks/http-hook";

const styles = (theme) => ({
  pl: {
    paddingLeft: 8,
  },
});

const steps = [
  "בחירת יחידה",
  "נושא 1",
  "נושא 2",
  "משהו(תחת נושא 2)",
  "נושא 3",
  "נושא 4",
  "נושא 5",
  "סיכום",
];

function HorizontalLinearStepper(props) {
  const { classes } = props;
  const router = useRouter();
  const Context = useContext(contextData);
  const reviewContext = useContext(reviewContextData);
  const [loading, setLoading] = useState(false);
  const { sendRequest, clearError } = useHttpClient();
  const [activeStep, setActiveStep] = useState(0);
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

  React.useEffect(() => {
    const isUserAuthenticated = !!Context.userData.token;
    if (!isUserAuthenticated) {
      router.push("/dashboard");
      return;
    } else {
      const isManagerOrGlobalOrReviewer =
        Context.userData.perms === "global" ||
        Context.userData.perms === "manager" ||
        Context.userData.perms === "reviewer";
      if (!isManagerOrGlobalOrReviewer) {
        router.push("/dashboard");
        return;
      }
    }
  }, [Context]);

// unitData isnt being saved after going to the other pages for some reason
  const submitHandler = async () => {
    // check if unit and command is not empty
    if (
      !reviewContext.reviewData.unitData.unit ||
      reviewContext.reviewData.unitData.unit === "" ||
      !reviewContext.reviewData.unitData.command ||
      reviewContext.reviewData.unitData.command === ""
    ) {
      openModal("danger", "אנא הזן יחידה");
      return;
    }

    setLoading(true);

    const body = {
      author: Context.userData.id,
      unit: unitData.unit,
      command: unitData.command,
      division: !!unitData.division ? unitData.division : null,
      brigade: !!unitData.brigade ? unitData.brigade : null,
      scores: reviewContext.scores,
      Summary: reviewContext.summary,
    };

    try {
      const response = await sendRequest(
        `${process.env.NEXT_PUBLIC_API_ADDRESS}api/reviews/newReview`,
        "POST",
        JSON.stringify(body),
        {
          "Content-Type": "application/json",
          Authorization: Context.userData.token,
        }
      );
      if (!!response.success) {
        openModal("success", "הביקורת נוספה בהצלחה");
        setLoading(false);
        reviewContext.clearContext();
        router.push("/dashboard");
      } else {
        throw new Error();
      }
    } catch (err) {
      clearError();
      openModal("danger", "קרתה תקלה במהלך שליחת הביקורת");
      setLoading(false);
    }
  };

  return (
    <ReviewContextProvider>
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
              disabled={activeStep === 0 || loading}
              onClick={handleBack}
              sx={{ mr: 1 }}
            >
              קודם
            </Button>
            <Box sx={{ flex: "1 1 auto" }} />
            <Button
              disabled={loading}
              onClick={() => {
                if (activeStep === steps.length - 1) {
                  submitHandler();
                } else {
                  handleNext();
                }
              }}
            >
              {activeStep === steps.length - 1 ? "סיים" : "הבא"}
            </Button>
          </Box>
        </React.Fragment>
      </Box>
      <NewReviewSelector
        openModal={openModal}
        next={handleNext}
        step={activeStep}
      />
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
    </ReviewContextProvider>
  );
}

HorizontalLinearStepper.layout = RTL;

export default withStyles(styles)(HorizontalLinearStepper);
