import {
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@material-ui/core";
import React, { useRef, useState } from "react";
import { FileUploader } from "react-drag-drop-files";
import CustomInput from "../CustomInput/CustomInput";
import GridContainer from "../Grid/GridContainer";
import GridItem from "../Grid/GridItem";
import RegularButton from "../CustomButtons/Button";

import "../../css/dashboard.css";
// nameRef,unitRef,numberRef,emailRef,contendingType,setContendingType,workType,
// setWorkType,props.jobs, file,setFile,disable,setDisable,
// authContender,props.is_open
const RegisteringLife = (props) => {
  const nameRef = useRef();
  const pikudRef = useRef();
  const ogdaRef = useRef();
  const rankRef = useRef();
  const jobRef = useRef();
  const timeRef = useRef();
  const unitRef = useRef();
  const numberRef = useRef();
  const [fileLife, setFileLife] = useState();
  const [fileAlam, setFileAlam] = useState();
  const [filePpt, setFilePpt] = useState();
  const [disable, setDisable] = useState(false);

  const clearInputs = () => {
    nameRef.current.value = "";
    unitRef.current.value = "";
    numberRef.current.value = "";
    pikudRef.current.value = "";
    ogdaRef.current.value = "";
    rankRef.current.value = "";
    jobRef.current.value = "";
    timeRef.current.value = "";
    setFileLife();
    setFileAlam();
    setFilePpt();
  };

  const authContender = async () => {
    const name = nameRef.current.value;
    const unit = unitRef.current.value;
    const number = numberRef.current.value;
    const pikud = pikudRef.current.value;
    const ogda = ogdaRef.current.value;
    const rank = rankRef.current.value;
    const job = jobRef.current.value;
    const time = timeRef.current.value;

    let errors = {
      name: false,
      unit: false,
      number: false,
      pikud: false,
      rank: false,
      job: false,
      time: false,
      files: false,
    };

    // validating name
    if (name.length < 3 || name.split(" ").length < 2) {
      errors.name = true;
    }

    // validating unit
    if (unit.length === 0) {
      errors.unit = true;
    }

    //validating number
    if (number[0] !== "0" || number.length < 9) {
      errors.number = true;
    }

    //validating pikud
    if (pikud.length === 0) {
      errors.pikud = true;
    }

    // // validating rank
    if (rank.length === 0) {
      errors.rank = true;
    }

    // validating job
    if (job.length === 0) {
      errors.bam = true;
    }

    if (time.length === 0) {
      errors.time = true;
    }

    // validating files
    if (!fileLife || !fileAlam || !filePpt) {
      errors.files = true;
    }

    if (
      errors.pikud ||
      errors.name ||
      errors.number ||
      errors.unit ||
      errors.files ||
      errors.rank ||
      errors.job ||
      errors.time
    ) {
      props.openModal(
        "danger",
        `אנא הזן ${errors.name ? "שם מלא, " : ""} ${
          errors.number ? "מספר טלפון, " : ""
        } ${errors.unit ? "מספר יחידה, " : ""} ${
          errors.files ? "קבצים, " : ""
        } ${errors.pikud ? "פיקוד או זרוע," : ""} ${
          errors.rank ? "דרגה, " : ""
        } ${errors.job ? "תפקיד " : ""} ${
          errors.time ? "ותק בתפקיד " : ""
        }  תקינים`
      );
      return;
    }
    let response;

    try {
      setDisable(true);

      const formData = new FormData();

      formData.append("name", name);
      formData.append("unit", unit);
      formData.append("phone", number);
      formData.append("pikud", pikud);
      if(ogda.length > 0){
        formData.append("ogda",ogda);
      }
      formData.append("rank",rank);
      formData.append("job",job);
      formData.append("timeOnJob", time);
      formData.append("CVFile",fileLife);
      formData.append("AlamFile", fileAlam);
      formData.append("pptFile",filePpt);

      response = await props.sendRequest(
        process.env.NEXT_PUBLIC_API_ADDRESS + "api/contenders/addLifeContender",
        "POST",
        formData
      );
    } catch (error) {
      setDisable(false);
      props.openModal("danger", "קרתה שגיאה במהלך שליחת הטופס");
    }
    clearInputs();
    setDisable(false);
    if (!!response) {
      props.setNumOfContenders((prev) => prev + 1);
      props.openModal("success", "הטופס נשלח בהצלחה");
    } else {
      props.openModal("danger", "קרתה שגיאה במהלך שליחת הטופס");
      props.clearError();
    }
  };

  return (
    <GridContainer>
      <GridItem xs={12} sm={6} md={4}>
        <div style={{ paddingRight: 15 }} className="formItem">
          <CustomInput
            labelText="שם המועמד"
            inputProps={{
              inputRef: nameRef,
            }}
            id="ContenderName"
            formControlProps={{
              fullWidth: true,
            }}
          />
          <CustomInput
            labelText="יחידה"
            inputProps={{
              inputRef: unitRef,
            }}
            id="ContenderUnit"
            formControlProps={{
              fullWidth: true,
            }}
          />
          <CustomInput
            inputProps={{
              inputRef: pikudRef,
            }}
            labelText="פיקוד\זרוע"
            id="ContenderPikud"
            formControlProps={{
              fullWidth: true,
            }}
          />
          <CustomInput
            inputProps={{
              inputRef: ogdaRef,
            }}
            labelText="אוגדה (אופציונלי)"
            id="ContenderOgda"
            formControlProps={{
              fullWidth: true,
            }}
          />
          <CustomInput
            labelText="מספר טלפון"
            inputProps={{
              inputRef: numberRef,
            }}
            id="ContenderPhone"
            formControlProps={{
              fullWidth: true,
            }}
          />
        </div>
      </GridItem>
      <GridItem xs={12} sm={6} md={4}>
        <div className="formItem">
          <CustomInput
            inputProps={{
              inputRef: rankRef,
            }}
            labelText="דרגה"
            id="ContenderRank"
            formControlProps={{
              fullWidth: true,
            }}
          />
          <CustomInput
            inputProps={{
              inputRef: jobRef,
            }}
            labelText='תפקיד'
            id="ContenderJob"
            formControlProps={{
              fullWidth: true,
            }}
          />
          <CustomInput
            inputProps={{
              inputRef: timeRef,
            }}
            labelText='ותק בתפקיד'
            id="ContenderTime"
            formControlProps={{
              fullWidth: true,
            }}
          />
          <div>
            <br />
            <FileUploader
              hoverTitle="גרור לכאן את הקובץ"
              label="לחץ או גרור לכאן את קובץ הקורות חיים"
              classes="dragndrop"
              handleChange={(file) => {
                setFileLife(file);
              }}
              name="file"
              types={["PDF", "DOC", "DOCX"]}
            />
          </div>
        </div>
      </GridItem>
      <GridItem xs={12} sm={6} md={4}>
        <div style={{ width: "calc(80% + 26px)", marginTop: 20 }}>
          <FileUploader
            hoverTitle="גרור לכאן את הקובץ"
            label='לחץ או גרור לכאן את קובץ המלצת אל"מ'
            classes="dragndrop"
            handleChange={(file) => {
              setFileAlam(file);
            }}
            name="file"
            types={["PDF", "DOC", "DOCX"]}
          />
          <br />
          <FileUploader
            hoverTitle="גרור לכאן את הקובץ"
            label="לחץ או גרור לכאן את קובץ מצגת הצגה אישית"
            classes="dragndrop"
            handleChange={(file) => {
              setFilePpt(file);
            }}
            name="file"
            types={["PPT", "PPTX"]}
          />
          <br />
          <div>
            <ul className="files">
                <h3> קבצים שהועלו</h3>
                <li className={!!fileLife ? "yes" : "no"}>קובץ קורות חיים -<br/><strong>{!!fileLife && fileLife.name}</strong></li>
                <li className={!!fileAlam ? "yes" : "no"}>קובץ המלצת אל"מ -<br/><strong>{!!fileAlam && fileAlam.name}</strong></li>
                <li className={!!filePpt ? "yes" : "no"}>קובץ מצגת הצגה אישית -<br/><strong>{!!filePpt && filePpt.name}</strong></li>
            </ul>
          </div>
          {!!props.is_open ? (
            <RegularButton
              disabled={disable}
              onClick={() => {
                authContender();
                setDisable(true);
                setTimeout(() => {
                  setDisable(false);
                }, 1000);
              }}
              color="primary"
              fullWidth
            >
              {disable ? (
                <CircularProgress
                  className="hello"
                  sx={{ mx: 4 }}
                  size={"1rem"}
                  color="warning"
                />
              ) : (
                "לחצו כאן"
              )}
            </RegularButton>
          ) : (
            <RegularButton disabled={true} color="primary" fullWidth>
              ההרשמה סגורה
            </RegularButton>
          )}
        </div>
      </GridItem>
    </GridContainer>
  );
};

export default RegisteringLife;
