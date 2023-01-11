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
import EditReviewSelector from "../../components/editReview/EditReviewSelector";
import {
  reviewContextData,
  ReviewContextProvider,
} from "../../context/contextReview";
import Snackbar from "../../components/Snackbar/Snackbar";
import { useHttpClient } from "../../components/Hooks/http-hook";
import SubmitBtn from "../../components/editReview/SubmitBtn";

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
      <SubmitBtn
        openModal={openModal}
        authorId={props.authorId}
        reviewId={props.reviewId}
      />
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
      <EditReviewSelector
        review={props.review}
        files={props.files}
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

export async function getServerSideProps(context) {
  let review = {};
  let files = {};
  let authorId = null;
  let fail = false;

  const { params } = context;
  const reviewId = params.index;

  try {
    const responseReview = await fetch(
      `${process.env.NEXT_PUBLIC_API_ADDRESS}api/reviews/${reviewId}`,
      {
        method: "GET",
      }
    );
    const responseFiles = await fetch(
      `${process.env.NEXT_PUBLIC_API_ADDRESS}api/info/allFiles`,
      {
        method: "GET",
      }
    );

    if (!responseReview.ok || !responseFiles.ok) {
      throw new Error("fetching content failed");
    }

    const parsedResponseReview = await responseReview.json();
    const parsedResponseFiles = await responseFiles.json();

    if (!parsedResponseReview || !parsedResponseFiles) {
      throw new Error("fetching content failed");
    }

    if (!!parsedResponseReview.success && !!parsedResponseFiles.success) {
      review = parsedResponseReview.review;
      files = parsedResponseFiles.files;
      authorId = !!parsedResponseReview.review
        ? parsedResponseReview.review.author
        : null;
    }
  } catch (err) {
    fail = true;
  }

  return {
    props: {
      review,
      files,
      authorId,
      reviewId,
      fail,
    },
  };
}

export default withStyles(styles)(HorizontalLinearStepper);
