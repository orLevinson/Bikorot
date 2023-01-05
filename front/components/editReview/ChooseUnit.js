import React, { useState, useEffect } from "react";
import Card from "../Card/Card";
import CardBody from "../Card/CardBody";
import GridContainer from "../Grid/GridContainer";
import GridItem from "../Grid/GridItem";
import { FormControl } from "@material-ui/core";
import "../../css/dashboard.css";
import RegularButton from "../CustomButtons/Button";
import CustomInput from "../CustomInput/CustomInput";

const ChooseUnit = (props) => {
  const [pikud, setPikud] = useState("");
  const [ogda, setOgda] = useState("");
  const [hativa, setHativa] = useState("");
  const [unit, setUnit] = useState("");

  useEffect(() => {
    setPikud(props.names.command);
    setOgda(props.names.division);
    setHativa(props.names.brigade);
    setUnit(props.names.unit);
  }, [props]);

  return (
    <div>
      <GridContainer className="full-width">
        <GridItem xs={12} sm={8} md={6} marginauto={true}>
          <Card login={true}>
            <CardBody>
              <h3>נתוני היחידה - יחידות האם</h3>
              <FormControl fullWidth>
                <CustomInput
                  labelText="פיקוד"
                  type="text"
                  inputProps={{
                    disabled: true,
                    value: pikud,
                  }}
                  id="passwordInput"
                  formControlProps={{
                    fullWidth: true,
                  }}
                />
                <CustomInput
                  labelText="אוגדה"
                  type="text"
                  inputProps={{
                    disabled: true,
                    value: ogda,
                  }}
                  id="passwordInput"
                  formControlProps={{
                    fullWidth: true,
                  }}
                />
                <CustomInput
                  labelText="חטיבה"
                  type="text"
                  inputProps={{
                    disabled: true,
                    value: hativa,
                  }}
                  id="passwordInput"
                  formControlProps={{
                    fullWidth: true,
                  }}
                />
                <CustomInput
                  labelText="יחידה"
                  type="text"
                  inputProps={{
                    disabled: true,
                    value: unit,
                  }}
                  id="passwordInput"
                  formControlProps={{
                    fullWidth: true,
                  }}
                />
              </FormControl>

              <br />
              <RegularButton
                onClick={() => {
                  props.next();
                }}
                color="primary"
              >
                המשך
              </RegularButton>
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
    </div>
  );
};

export default ChooseUnit;
