import React, { useContext, useEffect, useState } from "react";
import Card from "../Card/Card";
import CardBody from "../Card/CardBody";
import GridContainer from "../Grid/GridContainer";
import GridItem from "../Grid/GridItem";
import {
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@material-ui/core";
import "../../css/dashboard.css";
import RegularButton from "../CustomButtons/Button";
import { useHttpClient } from "../Hooks/http-hook";
import { reviewContextData } from "../../context/contextReview";
import CustomInput from "../CustomInput/CustomInput";

const ChooseUnit = (props) => {
  const { reviewData } = useContext(reviewContextData);
  const [pikud, setPikud] = useState(reviewData.unitData.command);
  const [ogda, setOgda] = useState(reviewData.unitData.division);
  const [hativa, setHativa] = useState(reviewData.unitData.brigade);
  const [unit, setUnit] = useState(reviewData.unitData.unit);

  // get units and show the title of them
  useEffect(() => {
    console.log(reviewData.unitData);
    setPikud(reviewData.unitData.command);
    setOgda(reviewData.unitData.division);
    setHativa(reviewData.unitData.brigade);
    setUnit(reviewData.unitData.unit);
  }, [reviewData]);

  return (
    <div>
      <GridContainer className="full-width">
        <GridItem xs={12} sm={8} md={6} marginauto={true}>
          <Card login={true}>
            <CardBody>
              <h3>בחירת היחידה לביקורת</h3>
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
