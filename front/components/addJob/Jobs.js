import React, {useState,useRef} from "react";
import Card from "../Card/Card";
import CardBody from "../Card/CardBody";
import CardHeader from "../Card/CardHeader";
import CustomInput from "../CustomInput/CustomInput";
import CustomButton from "../CustomButtons/Button";
import { CircularProgress } from "@material-ui/core";
import CustomSnackbarContent from "../Snackbar/CustomSnackbarContent";
import { makeStyles } from "@material-ui/core/styles";
import styles from "assets/jss/nextjs-material-dashboard/views/rtlStyle.js";

import "../../css/dashboard.css";
// jobList,openModal
// setJobList
const Jobs = (props) => {
  const useStyles = makeStyles(styles);
  const classes = useStyles();
  const jobRef = useRef();
  const [jobLoading, setJobLoading] = useState(false);

  const addJobHandler = async () => {
    const job = jobRef.current.value;
    if (!job) {
      props.openModal("danger", "אנא הזן שם לסוג העבודה");
      return;
    }

    setJobLoading(true);

    try {
      const response = await props.sendRequest(
        `${process.env.NEXT_PUBLIC_API_ADDRESS}api/jobs/`,
        "POST",
        JSON.stringify({ title: job }),
        { "Content-Type": "application/json", Authorization: `bearer ${props.token}` }
      );
      if (!!response.message && response.message.title === job) {
        props.setJobsList((prev) => [
          ...prev,
          { _id: response.message._id, title: job },
        ]);
        props.openModal("success", "ההודעה נוספה בהצלחה");
      }
    } catch (err) {
      props.openModal("danger", "קרתה שגיאה במהלך הוספת ההודעה");
      props.clearError();
    }
    setJobLoading(false);
    jobRef.current.value = "";
  };

  const closejobsHandler = async (id) => {
    try {
      const response = await props.sendRequest(
        `${process.env.NEXT_PUBLIC_API_ADDRESS}api/jobs/${id}`,
        "DELETE",
        JSON.stringify({}),
        { "Content-Type": "application/json", Authorization: `bearer ${props.token}` }
      );

      if (!!response.message && response.message === "Deleted job.") {
        props.setJobsList((prev) => prev.filter((i) => i._id !== id));
        props.openModal("success", "סוג העבודה נמחק בהצלחה");
      }
    } catch (err) {
      props.openModal("danger", "קרתה שגיאה במהלך מחיקת סוג העבודה");
      props.clearError();
    }
  };

  return (
    <div>
      <Card className={classes.frontGrid}>
        <CardHeader color="warning">
          <h4 className={classes.cardTitleWhite}>סוגי עבודות מצטיינות</h4>
        </CardHeader>
        <CardBody>
          <div>
            <CustomInput
              labelText="הודעה נוספת"
              inputProps={{
                inputRef: jobRef,
              }}
              id="ContenderPhone"
              formControlProps={{
                fullWidth: true,
              }}
            />
            <CustomButton
              disabled={jobLoading}
              onClick={addJobHandler}
              color="warning"
              fullWidth
            >
              {jobLoading ? (
                <CircularProgress
                  className="hello"
                  sx={{ mx: 4 }}
                  size={"1.5rem"}
                  color="warning"
                />
              ) : (
                "לחצו כאן להוספת סוג עבודה"
              )}
            </CustomButton>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: 10,
            }}
          >
            {props.jobsList
              .map((job) => {
                return (
                  <CustomSnackbarContent
                    message={job.title}
                    rtlActive
                    key={job._id}
                    onClose={async () => {
                      await closejobsHandler(job._id);
                    }}
                    close
                  />
                );
              })
              .reverse()}
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default Jobs;
