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

const FrontFiles = (props) => {
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
    let message = {success:"",fail: ""};
    switch (fileType) {
      case "Takanon":
        message.success = "קובץ התקנון הועלה בהצלחה";
        message.fail = "קרתה שגיאה במהלך העלאת קובץ התקנון";
        break;
      case "Proposition":
        message.success = "קובץ הצעת המועמד הועלה בהצלחה";
        message.fail = "קרתה שגיאה במהלך העלאת קובץ הצעת המועמד";
        break;
      case "Short":
        message.success = "קובץ תקציר המנהלים הועלה בהצלחה";
        message.fail = "קרתה שגיאה במהלך העלאת קובץ תקציר המנהלים";
        break;
      default:
        message.success = 'קובץ אישור הב"מ הועלה בהצלחה';
        message.fail = 'קרתה שגיאה במהלך העלאת קובץ אישור הב"מ';
        break;
    }

    setFileLoading(true);
    try {
      let formData = new FormData();
      formData.append("file", file);
      formData.append("fileType",fileType);
      const response = await props.sendRequest(
        `${process.env.NEXT_PUBLIC_API_ADDRESS}api/maincontent/`,
        "PATCH",
        formData,
        { Authorization: `bearer ${props.token}` }
      );
      if (!!response.message) {
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
          <h4 className={classes.cardTitleWhite}>עריכת קבצי הפורמטים והתקנון</h4>
        </CardHeader>
        <CardBody>
          <FormControl fullWidth>
            <InputLabel id="setFileLabel" className="selectFile">סוג הקובץ להחלפה</InputLabel>
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
              <MenuItem value={"Takanon"}>קובץ תקנון</MenuItem>
              <MenuItem value={"Proposition"}>פורמט קובץ הצעה</MenuItem>
              <MenuItem value={"Short"}>פורמט תקציר מנהלים</MenuItem>
              <MenuItem value={"Bam"}>פורמט אישור ב"מ</MenuItem>
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

export default FrontFiles;
