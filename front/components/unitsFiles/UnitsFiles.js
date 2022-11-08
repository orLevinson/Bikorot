import React, { useState } from "react";
import Card from "../Card/Card";
import CardBody from "../Card/CardBody";
import CardHeader from "../Card/CardHeader";
import CustomButton from "../CustomButtons/Button";
import {
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import styles from "assets/jss/nextjs-material-dashboard/views/rtlStyle.js";
import { FileUploader } from "react-drag-drop-files";
import "../../css/dashboard.css";

const UnitsFiles = (props) => {
  const useStyles = makeStyles(styles);
  const classes = useStyles();
  const [fileLoading, setFileLoading] = useState(false);
  const [file, setFile] = useState();
  const [fileType, setFileType] = useState("");

  const changeFileHandler = async () => {
    if (!fileType || fileType.length === 0) {
      props.openModal("danger", "אנא העלה בחר בסוג הקובץ להעלאה");
      return;
    }
    if (!file) {
      props.openModal("danger", "אנא העלה קובץ");
      return;
    }
    let message = { success: "", fail: "" };
    switch (fileType) {
      case "mlai":
        message.success = "קובץ ביקורת ניהול מלאי הועלה בהצלחה";
        message.fail = "קרתה שגיאה במהלך העלאת קובץ ביקורת ניהול מלאי";
        break;
      case "luz":
        message.success = 'קובץ לו"ז ביקורות הועלה בהצלחה';
        message.fail = 'קרתה שגיאה במהלך העלאת קובץ לו"ז ביקורות';
        break;
      case "irgun":
        message.success = "קובץ ביקורת ע. לארגון הועלה בהצלחה";
        message.fail = "קרתה שגיאה במהלך העלאת קובץ ביקורת ע. לארגון";
        break;
      case "vehicle":
        message.success = "קובץ ביקורת רכב הועלה בהצלחה";
        message.fail = "קרתה שגיאה במהלך העלאת קובץ ביקורת רכב";
        break;
      case "kitchen":
        message.success = "קובץ ביקורת מטבח הועלה בהצלחה";
        message.fail = "קרתה שגיאה במהלך העלאת קובץ ביקורת מטבח";
        break;
      default:
        message.success = 'קובץ ביקורת פלס"ם הועלה בהצלחה';
        message.fail = 'קרתה שגיאה במהלך העלאת קובץ ביקורת פלס"ם';
        break;
    }

    setFileLoading(true);
    try {
      let formData = new FormData();
      formData.append("file", file);
      formData.append("fileType", fileType);
      const response = await props.sendRequest(
        `${process.env.NEXT_PUBLIC_API_ADDRESS}api/units/`,
        "PATCH",
        formData,
        { Authorization: `bearer ${props.token}` }
      );
      if (
        !!response.message &&
        !!response.message[fileType === "luz" ? "luz" : fileType + "File"] &&
        response.message[fileType === "luz" ? "luz" : fileType + "File"]
          .originalName === file.name
      ) {
        props.openModal("success", message.success);
      }
    } catch (err) {
      props.openModal("danger", message.fail);
      props.clearError();
    }
    setFileLoading(false);
    setFile(null);
  };

  return (
    <div>
      <Card className={classes.frontGrid}>
        <CardHeader color="success">
          <h4 className={classes.cardTitleWhite}>
            עריכת קבצי הביקורות ולו"ז הביקורות
          </h4>
        </CardHeader>
        <CardBody>
          <FormControl fullWidth>
            <InputLabel id="setFileLabel" className="selectFile">
              סוג הקובץ להחלפה
            </InputLabel>
            <Select
              labelId="setFileLabel"
              id="setFile"
              label="סוג הקובץ להחלפה"
              value={fileType}
              className="selectFile"
              onChange={(e) => {
                setFileType(e.target.value);
              }}
            >
              <MenuItem value={"luz"}>קובץ לו"ז ביקורות</MenuItem>
              <MenuItem value={"mlai"}>קובץ ביקורת ניהול מלאי</MenuItem>
              <MenuItem value={"irgun"}>קובץ ביקורת ע. לארגון</MenuItem>
              <MenuItem value={"palsam"}>קובץ ביקורת פלס"ם</MenuItem>
              <MenuItem value={"vehicle"}>קובץ ביקורת רכב</MenuItem>
              <MenuItem value={"kitchen"}>קובץ ביקורת מטבח</MenuItem>
            </Select>
          </FormControl>
          <FileUploader
            hoverTitle="גרור לכאן את הקובץ"
            label="לחץ או גרור לכאן את הקובץ"
            classes="dragndrop green marginTop"
            handleChange={(file) => {
              setFile(file);
            }}
            name="file"
            types={["PDF", "DOC", "DOCX"]}
          />
          <div
            style={{
              margin: "auto",
              width: "calc(80% + 26px)",
              marginTop: 20,
            }}
          >
            <CustomButton
              disabled={fileLoading}
              onClick={changeFileHandler}
              color="success"
              fullWidth
            >
              {fileLoading ? (
                <CircularProgress
                  className="hello"
                  sx={{ mx: 4 }}
                  size={"1rem"}
                  color="warning"
                />
              ) : (
                "לחצו כאן להעלאת הקובץ"
              )}
            </CustomButton>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default UnitsFiles;
