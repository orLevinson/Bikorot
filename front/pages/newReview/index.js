import React, { useState, useEffect, useContext, useCallback } from "react";
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
import SubmitBtn from "../../components/newReview/SubmitBtn";

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
  const [files, setFiles] = useState(props.files);
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

  // in case the initial props arent loading
  useEffect(() => {
    if (!!props.fail) {
      openModal("danger", "קרתה שגיאה במהלך טעינת הנתונים");
    }
  }, [openModal, props.fail]);

  let currentBtn =
    activeStep === steps.length - 1 ? (
      <SubmitBtn openModal={openModal} />
    ) : (
      <Button onClick={handleNext}>הבא</Button>
    );

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
            {currentBtn}
          </Box>
        </React.Fragment>
      </Box>
      <NewReviewSelector
        files={files}
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

export async function getStaticProps() {
  let files = {};
  let fail = false;

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_ADDRESS}api/info/allFiles`,
      {
        method: "GET",
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

export default withStyles(styles)(HorizontalLinearStepper);
