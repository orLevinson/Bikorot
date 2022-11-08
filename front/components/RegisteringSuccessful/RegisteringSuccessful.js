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
const RegisteringSuccessful = (props) => {
  const nameRef = useRef();
  const pikudRef = useRef();
  const ogdaRef = useRef();
  const saalRef = useRef();
  const bamRef = useRef();
  const unitRef = useRef();
  const numberRef = useRef();
  const [workType, setWorkType] = useState("");
  const [fileProposition, setFileProposition] = useState();
  const [fileShort, setFileShort] = useState();
  const [fileBam, setFileBam] = useState();
  const [filePpt, setFilePpt] = useState();
  const [disable, setDisable] = useState(false);

  const clearInputs = () => {
    nameRef.current.value = "";
    unitRef.current.value = "";
    numberRef.current.value = "";
    pikudRef.current.value = "";
    ogdaRef.current.value = "";
    saalRef.current.value = "";
    bamRef.current.value = "";
    setWorkType("");
    setFileProposition();
    setFileShort();
    setFileBam();
    setFilePpt();
  };

  const authContender = async () => {
    const name = nameRef.current.value;
    const unit = unitRef.current.value;
    const number = numberRef.current.value;
    const pikud = pikudRef.current.value;
    const ogda = ogdaRef.current.value;
    const saal = saalRef.current.value;
    const bam = bamRef.current.value;

    let errors = {
      name: false,
      unit: false,
      number: false,
      pikud: false,
      saal: false,
      bam: false,
      files: false,
      workType: false,
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

    // validating saal
    if (saal.length === 0 || saal.split(" ").length < 2) {
      errors.saal = true;
    }

    // validating bam
    if (bam.length === 0 || bam.split(" ").length < 2) {
      errors.bam = true;
    }

    if (workType === "") {
      errors.workType = true;
    }

    // validating file
    if (!fileProposition || !fileShort || !fileBam || !filePpt) {
      errors.files = true;
    }

    if (
      errors.pikud ||
      errors.name ||
      errors.number ||
      errors.unit ||
      errors.files ||
      errors.workType ||
      errors.saal ||
      errors.bam
    ) {
      props.openModal(
        "danger",
        `אנא הזן ${errors.name ? "שם מלא, " : ""} ${
          errors.number ? "מספר טלפון, " : ""
        } ${errors.unit ? "מספר יחידה, " : ""} ${
          errors.files ? "קבצים, " : ""
        } ${errors.pikud ? "פיקוד או זרוע," : ""} ${
          errors.saal ? "גורם מאשר עבודה יחידתי, " : ""
        } ${errors.bam ? "גורם מאשר בטחון מידע " : ""} ${
          errors.workType ? "סוג עבודה " : ""
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
      formData.append("saal",saal);
      formData.append("bam",bam);
      formData.append("jobType", workType);
      formData.append("propositionFile",fileProposition);
      formData.append("shortFile", fileShort);
      formData.append("bamFile",fileBam);
      formData.append("pptFile",filePpt);

      response = await props.sendRequest(
        process.env.NEXT_PUBLIC_API_ADDRESS + "api/contenders/addJobContender",
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
          <FormControl fullWidth>
            <InputLabel id="workType">סוג עבודה מצטיינת</InputLabel>
            <Select
              labelId="workType"
              id="workTypeId"
              label="סוג עבודה מצטיינת"
              value={workType}
              onChange={(e) => {
                setWorkType(e.target.value);
              }}
            >
              {props.jobs.map((jobItem) => {
                return <MenuItem value={jobItem._id}>{jobItem.title}</MenuItem>;
              })}
            </Select>
          </FormControl>
          <CustomInput
            inputProps={{
              inputRef: saalRef,
            }}
            labelText='גורם מאשר עבודה יחידתי (בדרגת סא"ל, לדוגמא : סא"ל ישראל ישראלי)'
            id="ContenderSaal"
            formControlProps={{
              fullWidth: true,
            }}
          />
          <CustomInput
            inputProps={{
              inputRef: bamRef,
            }}
            labelText='גורם מאשר בטחון מידע (קצין ב"מ, לדוגמא : סגן ישראל ישראלי )'
            id="ContenderBam"
            formControlProps={{
              fullWidth: true,
            }}
          />
          <div>
            <br />
            <FileUploader
              hoverTitle="גרור לכאן את הקובץ"
              label="לחץ או גרור לכאן את קובץ הצעת המועמדות"
              classes="dragndrop"
              handleChange={(file) => {
                setFileProposition(file);
              }}
              name="file"
              types={["PDF", "DOC", "DOCX"]}
            />
            <br/>
            <FileUploader
            hoverTitle="גרור לכאן את הקובץ"
            label="לחץ או גרור לכאן את קובץ תקציר המנהלים"
            classes="dragndrop"
            handleChange={(file) => {
              setFileShort(file);
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
            label='לחץ או גרור לכאן את קובץ אישור הב"מ'
            classes="dragndrop"
            handleChange={(file) => {
              setFileBam(file);
            }}
            name="file"
            types={["PDF", "DOC", "DOCX"]}
          />
          <br />
          <FileUploader
            hoverTitle="גרור לכאן את הקובץ"
            label="לחץ או גרור לכאן את קובץ מצגת פירוט העבודה"
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
                <li className={!!fileProposition ? "yes" : "no"}>קובץ הצעת מועמדות -<br/><strong>{!!fileProposition && fileProposition.name}</strong></li>
                <li className={!!fileShort ? "yes" : "no"}>קובץ תקציר מנהלים -<br/><strong>{!!fileShort && fileShort.name}</strong></li>
                <li className={!!fileBam ? "yes" : "no"}>קובץ אישור ב"מ -<br/><strong>{!!fileBam && fileBam.name}</strong></li>
                <li className={!!filePpt ? "yes" : "no"}>קובץ מצגת פירוט העבודה -<br/><strong>{!!filePpt && filePpt.name}</strong></li>
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

export default RegisteringSuccessful;
