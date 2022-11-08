import React, { useRef, useState } from "react";
import Card from "../Card/Card";
import CardBody from "../Card/CardBody";
import CardHeader from "../Card/CardHeader";
import CustomInput from "../CustomInput/CustomInput";
import CustomButton from "../CustomButtons/Button";
import { Button, CircularProgress } from "@material-ui/core";
import CustomSnackbarContent from "../Snackbar/CustomSnackbarContent";
import { makeStyles } from "@material-ui/core/styles";
import styles from "assets/jss/nextjs-material-dashboard/views/rtlStyle.js";
import SnackbarContent from "../Snackbar/SnackbarContent";

import "../../css/dashboard.css";

const InputWithRef = (props) => {
  const { inputRef, text } = props;
  return (
    <div className="noMargin">
      <CustomInput
        labelText={`יחידות מצטיינות בתחום ${text}`}
        inputProps={{
          value: props.value[props.type],
          onChange: (e) => {
            props.setValue((prev) => {
              const copy = prev;
              copy[props.type] = e.target.value;
              return { ...copy };
            });
          },
        }}
        id={text}
        formControlProps={{
          fullWidth: true,
        }}
      />
    </div>
  );
};

const ChangeUnits = (props) => {
  const useStyles = makeStyles(styles);
  const classes = useStyles();

  const [units, setUnits] = useState({
    mlai: !!props.unitsList ? props.unitsList.mlai.join(", ") : "",
    irgun: !!props.unitsList ? props.unitsList.irgun.join(", ") : "",
    kitchen: props.unitsList ? props.unitsList.kitchen.join(", ") : "",
    palsam: !!props.unitsList ? props.unitsList.palsam.join(", ") : "",
    vehicle: !!props.unitsList ? props.unitsList.vehicle.join(", ") : "",
  });

  const [unitsLoading, setUnitsLoading] = useState(false);

  const changeUnits = async () => {
    // 5 arrays of string
    const mlai = units.mlai.replace(/^\s+|\s+$/g, "").split(",");
    const irgun = units.irgun.replace(/^\s+|\s+$/g, "").split(",");
    const palsam = units.palsam.replace(/^\s+|\s+$/g, "").split(",");
    const vehicle = units.vehicle.replace(/^\s+|\s+$/g, "").split(",");
    const kitchen = units.kitchen.replace(/^\s+|\s+$/g, "").split(",");

    if (
      mlai.length > 5 ||
      irgun.length > 5 ||
      palsam.length > 5 ||
      vehicle.length > 5 ||
      kitchen.length > 5
    ) {
      props.openModal("danger", "ניתן להזין עד 5 זוכים בכל קטגוריה");
      return;
    }

    try {
      setUnitsLoading(true);
      const response = await props.sendRequest(
        `${process.env.NEXT_PUBLIC_API_ADDRESS}api/units/winners`,
        "PATCH",
        JSON.stringify({
          mlai,
          irgun,
          vehicle,
          kitchen,
          palsam,
        }),
        {
          "Content-Type": "application/json",
          Authorization: `bearer ${props.token}`,
        }
      );
      if (!!response.message) {
        props.openModal("success", "היחידות המצטיינות נוספו בהצלחה");
      }
    } catch (err) {
      props.openModal("danger", "קרתה שגיאה במהלך הוספת היחידות המצטיינות");
      props.clearError();
    }
    setUnitsLoading(false);
  };

  return (
    <div>
      <Card className={classes.frontGrid}>
        <CardHeader color="info">
          <h4 className={classes.cardTitleWhite}>שינוי יחידות זוכות</h4>
          <p>
            יש להזין את היחידות הזוכות עם פסיק ביניהן, ניתן להזין עד 5 יחידות
            בכל תחום
          </p>
        </CardHeader>
        <CardBody>
          <SnackbarContent
            message={
              <InputWithRef
                text="ניהול המלאי"
                type="mlai"
                value={units}
                setValue={setUnits}
              />
            }
            rtlActive
          />
          <SnackbarContent
            message={
              <InputWithRef
                text="ע. לארגון"
                type="irgun"
                value={units}
                setValue={setUnits}
              />
            }
            rtlActive
          />
          <SnackbarContent
            message={
              <InputWithRef
                text='הפלס"ם'
                type="palsam"
                value={units}
                setValue={setUnits}
              />
            }
            rtlActive
          />
          <SnackbarContent
            message={
              <InputWithRef
                text="הרכב"
                type="vehicle"
                value={units}
                setValue={setUnits}
              />
            }
            rtlActive
          />
          <SnackbarContent
            message={
              <InputWithRef
                text="המטבח"
                type="kitchen"
                value={units}
                setValue={setUnits}
              />
            }
            rtlActive
          />
          <CustomButton
            disabled={unitsLoading}
            onClick={changeUnits}
            color="info"
            fullWidth
          >
            {unitsLoading ? (
              <CircularProgress
                className="hello"
                sx={{ mx: 4 }}
                size={"1.5rem"}
                color="warning"
              />
            ) : (
              "לחצו כאן לשינוי היחידות"
            )}
          </CustomButton>
        </CardBody>
      </Card>
    </div>
  );
};

export default ChangeUnits;
